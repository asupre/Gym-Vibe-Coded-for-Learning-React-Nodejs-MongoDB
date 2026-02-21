import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ExercisesTab = ({ 
  selectedFolder, 
  setSelectedFolder, 
  exercises, 
  muscleGroups, 
  onAddClick, 
  onViewClick, 
  onDeleteClick 
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center text-white">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight italic">
            {selectedFolder ? `${selectedFolder}` : "Exercise"} <span className="text-orange-600">Vault</span>
          </h2>
          <p className="text-slate-500 font-medium text-[10px] uppercase tracking-widest mt-1 italic">
            {selectedFolder ? `Managing ${selectedFolder} techniques` : "Select a category to manage movements"}
          </p>
        </div>
        <div className="flex gap-4">
          {selectedFolder && (
            <Button 
              variant="outline" 
              onClick={() => setSelectedFolder(null)} 
              className="px-6 py-6 border-slate-800 text-white hover:bg-slate-800 rounded-2xl font-black uppercase text-xs"
            >
              ← Back
            </Button>
          )}
          <Button 
            onClick={onAddClick} 
            className="bg-orange-600 hover:bg-orange-500 text-white font-black uppercase text-xs px-6 py-6 rounded-2xl shadow-lg"
          >
            + Add Exercise
          </Button>
        </div>
      </header>

      {!selectedFolder ? (
        /* --- FOLDER VIEW --- */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {muscleGroups.map((group) => (
            <Card 
              key={group} 
              onClick={() => setSelectedFolder(group)}
              className="bg-slate-900 border-slate-800 p-4 rounded-[40px] cursor-pointer group hover:border-orange-500 transition-all duration-500 relative overflow-hidden shadow-xl"
            >
              <CardContent className="pt-6 text-center">
                <span className="text-5xl mb-6 block group-hover:scale-110 transition duration-500">
                  {group === 'Chest' ? '💪' : group === 'Back' ? '🦅' : group === 'Legs' ? '🦵' : group === 'Shoulders' ? '🛡️' : group === 'Arms' ? '⚔️' : '🧘'}
                </span>
                <CardTitle className="text-2xl font-black text-white uppercase italic tracking-tighter">
                  {group}
                </CardTitle>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2">
                  {exercises.filter(ex => ex.muscleGroup === group).length} Techniques
                </p>
              </CardContent>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-600/5 rounded-full blur-3xl group-hover:bg-orange-600/10 transition-all"></div>
            </Card>
          ))}
        </div>
      ) : (
        /* --- EXERCISE LIST VIEW --- */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-right-4 duration-500">
          {exercises.filter(ex => ex.muscleGroup === selectedFolder).map(ex => (
            <Card key={ex._id} className="bg-slate-900 border-slate-800 rounded-[32px] overflow-hidden group hover:border-orange-500/50 transition-all duration-500 flex flex-col shadow-2xl">
              <div onClick={() => onViewClick(ex)} className="h-48 bg-slate-800 relative overflow-hidden cursor-zoom-in border-b border-slate-800">
                {ex.image ? (
                  <img src={ex.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={ex.name} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-700 font-black italic text-xs uppercase">No Media</div>
                )}
                <div className="absolute top-4 right-4">
                  <Badge className={`px-3 py-1 text-[9px] font-black uppercase shadow-lg border-none ${
                    ex.difficulty === 'Advanced' ? 'bg-red-600 text-white' : 
                    ex.difficulty === 'Intermediate' ? 'bg-yellow-600 text-black' : 
                    'bg-green-600 text-white'
                  }`}>
                    {ex.difficulty}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6 flex-1">
                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight italic">
                  {ex.name}
                </h3>
                <p className="text-slate-500 text-[10px] font-bold italic line-clamp-2 leading-relaxed">
                  {ex.instructions || "Click View to read technical instructions."}
                </p>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex gap-2">
                <Button 
                  onClick={() => onViewClick(ex)} 
                  className="flex-1 py-5 bg-white text-black rounded-xl font-black text-[10px] uppercase hover:bg-orange-600 hover:text-white transition shadow-xl"
                >
                  View Focus
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => onDeleteClick(ex)}
                  className="bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-xl px-4"
                >
                  🗑️
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExercisesTab;