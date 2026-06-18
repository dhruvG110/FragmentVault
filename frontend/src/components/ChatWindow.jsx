import { useState } from "react";

export const ChatWindow = ({ activeCollectionId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeCollectionId || loading) return;

    const userMessage = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`http://127.0.0.1:4000/query/${activeCollectionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.answer || data.message, isUser: false }]);
    } catch (err) {
      setMessages((prev) => [...prev, { text: "Error communicating with server.", isUser: false }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#09090b]">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <p className="text-sm text-zinc-400">
          Index: <span className="text-white font-medium">{activeCollectionId?.slice(0, 8)}</span>
        </p>
        <div className="flex gap-2">
           <span className="px-2 py-1 rounded border border-white/10 text-xs text-zinc-400">Active</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-2xl px-4 py-3 rounded-lg text-sm leading-relaxed ${
              msg.isUser ? "bg-white text-black" : "bg-zinc-900 border border-white/10 text-zinc-200"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-900 border border-white/10 text-zinc-400 px-4 py-3 rounded-lg text-sm animate-pulse">
              Thinking...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-[#09090b]">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!activeCollectionId}
            placeholder="Send a message..."
            className="flex-1 bg-zinc-950 border border-white/10 rounded-md px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500 disabled:opacity-50 transition-colors"
          />
          <button
            type="submit"
            disabled={!activeCollectionId || loading}
            className="bg-white text-black px-4 py-2.5 rounded-md font-medium text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};