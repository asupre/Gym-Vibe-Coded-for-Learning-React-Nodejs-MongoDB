import React, { useEffect } from 'react';

const PlanModal = ({ 
  show, 
  onClose, 
  onSubmit, 
  newPlan, 
  setNewPlan, 
  isEditing, 
  currentPlan 
}) => {

 useEffect(() => {
  if (isEditing && currentPlan) {
    setNewPlan({
      name: currentPlan.name,
      price: currentPlan.price,
      duration: currentPlan.duration,
      durationUnit: currentPlan.durationUnit || 'month'
    });
  } else if (show) { // Only reset if the modal is being opened for a NEW item
    setNewPlan({ name: '', price: '', duration: '1', durationUnit: 'month' });
  }
}, [isEditing, currentPlan, show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 text-slate-900">
      <form 
        onSubmit={onSubmit} 
        className="bg-white p-10 rounded-[40px] max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200"
      >
        <h2 className="text-3xl font-black tracking-tighter mb-6 uppercase italic text-slate-900 leading-none">
          {isEditing ? 'Edit' : 'Create'} <span className="text-orange-600">Plan</span>
        </h2>
        
        <div className="space-y-5 text-slate-900">
          {/* Plan Name */}
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Plan Name</label>
            <input 
              required 
              className="w-full bg-slate-100 rounded-2xl px-5 py-4 mt-1 outline-none font-bold focus:ring-2 ring-orange-500/20 transition" 
              placeholder="e.g. Pro Membership" 
              value={newPlan.name} 
              onChange={(e) => setNewPlan({...newPlan, name: e.target.value})} 
            />
          </div>

          {/* Price */}
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Price (PHP)</label>
            <input 
              required 
              type="number" 
              className="w-full bg-slate-100 rounded-2xl px-5 py-4 mt-1 outline-none font-bold text-orange-600 focus:ring-2 ring-orange-500/20 transition text-xl" 
              placeholder="0" 
              value={newPlan.price} 
              onChange={(e) => setNewPlan({...newPlan, price: e.target.value})} 
            />
          </div>

          {/* Duration */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Duration</label>
              <input 
                required 
                type="number" 
                className="w-full bg-slate-100 rounded-2xl px-5 py-4 mt-1 outline-none font-bold" 
                placeholder="1" 
                value={newPlan.duration} 
                onChange={(e) => setNewPlan({...newPlan, duration: e.target.value})} 
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Unit</label>
              <select 
                className="w-full bg-slate-100 rounded-2xl px-5 py-4 mt-1 outline-none font-bold cursor-pointer" 
                value={newPlan.durationUnit} 
                onChange={(e) => setNewPlan({...newPlan, durationUnit: e.target.value})}
              >
                <option value="day">Day(s)</option>
                <option value="month">Month(s)</option>
                <option value="year">Year(s)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-10">
          <button 
            type="button" 
            onClick={onClose} 
            className="flex-1 py-4 font-black bg-slate-100 rounded-2xl text-slate-400 uppercase text-[10px] tracking-widest hover:bg-slate-200 transition"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="flex-1 py-4 font-black bg-orange-600 text-white rounded-2xl hover:bg-orange-700 shadow-xl shadow-orange-900/20 uppercase text-[10px] tracking-widest transition transform active:scale-95"
          >
            {isEditing ? 'Update Plan' : 'Save Plan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlanModal;