import React from "react";
import { Sparkles } from "lucide-react";

const Benefits = () => (
  <div className="min-h-[60vh] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-16 px-4">
    <div className="max-w-3xl w-full mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-10 text-center">
      <div className="flex justify-center mb-6">
        <span className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
          <Sparkles className="w-8 h-8 text-white" />
        </span>
      </div>
      <h1 className="text-4xl font-bold text-white mb-4">Benefits</h1>
      <p className="text-lg text-slate-300 mb-6">Discover the unique advantages of using SkillSwap to connect, learn, and grow with like-minded individuals.</p>
      <ul className="text-left text-slate-200 space-y-4 max-w-xl mx-auto">
        <li className="flex items-start gap-3">
          <span className="w-3 h-3 mt-2 rounded-full bg-purple-500 inline-block"></span>
          <span>Expand your professional and personal network in a vibrant, supportive community.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="w-3 h-3 mt-2 rounded-full bg-pink-500 inline-block"></span>
          <span>Learn new skills and share your expertise with others on a modern, easy-to-use platform.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="w-3 h-3 mt-2 rounded-full bg-purple-500 inline-block"></span>
          <span>Access real-time connections, chats, and collaboration tools designed for growth.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="w-3 h-3 mt-2 rounded-full bg-pink-500 inline-block"></span>
          <span>Enjoy a seamless, visually appealing experience across all your devices.</span>
        </li>
      </ul>
    </div>
  </div>
);

export default Benefits;
