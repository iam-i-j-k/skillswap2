import React from 'react';
import { Facebook, Twitter, Linkedin } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Contact */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-purple-600 rounded-full" />
              <span className="text-xl font-bold">SwapSmart</span>
            </div>
            <div className="space-y-2 text-gray-600">
              <p>📧 skillswap@gmail.com</p>
              <p>💬 help@skillswap.com</p>
              <p>📍 Somewhere in the World</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Benefits</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">How It Works</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Our Testimonials</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Our FAQ</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Team</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Contact Us</a></li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
              About Us
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Company</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Achievements</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Our Goals</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
              Subscribe to our Newsletter
            </h3>
            <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-2 mb-4">
              <input
                type="email"
                placeholder="Enter your Email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button className="cursor-pointer mt-2 sm:mt-0 sm:px-4 sm:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Subscribe
              </button>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
                Social Profiles
              </h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <Facebook className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 text-center">
          <p className="text-gray-400">© 2024 Swap Smart. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
