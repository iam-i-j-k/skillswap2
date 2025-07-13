import React from "react";
import { Sparkles } from "lucide-react";

const HowItWorks = () => (
  <div className="min-h-[60vh] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-16 px-4">
    <div className="max-w-3xl w-full mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-10 text-center">
      <div className="flex justify-center mb-6">
        <span className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
          <Sparkles className="w-8 h-8 text-white" />
        </span>
      </div>
      <h1 className="text-4xl font-bold text-white mb-4">How It Works</h1>
      <p className="text-lg text-slate-300 mb-6">Learn how SkillSwap operates: create a profile, connect with others, and exchange skills in a supportive community.</p>
      <ol className="text-left text-slate-200 space-y-4 max-w-xl mx-auto list-decimal list-inside">
        <li><span className="font-semibold text-purple-300">Sign Up:</span> Create your free account and set up your profile.</li>
        <li><span className="font-semibold text-purple-300">Discover:</span> Browse users, filter by skills, and find people to connect with.</li>
        <li><span className="font-semibold text-purple-300">Connect:</span> Send or accept connection requests to start collaborating.</li>
        <li><span className="font-semibold text-purple-300">Chat & Collaborate:</span> Use real-time chat and project tools to learn and grow together.</li>
      </ol>
    </div>
  </div>
);

export default HowItWorks;
