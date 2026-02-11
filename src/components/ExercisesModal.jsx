import React from 'react';

const ExerciseModal = ({ show, onClose, onSubmit, newExercise, setNewExercise, convertToBase64 }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 text-slate-900">
      <form onSubmit={onSubmit} className="bg-white p-8 rounded-[40px] max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-black tracking-tight mb-6 uppercase italic text-slate-900">New Vault Exercise</h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Exercise Name</label>
            <input required className="w-full bg-slate-100 rounded-xl px-4 py-3 mt-1 outline-none font-bold text-slate-900" placeholder="e.g. Bench Press" value={newExercise.name} onChange={(e) => setNewExercise({...newExercise, name: e.target.value})} />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Muscle Group</label>
              <select className="w-full bg-slate-100 rounded-xl px-4 py-3 mt-1 outline-none font-bold text-slate-900 cursor-pointer" value={newExercise.muscleGroup} onChange={(e) => setNewExercise({...newExercise, muscleGroup: e.target.value})}>
                <option value="Chest">Chest</option>
                <option value="Back">Back</option>
                <option value="Legs">Legs</option>
                <option value="Shoulders">Shoulders</option>
                <option value="Arms">Arms</option>
                <option value="Core">Core/Abs</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Difficulty</label>
              <select className="w-full bg-slate-100 rounded-xl px-4 py-3 mt-1 outline-none font-bold text-slate-900 cursor-pointer" value={newExercise.difficulty} onChange={(e) => setNewExercise({...newExercise, difficulty: e.target.value})}>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Instructions</label>
            <textarea className="w-full bg-slate-100 rounded-xl px-4 py-3 mt-1 outline-none text-slate-900 text-sm h-24 resize-none font-medium" placeholder="Step by step guide..." value={newExercise.instructions} onChange={(e) => setNewExercise({...newExercise, instructions: e.target.value})} />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Exercise GIF / Image</label>
            <input type="file" accept="image/*" className="w-full mt-1 text-xs file:bg-orange-600 file:border-none file:px-4 file:py-2 file:rounded-lg file:text-white file:font-black cursor-pointer" 
              onChange={async (e) => {
                const file = e.target.files[0];
                if (file) {
                  const base64 = await convertToBase64(file);
                  setNewExercise({...newExercise, image: base64});
                }
              }} 
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button type="button" onClick={onClose} className="flex-1 py-4 font-bold bg-slate-100 rounded-2xl text-slate-500 uppercase text-[10px] tracking-widest">Cancel</button>
          <button type="submit" className="flex-1 py-4 font-bold bg-orange-600 text-white rounded-2xl hover:bg-orange-700 shadow-xl shadow-orange-900/20 uppercase text-[10px] tracking-widest">Save to Vault</button>
        </div>
      </form>
    </div>
  );
};

export default ExerciseModal;