const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const multer = require("multer");
const { Queue, Worker } = require("bullmq");
const readFile = require("fs").promises.readFile;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { ChromaClient } = require("chromadb");
const { OfficeConverter } = require("officeparser");
const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");

// Ensure the uploads directory exists
if (!fs.existsSync("uploads/")) {
  fs.mkdirSync("uploads/");
}

// Configure Multer to preserve the original file extension
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    // Extract the extension (e.g., ".pdf") and append it to a unique name
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + ext);
  }
});

const upload = multer({ storage: storage });
app.use(cors());
app.use(express.json());
// 1. Update CORS to accept traffic from anywhere (for now)
app.use(cors({ origin: "*" })); 

// 2. Update ChromaDB Connection
const client = new ChromaClient({ 
  path: process.env.CHROMA_URL || "http://127.0.0.1:8000" 
});

// 3. Update Redis Connection for BullMQ
const redisConnection = { 
  host: process.env.REDIS_HOST || "127.0.0.1", 
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined
};
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Set up Redis connection and BullMQ queue
const documentQueue = new Queue("DocumentProcessingQueue", { 
  connection: redisConnection 
});
const worker = new Worker(
  "DocumentProcessingQueue", 
  async (job) => {
    const { fileId, filePath, originalName } = job.data;
    console.log(`Processing job ${job.id} for file ${fileId}`);

    const { value: chunks } = await OfficeConverter.convert(
      filePath,
      "chunks",
      {
        generatorConfig: {
          chunksConfig: {
            strategy: "fixed-size",
            chunkSize: 1000,
            chunkOverlap: 200,
          },
        },
      },
    );
    
    // Safety Check: Fail the job gracefully if the file is empty
    if (!chunks || chunks.length === 0) {
      throw new Error("No text chunks could be extracted from the file.");
    }

    // Safety Check: Use getOrCreate so BullMQ can safely retry failed jobs
    const collection = await client.getOrCreateCollection({
      name: fileId,
      embeddingFunction: { generate: () => [] },
        metadata: { originalName: originalName }
    });

    for (let i = 0; i < chunks.length; i++) {
      const vectorData = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: chunks[i].text,
      });
      const googleMathCoordinates = vectorData.embeddings[0].values;
      await collection.add({
        ids: ["chunk_" + i],
        embeddings: [googleMathCoordinates],
        documents: [chunks[i].text],
        metadatas: [chunks[i].metadata],
      });
    }
    await require("fs").promises.unlink(filePath);
    return { message: "Document successfully embedded in ChromaDB" };
  },
  { connection: redisConnection }
);
//
const port = process.env.PORT || 4000;
app.get("/", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});
app.post("/upload", upload.single("file"),async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file was uploaded." });
    }
    const absoluteFilePath = path.resolve(req.file.path);
    const originalName = req.file.originalname;
    console.log("File saved successfully to:", absoluteFilePath);
    const fileId = uuidv4();

    // 1. Toss the job into the Redis Queue for the Worker to handle
    await documentQueue.add(
      "ProcessPDF", 
      { fileId,filePath: absoluteFilePath ,originalName: originalName }, 
      { jobId: fileId } 
    );

    // 2. Instantly respond to the frontend
    return res.status(202).json({ 
      message: "File accepted and added to the processing queue.", 
      fileId 
    });
  } catch (error) {
    console.error("Failed to queue document:", error);
    res.status(500).json({ message: "Failed to queue document" });
  }
});
app.post("/query/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { query } = req.body;
    const collection = await client.getCollection({
      name: id,
      embeddingFunction: { generate: () => [] },
    });
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }
    const queryVector = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: query,
    });
    const results = await collection.query({
      queryEmbeddings: [queryVector.embeddings[0].values],
      nResults: 3, // Grabs the top 3 most relevant chunks
    });
    const contextText = results.documents[0].join("\n\n");
    const strictPrompt = `
  You are an expert assistant. Answer the user's question using ONLY the provided context below.
  If the answer is not contained in the context, say "I cannot answer this based on the document."

  CONTEXT:
  ${contextText}

  USER QUESTION:
  ${query}
`;
    const finalAnswer = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: strictPrompt,
    });
    return res.status(200).json({ answer: finalAnswer.text });
    // The final text you send back to the user is: finalAnswer.text
  } catch (error) {
    console.error("Error processing query:", error);
    res.status(500).json({ message: "Error processing query" });
  }
});
app.get("/upload/status/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Ask BullMQ to find the job by ID
    const job = await documentQueue.getJob(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 2. Get the current state (waiting, active, completed, failed)
    const state = await job.getState();
    
    // 3. Optional: Get the error reason if it failed
    const failedReason = job.failedReason || null;

    return res.status(200).json({ 
      jobId: id, 
      status: state,
      error: failedReason
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching job status" });
  }
});
app.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await client.deleteCollection({ name: id });
    return res.status(200).json({ message: "Collection deleted successfully" });
  } catch (error) {
    console.error("Error deleting collection:", error);
    res.status(500).json({ message: "Error deleting collection" });
  }
});
app.get("/collections", async (req, res) => {
  try {
    const collections = await client.listCollections();
    
    
    const formattedCollections = collections.map(col => ({
      id: col.name,
      name: col.metadata?.originalName || "Unknown Document" 
    }));

    return res.status(200).json({ collections: formattedCollections });
  } catch (error) {
    console.error("Error listing collections:", error);
    res.status(500).json({ message: "Error listing collections" });
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
