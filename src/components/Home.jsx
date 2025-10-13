import React from "react"
import { useEffect, useState } from "react"
import { Users, Loader2, Search, UserPlus, Sparkles, Award, MessageSquare } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { fetchUsers, selectAllUsers, selectUsersStatus, selectUsersError } from "../features/users/userSlice"
import { fetchRequests } from "../features/connectionsSlice.js/connectionSlice"
import { useNavigate } from "react-router-dom"
import { useSocket } from "../context/SocketContext"

const notify = () => toast.success("Request Sent!")
const showError = (err) => toast.error(err.response?.data?.error || err.message)

const UserCard = ({ user, onConnect, isConnected, isPending, onRemoveConnection }) => (
  <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-3xl p-6 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
    {/* Background decoration */}
    <div className="absolute top-0 right-0 w-32 h-32 opacity-5 dark:opacity-10">
      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-full transform translate-x-16 -translate-y-16"></div>
    </div>

    <div className="relative flex items-start justify-between">
      <div className="flex gap-4 flex-1">
        {/* User Avatar */}
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
            {user.username?.charAt(0) || user.email?.charAt(0)}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">{user.username}</h3>
            <div className="px-2 py-1 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-full text-xs font-medium">
              Online
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 truncate">{user.email}</p>

          {/* Bio */}
          {user.bio && (
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">{user.bio}</p>
          )}

          {/* Skills */}
          {user.skills && user.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {user.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium border border-purple-200 dark:border-purple-500/30"
                >
                  {skill}
                </span>
              ))}
              {user.skills.length > 3 && (
                <span className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 rounded-full text-xs font-medium">
                  +{user.skills.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{Math.floor(Math.random() * 100) + 20} connections</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="w-3 h-3" />
              <span>{(4.0 + Math.random()).toFixed(1)} rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="ml-4">
        {isConnected ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRemoveConnection(user)
            }}
            className="px-4 py-2 bg-red-50 dark:bg-red-500/20 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-300 rounded-2xl hover:bg-red-100 dark:hover:bg-red-500/30 transition-all duration-200"
          >
            Remove
          </button>
        ) : isPending ? (
          <button
            disabled
            className="px-4 py-2 bg-yellow-50 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded-2xl cursor-not-allowed border border-yellow-200 dark:border-yellow-500/30"
          >
            Pending...
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onConnect(user)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <UserPlus className="w-4 h-4" />
            Connect
          </button>
        )}
      </div>
    </div>
  </div>
)

const StatsCard = ({ icon: Icon, title, value, description, color }) => {
  const colorClasses = {
    purple:
      "from-purple-500 to-purple-600 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20",
    blue: "from-blue-500 to-blue-600 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20",
    green: "from-green-500 to-green-600 bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20",
  }

  return (
    <div
      className={`${colorClasses[color].split(" ").slice(2).join(" ")} border rounded-3xl p-6 text-center relative overflow-hidden group hover:shadow-lg transition-all duration-300`}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
        <Icon className="w-full h-full" />
      </div>

      <div className="relative">
        <div
          className={`w-12 h-12 bg-gradient-to-r ${colorClasses[color].split(" ").slice(0, 2).join(" ")} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{value}</div>
        <div className="text-gray-600 dark:text-gray-400 font-medium mb-1">{title}</div>
        <div className="text-xs text-gray-500 dark:text-gray-500">{description}</div>
      </div>
    </div>
  )
}

const Home = () => {
  const [filteredUsers, setFilteredUsers] = useState([])
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [connectedUsers, setConnectedUsers] = useState([])
  const [outgoingRequests, setOutgoingRequests] = useState([])

  const dispatch = useDispatch()
  const users = useSelector(selectAllUsers)
  const usersStatus = useSelector(selectUsersStatus)
  const usersError = useSelector(selectUsersError)
  const socket = useSocket()
  const currentUserId = useSelector((state) => state.auth.user?._id)
  const navigate = useNavigate()
  const token = useSelector((state) => state.auth.token)
  const requests = useSelector((state) => state.connections.requests)
  const safeRequests = Array.isArray(requests) ? requests : []

  useEffect(() => {
    if (token && usersStatus === "idle") {
      dispatch(fetchUsers())
    }
  }, [token, usersStatus, dispatch])

  const user = useSelector((state) => state.auth.user)
  useEffect(() => {
    const fetchConnectionRequests = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/connections`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (user && user.token) {
          dispatch(fetchRequests())
        }
        const outgoing = (response.data.connections || [])
          .filter((req) => req.requester && req.requester._id === currentUserId)
          .map((req) => req.recipient && req.recipient._id)
        setOutgoingRequests(outgoing)
      } catch (err) {
        showError(err)
      }
    }

    fetchConnectionRequests()
  }, [user, currentUserId])

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/connections/matches`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setConnectedUsers(res.data.matches || [])
      } catch (err) {
        showError(err)
      }
    }
    fetchConnections()
  }, [])

  useEffect(() => {
    const filtered = (Array.isArray(users) ? users : []).filter(
      (user) =>
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.skills?.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())),
    )
    setFilteredUsers(filtered)
  }, [searchQuery, users])

  const handleConnect = async (user) => {
    try {
      const token = localStorage.getItem("token")
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/connections`,
        { userId: user._id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      )
      setOutgoingRequests((prev) => [...prev, user._id])

      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/connections`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const outgoing = (response.data.connections || [])
        .filter((req) => req.requester && req.requester._id === currentUserId)
        .map((req) => req.recipient && req.recipient._id)
      setOutgoingRequests(outgoing)
      notify()
    } catch (err) {
      showError(err)
    }
  }

  const handleRemoveConnection = async (connectionId) => {
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/connections/${connectionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success("Connection removed")
      refetchConnections()
    } catch (err) {
      showError(err)
    }
  }

  const refetchConnections = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/connections/matches`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setConnectedUsers(res.data.matches || [])
    } catch (err) {
      showError(err)
    }
  }

  const isPendingRequest = (userId) =>
    outgoingRequests.includes(userId) ||
    safeRequests.some(
      (req) =>
        req.requester &&
        req.requester._id === currentUserId &&
        req.recipient &&
        req.recipient._id === userId &&
        req.status === "pending",
    )

  const isConnected = (userId) => connectedUsers.some((conn) => conn.user && conn.user._id === userId)

  const statsData = [
    {
      icon: Users,
      title: "People Available",
      value: filteredUsers.length,
      description: "Ready to connect",
      color: "purple",
    },
    {
      icon: MessageSquare,
      title: "Your Connections",
      value: connectedUsers.length,
      description: "Active network",
      color: "blue",
    },
    {
      icon: Award,
      title: "Skills Available",
      value: new Set(filteredUsers.flatMap((user) => user.skills || [])).size,
      description: "Unique expertise",
      color: "green",
    },
  ]

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\60\ height=\60\ viewBox=\0 0 60 60\ xmlns=\http://www.w3.org/2000/svg\%3E%3Cg fill=\none\ fillRule=\evenodd\%3E%3Cg fill=\%239C92AC\ fillOpacity=\0.05\%3E%3Ccircle cx=\30\ cy=\30\ r=\2\/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20 dark:opacity-10"></div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-700 dark:to-pink-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl mb-6 shadow-lg border border-white/30">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">Discover Amazing People</h1>
            <p className="text-purple-100 text-xl max-w-2xl mx-auto mb-8">
              Connect with talented individuals, share knowledge, and grow together in our vibrant community
            </p>

            {/* Search Bar */}
            <div className="relative max-w-lg mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email, or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {statsData.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-3xl p-6 text-center mb-8">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {usersStatus === "loading" ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-900 dark:text-white text-lg">Finding amazing people...</p>
            </div>
          </div>
        ) : usersStatus === "failed" ? (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-3xl p-8 text-center">
            <p className="text-red-600 dark:text-red-400">{usersError}</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-3xl p-12 max-w-md mx-auto">
              <Users className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">No People Found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery ? "Try adjusting your search terms" : "New people will appear here when they join"}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {Array.isArray(filteredUsers) &&
              filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="cursor-pointer transition-transform hover:scale-[1.02]"
                  onClick={() => navigate(`/profile/${user._id}`)}
                >
                  <UserCard
                    user={user}
                    onConnect={handleConnect}
                    isConnected={isConnected(user._id)}
                    isPending={isPendingRequest(user._id)}
                    onRemoveConnection={() => {
                      const match = connectedUsers.find((conn) => conn.user && conn.user._id === user._id)
                      if (match) handleRemoveConnection(match.connectionId)
                    }}
                  />
                </div>
              ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Home
