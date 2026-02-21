import React from 'react';

const ExerciseFocusModal = ({ exercise, onClose }) => {
  if (!exercise) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[200] flex items-center justify-center p-6 md:p-12 animate-in fade-in zoom-in duration-300">
      <button 
        onClick={onClose} 
        className="absolute top-10 right-10 text-white/30 hover:text-orange-500 transition-all text-5xl z-[210] font-light"
      >
        ✕
      </button>
      
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Visual Side */}
        <div className="rounded-[50px] overflow-hidden border-2 border-slate-800 bg-slate-900 aspect-square lg:aspect-auto shadow-2xl">
          {exercise.image ? (
            <img src={exercise.image} className="w-full h-full object-contain" alt={exercise.name} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-800 font-black">MEDIA NOT FOUND</div>
          )}
        </div>
        
        {/* Info Side */}
        <div className="text-white">
          <header className="mb-10 text-white">
            <p className="text-orange-500 font-black text-xs uppercase tracking-[5px] mb-4">Exercise Breakdown</p>
            <h2 className="text-7xl font-black uppercase italic tracking-tighter leading-[0.85] mb-6">
              {exercise.name}
            </h2>
            <div className="flex gap-4">
              <span className="bg-slate-800 px-6 py-2 rounded-xl text-[10px] font-black uppercase border border-slate-700">{exercise.muscleGroup}</span>
              <span className="bg-orange-600 px-6 py-2 rounded-xl text-[10px] font-black uppercase">{exercise.difficulty}</span>
            </div>
          </header>
          
          <div className="bg-slate-900/80 border border-slate-800 p-10 rounded-[40px] shadow-inner">
            <h4 className="text-xs font-black uppercase tracking-[3px] text-slate-500 mb-6 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-slate-800 inline-block"></span> Proper Form
            </h4>
            <p className="text-xl text-slate-300 leading-relaxed font-medium italic">
              {exercise.instructions || "Focus on mind-muscle connection and controlled tempo."}
            </p>
          </div>
          
          <button 
            onClick={onClose} 
            className="mt-12 px-12 py-5 bg-white text-black font-black uppercase rounded-2xl hover:bg-orange-600 hover:text-white transition shadow-2xl"
          >
            Close Technique
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseFocusModal;