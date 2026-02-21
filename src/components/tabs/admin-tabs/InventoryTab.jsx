import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const InventoryTab = ({ products, onAddClick, onDeleteClick, onEditClick }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center text-white">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight italic">
            Gym <span className="text-orange-600">Shop</span>
          </h2>
          <p className="text-slate-500 font-medium tracking-tight uppercase text-[10px] mt-1">
            Inventory & Stock Management
          </p>
        </div>
        <Button 
          onClick={onAddClick} 
          className="bg-orange-600 hover:bg-orange-500 text-white font-black uppercase text-xs px-6 py-6 rounded-2xl shadow-lg shadow-orange-900/20"
        >
          + Add Product
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <Card key={product._id} className="bg-slate-900 border-slate-800 overflow-hidden group hover:border-orange-500/50 transition-all duration-300 rounded-[32px]">
            <CardHeader className="p-0">
              <div className="w-full h-48 bg-slate-800 relative overflow-hidden">
                {product.image ? (
                  <img 
                    src={product.image} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                    alt={product.name} 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600 italic text-xs uppercase font-black">
                    No Image
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-orange-600/90 text-white border-none text-[9px] font-black uppercase tracking-widest">
                    Stock: {product.stock}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <CardTitle className="text-white text-lg font-black uppercase italic tracking-tight mb-1 truncate">
                {product.name}
              </CardTitle>
              <p className="text-orange-500 font-black text-2xl italic">₱{product.price}</p>
            </CardContent>
            <CardFooter className="p-6 pt-0 flex gap-2">
              <Button 
      variant="outline" 
      onClick={() => onEditClick(product)} // 👈 Add this line
      className="flex-1 bg-transparent border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl text-[10px] font-black uppercase"
    >
      Edit
    </Button>
              <Button 
                variant="destructive" 
                size="icon"
                onClick={() => onDeleteClick(product)}
                className="rounded-xl bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white transition-colors"
              >
                🗑️
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InventoryTab;