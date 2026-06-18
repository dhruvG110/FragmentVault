import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export const InteractiveArchitecture = () => {
  const [activeStep, setActiveStep] = useState(0);

  // Auto-play the 3D visualization if the user doesn't click
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev >= 3 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    {
      title: "1. Asynchronous Ingestion",
      desc: "BullMQ picks up the uploaded document in the background, splitting it into semantic chunks without blocking the main event loop.",
    },
    {
      title: "2. Vector Embedding",
      desc: "Chunks are translated into high-dimensional math via Gemini Embeddings and stored in your local ChromaDB instance.",
    },
    {
      title: "3. Agentic Retrieval",
      desc: "When a query is made, the system calculates nearest-neighbor distances in 3D space to pull only the strictly relevant context.",
    },
    {
      title: "4. Autonomous Synthesis",
      desc: "The Gemini Agent analyzes the exact vector matches and synthesizes a precise, hallucination-free response.",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto mt-24 mb-32 border border-white/10 bg-[#09090b] rounded-2xl overflow-hidden shadow-2xl relative">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        
        {/* Left Side: The 3D Isometric Canvas */}
        <div className="relative h-[400px] lg:h-[500px] bg-zinc-950 flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

          {/* The 3D Stage */}
          <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: "1000px" }}>
            <motion.div
              animate={{ rotateX: 60, rotateZ: -45, y: 50 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative w-64 h-64"
            >
              {/* Layer 1: The Raw Document */}
              <motion.div 
                animate={{ z: activeStep === 0 ? 40 : 0, opacity: activeStep === 0 ? 1 : 0.5 }}
                className="absolute top-0 left-0 w-24 h-32 bg-white/5 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              >
                📄
              </motion.div>

              {/* Data Flow Line 1 */}
              <motion.div 
                className="absolute top-16 left-24 w-32 h-[2px] bg-white/10"
                style={{ originX: 0 }}
              >
                <motion.div 
                  animate={{ x: activeStep === 1 ? [0, 128] : 0, opacity: activeStep === 1 ? [0, 1, 0] : 0 }}
                  transition={{ duration: 1.5, repeat: activeStep === 1 ? Infinity : 0 }}
                  className="w-16 h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                />
              </motion.div>

              {/* Layer 2: Chroma DB */}
              <motion.div 
                animate={{ z: activeStep === 1 || activeStep === 2 ? 40 : 0, opacity: activeStep === 1 || activeStep === 2 ? 1 : 0.5 }}
                className="absolute top-8 left-[140px] w-24 h-24 rounded-full bg-blue-900/20 border border-blue-500/30 backdrop-blur-md flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.2)]"
              >
                <div className="grid grid-cols-2 gap-1 opacity-50">
                   <div className="w-2 h-2 bg-blue-400 rounded-full" />
                   <div className="w-2 h-2 bg-blue-400 rounded-full" />
                   <div className="w-2 h-2 bg-blue-400 rounded-full" />
                   <div className="w-2 h-2 bg-blue-400 rounded-full" />
                </div>
              </motion.div>

              {/* Data Flow Line 2 */}
              <motion.div 
                className="absolute top-[130px] left-[180px] w-[2px] h-32 bg-white/10"
                style={{ originY: 0 }}
              >
                <motion.div 
                  animate={{ y: activeStep === 2 ? [0, 128] : 0, opacity: activeStep === 2 ? [0, 1, 0] : 0 }}
                  transition={{ duration: 1.5, repeat: activeStep === 2 ? Infinity : 0 }}
                  className="h-16 w-full bg-purple-500 shadow-[0_0_10px_#a855f7]"
                />
              </motion.div>

              {/* Layer 3: Gemini Agent */}
              <motion.div 
                animate={{ z: activeStep === 3 ? 40 : 0, opacity: activeStep === 3 ? 1 : 0.5 }}
                className="absolute top-[220px] left-[140px] w-32 h-20 bg-zinc-900 border border-purple-500/30 backdrop-blur-md flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.2)]"
              >
                🧠 Agent
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Right Side: Interactive Controls */}
        <div className="flex flex-col justify-center p-8 bg-[#09090b]">
          <h3 className="text-xl font-bold text-white mb-6">Pipeline Telemetry</h3>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                  activeStep === index 
                    ? "bg-zinc-900 border-white/20 shadow-md" 
                    : "bg-transparent border-transparent hover:bg-zinc-900/50"
                }`}
              >
                <div className={`text-sm font-bold mb-1 ${activeStep === index ? "text-white" : "text-zinc-500"}`}>
                  {step.title}
                </div>
                {activeStep === index && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: "auto" }} 
                    className="text-sm text-zinc-400 mt-2 leading-relaxed"
                  >
                    {step.desc}
                  </motion.div>
                )}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};