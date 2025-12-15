import json
import requests
from tqdm import tqdm

# ============================================================
# CONFIG
# ============================================================
OPENSEARCH_URL = "http://localhost:9201"
INDEX_NAME = "smart_news"
JSON_PATH = "output/reuters_with_embeddings.json"
BULK_SIZE = 500


# ============================================================
# HELPERS
# ============================================================
def clean_geopoints(geopoints):
    """
    Remove invalid geo_points (null / missing lat-lon)
    OpenSearch geo_point does NOT accept null values
    """
    clean = []
    for g in geopoints:
        loc = g.get("location", {})
        lat = loc.get("lat")
        lon = loc.get("lon")

        if isinstance(lat, (int, float)) and isinstance(lon, (int, float)):
            clean.append({
                "place": g.get("place"),
                "location": {
                    "lat": lat,
                    "lon": lon
                }
            })
    return clean


def prepare_document(doc):
    """
    Normalize document before indexing
    """
    # ---- CLEAN GEOPOINTS ----
    doc["geopoints"] = clean_geopoints(doc.get("geopoints", []))

    # ---- AUTOCOMPLETE SUPPORT ----
    # (المابينغ بيستخدم analyzer خاص، بس الداتا نفسها نص)
    doc["title"] = doc.get("title", "")
    doc["content"] = doc.get("content", "")

    # ---- SAFETY: EMPTY ARRAYS ----
    doc["places"] = doc.get("places", [])
    doc["georeferences"] = doc.get("georeferences", [])
    doc["temporalExpressions"] = doc.get("temporalExpressions", [])

    return doc


def build_bulk_payload(docs):
    """
    Build OpenSearch bulk payload
    """
    lines = []

    for i, doc in docs.items():
        doc = prepare_document(doc)

        lines.append(json.dumps({
            "index": {
                "_index": INDEX_NAME,
                "_id": i
            }
        }))
        lines.append(json.dumps(doc, ensure_ascii=False))

    return "\n".join(lines) + "\n"


# ============================================================
# MAIN
# ============================================================
def main():
    print("📂 Loading JSON file...")
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    print(f"📄 Documents loaded: {len(data)}")

    errors = False
    session = requests.Session()

    for start in tqdm(range(0, len(data), BULK_SIZE), desc="🚀 Bulk indexing"):
        batch = {
            start + i: data[start + i]
            for i in range(min(BULK_SIZE, len(data) - start))
        }

        payload = build_bulk_payload(batch)

        response = session.post(
            f"{OPENSEARCH_URL}/_bulk",
            headers={"Content-Type": "application/x-ndjson"},
            data=payload.encode("utf-8")
        )

        if response.status_code != 200:
            print("❌ HTTP Error:", response.text)
            errors = True
            continue

        result = response.json()
        if result.get("errors"):
            errors = True
            for item in result["items"]:
                action = item.get("index", {})
                if "error" in action:
                    print("⚠️ Indexing error:", action["error"])
                    break

    print("\n📊 Indexing summary:")
    print("Errors:", errors)
    if not errors:
        print("✅ Bulk indexing completed successfully")


# ============================================================
# RUN
# ============================================================
if __name__ == "__main__":
    main()
