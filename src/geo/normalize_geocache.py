import json
import re

INPUT_PATH = "/Users/mac2/University/Information Retrieval/Smart Doc System/smart-news-retrieval-/src/geo/geocache.json"
OUTPUT_PATH = "/Users/mac2/University/Information Retrieval/Smart Doc System/smart-news-retrieval-/src/geo/geocache_clean.json"

def clean_place_name(name):
    """
    تنظيف شامل للاسم:
    - lowercase
    - إزالة newlines
    - إزالة الرموز الغريبة
    - إزالة المسافات المكررة
    """
    if not name:
        return None

    name = name.replace("\n", " ").replace("\t", " ")
    name = re.sub(r"[^a-zA-Z0-9\s,-]", " ", name)
    name = name.lower().strip()
    name = re.sub(r"\s+", " ", name)
    return name


def split_locations(name):
    """
    تقسيم الأماكن المركبة:
    مثال:
    'los angeles, usa' → ['los angeles', 'usa']
    """
    if "," in name:
        parts = [p.strip() for p in name.split(",") if p.strip()]
        return parts
    return [name]


def is_valid_location(name):
    """
    حذف الأسماء اللي مش أماكن:
    مثل protein, sugar, company names...
    """
    bad_keywords = [
        "corp", "company", "inc", "ltd", "co", "bank", "examiner",
        "tire", "sugar", "protein", "station", "banks",
        "subsidiary", "dollars", "bill"
    ]

    for bad in bad_keywords:
        if bad in name:
            return False

    if len(name) < 2:
        return False

    return True


# ============================================================
# MAIN
# ============================================================

print("Loading geocache...")
with open(INPUT_PATH, "r") as f:
    geocache = json.load(f)

new_cache = {}
skipped = 0

for raw_name, coords in geocache.items():

    if coords is None:
        skipped += 1
        continue

    cleaned = clean_place_name(raw_name)

    if not cleaned:
        skipped += 1
        continue

    # split into components if needed
    components = split_locations(cleaned)

    for comp in components:
        comp = clean_place_name(comp)

        if not is_valid_location(comp):
            skipped += 1
            continue

        if comp not in new_cache:
            new_cache[comp] = coords   # reuse same coords


# Save cleaned JSON
with open(OUTPUT_PATH, "w") as f:
    json.dump(new_cache, f, indent=2)

print(f"Done! Clean locations: {len(new_cache)}")
print(f"Skipped entries: {skipped}")
print(f"Saved cleaned geocache → {OUTPUT_PATH}")
