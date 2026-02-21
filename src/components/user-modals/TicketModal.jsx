import React from 'react';

const TicketModal = ({ show, onClose, onUpload }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-6">
      <div className="bg-white text-slate-900 p-10 rounded-[40px] max-w-md w-full shadow-2xl text-center animate-in zoom-in-95 duration-200">
        <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
          🎫
        </div>
        <h2 className="text-3xl font-black uppercase mb-2">Access Locked</h2>
        <p className="text-slate-500 mb-8 font-medium italic">
          Upload a photo of your Gym Ticket for verification.
        </p>
        
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          id="ticket-upload" 
          onChange={onUpload} 
        />
        
        <label 
          htmlFor="ticket-upload" 
          className="block w-full bg-orange-600 text-white font-black py-4 rounded-2xl cursor-pointer hover:bg-orange-700 transition mb-4 uppercase text-xs tracking-widest shadow-xl shadow-orange-600/20"
        >
          Select Ticket Photo
        </label>
        
        <button 
          onClick={onClose} 
          className="text-slate-400 font-bold text-sm uppercase hover:text-slate-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TicketModal;