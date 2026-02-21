import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const PlansTab = ({ plans, onAddClick, onDeleteClick ,onEditClick}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <header className="flex justify-between items-center text-white">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight italic">
            Membership <span className="text-orange-600">Vault</span>
          </h2>
          <p className="text-slate-500 font-medium tracking-tight uppercase text-[10px] mt-1 italic">
            Configure pricing and access tiers
          </p>
        </div>
        <Button 
          onClick={onAddClick} 
          className="bg-orange-600 hover:bg-orange-500 text-white font-black uppercase text-xs px-6 py-6 rounded-2xl shadow-lg shadow-orange-900/20"
        >
          + Create New Plan
        </Button>
      </header>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card 
            key={plan._id} 
            className="bg-slate-900 border-slate-800 rounded-[40px] overflow-hidden group hover:border-orange-500/50 transition-all duration-500 shadow-2xl relative"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 rounded-full blur-3xl group-hover:bg-orange-600/10 transition-all"></div>

            <CardHeader className="p-8 pb-4">
              <div className="flex justify-between items-start mb-4">
                <Badge variant="outline" className="border-orange-500/50 text-orange-500 font-black uppercase text-[9px] tracking-widest px-3">
                  Tier {plans.indexOf(plan) + 1}
                </Badge>
              </div>
              <CardTitle className="text-3xl font-black text-white uppercase italic tracking-tighter">
                {plan.name}
              </CardTitle>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-black text-white italic">₱{plan.price}</span>
                <span className="text-slate-500 font-bold uppercase text-xs">/ cycle</span>
              </div>
              
              <Separator className="bg-slate-800 mb-6" />
              
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                  <span className="text-orange-500">✔</span> Full Access for {plan.duration} {plan.durationUnit}(s)
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                  <span className="text-orange-500">✔</span> Mobile App Access
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                  <span className="text-orange-500">✔</span> Free Gym Orientation
                </li>
              </ul>
            </CardContent>

            <CardFooter className="p-8 pt-0 flex gap-3">
              <Button 
      variant="outline" 
      onClick={() => onEditClick(plan)} // 👈 Add this line
      className="flex-1 bg-white text-black hover:bg-orange-600 hover:text-white border-none font-black uppercase text-[10px] py-6 rounded-2xl transition-all"
    >
      Edit Details
    </Button>
              <Button 
                variant="destructive"
                size="icon"
                onClick={() => onDeleteClick(plan)}
                className="bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-2xl py-6 px-6"
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

export default PlansTab;