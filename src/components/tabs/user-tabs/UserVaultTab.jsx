import React from 'react';

const UserVaultTab = ({ 
  selectedFolder, 
  setSelectedFolder, 
  exercises, 
  muscleGroups, 
  setViewingExercise 
}) => {
  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none text-white">
            {selectedFolder ? selectedFolder : "Workout"} <span className="text-orange-600">Vault</span>
          </h2>
          <p className="text-slate-500 font-medium italic mt-2">
            {selectedFolder ? `Mastering ${selectedFolder} movements` : "Select a muscle group to begin."}
          </p>
        </div>
        {selectedFolder && (
          <button 
            onClick={() => setSelectedFolder(null)} 
            className="bg-slate-800 text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition"
          >
            ← All Folders
          </button>
        )}
      </header>

      {!selectedFolder ? (
        /* --- FOLDER VIEW --- */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {muscleGroups.map((group) => (
            <div 
              key={group} 
              onClick={() => setSelectedFolder(group)} 
              className="group relative bg-slate-900 border border-slate-800 p-10 rounded-[40px] cursor-pointer hover:border-orange-500 transition-all duration-500 overflow-hidden shadow-2xl"
            >
              <div className="relative z-10 text-center">
                <div className="text-5xl mb-6 group-hover:scale-110 transition duration-500">
                  {group === 'Chest' ? '💪' : group === 'Back' ? '🦅' : group === 'Legs' ? '🦵' : group === 'Shoulders' ? '🛡️' : group === 'Arms' ? '⚔️' : '🧘'}
                </div>
                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">{group}</h3>
                <p className="text-orange-500 text-[10px] font-black uppercase tracking-[3px] mt-2">
                  {exercises.filter(ex => ex.muscleGroup === group).length} Techniques
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* --- EXERCISE LIST VIEW --- */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-right-4 duration-500">
          {exercises.filter(ex => ex.muscleGroup === selectedFolder).map(ex => (
            <div key={ex._id} className="bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden group hover:border-orange-500/50 shadow-2xl flex flex-col">
              <div onClick={() => setViewingExercise(ex)} className="h-56 bg-slate-800 relative overflow-hidden cursor-zoom-in">
                {ex.image ? (
                  <img src={ex.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={ex.name} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-700 font-black italic text-xs uppercase">No Preview</div>
                )}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase shadow-lg ${
                    ex.difficulty === 'Advanced' ? 'bg-red-600' : ex.difficulty === 'Intermediate' ? 'bg-yellow-600' : 'bg-green-600'
                  }`}>
                    {ex.difficulty}
                  </span>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col text-white">
                <h3 className="text-2xl font-black mb-1 uppercase tracking-tight italic">{ex.name}</h3>
                <p className="text-slate-500 text-xs font-bold italic mb-6 line-clamp-2 leading-relaxed">
                  {ex.instructions || "Click to view full instructions."}
                </p>
                <button 
                  onClick={() => setViewingExercise(ex)} 
                  className="mt-auto w-full py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase hover:bg-orange-600 hover:text-white transition shadow-xl"
                >
                  Watch Technique
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserVaultTab;