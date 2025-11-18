import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// RTK Query
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetStatsQuery,
} from "../services/usersApi";

import { Users, MessageSquare, Video, Calendar, X, Edit2, TrendingUp, Clock, Activity, Target, BarChart3, BookOpen, ChevronRight } from 'lucide-react'
import { useSelector } from "react-redux";
import ProfileModal from "./ProfileModal";

const StatsCard = ({ icon: Icon, title, value, trend, change }) => {
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        {trend && (
          <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <TrendingUp className="w-3 h-3 mr-1" />
            {trend}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{title}</p>
      {change && (
        <p className="text-xs text-emerald-600 dark:text-emerald-400">
          {change} from last month
        </p>
      )}
    </div>
  )
}

const SkillBadge = ({ skill, onRemove, variant = "default" }) => {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
      {skill}
      {onRemove && (
        <button onClick={() => onRemove(skill)} className="hover:text-red-500 transition-colors ml-1">
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  )
}

const QuickActionCard = ({ icon: Icon, title, description, to, onClick }) => {
  const Component = to ? Link : "div"
  const props = to ? { to } : { onClick }

  return (
    <Component
      {...props}
      className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-200 group cursor-pointer"
    >
      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-sm text-gray-900 dark:text-white">{title}</h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors flex-shrink-0" />
    </Component>
  )
}

const Dashboard = () => {
  const [greeting, setGreeting] = useState("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const userId = useSelector((state) => state.auth.user?._id);

  const { data: profile } = useGetProfileQuery(userId, {
    skip: !userId,
  });
  const { data: stats } = useGetStatsQuery();
  const [updateProfile] = useUpdateProfileMutation();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const handleProfileSave = async (updatedProfile) => {
    try {
      await updateProfile(updatedProfile).unwrap();
      setIsProfileModalOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const statsCards = [
    {
      icon: Users,
      title: "Total Connections",
      value: stats?.totalConnections ?? 0,
      trend: "+12%",
      change: "+23",
    },
    {
      icon: MessageSquare,
      title: "Messages Sent",
      value: stats?.messagesSent ?? 0,
      trend: "+24%",
      change: "+156",
    },
    {
      icon: Video,
      title: "Video Calls",
      value: stats?.videoCalls ?? 0,
      trend: "+8%",
      change: "+12",
    },
    {
      icon: Calendar,
      title: "Scheduled Calls",
      value: stats?.scheduledCalls ?? 0,
      trend: "+5%",
      change: "+3",
    },
  ];

  const quickActions = [
    {
      icon: Users,
      title: "Find New Connections",
      description: "Discover people with complementary skills",
      to: "/home",
    },
    {
      icon: MessageSquare,
      title: "View My Matches",
      description: "Chat with your connected peers",
      to: "/matches",
    },
    {
      icon: BarChart3,
      title: "Skill Progress",
      description: "Track your learning journey",
    },
    {
      icon: Target,
      title: "Set Goals",
      description: "Define your learning objectives",
    },
  ];

  const recentActivities = [
    {
      icon: Video,
      title: "Video call with Alex Johnson",
      time: "45 minutes ago",
      duration: "32m 16s",
    },
    {
      icon: MessageSquare,
      title: "New message from Sarah Chen",
      time: "2 hours ago",
      duration: "5 messages",
    },
    {
      icon: Users,
      title: "Connected with Mike Rodriguez",
      time: "1 day ago",
      duration: "New connection",
    },
    {
      icon: BookOpen,
      title: "Completed JavaScript course",
      time: "2 days ago",
      duration: "8 hours",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="relative w-full">
        {/* COVER PHOTO */}
        <div className="h-32 w-full bg-gradient-to-r from-purple-500 to-pink-500">
          {profile?.user?.coverPhoto && (
            <img
              src={profile.user.coverPhoto || "/placeholder.svg"}
              className="w-full h-full object-cover"
              alt="Cover"
            />
          )}
        </div>

        {/* PROFILE SECTION */}
        <div className="max-w-7xl mx-auto px-6 pb-6">
          <div className="flex items-end gap-6 -mt-8">
            {/* AVATAR */}
            <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 border-4 border-white dark:border-slate-900 bg-white flex-shrink-0">
              <img
                src={profile?.user?.avatar || "/placeholder.svg"}
                alt="Loading..."
                className="w-full h-full object-cover"
              />
            </div>

            {/* INFO & ACTIONS */}
            <div className="flex-1 pb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {greeting}, {profile?.user?.username}! 👋
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Ready to connect and learn today?
              </p>
            </div>

            <div className="flex gap-3 pb-2 flex-shrink-0">
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="px-5 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500 text-sm font-medium transition-colors"
              >
                <Edit2 className="inline w-4 h-4 mr-2" />
                Edit
              </button>

              <Link
                to="/home"
                className="px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
              >
                <Users className="inline w-4 h-4 mr-2" />
                Connect
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat, i) => (
            <StatsCard key={i} {...stat} />
          ))}
        </div>

        {/* Profile Overview */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Profile Overview
            </h2>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <Edit2 className="w-4 h-4" /> Edit
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">Bio</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {profile?.bio || "No bio added yet."}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
                Skills ({profile?.skills?.length || 0})
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile?.skills?.length ? (
                  profile.skills.map((s) => <SkillBadge key={s} skill={s} />)
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No skills added</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="grid gap-3">
              {quickActions.map((action, i) => (
                <QuickActionCard key={i} {...action} />
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Recent Activity
              </h2>
              <Clock className="w-4 h-4 text-gray-400" />
            </div>

            <div className="space-y-3">
              {recentActivities.map((activity, i) => (
                <div key={i} className="pb-3 border-b border-gray-100 dark:border-slate-700 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-slate-700 flex-shrink-0 mt-0.5">
                      <activity.icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">{activity.time}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{activity.duration}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={{
          username: profile?.user?.username || "",
          bio: profile?.user?.bio || "",
          skills: profile?.user?.skills || [],
          avatar: profile?.user?.avatar || "",
          coverPhoto: profile?.user?.coverPhoto || "",
          _id: profile?.user?._id
        }}
      />
    </div>
  );
};

export default Dashboard;
