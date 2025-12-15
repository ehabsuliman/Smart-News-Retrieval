# Smart News Retrieval

Smart News Retrieval is an **Information Retrieval (IR) system** designed to index, search, and retrieve news documents using **LLM-powered parsing**, semantic embeddings, and efficient vector search.  
The project focuses on building a modern retrieval pipeline that combines large language models with vector-based similarity search to enable accurate and context-aware document retrieval.

---

## 🚀 Project Overview

The system ingests raw news documents, parses them using an LLM, splits them into semantic chunks, and converts them into vector embeddings.  
A vector index based on **HNSW (Hierarchical Navigable Small World)** is then used to efficiently retrieve the most relevant document chunks for a given user query.

The retrieved results are integrated into a **Retrieval-Augmented Generation (RAG)** pipeline, enabling downstream LLMs to generate informed, context-aware responses grounded in the retrieved documents.

This project was developed collaboratively as a team effort, with shared contributions in system design, retrieval pipeline development, and experimentation.

---

## 🧠 Core IR Pipeline

1. **LLM-based Document Parsing**  
   - Used a Large Language Model to clean, structure, and normalize raw news documents.
   - Extracted meaningful textual segments suitable for retrieval.

2. **Chunking & Embedding Generation**  
   - Split documents into semantic chunks.
   - Generated dense vector embeddings for each chunk using an embedding model.

3. **Vector Indexing with HNSW**  
   - Indexed embeddings using an HNSW-based vector store.
   - Enabled fast and scalable approximate nearest neighbor (ANN) search.

4. **Semantic Retrieval**  
   - Retrieved the most relevant document chunks based on vector similarity.
   - Ranked results by relevance scores.

5. **RAG (Retrieval-Augmented Generation)**  
   - Integrated retrieved chunks into a RAG pipeline.
   - Provided grounded context to LLMs for accurate answer generation.

---

## ✨ Key Features

- LLM-powered document parsing and preprocessing  
- Semantic chunking and dense vector embeddings  
- Fast similarity search using HNSW indexing  
- Retrieval-Augmented Generation (RAG) pipeline  
- Modular IR architecture for experimentation  
- Dockerized setup for reproducibility  

---

## 🛠️ Technologies & Libraries

### **Programming Language**
- Python

### **Information Retrieval**
- Large Language Models (LLMs)  
- Embedding Models  
- Vector Similarity Search  
- HNSW (Approximate Nearest Neighbor Indexing)  
- Retrieval-Augmented Generation (RAG)

### **Data Processing**
- NumPy  
- Pandas  

### **Infrastructure & Tools**
- Docker  
- Git & GitHub  
- OpenSearch (Same ElasticSearch but Open Source)  
- Kibana  
- Postman 

---

## 📂 Project Structure

smart-News-Retrieval/
│
├── src/ # Core source code
├── output/ # Generated outputs and results
├── docker/ # Docker configuration files
├── archive/ # Archived resources and experiments
├── README.md # Project documentation
└── requirements.txt # Python dependencies


---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repository
git clone https://github.com/ehabsuliman/Smart-News-Retrieval.git
cd Smart News Retrieval

