import { useState, useRef } from "react";

export const UploadZone = ({ onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState(""); 
  const [progressText, setProgressText] = useState("");
  const fileInputRef = useRef(null);

  const pollJobStatus = async (fileId) => {
    setStatus("processing");
    setProgressText("Processing document...");
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://127.0.0.1:4000/upload/status/${fileId}`);
        const data = await res.json();
        if (data.status === "completed") {
          clearInterval(interval);
          setStatus("done");
          setProgressText("Ready.");
          setTimeout(() => { setStatus(""); onUploadSuccess(); }, 1500);
        } else if (data.status === "failed") {
          clearInterval(interval);
          setStatus("error");
          setProgressText(`Error: ${data.error}`);
        }
      } catch (err) {
        clearInterval(interval);
        setStatus("error");
        setProgressText("Connection failed.");
      }
    }, 2000);
  };

  const handleFile = async (file) => {
    if (!file) return;
    setStatus("uploading");
    setProgressText(`Uploading ${file.name}...`);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:4000/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      pollJobStatus(data.fileId);
    } catch (error) {
      setStatus("error");
      setProgressText("Upload failed.");
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl">
      <h3 className="text-white font-medium mb-1">Add a new document</h3>
      <p className="text-sm text-zinc-400 mb-6">Upload a file to initialize the vector engine.</p>
      
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFile(e.dataTransfer.files[0]); }}
        className={`flex flex-col items-center justify-center border border-dashed rounded-xl p-8 mb-6 transition-all ${
          dragActive ? "border-white bg-white/5" : "border-white/10 bg-zinc-950"
        }`}
      >
        <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
        
        <p className="text-sm text-zinc-300 mb-1">
          {status === "" ? "Drag and drop your file here" : progressText}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <button 
          onClick={() => fileInputRef.current.click()}
          disabled={status !== ""}
          className="w-full bg-white text-black py-2 rounded-md text-sm font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50"
        >
          {status === "" ? "Select File" : "Processing..."}
        </button>
        <button className="w-full bg-transparent border border-white/10 text-white py-2 rounded-md text-sm font-medium hover:bg-zinc-900 transition-colors"onClick={()=>{window.location.reload()}} >
          Cancel
        </button>
      </div>
    </div>
  );
};