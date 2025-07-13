import React from "react"
import { Facebook, Twitter, Linkedin, Mail, MessageCircle, MapPin, Heart } from "lucide-react"
import { Sparkles } from "lucide-react"
import { Link } from "react-router-dom"

function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo and Contact */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
                <a href="/dashboard" className="flex items-center space-x-3 group">
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                    <div className="relative w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="relative">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                      Skill<span className="text-purple-600 dark:text-purple-400">Swap</span>
                    </h1>
                  </div>
                </a>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md leading-relaxed">
              Connect with talented individuals, share knowledge, and grow together in our vibrant community of learners
              and teachers.
            </p>
            <div className="space-y-3 text-gray-600 dark:text-gray-400">
              <p className="flex items-center space-x-3 transition-all duration-300 hover:text-purple-600 dark:hover:text-purple-400">
                <Mail className="w-5 h-5 text-purple-500" />
                <a href="mailto:helpskillswap@gmail.com">helpskillswap@gmail.com</a>
              </p>
              <p className="flex items-center space-x-3 transition-all duration-300 hover:text-purple-600 dark:hover:text-purple-400">
                <MapPin className="w-5 h-5 text-purple-500" />
                <span>Somewhere in the World</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-6 pb-2 border-b border-gray-200 dark:border-white/10">
              Quick Links
            </h3>
            <ul className="space-y-4">
              <li>
                <Link to="/benefits" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 flex items-center group">
                  <span className="mr-2 text-xs text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                  Benefits
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 flex items-center group">
                  <span className="mr-2 text-xs text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 flex items-center group">
                  <span className="mr-2 text-xs text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                  Our Testimonials
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 flex items-center group">
                  <span className="mr-2 text-xs text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                  Our FAQ
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 flex items-center group">
                  <span className="mr-2 text-xs text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                  Team
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 flex items-center group">
                  <span className="mr-2 text-xs text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-6 pb-2 border-b border-gray-200 dark:border-white/10">
              About Us
            </h3>
            <ul className="space-y-4">
              {["Company", "Achievements", "Our Goals"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 text-xs text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      ›
                    </span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div className="mt-8">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Stay Updated</h4>
              <div className="flex flex-col space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-3 border border-gray-300 dark:border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <button className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              <a
                href="#"
                className="bg-white dark:bg-white/10 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 border border-gray-200 dark:border-white/10"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-white dark:bg-white/10 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-gray-600 dark:text-gray-400 hover:text-blue-400 border border-gray-200 dark:border-white/10"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-white dark:bg-white/10 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 border border-gray-200 dark:border-white/10"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>

            <div className="text-center md:text-right">
              <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center md:justify-end">
                Made with <Heart className="w-4 h-4 text-red-500 mx-1" /> by SkillSwap Team
              </p>
              <div className="mt-2 flex flex-wrap justify-center md:justify-end gap-6 text-sm">
                <a
                  href="#"
                  className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-white/10 text-center">
          <p className="text-gray-500 dark:text-gray-400"> 2024 SkillSwap. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
