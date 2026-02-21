import React, { useEffect } from 'react'; // 👈 Added useEffect

const ProductModal = ({ 
  show, 
  onClose, 
  onSubmit, 
  newProduct, 
  setNewProduct, 
  convertToBase64,
  isEditing,      // 👈 Added prop
  currentProduct  // 👈 Added prop
}) => {

  // This hook fills the form when you click "Edit"
  useEffect(() => {
    if (isEditing && currentProduct) {
      setNewProduct({
        name: currentProduct.name,
        price: currentProduct.price,
        stock: currentProduct.stock,
        category: currentProduct.category || 'Supplement',
        image: currentProduct.image || ''
      });
    } else {
      // Reset to empty when adding a NEW product
      setNewProduct({ name: '', price: '', stock: '', category: 'Supplement', image: '' });
    }
  }, [isEditing, currentProduct, show, setNewProduct]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 text-slate-900">
      <form onSubmit={onSubmit} className="bg-white p-8 rounded-[40px] max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Changed Title to be dynamic */}
        <h2 className="text-2xl font-black tracking-tight mb-6 uppercase italic text-slate-900">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h2>
        
        <div className="space-y-4 text-slate-900">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Product Name</label>
            <input 
              required 
              className="w-full bg-slate-100 rounded-xl px-4 py-3 mt-1 outline-none font-bold" 
              placeholder="e.g. Whey Protein" 
              value={newProduct.name} 
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} 
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Price (PHP)</label>
              <input 
                required 
                type="number" 
                className="w-full bg-slate-100 rounded-xl px-4 py-3 mt-1 outline-none font-bold text-orange-600" 
                placeholder="0" 
                value={newProduct.price} 
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} 
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Stock</label>
              <input 
                required 
                type="number" 
                className="w-full bg-slate-100 rounded-xl px-4 py-3 mt-1 outline-none font-bold" 
                placeholder="0" 
                value={newProduct.stock} 
                onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} 
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Category</label>
            <select 
              className="w-full bg-slate-100 rounded-xl px-4 py-3 mt-1 outline-none font-bold cursor-pointer" 
              value={newProduct.category} 
              onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
            >
              <option value="Supplement">Supplement</option>
              <option value="Gear">Gym Gear</option>
              <option value="Drinks">Drinks</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Product Image</label>
            <input 
              type="file" 
              accept="image/*" 
              className="w-full mt-1 text-xs file:bg-orange-600 file:border-none file:px-4 file:py-2 file:rounded-lg file:text-white file:font-black cursor-pointer" 
              onChange={async (e) => {
                const file = e.target.files[0];
                if (file) {
                  const base64 = await convertToBase64(file);
                  setNewProduct({...newProduct, image: base64});
                }
              }} 
            />
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
            {isEditing ? 'Update Product' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductModal;