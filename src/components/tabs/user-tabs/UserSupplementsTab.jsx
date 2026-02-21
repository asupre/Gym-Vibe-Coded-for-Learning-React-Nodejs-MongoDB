import React from 'react';

const UserSupplementsTab = ({ products, onBack }) => {
  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-4xl font-black mb-8 uppercase italic tracking-tighter text-white">
        Vault <span className="text-orange-600">Supplements</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(product => (
          <div 
            key={product._id} 
            className="bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden group hover:border-orange-500 shadow-2xl transition duration-500"
          >
            <div className="h-60 bg-slate-800 relative">
              {product.image ? (
                <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={product.name} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600 uppercase font-black">No Photo</div>
              )}
              <div className="absolute top-4 left-4">
                <span className="bg-orange-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase">
                  {product.category}
                </span>
              </div>
            </div>

            <div className="p-8">
              <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-tight italic">{product.name}</h3>
              <p className="text-orange-500 text-3xl font-black mb-6 italic">₱{product.price}</p>
              
              <button 
                onClick={() => alert(`Ordering ${product.name}... (You can link this to a checkout soon!)`)}
                className="bg-white text-black px-5 py-4 rounded-xl font-black text-[10px] uppercase hover:bg-orange-600 hover:text-white transition w-full shadow-lg"
              >
                Order Now
              </button>
            </div>
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

export default UserSupplementsTab;