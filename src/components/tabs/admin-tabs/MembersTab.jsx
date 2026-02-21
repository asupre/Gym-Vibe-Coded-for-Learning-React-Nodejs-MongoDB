import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const MembersTab = ({ users, searchTerm, onSearch, onSelect, onStatusToggle, onDeleteClick }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black uppercase tracking-tight text-white italic">
          Member <span className="text-orange-600">Registry</span>
        </h2>
        <Input 
          placeholder="Search members..." 
          className="max-w-xs bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 rounded-xl focus:ring-orange-500 focus:border-orange-500"
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className="rounded-[32px] border border-slate-800 bg-slate-900/50 overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-slate-800/50">
            <TableRow className="hover:bg-transparent border-slate-800">
              <TableHead className="text-slate-400 font-black uppercase text-[10px] py-6 pl-8">Member</TableHead>
              <TableHead className="text-slate-400 font-black uppercase text-[10px]">Plan</TableHead>
              <TableHead className="text-center text-slate-400 font-black uppercase text-[10px]">Status</TableHead>
              <TableHead className="text-right text-slate-400 font-black uppercase text-[10px] pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow 
                key={u._id} 
                className="border-slate-800 hover:bg-slate-800/30 transition cursor-pointer"
                onClick={() => onSelect(u)}
              >
                <TableCell className="font-bold text-slate-200 py-4 pl-8">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center overflow-hidden shadow-inner">
                        {u.profileImage ? (
                          <img src={u.profileImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-orange-500 font-black italic text-xs">{u.name.charAt(0)}</span>
                        )}
                      </div>
                      <span className="tracking-tight">{u.name}</span>
                   </div>
                </TableCell>
                <TableCell className="text-slate-400 font-medium">{u.plan}</TableCell>
                <TableCell className="text-center">
                  <Badge 
                    variant="outline" 
                    className={u.status === 'active' 
                      ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                      : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}
                  >
                    {u.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2 pr-8" onClick={(e) => e.stopPropagation()}>
                  <Button 
                    variant="ghost" 
                    className="h-9 px-4 text-[10px] font-black uppercase text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                    onClick={() => onDeleteClick(u)}
                  >
                    Delete
                  </Button>
                  <Button 
                    className="h-9 px-4 text-[10px] font-black uppercase bg-white text-black hover:bg-orange-600 hover:text-white rounded-xl transition-all shadow-lg"
                    onClick={() => onStatusToggle(u._id, u.status)}
                  >
                    {u.status === 'pending' ? 'Approve' : 'Suspend'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MembersTab;