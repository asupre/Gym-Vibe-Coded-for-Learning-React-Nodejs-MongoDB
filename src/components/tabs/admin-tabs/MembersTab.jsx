import React from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, User, Trash2, CheckCircle, ShieldAlert } from 'lucide-react';

const MembersTab = ({ users, searchTerm, onSearch, onSelect, onStatusToggle, onDeleteClick }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white italic">
          Member <span className="text-orange-600">Registry</span>
        </h2>
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <Input 
            placeholder="Search athletes..." 
            className="pl-10 w-full bg-slate-900 border-slate-800 text-white rounded-2xl h-12"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>

      {/* --- MOBILE VIEW (Box/Card Grid) --- */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {users.map((u) => (
          <div 
            key={u._id}
            onClick={() => onSelect(u)}
            className="bg-slate-900/60 border border-slate-800 rounded-[24px] p-5 space-y-4 active:scale-95 transition-transform"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
                  {u.profileImage ? (
                    <img src={u.profileImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-orange-500 font-black italic underline decoration-orange-600">
                      {u.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg tracking-tight leading-tight">{u.name}</h3>
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mt-1">{u.plan} PLAN</p>
                </div>
              </div>
              <Badge 
                variant="outline" 
                className={`px-2 py-0.5 rounded-lg font-black uppercase text-[8px] ${
                  u.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                }`}
              >
                {u.status}
              </Badge>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-800/50">
              <Button 
                className="flex-1 bg-white text-black hover:bg-orange-600 hover:text-white rounded-xl h-10 font-black uppercase text-[10px] tracking-wider"
                onClick={(e) => { e.stopPropagation(); onStatusToggle(u._id, u.status); }}
              >
                {u.status === 'pending' ? 'Approve Access' : 'Suspend Member'}
              </Button>
              <Button 
                variant="ghost"
                className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl h-10 px-3"
                onClick={(e) => { e.stopPropagation(); onDeleteClick(u); }}
              >
                <Trash2 size={18} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* --- DESKTOP VIEW (Standard Table) --- */}
      <div className="hidden md:block rounded-[32px] border border-slate-800 bg-slate-900/50 overflow-hidden shadow-2xl">
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
              <TableRow key={u._id} className="border-slate-800 hover:bg-slate-800/30 transition cursor-pointer" onClick={() => onSelect(u)}>
                <TableCell className="font-bold text-slate-200 py-4 pl-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 overflow-hidden">
                      {u.profileImage ? <img src={u.profileImage} alt="" className="w-full h-full object-cover" /> : <span className="text-orange-500 font-black p-4 italic text-xs">{u.name.charAt(0)}</span>}
                    </div>
                    <span>{u.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-slate-400 font-medium">{u.plan}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className={u.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}>{u.status}</Badge>
                </TableCell>
                <TableCell className="text-right space-x-2 pr-8" onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" className="h-9 text-[10px] font-black uppercase text-red-500 hover:bg-red-500 hover:text-white rounded-xl" onClick={() => onDeleteClick(u)}>Delete</Button>
                  <Button className="h-9 text-[10px] font-black uppercase bg-white text-black hover:bg-orange-600 hover:text-white rounded-xl" onClick={() => onStatusToggle(u._id, u.status)}>{u.status === 'pending' ? 'Approve' : 'Suspend'}</Button>
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