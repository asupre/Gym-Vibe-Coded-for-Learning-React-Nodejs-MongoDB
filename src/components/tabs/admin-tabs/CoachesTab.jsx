import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const CoachesTab = ({ coaches, onAddClick, onEditClick, onDeleteClick }) => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <header className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-black uppercase tracking-tight text-white italic">
          Gym <span className="text-orange-600">Coaches</span>
        </h2>
        <p className="text-slate-500 font-medium text-[10px] uppercase tracking-widest mt-1 italic">
          Manage your elite training staff
        </p>
      </div>
      <Button 
        onClick={onAddClick} 
        className="bg-orange-600 hover:bg-orange-500 text-white font-black uppercase text-xs px-6 py-6 rounded-2xl shadow-lg"
      >
        + Add New Coach
      </Button>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {coaches.map(coach => (
        <Card key={coach._id} className="bg-slate-900 border-slate-800 rounded-[32px] overflow-hidden group hover:border-orange-500/50 transition-all duration-300">
          <CardHeader className="flex flex-row items-center gap-4 p-6 pb-4">
            <Avatar className="h-16 w-16 border-2 border-slate-800 shadow-xl group-hover:border-orange-500/50 transition-colors">
              <AvatarImage src={coach.image} alt={coach.name} className="object-cover" />
              <AvatarFallback className="bg-slate-800 text-orange-500 font-black italic">
                {coach.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none mb-1">
                {coach.name}
              </h3>
              <p className="text-orange-500 font-black text-[10px] uppercase tracking-[2px]">
                {coach.specialty}
              </p>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            <div className="space-y-3 bg-black/20 p-4 rounded-2xl border border-slate-800/50">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                Weekly Duty Schedule
              </p>
              <Separator className="bg-slate-800/50" />
              <div className="space-y-2">
                {coach.availableDates?.length > 0 ? (
                  coach.availableDates.slice(0, 3).map((slot, i) => (
                    <div key={i} className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-slate-300">
                        {new Date(slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })}
                      </span>
                      <span className="text-orange-500 italic bg-orange-500/10 px-2 py-0.5 rounded">
                        {slot.hours}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-slate-600 italic">No schedule active.</p>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="px-6 pb-6 flex gap-2">
            <Button 
              onClick={() => onEditClick(coach)} 
              variant="outline"
              className="flex-1 bg-white text-black text-[10px] font-black uppercase rounded-xl hover:bg-orange-600 hover:text-white border-none transition-all"
            >
              Edit Schedule
            </Button>
            <Button 
              variant="destructive"
              onClick={() => onDeleteClick(coach)}
              className="bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-xl"
            >
              🗑️
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  </div>
);

export default CoachesTab;