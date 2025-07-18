import React,{ useEffect, useState } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { MessageSquare, Users, Sparkles, ArrowRight, Phone, Video, MoreHorizontal } from "lucide-react"

const Matches = () => {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const token = useSelector((state) => state.auth.token)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/connections/matches`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setMatches(res.data.matches || [])
      } catch (err) {
        setError(err.response?.data?.error || err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchMatches()
  }, [token])


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 mx-auto animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-900 dark:text-white text-lg font-medium">Loading your matches...</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Finding your connections</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-3xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <Users className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Error Loading Matches</h2>
          <p className="text-red-500 dark:text-red-300">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-xl">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Your Connections</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Connect, collaborate, and learn from amazing people in your network
          </p>
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-3xl p-12 max-w-md mx-auto shadow-xl">
              <div className="w-20 h-20 bg-gray-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">No Connections Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start connecting with people to build your network and begin meaningful collaborations.
              </p>
              <button
                onClick={() => navigate("/home")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg font-medium"
              >
                Find People
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-3xl p-6 text-center shadow-xl">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{matches.length}</div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Total Connections</div>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-3xl p-6 text-center shadow-xl">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {matches.reduce((acc, match) => acc + (match.user?.skills?.length || 0), 0)}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Combined Skills</div>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-3xl p-6 text-center shadow-xl">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {new Set(matches.flatMap((match) => match.user?.skills || [])).size}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Unique Skills</div>
              </div>
            </div>

            {/* Matches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map(({ connectionId, user }) => (
                <div
                  key={connectionId}
                  className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-3xl p-6 hover:shadow-lg transition-all duration-300 group"
                >
                  {/* User Avatar & Info */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                        {user?.username?.charAt(0).toUpperCase()}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg truncate">{user?.username}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm truncate">{user.email}</p>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all duration-200">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  {/* Bio */}
                  {user.bio && (
                    <div className="mb-4">
                      <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2 leading-relaxed">
                        {user.bio}
                      </p>
                    </div>
                  )}

                  {/* Skills */}
                  {user.skills && user.skills.length > 0 && (
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {user.skills.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium border border-purple-200 dark:border-purple-500/30"
                          >
                            {skill}
                          </span>
                        ))}
                        {user.skills.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium">
                            +{user.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/chat/${user._id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl transition-all duration-200 shadow-lg group-hover:shadow-xl font-medium"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Chat
                    </button>
                    <button className="p-3 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-600 dark:text-gray-400 rounded-2xl transition-all duration-200">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="p-3 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-600 dark:text-gray-400 rounded-2xl transition-all duration-200">
                      <Video className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Matches
