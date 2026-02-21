import React from 'react';

const UserCoachesTab = ({ coaches, onBack }) => {
  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-4xl font-black mb-8 uppercase italic tracking-tighter text-white">
        Our <span className="text-orange-600">Trainers</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coaches.map(coach => (
          <div key={coach._id} className="bg-slate-900 border border-slate-800 p-6 rounded-[32px] hover:border-orange-500/50 transition duration-500 group flex flex-col">
            {/* Coach Image */}
            <div className="w-full h-56 rounded-2xl overflow-hidden mb-4 border border-slate-800">
              <img 
                src={coach.image || 'https://via.placeholder.com/300'} 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                alt={coach.name} 
              />
            </div>

            {/* Coach Info */}
            <h3 className="text-xl font-bold text-white mb-1 uppercase italic tracking-tight">{coach.name}</h3>
            <p className="text-orange-500 text-xs font-black uppercase tracking-widest mb-6">{coach.specialty}</p>

            {/* --- DUTY SCHEDULE SECTION --- */}
            <div className="bg-black/30 p-4 rounded-2xl border border-slate-800/50 mb-6 flex-1">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[2px] mb-3">Available Duty Hours</p>
              <div className="space-y-2">
                {coach.availableDates && coach.availableDates.length > 0 ? (
                  coach.availableDates.map((slot, i) => (
                    <div key={i} className="flex justify-between items-center text-[10px] font-bold pb-2 border-b border-white/5 last:border-0">
                      <span className="text-slate-300">
                        {new Date(slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })}
                      </span>
                      <span className="text-orange-500 bg-orange-500/10 px-2 py-1 rounded-md italic">
                        {slot.hours}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-slate-600 italic">No schedule posted for this week.</p>
                )}
              </div>
            </div>

            <button 
              onClick={() => alert(`Inquiring with ${coach.name}...`)}
              className="w-full py-4 bg-white text-black rounded-xl font-black text-[10px] uppercase hover:bg-orange-600 hover:text-white transition shadow-xl"
            >
              Book Training Session
            </button>
          </div>
        ))}
      </div>

      <button 
        onClick={onBack} 
        className="mt-10 text-slate-500 font-bold hover:text-white transition italic"
      >
        ← Back to Dashboard
      </button>
    </div>
  );
};

export default UserCoachesTab;