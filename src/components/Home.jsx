import React,{ useEffect, useState } from "react"
import { Users, Loader2, Search, UserPlus, Sparkles } from "lucide-react"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { fetchUsers, selectAllUsers, selectUsersStatus, selectUsersError, addUser } from "../features/users/userSlice"
import { fetchRequests, addRequest } from "../features/connectionsSlice.js/connectionSlice";
import { useNavigate } from "react-router-dom"
import { useSocket } from "../context/SocketContext"


const notify = () => toast.success("Request Sent!")
const showError = (err) => toast.error(err.response?.data?.error || err.message)

const UserCard = ({ user, onConnect, isConnected, isPending, onRemoveConnection }) => (
  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all duration-300 group">
    <div className="flex items-start justify-between">
      <div className="flex gap-4 flex-1">
        {/* User Avatar */}
        <div className="relative">
          <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
            {user.username?.charAt(0) || user.email?.charAt(0)}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-800"></div>
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-lg mb-1">{user.username}</h3>
          <p className="text-slate-400 text-sm mb-3 truncate">{user.email}</p>

          {/* Bio */}
          {user.bio && <p className="text-slate-300 text-sm mb-4 line-clamp-2 leading-relaxed">{user.bio}</p>}

          {/* Skills */}
          {user.skills && user.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {user.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium border border-purple-500/30"
                >
                  {skill}
                </span>
              ))}
              {user.skills.length > 3 && (
                <span className="px-3 py-1 bg-slate-700/50 text-slate-400 rounded-full text-xs font-medium">
                  +{user.skills.length - 3} more
                </span>
              )}
            </div>
          )}
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
            className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-2xl hover:bg-red-500/30 transition-all duration-200"
          >
            Remove
          </button>
        ) : isPending ? (
          <button disabled className="px-4 py-2 bg-slate-600/50 text-slate-400 rounded-2xl cursor-not-allowed">
            Pending...
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onConnect(user)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg"
          >
            <UserPlus className="w-4 h-4" />
            Connect
          </button>
        )}
      </div>
    </div>
  </div>
)

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
  const token = useSelector((state) => state.auth.token);
  const requests = useSelector(state => state.connections.requests);
  const safeRequests = Array.isArray(requests) ? requests : [];

  useEffect(() => {
    if (token && usersStatus === "idle") {
      dispatch(fetchUsers());
    }
  }, [token, usersStatus, dispatch]);


  const user = useSelector(state => state.auth.user);
  useEffect(() => {
    const fetchConnectionRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/connections`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if(user && user.token){
          dispatch(fetchRequests());
        }
        // Update outgoing requests
        const outgoing = (response.data.connections || [])
          .filter(req => req.requester && req.requester._id === currentUserId)
          .map(req => req.recipient && req.recipient._id);
        setOutgoingRequests(outgoing);
      } catch (err) {
        showError(err);
      }
    };

    fetchConnectionRequests();
  }, [user, currentUserId])

  // Fetch connections
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

  // Handle search
  useEffect(() => {
    const filtered = (Array.isArray(users) ? users : []).filter(
      (user) =>
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.skills?.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())),
    )
    setFilteredUsers(filtered)
  }, [searchQuery, users])

  // When user clicks connect
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
      setOutgoingRequests((prev) => [...prev, user._id]);

      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/connections`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const outgoing = (response.data.connections || [])
        .filter(req => req.requester && req.requester._id === currentUserId)
        .map(req => req.recipient && req.recipient._id);
      setOutgoingRequests(outgoing)
      notify()
    } catch (err) {
      showError(err)
    }
  }


  const handleRemoveConnection = async (connectionId) => {
    try {
      const token = localStorage.getItem("token")
      await axios.delete(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/connections/${connectionId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
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
        req.requester && req.requester._id === currentUserId &&
        req.recipient && req.recipient._id === userId &&
        req.status === "pending"
    );

  const isConnected = (userId) => connectedUsers.some((conn) => conn.user && conn.user._id === userId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\60\ height=\60\ viewBox=\0 0 60 60\ xmlns=\http://www.w3.org/2000/svg\%3E%3Cg fill=\none\ fillRule=\evenodd\%3E%3Cg fill=\%239C92AC\ fillOpacity=\0.05\%3E%3Ccircle cx=\30\ cy=\30\ r=\2\/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      


      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Discover Amazing People</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
            Connect with talented individuals, share knowledge, and grow together in our vibrant community
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">{filteredUsers.length}</div>
            <div className="text-slate-400">People Available</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">{connectedUsers.length}</div>
            <div className="text-slate-400">Your Connections</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {new Set(filteredUsers.flatMap(user => user.skills || [])).size}
            </div>
            <div className="text-slate-400">Skills Available</div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-6 text-center mb-8">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {usersStatus === 'loading' ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
              <p className="text-white text-lg">Finding amazing people...</p>
            </div>
          </div>
        ) : usersStatus === 'failed' ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 text-center">
            <p className="text-red-400">{usersError}</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 max-w-md mx-auto">
              <Users className="w-16 h-16 text-slate-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-white mb-3">No People Found</h3>
              <p className="text-slate-400">
                {searchQuery ? "Try adjusting your search terms" : "New people will appear here when they join"}
              </p>
            </div>
          </div>
        ) : (
          // Users Grid
          <div className="space-y-6">
            {Array.isArray(filteredUsers) && filteredUsers.map(user => (
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
                    const match = connectedUsers.find(conn => conn.user && conn.user._id === user._id);
                    if (match) handleRemoveConnection(match.connectionId);                    
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
