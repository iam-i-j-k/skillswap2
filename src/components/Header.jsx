import React from 'react';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();
  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <a href='/' className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8" />
            <h1 className="text-2xl font-bold">SwapSmart</h1>
          </a>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="hover:text-purple-200 transition">Find Skills</a>
            <a href="#" className="hover:text-purple-200 transition">My Matches</a>
            <button onClick={()=>{
              navigate('/profile')
            }} className="cursor-pointer hover:text-purple-200 transition">Profile</button>
          </nav>
          
        </div>
      </div>
    </header>
  );
}
