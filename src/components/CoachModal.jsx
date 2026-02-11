import React from 'react';

const CoachModal = ({ 
  show, 
  onClose, 
  isEditing, 
  newCoach, 
  setNewCoach, 
  onSubmit, 
  toggleDate, 
  updateDateHours,
  convertToBase64 
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 text-slate-900">
      <form onSubmit={onSubmit} className="bg-white p-8 rounded-[40px] max-w-lg w-full shadow-2xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-black tracking-tight mb-6 uppercase italic text-slate-900">
          {isEditing ? 'Edit Coach Schedule' : 'Add New Gym Coach'}
        </h2>
        
        <div className="space-y-4">
          <input required className="w-full bg-slate-100 rounded-xl px-4 py-3 outline-none font-bold text-slate-900" placeholder="Coach Name" value={newCoach.name} onChange={(e) => setNewCoach({...newCoach, name: e.target.value})} />
          <input required className="w-full bg-slate-100 rounded-xl px-4 py-3 outline-none font-bold text-slate-900" placeholder="Specialty" value={newCoach.specialty} onChange={(e) => setNewCoach({...newCoach, specialty: e.target.value})} />
          
          {/* CALENDAR SECTION */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4 block text-center">Duty Calendar (Feb 2026)</label>
            <div className="grid grid-cols-7 gap-2 text-center mb-4">
              {['S','M','T','W','T','F','S'].map((day, index) => (
                <div key={`head-${day}-${index}`} className="text-[10px] font-bold text-slate-300 uppercase">{day}</div>
              ))}
              {[...Array(28)].map((_, i) => {
                const dayNum = i + 1;
                const dateStr = `2026-02-${dayNum < 10 ? '0' + dayNum : dayNum}`;
                const isSelected = newCoach.availableDates?.some(d => d.date === dateStr);
                return (
                  <div key={`day-${i}`} onClick={() => toggleDate(dateStr)} className={`py-2 rounded-lg cursor-pointer font-black text-xs transition-all ${isSelected ? 'bg-orange-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
                    {dayNum}
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 mt-4 max-h-40 overflow-y-auto pr-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              {newCoach.availableDates?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 bg-white p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-900 w-16 uppercase">Feb {new Date(item.date).getDate()}</span>
                  <input className="flex-1 bg-slate-50 rounded-lg p-2 text-[10px] font-bold outline-none border border-transparent focus:border-orange-500" value={item.hours} placeholder="e.g. 8AM - 5PM" onChange={(e) => updateDateHours(item.date, e.target.value)} />
                </div>
              ))}
            </div>
          </div>

          <input type="file" accept="image/*" className="w-full text-xs" onChange={async (e) => { 
            const file = e.target.files[0]; 
            if(file) { const base = await convertToBase64(file); setNewCoach({...newCoach, image: base}); }
          }} />
        </div>

        <div className="flex gap-3 mt-8">
          <button type="button" onClick={onClose} className="flex-1 py-4 font-bold bg-slate-100 rounded-2xl text-slate-500 uppercase text-[10px]">Cancel</button>
          <button type="submit" className="flex-1 py-4 font-bold bg-orange-600 text-white rounded-2xl">Save</button>
        </div>
      </form>
    </div>
  );
};

export default CoachModal;