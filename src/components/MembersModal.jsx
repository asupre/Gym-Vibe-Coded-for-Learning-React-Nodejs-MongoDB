import React from 'react';

const MemberDetailSidebar = ({ selectedUser, onClose, onVerify }) => {
  if (!selectedUser) return null;

  return (
    <aside className="fixed right-0 top-0 w-80 h-full bg-slate-900 border-l border-slate-800 p-8 shadow-2xl animate-in slide-in-from-right duration-300 z-30 overflow-y-auto">
      <button 
        onClick={onClose} 
        className="text-slate-500 hover:text-white mb-6 font-bold flex items-center gap-2"
      >
        ✕ Close
      </button>
      
      <p className="text-[10px] font-black uppercase text-orange-500 tracking-[3px] mb-6 text-center">
        Verification Vault
      </p>
      
      <div className="space-y-6">
        {/* Ticket Image Section */}
        <div className="bg-black/40 border border-slate-800 rounded-2xl p-2 overflow-hidden">
          <p className="text-[10px] text-slate-500 uppercase font-black mb-2 px-2">Uploaded Payment Ticket</p>
          {selectedUser.paymentTicket ? (
            <img 
              src={selectedUser.paymentTicket} 
              className="w-full h-auto rounded-xl shadow-2xl border border-slate-700 hover:scale-105 transition cursor-zoom-in" 
              alt="Ticket" 
              onClick={() => window.open(selectedUser.paymentTicket)} 
            />
          ) : (
            <div className="h-48 flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-xl">
               <span className="text-2xl mb-2">🚫</span>
               <p className="text-[10px] font-bold uppercase italic">No Ticket Uploaded</p>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-slate-800/50 p-4 rounded-xl">
          <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Join Date</p>
          <p className="font-bold text-white text-sm">
            {new Date(selectedUser.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Verification Actions */}
        {selectedUser.status === 'pending' && (
          <button 
            onClick={() => onVerify(selectedUser._id, 'pending')}
            className="w-full bg-green-600 text-white font-black py-4 rounded-xl uppercase text-xs tracking-widest hover:bg-green-500 shadow-lg shadow-green-900/20"
          >
            Verify & Activate
          </button>
        )}
      </div>
    </aside>
  );
};

export default MemberDetailSidebar;