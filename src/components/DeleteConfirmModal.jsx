import React from 'react';

const DeleteConfirmModal = ({ show, onClose, onConfirm, title, itemName }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[300] p-4 text-slate-900">
      <div className="bg-white p-10 rounded-[40px] max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
          ⚠️
        </div>
        
        <h2 className="text-2xl font-black tracking-tight mb-2 text-center uppercase italic">
          {title || 'Confirm Delete'}
        </h2>
        
        <p className="text-slate-500 text-sm mb-8 text-center font-medium leading-relaxed">
          Are you sure you want to remove <span className="font-bold text-slate-900">{itemName}</span>? This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button 
            onClick={onClose} 
            className="flex-1 py-4 font-bold bg-slate-100 rounded-2xl text-slate-500 uppercase text-[10px] tracking-widest hover:bg-slate-200 transition"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className="flex-1 py-4 font-bold bg-red-600 text-white rounded-2xl hover:bg-red-700 transition shadow-xl shadow-red-900/20 uppercase text-[10px] tracking-widest"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;