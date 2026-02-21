import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const OverviewTab = ({ users, coaches, recentMembers, onNavigate }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <header>
        <h2 className="text-3xl font-black uppercase tracking-tight text-white italic">
          Gym <span className="text-orange-600">Command</span> Center
        </h2>
        <p className="text-slate-500 font-medium text-[10px] uppercase tracking-[3px] mt-1">
          Real-time analytics & system status
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Members", value: users.length, color: "text-white" },
          { label: "Pending Approval", value: users.filter(u => u.status === 'pending').length, color: "text-yellow-500" },
          { label: "Active Coaches", value: coaches.length, color: "text-orange-500" },
          { label: "Total Records", value: users.length + coaches.length, color: "text-green-500" },
        ].map((stat, i) => (
          <Card key={i} className="bg-slate-900 border-slate-800 rounded-3xl shadow-xl overflow-hidden relative">
            <CardHeader className="pb-2">
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">{stat.label}</p>
            </CardHeader>
            <CardContent>
              <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
            </CardContent>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/5 rounded-full blur-2xl"></div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Members Section */}
        <Card className="lg:col-span-2 bg-slate-900 border-slate-800 rounded-[40px] shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between p-8 pb-4">
            <CardTitle className="text-xl font-bold text-white uppercase italic">Recent Registrations</CardTitle>
            <Button 
              variant="link" 
              onClick={() => onNavigate('members')} 
              className="text-orange-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors"
            >
              View All Registry →
            </Button>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentMembers.map((member) => (
                <div 
                  key={member._id} 
                  className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-slate-800/50 hover:border-orange-500/30 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-slate-700 group-hover:border-orange-500 transition-colors">
                      <AvatarImage src={member.profileImage} />
                      <AvatarFallback className="bg-slate-800 text-orange-500 font-black italic text-xs">
                        {member.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-sm text-slate-200 leading-none mb-1">{member.name}</p>
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-tighter">Joined {new Date(member.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[8px] border-slate-700 text-slate-500 uppercase">New</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health Card */}
        <Card className="bg-slate-900 border-slate-800 rounded-[40px] shadow-2xl relative overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-xl font-bold text-white uppercase italic">System Monitor</CardTitle>
          </CardHeader>
          <CardContent className="px-8 space-y-6">
            <div className="p-5 bg-green-500/5 border border-green-500/20 rounded-3xl flex items-center gap-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
              <div>
                <p className="text-green-500 text-[10px] font-black uppercase tracking-widest">Main Database</p>
                <p className="text-white text-xs font-bold italic">Connection Stable</p>
              </div>
            </div>

            <div className="p-5 bg-orange-500/5 border border-orange-500/20 rounded-3xl flex items-center gap-4 opacity-80">
              <div className="w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.6)]"></div>
              <div>
                <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest">API Engine</p>
                <p className="text-white text-xs font-bold italic">V1.0 Operational</p>
              </div>
            </div>
          </CardContent>
          <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-orange-600/5 rounded-full blur-3xl"></div>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;