import React from 'react';

const PlanModal = ({ show, onClose, onSubmit, newPlan, setNewPlan }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 text-slate-900">
      <form onSubmit={onSubmit} className="bg-white p-8 rounded-[40px] max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
        <h2 className="text-2xl font-black tracking-tight mb-6 uppercase italic text-slate-900">
          Create Membership Plan
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Plan Name</label>
            <input 
              required 
              className="w-full bg-slate-100 rounded-xl px-4 py-3 mt-1 outline-none font-bold text-slate-900" 
              placeholder="e.g. Bronze Access" 
              value={newPlan.name} 
              onChange={(e) => setNewPlan({...newPlan, name: e.target.value})} 
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Price (PHP)</label>
            <input 
              required 
              type="number" 
              className="w-full bg-slate-100 rounded-xl px-4 py-3 mt-1 outline-none font-bold text-orange-600" 
              placeholder="0.00" 
              value={newPlan.price} 
              onChange={(e) => setNewPlan({...newPlan, price: e.target.value})} 
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Duration</label>
              <input 
                required 
                type="number" 
                className="w-full bg-slate-100 rounded-xl px-4 py-3 mt-1 outline-none text-slate-900 font-bold" 
                value={newPlan.duration} 
                onChange={(e) => setNewPlan({...newPlan, duration: e.target.value})} 
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Unit</label>
              <select 
                className="w-full bg-slate-100 rounded-xl px-4 py-3 mt-1 outline-none text-slate-900 font-bold cursor-pointer" 
                value={newPlan.durationUnit} 
                onChange={(e) => setNewPlan({...newPlan, durationUnit: e.target.value})}
              >
                <option value="month">Month(s)</option>
                <option value="year">Year(s)</option>
                <option value="day">Day(s)</option>
                <option value="week">Week(s)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button 
            type="button" 
            onClick={onClose} 
            className="flex-1 py-4 font-bold bg-slate-100 rounded-2xl text-slate-500 uppercase text-[10px] tracking-widest"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="flex-1 py-4 font-bold bg-orange-600 text-white rounded-2xl hover:bg-orange-700 shadow-xl shadow-orange-900/20 uppercase text-[10px] tracking-widest"
          >
            Save Plan
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlanModal;