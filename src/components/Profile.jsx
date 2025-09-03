import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  MessageSquare, Share2, Phone, Edit2, MapPin, Calendar, Award, Users, Mail, Globe, Camera
} from "lucide-react";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [editedProfile, setEditedProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = useSelector((state) => state.auth.token);
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/${currentUser._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserProfile(res.data.user);
        setEditedProfile(res.data.user);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    if (currentUser?._id && token) fetchProfile();
  }, [currentUser, token]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await axios.put(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/profile/${currentUser._id}`,
        editedProfile,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserProfile(res.data.user);
      setEditedProfile(res.data.user);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(userProfile);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 mx-auto animate-pulse">
            <Users className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-900 dark:text-white text-lg font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-3xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <Users className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Error Loading Profile</h2>
          <p className="text-red-500 dark:text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  const statsCards = [
    { icon: Users, label: "Connections", value: userProfile.totalConnections || 0, color: "purple" },
    { icon: Award, label: "Skills", value: userProfile.skills?.length || 0, color: "blue" },
    { icon: MessageSquare, label: "Bio Length", value: userProfile.bio?.length || 0, color: "green" },
    { icon: Calendar, label: "Joined", value: new Date(userProfile.createdAt).toLocaleDateString(), color: "orange" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Card */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl mb-8">
          {/* Cover Photo */}
          <div className="h-32 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 relative">
            <div className="absolute inset-0 bg-black/20"></div>
            <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors text-white">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16 relative z-10">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-3xl bg-white dark:bg-slate-800 p-2 shadow-xl">
                  <div className="w-full h-full rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold">
                    {userProfile.username?.charAt(0)?.toUpperCase()}
                  </div>
                </div>
                <button className="absolute bottom-2 right-2 p-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-white/10">
                  <Camera className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Name and Actions */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{userProfile.username}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{userProfile.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Joined {new Date(userProfile.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-200 font-medium"
                    >
                      <Edit2 className="w-4 h-4" />
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-all duration-200 shadow-lg font-medium">
                      <Share2 className="w-4 h-4" />
                      Share
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
                    : stat.color === "green"
                    ? "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400"
                    : "bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400"
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <textarea
                  value={editedProfile.bio || ""}
                  onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Tell us about yourself..."
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-medium"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-white/20 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{userProfile.bio}</p>
            )}
          </div>

          {/* Contact & Actions */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Connect</h2>

            <div className="space-y-4">
              <button className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/10 border border-purple-200 dark:border-purple-500/20 rounded-2xl hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-500/20 dark:hover:to-pink-500/20 transition-all duration-200 group">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    Send Message
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Start a conversation</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10 border border-blue-200 dark:border-blue-500/20 rounded-2xl hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-500/20 dark:hover:to-cyan-500/20 transition-all duration-200 group">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Schedule Call
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Book a session</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-500/20 dark:hover:to-emerald-500/20 transition-all duration-200 group">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    View Portfolio
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">See their work</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Skills Sections */}
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* Skills */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Skills</h2>
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                {userProfile.skills?.length || 0} skills
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {(userProfile.skills || []).map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-500/30 hover:bg-blue-200 dark:hover:bg-blue-500/30 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Teaching (optional, if you have this field) */}
          {/* <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-xl">
            ...
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Profile;
