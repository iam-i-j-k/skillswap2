import React from "react";
import { Sparkles } from "lucide-react";

const team = [
  { name: "Irfan Jan Khan", role: "MERN Developer" },
  { name: "Priya Sharma", role: "Frontend Developer" },
  { name: "Arjun Mehta", role: "Backend Developer" },
  { name: "Sara Kim", role: "UI/UX Designer" },
];

const Team = () => (
  <div className="min-h-[60vh] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-16 px-4">
    <div className="max-w-3xl w-full mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-10 text-center">
      <div className="flex justify-center mb-6">
        <span className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
          <Sparkles className="w-8 h-8 text-white" />
        </span>
      </div>
      <h1 className="text-4xl font-bold text-white mb-4">Meet the Team</h1>
      <p className="text-lg text-slate-300 mb-8">The passionate people behind SkillSwap.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto">
        {team.map((member, i) => (
          <div key={i} className="bg-white/5 rounded-2xl p-6 shadow flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold mb-3">
              {member.name.charAt(0)}
            </div>
            <div className="text-white font-semibold">{member.name}</div>
            <div className="text-purple-300 text-sm">{member.role}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Team;
