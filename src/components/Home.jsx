import React, { useEffect, useState } from "react"
import { Header } from "./Header"
import Footer from "./Footer"
import { Users, Mail, Video, MessageSquare, Loader2, Search, UserPlus, User2, MailIcon } from "lucide-react"

const UserCard = ({ user, onConnect }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className="flex gap-4">
        {/* User Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-lg font-semibold">
          {user.fullname?.charAt(0) || user.email?.charAt(0)}
        </div>

        {/* User Info */}
        <div>
          <h3 className="font-semibold text-gray-900">{user.username}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <MailIcon className="w-4 h-4" />
            <span>{user.email}</span>
          </div>

          {/* Skills */}
          {user.skills && user.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {user.skills.slice(0, 3).map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium">
                  {skill}
                </span>
              ))}
              {user.skills.length > 3 && (
                <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-medium">
                  +{user.skills.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onConnect(user)}
          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          title="Connect"
        >
          <UserPlus className="w-5 h-5" />
        </button>
        <button
          onClick={() => (window.location.href = `/video-call/${user._id}`)}
          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          title="Start Video Call"
        >
          <Video className="w-5 h-5" />
        </button>
        <button
          onClick={() => (window.location.href = `/chat/${user._id}`)}
          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          title="Send Message"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      </div>
    </div>

    {/* Bio */}
    {user.bio && <p className="mt-4 text-sm text-gray-600 line-clamp-2">{user.bio}</p>}
  </div>
)

const Home = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/users`, {
          headers: {
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
          }
        });
        if (!response.ok) throw new Error("Failed to fetch users");
  
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchUsers();
  }, []);

  // Handle search
  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.skills?.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())),
    )
    setFilteredUsers(filtered)
  }, [searchQuery, users])

  const handleConnect = async (user) => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/connections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        },
        body: JSON.stringify({ userId: user._id })
      });

      if (!response.ok) throw new Error("Failed to connect with user");

      const data = await response.json();
      
      // Optionally, update the UI or show a success message
    } catch (err) {
      console.error("Error connecting with user:", err.message);
      // Optionally, show an error message to the user
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Find People</h1>
              <p className="mt-1 text-gray-500">Connect with other people in the community</p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-500">{error}</div>}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
        ) : filteredUsers.length === 0 ? (
          // Empty State
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-gray-500">
              {searchQuery ? "Try adjusting your search terms" : "Users will appear here when they join"}
            </p>
          </div>
        ) : (
          // Users Grid
          <div className="grid grid-cols-1 gap-6">
            {filteredUsers.map((user) => (
              <UserCard key={user._id} user={user} onConnect={handleConnect} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Home

