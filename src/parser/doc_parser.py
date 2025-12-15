import os
from bs4 import BeautifulSoup
import json
import re
import dateparser
import subprocess
import spacy

from src.temporal.temporal_extractor import extract_temporal_expressions
from src.geo.georeference_extractor import extract_georeferences
from src.geo.geopoint_extractor import get_geopoint
from src.geo.geonormalizer import normalize_geo_name

# =============================
# CONFIG
# =============================
DATA_DIR = "/Users/mac2/University/Information Retrieval/Smart Doc System/smart-news-retrieval-/archive"
OUTPUT_DIR = "/Users/mac2/University/Information Retrieval/Smart Doc System/smart-news-retrieval-/output"

# =============================
# NER MODEL
# =============================
nlp = spacy.load("en_core_web_sm")


# =============================
# LLM CALLER (Ollama)
# =============================
def ask_llm(prompt: str) -> str:
    """
    Calls local Qwen2.5 1.5B via Ollama
    """
    try:
        result = subprocess.run(
            ["ollama", "run", "qwen2.5:1.5b"],
            input=prompt,
            text=True,
            capture_output=True
        )
        return result.stdout.strip()
    except Exception as e:
        print("[LLM ERROR]", e)
        return "Unknown"


# =============================
# EXTRACT PERSONS (NER)
# =============================
def extract_persons(text):
    if not text:
        return []
    doc = nlp(text)
    return list(set([ent.text for ent in doc.ents if ent.label_ == "PERSON"]))


# =============================
# AUTHOR EXTRACTION via LLM
# =============================
def extract_author_llm(article_text):
    persons = extract_persons(article_text)

    prompt = f"""
You are an expert news article analyzer.

Extract ONLY the author name of this article.

Rules:
- Author MUST appear in a byline such as:
  "By John Smith"
  "BY JOHN SMITH"
  "Reporting by John Smith"
  "Editing by John Smith"
  "Written by John Smith"
- Ignore ALL other names inside the article (NOT authors).
- If the story ends with "Reuter" or "Reuters", return exactly: Reuter
- If you cannot find any author, return: Unknown
- Output ONLY the name, no explanation.

ARTICLE:
{article_text}

Detected PERSON entities:
{persons}
"""

    answer = ask_llm(prompt).strip()

    if answer.lower() in ["", "unknown", "no author", "none"]:
        return "Unknown"

    return answer


# =============================
# AUTHOR VALIDATION
# =============================
def validate_author(body, author):
    if author in ["Unknown", "Reuter"]:
        return author

    if not body:
        return "Unknown"

    last_lines = "\n".join(body.split("\n")[-10:]).lower().strip()

    pattern = rf"(by|reporting by|written by|editing by)\s+{re.escape(author.lower())}"

    if re.search(pattern, last_lines, re.IGNORECASE):
        return author

    return "Unknown"


# =============================
# AUTHOR FORMATTER
# =============================
def format_author(author_raw):
    if not author_raw or author_raw == "Unknown":
        return [{
            "first_name": "",
            "last_name": "",
            "email": ""
        }]

    if author_raw == "Reuter":
        return [{
            "first_name": "",
            "last_name": "Reuter",
            "email": ""
        }]

    parts = author_raw.split()
    if len(parts) == 1:
        return [{
            "first_name": "",
            "last_name": parts[0].title(),
            "email": ""
        }]

    return [{
        "first_name": parts[0].title(),
        "last_name": " ".join(p.title() for p in parts[1:]),
        "email": ""
    }]


# =============================
# DATE CONVERTER
# =============================
def format_date(date_raw):
    if not date_raw:
        return None
    parsed = dateparser.parse(date_raw)
    return parsed.isoformat() if parsed else None


# =============================
# PARSER
# =============================
def parse_reuters_file(file_path):

    with open(file_path, "r", encoding="latin-1") as f:
        raw_text = f.read()

    soup = BeautifulSoup(raw_text, "html.parser")
    docs = []

    for reuter in soup.find_all("reuters"):

        title_tag = reuter.find("title")
        text_tag = reuter.find("text")
        date_tag = reuter.find("date")
        author_tag = reuter.find("author")
        dateline_tag = reuter.find("dateline")
        places_tag = reuter.find("places")

        title = title_tag.get_text(strip=True) if title_tag else None

        # body
        if text_tag:
            body_tag = text_tag.find("body")
            body = body_tag.get_text(" ", strip=True) if body_tag else text_tag.get_text(" ", strip=True)
        else:
            body = ""

        # --------------------
        # AUTHOR
        # --------------------
        if author_tag:
            author_raw = author_tag.get_text(strip=True)
        else:
            author_raw = extract_author_llm(body)

        author_raw = validate_author(body, author_raw)
        authors = format_author(author_raw)

        # --------------------
        # DATE
        # --------------------
        date_raw = date_tag.get_text(strip=True) if date_tag else None
        date_iso = format_date(date_raw)

        # --------------------
        # DATELINE
        # --------------------
        dateline_raw = dateline_tag.get_text(" ", strip=True) if dateline_tag else None
        dateline = dateline_raw

        # --------------------
        # PLACES TAG
        # --------------------
        places = []
        if places_tag:
            for d in places_tag.find_all("d"):
                p = d.get_text(strip=True)
                if p:
                    places.append(p)

        # --------------------
        # TEMPORAL + GEO REFERENCES
        # --------------------
        temporal_expressions = extract_temporal_expressions(body or "")
        geo_refs = extract_georeferences(body or "")

        if not geo_refs and places:
            geo_refs = places.copy()

        if not geo_refs and dateline_raw:
            city = dateline_raw.split(",")[0].strip()
            if city.isalpha():
                geo_refs = [city]

        if not geo_refs:
            geo_refs = ["Unknown"]

        # clean geo
        VALID_GEO = [g for g in geo_refs if len(g.strip()) > 2]
        if not VALID_GEO:
            VALID_GEO = ["Unknown"]

        # --------------------
        # GEOCODING
        # --------------------
        geopoints = []
        for place in VALID_GEO:
            norm = normalize_geo_name(place)
            point = get_geopoint(norm)
            geopoints.append({
                "place": place,
                "location": {
                    "lat": point["lat"] if point else None,
                    "lon": point["lon"] if point else None
                }
            })

        # --------------------
        # FINAL DOC
        # --------------------
        doc = {
            "title": title,
            "content": body,
            "authors": authors,
            "date": date_iso,
            "dateline": dateline,
            "places": places,
            "temporalExpressions": temporal_expressions,
            "georeferences": VALID_GEO,
            "geopoints": geopoints
        }

        if title or body:
            docs.append(doc)

    return docs


# =============================
# MAIN
# =============================
def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    all_docs = []

    for filename in os.listdir(DATA_DIR):
        if filename.lower().endswith(".sgm"):
            print(f"Processing: {filename}")
            file_path = os.path.join(DATA_DIR, filename)
            docs = parse_reuters_file(file_path)
            print(f" -> {len(docs)} extracted")
            all_docs.extend(docs)

    output_path = os.path.join(OUTPUT_DIR, "all_reuters_parsed.json")

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(all_docs, f, ensure_ascii=False, indent=2)

    print("\n===============================")
    print(f"TOTAL DOCUMENTS: {len(all_docs)}")
    print(f"SAVED TO: {output_path}")
    print("===============================")


if __name__ == "__main__":
    main()
