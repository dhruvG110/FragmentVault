import { motion } from "framer-motion";
import { InteractiveArchitecture } from "./InteractiveArchitecture";

export const Hero = ({ onEnterApp }) => {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-50 font-sans selection:bg-zinc-800 overflow-x-hidden">
      {/* Sticky Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#09090b]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between transition-all">
        <div className="flex items-center gap-8 font-medium text-sm text-zinc-400">
          <span className="text-white font-bold text-base tracking-tight flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Fragment Vault
          </span>
          <button onClick={() => scrollToSection("features")} className="hover:text-white transition-colors hidden sm:block">Agent Specs</button>
          <button onClick={() => scrollToSection("architecture")} className="hover:text-white transition-colors hidden sm:block">Architecture</button>
          <button onClick={() => scrollToSection("contact")} className="hover:text-white transition-colors hidden sm:block">Contact</button>
        </div>
        <button onClick={onEnterApp} className="bg-white text-black px-4 py-2 rounded-md font-medium text-sm hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          Initialize Agent
        </button>
      </nav>

      {/* Main Hero Section */}
      <section className="pt-48 pb-10 px-4 flex flex-col items-center text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300 backdrop-blur-sm"
        >
          v1.0 • Autonomous RAG Agents deployed.
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl sm:text-7xl font-bold tracking-tight text-white mb-6 leading-tight"
        >
          Don't just chat. <br className="hidden sm:block" />
          <span className="text-zinc-600">Deploy data-driven Agents.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl text-lg text-zinc-400 mb-10 leading-relaxed"
        >
          Fragment Vault isn't a wrapper. It is a fully engineered, asynchronous pipeline. Upload massive documents, generate mathematical vector embeddings, and interact with an AI that routes, reasons, and strictly cites your local data.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex gap-4">
          <button onClick={onEnterApp} className="bg-white text-black px-8 py-3 rounded-md font-medium text-sm hover:bg-zinc-200 transition-colors flex items-center gap-2">
            Enter Vault <span className="text-zinc-500">→</span>
          </button>
          <button onClick={() => scrollToSection("architecture")} className="bg-transparent border border-white/10 text-white px-8 py-3 rounded-md font-medium text-sm hover:bg-zinc-900 transition-colors">
            View Pipeline
          </button>
        </motion.div>
      </section>

      {/* 3D Interactive Architecture Section */}
      <section id="architecture" className="px-6 relative">
        {/* Glow effect behind the architecture block */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <InteractiveArchitecture />
      </section>

      {/* Features Section (Shadcn Bento Grid Style) */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto border-t border-white/5">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">The Agentic Advantage</h2>
          <p className="text-zinc-400">Standard chatbots guess. RAG Agents calculate.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 md:col-span-2 p-8 rounded-2xl border border-white/10 bg-zinc-950/50 hover:bg-zinc-900/50 transition-colors">
            <div className="text-2xl mb-4">⏱️</div>
            <h3 className="text-xl font-semibold mb-2">Unblocked Event Loops</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">Built on Node.js with Redis and BullMQ. When you drop a 500-page PDF, the worker thread handles the heavy text-chunking and API calls. Your UI stays at a buttery 60 frames per second.</p>
          </div>
          <div className="p-8 rounded-2xl border border-white/10 bg-zinc-950/50 hover:bg-zinc-900/50 transition-colors">
            <div className="text-2xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Zero Hallucinations</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">The Gemini Agent is hard-prompted to act as a strict synthesizer. If your documents don't contain the answer, the agent refuses to fabricate one.</p>
          </div>
          <div className="p-8 rounded-2xl border border-white/10 bg-zinc-950/50 hover:bg-zinc-900/50 transition-colors">
            <div className="text-2xl mb-4">🗄️</div>
            <h3 className="text-xl font-semibold mb-2">Local Vector Search</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">Using ChromaDB, all document math is stored locally. Nearest-neighbor algorithms fetch context in milliseconds before the LLM even wakes up.</p>
          </div>
          <div className="col-span-1 md:col-span-2 p-8 rounded-2xl border border-white/10 bg-zinc-950/50 hover:bg-zinc-900/50 transition-colors">
            <div className="text-2xl mb-4">🔄</div>
            <h3 className="text-xl font-semibold mb-2">Dynamic Context Switching</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">The vault architecture allows you to instantly swap the Agent's active memory. Click a new document in the sidebar, and the entire vector space shifts instantly.</p>
          </div>
        </div>
      </section>

      {/* Footer / Contact Section */}
      <footer id="contact" className="border-t border-white/10 bg-[#09090b] py-16 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white mb-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white" />
              Fragment Vault
            </h2>
            <p className="text-sm text-zinc-500">Engineered by Dhruv Gupta.</p>
          </div>
          
          <div className="flex gap-8">
            <a href="https://github.com/dhruvG110" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">
              GitHub
            </a>
            <a href="https://linkedin.com/in/dhruv-gupta-913a7b2a6" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">
              LinkedIn
            </a>
            <a href="https://instagram.com/its_meh_dhruvv" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">
              Instagram
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};