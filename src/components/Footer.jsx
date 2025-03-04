import { Facebook, Twitter, Linkedin, Mail, MessageCircle, MapPin } from "lucide-react"

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-50 to-white border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo and Contact */}
          <div className="col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                SwapSmart
              </span>
            </div>
            <div className="space-y-3 text-gray-600">
              <p className="flex items-center space-x-2 transition-all duration-300 hover:text-purple-600">
                <Mail className="w-5 h-5 text-purple-500" />
                <span>skillswap@gmail.com</span>
              </p>
              <p className="flex items-center space-x-2 transition-all duration-300 hover:text-purple-600">
                <MessageCircle className="w-5 h-5 text-purple-500" />
                <span>help@skillswap.com</span>
              </p>
              <p className="flex items-center space-x-2 transition-all duration-300 hover:text-purple-600">
                <MapPin className="w-5 h-5 text-purple-500" />
                <span>Somewhere in the World</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-4 md:mt-0">
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-5 pb-1 border-b border-gray-200">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {["Benefits", "How It Works", "Our Testimonials", "Our FAQ", "Team", "Contact Us"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-purple-600 transition-colors duration-300 flex items-center"
                  >
                    <span className="mr-2 text-xs text-purple-500">›</span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About Us */}
          <div className="mt-4 md:mt-0">
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-5 pb-1 border-b border-gray-200">
              About Us
            </h3>
            <ul className="space-y-3">
              {["Company", "Achievements", "Our Goals"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-purple-600 transition-colors duration-300 flex items-center"
                  >
                    <span className="mr-2 text-xs text-purple-500">›</span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="mt-8 lg:mt-0">
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-5 pb-1 border-b border-gray-200">
              Subscribe to our Newsletter
            </h3>
            <div className="flex flex-col space-y-2 mb-6">
              <input
                type="email"
                placeholder="Enter your Email"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              />
              <button className="px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                Subscribe
              </button>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-5 pb-1 border-b border-gray-200">
                Social Profiles
              </h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:text-purple-600"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:text-blue-400"
                >
                  <Twitter className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:text-blue-600"
                >
                  <Facebook className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-500">© 2024 Swap Smart. All Rights Reserved.</p>
          <div className="mt-4 flex justify-center space-x-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-purple-600 transition-colors duration-300">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-purple-600 transition-colors duration-300">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-purple-600 transition-colors duration-300">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

