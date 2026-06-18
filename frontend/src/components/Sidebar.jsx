export const Sidebar = ({ collections, activeId, onSelectCollection, onDeleteCollection }) => {
  return (
    <div className="w-64 h-screen bg-[#09090b] border-r border-white/10 flex flex-col z-10 text-zinc-300">
      <div className="p-6">
        <h2 className="text-base font-bold text-white tracking-tight">Fragment Vault</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        
        

        {/* Real Dynamic Data */}
        <div>
          <p className="text-[11px] font-semibold text-zinc-500 mb-3 px-2">YOUR INDEXES</p>
          {collections.length === 0 ? (
            <p className="text-xs text-zinc-600 px-2">No documents yet.</p>
          ) : (
            <div className="space-y-1">
              {collections.map((col) => (
                <div
                  key={col.id}
                  onClick={() => onSelectCollection(col.id)}
                  className={`flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer text-sm transition-all group ${
                    activeId === col.id 
                      ? "bg-zinc-800 text-white" 
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                  }`}
                >
                  <span className="truncate pr-2">{col.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCollection(col.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};