
# %pip install elasticsearch sentence-transformers
from elasticsearch import Elasticsearch, helpers
from sentence_transformers import SentenceTransformer
from datetime import datetime
import json
import time


 
INDEX_NAME = "news_reuters_docs"
es = Elasticsearch(
    "http://localhost:9200",
    request_timeout=60,
    max_retries=3,
    retry_on_timeout=True
)

# Add this to clean up old indices
print("Cleaning up...")
try:
    # Delete old problematic indices
    all_indices = es.cat.indices(format='json')
    for idx in all_indices:
        if idx['health'] == 'red' or idx['status'] == 'close':
            print(f"Deleting problematic index: {idx['index']}")
            es.indices.delete(index=idx['index'], ignore=[400, 404])
except:
    pass

print(es.ping())

 
mapping = {
    "settings": {
        "index": {
            "max_ngram_diff": 5
        },
        "analysis": {
            "char_filter": {
                "html_strip": {"type": "html_strip"}
            },
            "filter": {
                "length_filter": {"type": "length", "min": 3}
            },
            "tokenizer": {
                "autocomplete_infix_tokenizer": {
                    "type": "ngram",
                    "min_gram": 3,
                    "max_gram": 8,
                    "token_chars": ["letter", "digit"]
                }
            },
            "analyzer": {
                "autocomplete_infix": {
                    "type": "custom",
                    "tokenizer": "autocomplete_infix_tokenizer",
                    "filter": ["lowercase"]
                },
                "autocomplete_infix_search": {
                    "type": "custom",
                    "tokenizer": "lowercase"
                },
                "content_analyzer": {
                    "type": "custom",
                    "char_filter": ["html_strip"],
                    "tokenizer": "standard",
                    "filter": ["lowercase", "stop", "length_filter", "porter_stem"]
                }
            }
        }
    },

    "mappings": {
        "properties": {
            "title": {
                "type": "text",
                "analyzer": "autocomplete_infix",
                "search_analyzer": "autocomplete_infix_search",
                "fields": {
                    "keyword": {"type": "keyword"}
                }
            },
            # HNSW enabled for title_vector
            "title_vector": {
                "type": "dense_vector",
                "dims": 384,
                "index": True,
                "similarity": "cosine",
                "index_options": {
                    "type": "hnsw",
                    "m": 16,
                    "ef_construction": 100
                }
            },
            # HNSW enabled for content_vector
            "content_vector": {
                "type": "dense_vector",
                "dims": 384,
                "index": True,
                "similarity": "cosine",
                "index_options": {
                    "type": "hnsw",
                    "m": 16,
                    "ef_construction": 100
                }
            },
            "content": {
                "type": "text",
                "analyzer": "content_analyzer",
                "fields": {
                    "keyword": {"type": "keyword"}
                }
            },
            "authors": {
                "type": "nested",
                "properties": {
                    "first_name": {"type": "text"},
                    "last_name": {"type": "text"},
                    "email": {"type": "keyword"}
                }
            },
            "date": {
                "type": "date",
                "format": "strict_date_optional_time||yyyy-MM-dd'T'HH:mm:ss||epoch_millis"
            },
            "dateline": {"type": "text"},
            "geopoint": {"type": "geo_point"},
            "temporalExpressions": {"type": "keyword"},
            "georeferences": {"type": "keyword"},
            "places": {"type": "keyword"},
            "geopoints": {
                "type": "nested",
                "properties": {
                    "place": {"type": "keyword"},
                    "location": {"type": "geo_point"}
                }
            },
            "topics": {"type": "keyword"},
            "people": {"type": "keyword"},
            "orgs": {"type": "keyword"},
            "exchanges": {"type": "keyword"},
            "companies": {"type": "keyword"}
        }
    }
}

 
print(es.ping())


 
if es.indices.exists(index=INDEX_NAME):
    es.indices.delete(index=INDEX_NAME)
es.indices.create(index=INDEX_NAME, body=mapping)

# Add this - wait for index to be ready
print("Waiting for index to be ready...")
time.sleep(5)
es.cluster.health(wait_for_status='yellow', timeout='30s')


 
model = SentenceTransformer('all-MiniLM-L6-v2')

file_path = r"C:\Users\asus\Desktop\NewsRetrival\smart-news-retrieval-\output\reuters_full.json"

print("Loading documents...")
with open(file_path, "r", encoding="utf-8") as f:
    documents = json.load(f)

print(f"Loaded {len(documents)} documents")

batch_size = 500
total_indexed = 0

for i in range(0, len(documents), batch_size):
    batch = documents[i:i + batch_size]
    actions = []
    
    print(f"Processing batch {i//batch_size + 1} ({i} to {min(i+batch_size, len(documents))})")
    
    for doc in batch:
        title = doc.get("title") or ""
        content = doc.get("content") or ""
        author_raw = doc.get("author_raw") or ""
        dateline_raw = doc.get("dateline_raw") or ""
        date_raw = doc.get("date_raw") or ""
        
        places = doc.get("places") or []
        temporal = doc.get("temporalExpressions") or []
        georefs = doc.get("georeferences") or []
        
        geopoints = []
        for g in doc.get("geopoints") or []:
            if g:
                lat = g.get("lat")
                lon = g.get("lon")
                place = g.get("place")
                if lat is not None and lon is not None:
                    geopoints.append({
                        "place": place,
                        "location": {"lat": lat, "lon": lon}
                    })
        
        # encode both title and content
        title_vector = model.encode(title).tolist()
        content_vector = model.encode(content[:500]).tolist()
        
        es_doc = {
            "_index": INDEX_NAME,
            "_source": {
                "title": title,
                "title_vector": title_vector,
                "content": content,
                "content_vector": content_vector,
                "places": places,
                "temporalExpressions": temporal,
                "georeferences": georefs,
                "geopoints": geopoints
            }
        }
        actions.append(es_doc)
    
    try:
        success, failed = helpers.bulk(es, actions, raise_on_error=False, request_timeout=120)
        total_indexed += success
        print(f"  Indexed {success} documents (Failed: {len(failed)})")
        
        if failed:
            print(f"  First error: {failed[0]}")
        
        time.sleep(1)
        
    except Exception as e:
        print(f"  Error in batch: {e}")
        continue

print(f"\nTotal indexed: {total_indexed} documents successfully.")

es.indices.refresh(index=INDEX_NAME)

 
def hybrid_search(query, top_k=10):
    query_vector = model.encode(query).tolist()
    
    # lexical search on title and content
    lexical_query = {
        "multi_match": {
            "query": query,
            "fields": ["title^3", "content"],
            "type": "best_fields"
        }
    }
    
    # Use kNN for faster HNSW vector search
    response = es.search(
        index=INDEX_NAME,
        body={
            "size": top_k,
            "query": lexical_query,
            "knn": [
                {
                    "field": "title_vector",
                    "query_vector": query_vector,
                    "k": top_k,
                    "num_candidates": 100
                },
                {
                    "field": "content_vector",
                    "query_vector": query_vector,
                    "k": top_k,
                    "num_candidates": 100
                }
            ]
        },
        request_timeout=30
    )
    
    return [hit["_source"]["title"] for hit in response["hits"]["hits"]]

# test
print("\nTesting search with HNSW...")
results = hybrid_search("banking crisis")
print(f"Found {len(results)} results:")
for i, title in enumerate(results, 1):
    print(f"{i}. {title}")


