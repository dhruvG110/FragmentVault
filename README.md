<div align="center">

# 💎 Fragment Vault
<img width="1906" height="996" alt="image" src="https://github.com/user-attachments/assets/c7d60869-b8b0-4d79-9998-f62576c4a7df" />

**Autonomous, Asynchronous RAG Agents for Massive Documents**

[![React](https://img.shields.io/badge/React-18-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![Redis](https://img.shields.io/badge/Redis-BullMQ-red.svg?style=for-the-badge&logo=redis)](https://redis.io/)
[![ChromaDB](https://img.shields.io/badge/ChromaDB-Vector_Store-orange.svg?style=for-the-badge)](https://www.trychroma.com/)
[![Gemini](https://img.shields.io/badge/Google-Gemini_2.5-blueviolet.svg?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)

[View Demo](#) • [Report Bug](#) • [Request Feature](#)
<img width="1917" height="996" alt="image" src="https://github.com/user-attachments/assets/87f2ee4c-0604-43c7-b593-8532a7fa32e2" />

<img src="docs/hero-screenshot.png" alt="Fragment Vault Interface" width="800" style="border-radius: 12px; margin-top: 20px; box-shadow: 0 0 20px rgba(255,255,255,0.1);"/>
<img width="1919" height="998" alt="image" src="https://github.com/user-attachments/assets/01d9e854-5a95-48bd-8362-50825a78fed0" />

</div>
<img width="1909" height="999" alt="image" src="https://github.com/user-attachments/assets/7b9f1ad7-f3ed-470a-86cf-a902d048336e" />

---

## ⚡ The Engineering Problem

Most local "Chat with PDF" wrappers suffer from a fatal flaw: **The Event Loop Bottleneck.** When a user uploads a 500-page PDF, Node.js blocks the main thread to parse, chunk, and embed the text. The API freezes, the UI hangs, and the application crashes under load.

## 🧠 The Fragment Vault Solution

Fragment Vault bypasses this by completely decoupling data ingestion from the user interface using a **Worker Queue Architecture**. 

Files are intercepted, written to disk, and handed to a **Redis/BullMQ** background worker. The worker handles the heavy text-chunking and high-dimensional vector translation while your frontend remains at a buttery 60 FPS. Once embedded into the local **ChromaDB** instance, the **Gemini 2.5 Agent** is unleashed—strictly synthesizing answers based *only* on the nearest-neighbor mathematics of your document.

---

## 📐 Architecture Pipeline

```mermaid
graph LR
    A[React Client] -->|Upload Document| B(Express API)
    B -->|Return 202 Accepted| A
    B -->|Enqueue Job| C{Redis / BullMQ}
    C -->|Process in Background| D[Node Worker]
    D -->|Chunk & Extract| E[OfficeParser]
    E -->|Generate Vectors| F[Gemini Embeddings]
    F -->|Store Math| G[(ChromaDB)]
    A -->|Poll Status| B
    A -->|Query Question| B
    B -->|Nearest Neighbor Search| G
    G -->|Return Context| H[Gemini 2.5 Agent]
    H -->|Synthesize Response| A

✨ Enterprise Features
Asynchronous Ingestion: Upload gigabytes of data without dropping a single frame on the client.

Zero Hallucinations: The RAG Agent is heavily prompted to reject answering if the exact vector matches do not contain the factual context.

Local Vector Math: Powered by ChromaDB, ensuring lightning-fast semantic retrieval.

Premium UI/UX: Built with Framer Motion and Tailwind CSS for a premium, isometric Vercel/Linear aesthetic.

🚀 Getting Started
1. Prerequisites
Ensure you have the following installed on your machine:

Node.js (v18 or higher)

Redis Server (Running on port 6379)

Docker (Highly recommended for running ChromaDB)

2. Boot up ChromaDB
The easiest way to run the local vector database is via Docker:

Bash
docker run -p 8000:8000 chromadb/chroma
3. Setup the Backend Engine
Navigate to the backend directory, install dependencies, and configure your environment.

Bash
cd backend
npm install
Create a .env file in the backend folder:

Code snippet
PORT=4000
GEMINI_API_KEY=your_google_gemini_api_key_here
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
CHROMA_URL=[http://127.0.0.1:8000](http://127.0.0.1:8000)
Start the API and the BullMQ Background Worker:

Bash
npm run dev
4. Setup the Frontend UI
Open a new terminal, navigate to the frontend directory, and spin up Vite.

Bash
cd frontend
npm install
Create a .env file in the frontend folder:

Code snippet
VITE_API_URL=[http://127.0.0.1:4000](http://127.0.0.1:4000)
Start the React application:

Bash
npm run dev
Visit http://localhost:5173 to initialize your RAG Agent.

📂 Project Structure
Plaintext
fragment-vault/
├── backend/
│   ├── index.js          # Express API & BullMQ Worker Logic
│   ├── package.json
│   └── uploads/          # Temporary Multer storage
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Hero.jsx                # Landing Page
    │   │   ├── InteractiveArchitecture.jsx # 3D Pipeline Visualizer
    │   │   ├── UploadZone.jsx          # File Polling Component
    │   │   ├── ChatWindow.jsx          # AI Interface
    │   │   └── Sidebar.jsx             # Vault Index Manager
    │   ├── App.jsx                     # Global State & Routing
    │   └── index.css                   # Tailwind Engine
    ├── tailwind.config.js
    └── package.json
👨‍💻 Engineered By
Dhruv Gupta

GitHub: @dhruvG110

LinkedIn: Dhruv Gupta

Instagram: @its_meh_dhruvv
