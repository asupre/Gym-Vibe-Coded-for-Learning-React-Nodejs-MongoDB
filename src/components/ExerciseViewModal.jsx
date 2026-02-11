import React from 'react';

const ExerciseViewModal = ({ exercise, onClose }) => {
  if (!exercise) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[200] flex items-center justify-center p-4 md:p-10 animate-in fade-in zoom-in duration-300">
      <button onClick={onClose} className="absolute top-8 right-8 text-white/50 hover:text-orange-500 transition-all text-4xl z-[210]">✕</button>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="rounded-[40px] overflow-hidden border-4 border-slate-800 shadow-[0_0_50px_rgba(234,88,12,0.2)] bg-slate-900">
          {exercise.image ? (
            <img src={exercise.image} className="w-full h-auto object-contain" alt={exercise.name} />
          ) : (
            <div className="aspect-video flex items-center justify-center text-slate-700 font-black">NO MEDIA</div>
          )}
        </div>

        <div className="text-white">
          <div className="mb-8">
            <p className="text-orange-500 font-black text-xs uppercase tracking-[4px] mb-2">Technique Guide</p>
            <h2 className="text-6xl font-black uppercase italic tracking-tighter leading-none mb-4">{exercise.name}</h2>
            <div className="flex gap-3">
               <span className="bg-slate-800 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-700">{exercise.muscleGroup}</span>
               <span className="bg-orange-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{exercise.difficulty}</span>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[40px]">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-4">How to Perform:</h4>
            <p className="text-lg text-slate-300 leading-relaxed font-medium italic">
              {exercise.instructions || "Contact your Personal Trainer for specific coaching cues and form correction for this movement."}
            </p>
          </div>

          <button onClick={onClose} className="mt-10 px-10 py-4 bg-white text-black font-black uppercase rounded-2xl hover:bg-orange-600 hover:text-white transition-all shadow-2xl">
            Got it, let's work!
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseViewModal;