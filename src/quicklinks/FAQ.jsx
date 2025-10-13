import React from "react";
import { Sparkles } from "lucide-react";

const faqs = [
  {
    q: "Is SkillSwap free to use?",
    a: "Yes! SkillSwap is completely free for all users.",
  },
  {
    q: "How do I connect with others?",
    a: "Just browse the Home page, find someone interesting, and click Connect!",
  },
  {
    q: "Can I offer and learn multiple skills?",
    a: "Absolutely. Add as many skills as you want to your profile.",
  },
  {
    q: "Is my data secure?",
    a: "We use best-in-class security practices to keep your data safe.",
  },
];

const FAQ = () => (
  <div className="min-h-[60vh] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-16 px-4">
    <div className="max-w-3xl w-full mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-10 text-center">
      <div className="flex justify-center mb-6">
        <span className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
          <Sparkles className="w-8 h-8 text-white" />
        </span>
      </div>
      <h1 className="text-4xl font-bold text-white mb-4">Our FAQ</h1>
      <p className="text-lg text-slate-300 mb-8">Find answers to frequently asked questions about SkillSwap, account management, and more.</p>
      <div className="space-y-6 text-left max-w-xl mx-auto">
        {faqs.map((f, i) => (
          <div key={i} className="bg-white/5 rounded-xl p-5">
            <div className="font-semibold text-purple-300 mb-2">Q: {f.q}</div>
            <div className="text-slate-200 pl-2">{f.a}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default FAQ;
