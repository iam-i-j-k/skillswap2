import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Menu, X, Users, Layout, Search } from 'lucide-react'

export function Header() {
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const menuItems = [
    {
      label: 'Find Skills',
      icon: Search,
      href: '#',
    },
    {
      label: 'My Matches',
      icon: Users,
      href: '#',
    },
    {
      label: 'Dashboard',
      icon: Layout,
      onClick: () => navigate('/dashboard'),
    },
  ]

  return (
    <header className="relative bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <a
            href="/dashboard"
            className="flex items-center space-x-3 group"
          >
            <div className="relative">
              <div className="absolute -inset-3 bg-white/20 rounded-lg blur-lg transition-all group-hover:bg-white/30" />
              <Sparkles className="h-8 w-8 relative" />
            </div>
            <div className="relative">
              <h1 className="text-2xl font-bold tracking-tight">
                Skill<span className="text-purple-200">Swap</span>
              </h1>
              <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-purple-300 scale-x-0 group-hover:scale-x-100 transition-transform" />
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors group"
                >
                  <item.icon className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                  <span>{item.label}</span>
                </a>
              ) : (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors group cursor-pointer"
                >
                  <item.icon className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                  <span>{item.label}</span>
                </button>
              )
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 px-2 space-y-2">
            {menuItems.map((item) => (
              item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <item.icon className="w-5 h-5 opacity-70" />
                  <span>{item.label}</span>
                </a>
              ) : (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="w-full flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-left"
                >
                  <item.icon className="w-5 h-5 opacity-70" />
                  <span>{item.label}</span>
                </button>
              )
            ))}
          </nav>
        )}
      </div>

      {/* Decorative bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-300 via-white/20 to-purple-300" />
    </header>
  )
}
