import React,{ useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import {
  ArrowLeft,
  MessageSquare,
  Phone,
  Video,
  Share2,
  MoreHorizontal,
  Calendar,
  Award,
  Users,
  Mail,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  UserPlus,
  UserCheck,
} from "lucide-react"
import { useSelector } from "react-redux"
import toast from "react-hot-toast"

const UserProfile = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState("none") // 'none', 'pending', 'connected'
  const [isConnecting, setIsConnecting] = useState(false)
  const [outgoingRequests, setOutgoingRequests] = useState([])

  const currentUser = useSelector((state) => state.auth.user)
  const currentUserId = currentUser._id

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setProfile(res.data.user)

        // Check connection status
        const connectionRes = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/connections/status/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        )
        setConnectionStatus(connectionRes.data.status)
      } catch (err) {
        setError(err.response?.data?.error || err.message)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchProfile()
    }
  }, [userId])

  const handleConnect = async () => {
    if (isConnecting) return

    setIsConnecting(true)
    try {
      const token = localStorage.getItem("token")
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/connections`,
        { userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // Refetch connection status after sending request
      const connectionRes = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/connections/status/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setConnectionStatus(connectionRes.data.status)

      // Fetch and set outgoing connection requests
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/connections`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const outgoing = (response.data.connections || [])
        .filter(req => req.requester && req.requester._id === currentUserId)
        .map(req => req.recipient && req.recipient._id)
      setOutgoingRequests(outgoing)

      toast.success("Connection request sent!")
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to send connection request")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleMessage = () => {
    if (connectionStatus === "connected") {
      navigate(`/chat/${userId}`)
    } else {
      toast.error("You need to be connected to send messages")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-900 dark:text-white text-lg font-medium">Loading profile...</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Getting user information</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-3xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Profile Not Found</h2>
          <p className="text-red-500 dark:text-red-300 mb-4">{error}</p>
          <button
            onClick={() => navigate("/home")}
            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-3xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">User Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">This user profile doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate("/home")}
            className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            Find Other Users
          </button>
        </div>
      </div>
    )
  }

  const mockStats = {
    connections: Math.floor(Math.random() * 200) + 50,
    skillsShared: Math.floor(Math.random() * 50) + 10,
    rating: (4.0 + Math.random() * 1).toFixed(1),
    completedSessions: Math.floor(Math.random() * 100) + 20,
    responseTime: Math.floor(Math.random() * 60) + 5,
    joinedDate: "March 2023",
  }

  const statsCards = [
    { icon: Users, label: "Connections", value: mockStats.connections, color: "purple" },
    { icon: Award, label: "Skills Shared", value: mockStats.skillsShared, color: "blue" },
    { icon: Star, label: "Rating", value: `${mockStats.rating}/5`, color: "yellow" },
    { icon: Clock, label: "Response Time", value: `${mockStats.responseTime}m`, color: "green" },
  ]

  const getConnectionButton = () => {
    switch (connectionStatus) {
      case "connected":
        return (
          <button className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 rounded-xl border border-green-200 dark:border-green-500/30 cursor-default">
            <UserCheck className="w-4 h-4" />
            Connected
          </button>
        )
      case "pending":
        return (
          <button className="flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 rounded-xl border border-yellow-200 dark:border-yellow-500/30 cursor-default">
            <Clock className="w-4 h-4" />
            Pending
          </button>
        )
      default:
        return (
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            {isConnecting ? "Connecting..." : "Connect"}
          </button>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 text-gray-700 dark:text-gray-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Header Card */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl mb-8">
          {/* Cover Photo */}
          <div className="h-32 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 relative">
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* Profile Info */}
          <div className="px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16 relative z-10">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-3xl bg-white dark:bg-slate-800 p-2 shadow-xl">
                  <div className="w-full h-full rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold">
                    {profile.username?.charAt(0)?.toUpperCase() || profile.email?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                </div>
                {connectionStatus === "connected" && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Name and Actions */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {profile.username || "Anonymous User"}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{profile.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Joined {mockStats.joinedDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">{mockStats.rating} rating</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {getConnectionButton()}
                    <button className="p-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-600 dark:text-gray-400 rounded-xl transition-all duration-200">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-600 dark:text-gray-400 rounded-xl transition-all duration-200">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${
                  stat.color === "purple"
                    ? "bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400"
                    : stat.color === "blue"
                      ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                      : stat.color === "yellow"
                        ? "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                        : "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400"
                }`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Bio Section */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">About</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {profile.bio || "This user hasn't added a bio yet."}
            </p>
          </div>

          {/* Contact & Actions */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Connect</h2>

            <div className="space-y-4">
              <button
                onClick={handleMessage}
                disabled={connectionStatus !== "connected"}
                className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/10 border border-purple-200 dark:border-purple-500/20 rounded-2xl hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-500/20 dark:hover:to-pink-500/20 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    Send Message
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {connectionStatus === "connected" ? "Start a conversation" : "Connect first to message"}
                  </p>
                </div>
              </button>

              <button
                disabled={connectionStatus !== "connected"}
                className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10 border border-blue-200 dark:border-blue-500/20 rounded-2xl hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-500/20 dark:hover:to-cyan-500/20 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Schedule Call
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {connectionStatus === "connected" ? "Book a session" : "Connect first to schedule"}
                  </p>
                </div>
              </button>

              <button
                disabled={connectionStatus !== "connected"}
                className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-500/20 dark:hover:to-emerald-500/20 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    Video Call
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {connectionStatus === "connected" ? "Start video session" : "Connect first for video calls"}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Skills</h2>
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
              {profile.skills?.length || 0} skills
            </span>
          </div>

          {profile.skills && profile.skills.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-500/30 hover:bg-blue-200 dark:hover:bg-blue-500/30 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <Award className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 italic">No skills listed yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile
