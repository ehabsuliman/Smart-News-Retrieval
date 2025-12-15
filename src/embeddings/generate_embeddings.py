import json
from sentence_transformers import SentenceTransformer
from tqdm import tqdm

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
JSON_IN = "output/reuters_full.json"
JSON_OUT = "output/reuters_with_embeddings.json"

model = SentenceTransformer(MODEL_NAME)

print("📂 Loading documents...")
with open(JSON_IN, "r", encoding="utf-8") as f:
    docs = json.load(f)

print("🧠 Generating embeddings...")
for doc in tqdm(docs):
    text = (doc.get("title", "") + " " + doc.get("content", "")).strip()
    if text:
        doc["embedding"] = model.encode(text).tolist()
    else:
        doc["embedding"] = None

print("💾 Saving new JSON with embeddings...")
with open(JSON_OUT, "w", encoding="utf-8") as f:
    json.dump(docs, f, ensure_ascii=False)

print("✅ Done:", JSON_OUT)
