import React from "react";
import { Sparkles } from "lucide-react";

const testimonials = [
  {
    name: "Ava Patel",
    quote: "SkillSwap helped me find the perfect coding mentor. The real-time chat and vibrant community made learning fun!",
  },
  {
    name: "Liam Chen",
    quote: "I’ve grown my network and learned new skills. The UI is beautiful and the connections are real!",
  },
  {
    name: "Sofia Garcia",
    quote: "The platform is so easy to use. I love how quickly I can find and connect with other learners!",
  },
];

const Testimonials = () => (
  <div className="min-h-[60vh] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-16 px-4">
    <div className="max-w-3xl w-full mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-10 text-center">
      <div className="flex justify-center mb-6">
        <span className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
          <Sparkles className="w-8 h-8 text-white" />
        </span>
      </div>
      <h1 className="text-4xl font-bold text-white mb-4">Our Testimonials</h1>
      <p className="text-lg text-slate-300 mb-8">Read what our users are saying about their experiences with SkillSwap!</p>
      <div className="space-y-8">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-white/5 rounded-2xl p-6 shadow flex flex-col items-center">
            <p className="text-slate-100 text-lg mb-2">“{t.quote}”</p>
            <span className="text-purple-300 font-semibold">— {t.name}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Testimonials;
