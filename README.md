<div align="center">

# 💎 Fragment Vault

<img width="1902" height="996" alt="image" src="https://github.com/user-attachments/assets/052883a6-8d38-469f-bf1d-55962f73378b" />


**Autonomous, Asynchronous RAG Agents for Massive Documents**

[![React](https://img.shields.io/badge/React-18-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![Redis](https://img.shields.io/badge/Redis-BullMQ-red.svg?style=for-the-badge&logo=redis)](https://redis.io/)
[![ChromaDB](https://img.shields.io/badge/ChromaDB-Vector_Store-orange.svg?style=for-the-badge)](https://www.trychroma.com/)
[![Gemini](https://img.shields.io/badge/Google-Gemini_2.5-blueviolet.svg?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)

[View Demo](#) • [Report Bug](#) • [Request Feature](#)

<img width="1276" height="724" alt="image" src="https://github.com/user-attachments/assets/42b7a513-9825-4564-813c-85390f125c4e" />


<img width="1891" height="996" alt="image" src="https://github.com/user-attachments/assets/484c86ab-be8e-4e55-bebf-25a5cca9450c" />

<img src="docs/hero-screenshot.png" alt="Fragment Vault Interface" width="800" style="border-radius: 12px; margin-top: 20px; box-shadow: 0 0 20px rgba(255,255,255,0.1);"/>

<img width="1917" height="994" alt="image" src="https://github.com/user-attachments/assets/54155515-64df-4932-8dbe-afd70a720946" />


</div>

<img width="1909" height="999" alt="image" src="[https://github.com/user-attachments/assets/7b9f1ad7-f3ed-470a-86cf-a902d048336e](https://github.com/user-attachments/assets/7b9f1ad7-f3ed-470a-86cf-a902d048336e)" />

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
