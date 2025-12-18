# Smart News Search & Retrieval System

A comprehensive news search and retrieval system combining hybrid search (lexical + semantic), RAG-based AI chatbot, and advanced analytics for Reuters news articles.

## Features

### Hybrid Search
- **Lexical Search**: Traditional keyword matching with BM25 algorithm
- **Semantic Search**: Vector-based similarity using Sentence Transformers
- **Combined Ranking**: Optimized fusion of both search methods

### Multi-turn AI Chatbot
- **Retrieval-Augmented Generation (RAG)**: Answers based on actual documents
- **Conversation Memory**: Maintains context across multiple turns
- **Smart Query Rewriting**: Understands follow-up questions like "summarize that one"
- **Document Reuse**: Efficient context handling for related queries

### Rich Document Display
- Full document metadata (title, content, date, authors)
- Entity extraction (people, places, organizations, companies)
- Geographic and temporal information
- Relevance scoring

### Analytics Dashboard
- Kibana integration for advanced visualizations
- Search trends and usage patterns
- Document distribution analysis

---

## Architecture

```
┌─────────────────┐
│   Frontend      │  React/HTML + JavaScript
│   (Port 3000)   │  - Search Interface
└────────┬────────┘  - Chat Interface
         │           - Results Display
         ↓
┌─────────────────┐
│   Backend API   │  FastAPI (Python)
│   (Port 8000)   │  - /search endpoint
└────────┬────────┘  - /chat endpoint
         │           - /autocomplete endpoint
         ↓
┌─────────────────┐
│ Elasticsearch   │  Search Engine
│   (Port 9200)   │  - Document storage
└────────┬────────┘  - Hybrid indexing
         │           - Vector search (HNSW)
         ↓
┌─────────────────┐
│    Kibana       │  Analytics Dashboard
│   (Port 5601)   │  - Visualizations
└─────────────────┘  - Search analytics
```

---

## Prerequisites

- **Python**: 3.8 or higher (Miniconda/Anaconda recommended)
- **Node.js**: 14.x or higher
- **Elasticsearch**: 8.x
- **Kibana**: 8.x (optional, for analytics)

---

## Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/iistatiehh/Smart-News-Retrieval.git
cd smart-news-retrieval
```

### Step 2: Set Up Python Environment

```bash
# Create conda environment
conda create -n NewsRetrival python=3.9
conda activate NewsRetrival

# Install Python dependencies
pip install -r requierments.txt
```

### Step 3: Start Elasticsearch

**Option A: Docker (Recommended)**
```bash
docker run -d \
  --name elasticsearch \
  -p 9200:9200 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  elasticsearch:8.11.0
```

**Option B: Local Installation**
- Download from [elastic.co](https://www.elastic.co/downloads/elasticsearch)
- Start Elasticsearch service
- Verify at: http://localhost:9200

### Step 4: Index Your Documents

**IMPORTANT**: Before running the application, you must index your documents first!

```bash
# Make sure Elasticsearch is running
# Verify: curl http://localhost:9200

# Run the indexing script
#you can also use the indexing notebook in the Notebooks folder
python newsReutersIndexing.py
 
```

The indexing script will:
1. Create the Elasticsearch index with proper mappings
2. Load documents from your JSON file
3. Generate embeddings using Sentence Transformers
4. Index documents with both text and vector fields
5. Create chunks for efficient retrieval


**Verify Indexing:**
```bash
# Check if index was created
curl http://localhost:9200/news_reuters_docs

# Check document count
curl http://localhost:9200/news_reuters_docs/_count
```

### Step 5: (Optional) Set Up Kibana for Analytics

```bash
# Start Kibana (Docker)
docker run -d \
  --name kibana \
  --link elasticsearch \
  -p 5601:5601 \
  kibana:8.11.0

# Access Kibana at: http://localhost:5601
```

**Configure Kibana Dashboards:**

1. Open Kibana at http://localhost:5601
2. Go to **Stack Management** → **Index Patterns**
3. Create index pattern: `news_reuters_docs`
4. Go to **Dashboard** → **Create Dashboard**
5. Add visualizations:
   - Document count over time
   - Top places/companies/people
   - Search query trends
   - Geographic distribution (if using geo_location field)

**Import Pre-built Dashboards** (if available):
```bash
# Export from Kibana UI or use saved_objects API
# Place dashboard JSON in kibana_dashboards/ folder
```

6. **Embed in Frontend**: Update the analytics section iframe URL:
```javascript
// In frontend code
const kibanaUrl = 'http://localhost:5601/app/dashboards#/view/YOUR_DASHBOARD_ID';
```

**Note**: The analytics section in the website will only work if you configure Kibana dashboards.

### Step 6: Configure API Keys

Edit `app.py` (backend file) and add your Groq API key:

```python
GROQ_API_KEY = "your_groq_api_key_here"  # Get from https://console.groq.com
```

### Step 7: Install Frontend Dependencies

```bash
cd Frontend
npm install
```

---

## ▶️ Running the Application

### Terminal 1: Start Backend (FastAPI)

```bash
# Activate conda environment
conda activate NewsRetrival

# Navigate to backend directory (if needed)
cd path/to/backend

# Run the backend using your conda Python
C:\Users\asus\miniconda3\envs\NewsRetrival\python.exe app.py
```

**Expected Output:**
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Verify Backend:**
- Open http://localhost:8000
- Check health: http://localhost:8000/health

### Terminal 2: Start Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

**Access Application:**
- Open http://localhost:3000 in your browser

---

## Usage Guide

### Search Mode

1. **Enter Keywords**: Type your search query in the search box
2. **Hit Search**: Click the "Search" button or press Enter
3. **Browse Results**: Scroll through document cards showing:
   - Document title and relevance score
   - Publication date and authors
   - Content preview (first 500 characters)
   - Tagged entities (places, people, organizations)

**Example Queries:**
- `banking crisis 1987`
- `farmer owned reserve`
- `Japan economic events`

### Chat Mode

1. **Switch Mode**: Click "AI Chat" button
2. **Ask Questions**: Type natural language questions
3. **Follow-up**: Continue the conversation with context
   - "Tell me more about that"
   - "Summarize that in 2 sentences"
   - "What were the consequences?"

**Example Conversation:**
```
You: Tell me about NATIONAL AVERAGE PRICES FOR FARMER-OWNED RESERVE
Bot: [Provides detailed information with tables]
You: Summarize that in two sentences
Bot: [Provides concise summary]
```

### Autocomplete (Search Suggestions)

- Type at least 3 characters
- See instant suggestions from document titles
- Click any suggestion to search

---

## Configuration

### Backend Configuration (app.py)

```python
# Elasticsearch
ES_HOST = "http://localhost:9200"
INDEX_NAME = "news_reuters_docs"

# API Keys
GROQ_API_KEY = "your_api_key_here"

# Search Parameters
DEFAULT_TOP_K = 10  # Number of results to return
REQUEST_TIMEOUT = 60  # Elasticsearch timeout

# LLM Configuration
MODEL_NAME = "openai/gpt-oss-120b"
TEMPERATURE = 0
```

### Frontend Configuration

```javascript
// In your frontend code
const API_URL = 'http://localhost:8000';
```

### Indexing Configuration (indexing_script.py)

```python
# File path to your JSON documents
file_path = r"C:\path\to\your\reuters_full.json"

# Batch size for indexing
batch_size = 500

# Content chunk size
max_chunk_length = 500
```

---

## Project Structure

```
smart-news-retrieval/
├── backend/
│   ├── app.py                    # FastAPI backend
│   └── requirements.txt          # Python dependencies
├── frontend/
│   ├── src/
│   │   └── components/
│   ├── package.json
│   └── index.html
├── indexing_script.py            # Elasticsearch indexing
├── kibana_dashboards/            # (Optional) Dashboard configs
│   └── analytics_dashboard.json
├── data/
│   └── reuters_full.json         # Your document collection
└── README.md
```


## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---


