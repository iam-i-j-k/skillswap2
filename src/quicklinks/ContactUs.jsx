import React from "react";
import { Sparkles, Mail, MessageCircle } from "lucide-react";

const ContactUs = () => (
  <div className="min-h-[60vh] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-16 px-4">
    <div className="max-w-3xl w-full mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-10 text-center">
      <div className="flex justify-center mb-6">
        <span className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
          <Sparkles className="w-8 h-8 text-white" />
        </span>
      </div>
      <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
      <p className="text-lg text-slate-300 mb-8">Have questions or feedback? Reach out to the SkillSwap team and we’ll be happy to help!</p>
      <div className="flex flex-col items-center space-y-4">
        <a href="mailto:helpskillswap@gmail.com" className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200">
          <Mail className="w-5 h-5" /> helpskillswap@gmail.com
        </a>
        <a href="mailto:feedback@skillswap.com" className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 text-purple-200 rounded-2xl border border-purple-400/10 hover:bg-white/20 transition-all duration-200">
          <MessageCircle className="w-5 h-5" /> feedback@skillswap.com
        </a>
      </div>
    </div>
  </div>
);

export default ContactUs;
