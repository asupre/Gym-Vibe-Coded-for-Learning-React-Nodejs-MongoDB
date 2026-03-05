import React from 'react';
import { X, ShieldCheck, ShieldAlert, ExternalLink } from 'lucide-react';

const MemberDetailSidebar = ({ selectedUser, onClose, onVerify }) => {
  if (!selectedUser) return null;

  return (
    <>
      {/* --- SAFETY BACKDROP --- 
          Clicking this darkened area will close the modal automatically.
      */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] lg:hidden"
        onClick={onClose}
      />

      {/* --- THE DRAWER --- */}
      <aside className="fixed right-0 top-0 w-full sm:w-[400px] h-full bg-[#020617] border-l border-slate-800 p-6 sm:p-8 shadow-[ -10px_0_30px_rgba(0,0,0,0.5)] animate-in slide-in-from-right duration-300 z-[110] flex flex-col">
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h3 className="text-orange-500 font-black uppercase tracking-[0.2em] text-[10px] mb-1 italic">
              Verification Vault
            </h3>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
              Member <span className="text-slate-500 underline decoration-orange-600 underline-offset-4">ID</span>
            </h2>
          </div>
          
          <button 
            onClick={onClose} 
            className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white hover:border-orange-500 transition-all active:scale-95 shadow-lg"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
          
          {/* Ticket Image Container */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-4 relative group">
            <div className="flex justify-between items-center mb-4 px-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Payment Ticket</span>
              {selectedUser.paymentTicket && (
                <button 
                  onClick={() => window.open(selectedUser.paymentTicket)}
                  className="text-orange-500 hover:text-white transition-colors"
                >
                  <ExternalLink size={14} />
                </button>
              )}
            </div>

            <div className="aspect-[4/5] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center relative">
              {selectedUser.paymentTicket ? (
                <img 
                  src={selectedUser.paymentTicket} 
                  alt="Payment Proof" 
                  className="w-full h-full object-contain transition-transform group-hover:scale-105 duration-500"
                />
              ) : (
                <div className="text-center space-y-2 opacity-30">
                  <ShieldAlert size={48} className="mx-auto text-slate-500" />
                  <p className="text-[10px] font-black uppercase tracking-widest">No Data Found</p>
                </div>
              )}
            </div>
          </div>

          {/* Member Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl">
              <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Status</p>
              <p className={`text-xs font-black uppercase italic ${selectedUser.status === 'active' ? 'text-green-500' : 'text-yellow-500'}`}>
                {selectedUser.status}
              </p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl">
              <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Joined</p>
              <p className="text-xs font-black text-white italic">
                {new Date(selectedUser.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Verification CTA */}
          {selectedUser.status === 'pending' && (
            <button 
              onClick={() => onVerify(selectedUser._id, 'pending')}
              className="w-full py-5 bg-white text-black font-black uppercase italic text-sm tracking-widest rounded-2xl hover:bg-orange-600 hover:text-white transition-all shadow-[0_10px_20px_rgba(255,255,255,0.05)] active:scale-95 flex items-center justify-center gap-2"
            >
              <ShieldCheck size={18} />
              Verify Athlete Access
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default MemberDetailSidebar;