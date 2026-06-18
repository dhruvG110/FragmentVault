import { useState, useEffect } from "react";
import { Hero } from "./components/Hero";
import { Sidebar } from "./components/Sidebar";
import { UploadZone } from "./components/UploadZone";
import { ChatWindow } from "./components/ChatWindow";

function App() {
  const [inApp, setInApp] = useState(false);
  const [collections, setCollections] = useState([]);
  const [activeCollectionId, setActiveCollectionId] = useState(null);

  const fetchCollections = async () => {
    try {
      const res = await fetch("http://127.0.0.1:4000/collections");
      const data = await res.json();
      setCollections(data.collections || []);
      if (data.collections?.length > 0 && !activeCollectionId) {
        setActiveCollectionId(data.collections[0].id);
      }
    } catch (err) {
      console.error("Failed to load", err);
    }
  };

  useEffect(() => { if (inApp) fetchCollections(); }, [inApp]);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://127.0.0.1:4000/delete/${id}`, { method: "DELETE" });
      if (activeCollectionId === id) setActiveCollectionId(null);
      fetchCollections();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans overflow-hidden">
      {!inApp ? (
        <Hero onEnterApp={() => setInApp(true)} />
      ) : (
        <div className="flex w-full h-screen">
          <Sidebar
            collections={collections}
            activeId={activeCollectionId}
            onSelectCollection={setActiveCollectionId}
            onDeleteCollection={handleDelete}
          />
          
          <div className="flex-1 flex flex-col items-center justify-center relative bg-[#09090b]">
            {!activeCollectionId  ? (
              <UploadZone onUploadSuccess={fetchCollections} />
            ) : (
              <div className="w-full h-full flex relative">
                <ChatWindow activeCollectionId={activeCollectionId} />
                <div className="absolute top-4 right-4 z-20">
                  <button 
                    onClick={() => setActiveCollectionId(null)} 
                    className="bg-white text-black px-4 py-1.5 rounded-md text-xs font-medium hover:bg-zinc-200 transition-colors"
                  >
                    + New Document
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;