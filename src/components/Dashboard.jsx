import React,{ useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import {
  Users,
  Video,
  MessageSquare,
  Calendar,
  X,
  Plus,
  Edit2,
  Save,
  TrendingUp,
  Clock,
  Activity,
  Award,
  Target,
} from "lucide-react"

const StatsCard = ({ icon: Icon, title, value, trend, color = "purple", description }) => {
  const colorClasses = {
    purple: "from-purple-500 to-purple-600",
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    orange: "from-orange-500 to-orange-600",
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-3xl p-6 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl bg-gradient-to-r ${colorClasses[color]} shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {trend && (
          <div className="flex items-center text-green-500 text-sm font-medium">
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
        {description && <p className="text-xs text-gray-500 dark:text-gray-500">{description}</p>}
      </div>
    </div>
  )
}

const SkillBadge = ({ skill, onRemove, variant = "default" }) => {
  const variants = {
    default:
      "bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/30",
    removable:
      "bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/30 hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-700 dark:hover:text-red-300 hover:border-red-200 dark:hover:border-red-500/30",
  }

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-all duration-200 ${variants[variant]}`}
    >
      {skill}
      {onRemove && (
        <button onClick={() => onRemove(skill)} className="hover:text-red-500 transition-colors">
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  )
}

// Predefined Skills List
const skillOptions = [
  // Programming & Development
  "JavaScript",
  "TypeScript",
  "React.js",
  "Next.js",
  "Vue.js",
  "Angular",
  "Node.js",
  "Express.js",
  "Python",
  "Django",
  "Flask",
  "Java",
  "Spring Boot",
  "Kotlin",
  "Swift",
  "C",
  "C++",
  "C#",
  ".NET",
  "PHP",
  "Laravel",
  "Ruby",
  "Ruby on Rails",
  "Go (Golang)",
  "Rust",
  "GraphQL",
  "REST APIs",
  "WebSockets",
  "HTML",
  "CSS",
  "Tailwind CSS",
  "Bootstrap",
  "Sass",
  "Material UI",

  // DevOps & Cloud
  "Docker",
  "Kubernetes",
  "CI/CD Pipelines",
  "GitHub Actions",
  "GitLab CI/CD",
  "Jenkins",
  "AWS",
  "AWS Lambda",
  "Azure",
  "Google Cloud Platform (GCP)",
  "Firebase",
  "Terraform",
  "Ansible",
  "Linux Administration",
  "Bash Scripting",
  "Nginx",
  "Apache",

  // Data Science & AI
  "Machine Learning",
  "Deep Learning",
  "TensorFlow",
  "PyTorch",
  "Scikit-Learn",
  "NumPy",
  "Pandas",
  "Matplotlib",
  "Seaborn",
  "OpenCV",
  "Natural Language Processing (NLP)",
  "Computer Vision",
  "Big Data",
  "Apache Spark",
  "Hadoop",
  "SQL",
  "NoSQL",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",

  // UI/UX & Design
  "Figma",
  "Adobe XD",
  "Sketch",
  "Photoshop",
  "Illustrator",
  "UI/UX Principles",
  "Wireframing",
  "Prototyping",
  "Responsive Design",
  "Accessibility (WCAG)",

  // Mobile Development
  "Android Development",
  "iOS Development",
  "Flutter",
  "React Native",
  "SwiftUI",
  "Jetpack Compose",

  // Cybersecurity
  "Ethical Hacking",
  "Penetration Testing",
  "Network Security",
  "Cryptography",
  "OWASP Top 10",
  "Security Best Practices",
  "ISO 27001",

  // Mathematics & Algorithms
  "Data Structures & Algorithms",
  "Competitive Programming",
  "Discrete Mathematics",
  "Linear Algebra",
  "Probability & Statistics",

  // Business & Soft Skills
  "Agile Methodology",
  "Scrum",
  "Kanban",
  "Project Management",
  "Communication Skills",
  "Leadership",
  "Team Collaboration",
  "Time Management",
  "Problem-Solving",
  "Critical Thinking",
  "Creativity",
  "Adaptability",
]

const ProfileModal = ({ isOpen, onClose, profile, onSave }) => {
  const [editedProfile, setEditedProfile] = useState(profile)
  const [selectedSkill, setSelectedSkill] = useState("")

  const handleAddSkill = () => {
    if (selectedSkill && !editedProfile.skills.includes(selectedSkill)) {
      setEditedProfile({
        ...editedProfile,
        skills: [...editedProfile.skills, selectedSkill],
      })
      setSelectedSkill("") // Reset selection
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setEditedProfile({
      ...editedProfile,
      skills: editedProfile.skills.filter((skill) => skill !== skillToRemove),
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSave(editedProfile)
            onClose()
          }}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              value={editedProfile.username}
              onChange={(e) => setEditedProfile({ ...editedProfile, username: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
            <textarea
              value={editedProfile.bio}
              onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {editedProfile.skills.map((skill) => (
                <SkillBadge key={skill} skill={skill} onRemove={handleRemoveSkill} variant="removable" />
              ))}
            </div>
            <div className="flex gap-2">
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select a skill</option>
                {skillOptions.map((skill) => (
                  <option key={skill} value={skill} className="bg-white dark:bg-slate-800">
                    {skill}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddSkill}
                type="button"
                className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const Dashboard = () => {
  const [username, setUsername] = useState("")
  const [greeting, setGreeting] = useState("")
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [profile, setProfile] = useState({
    username: "",
    bio: "",
    skills: [],
  })
  const [stats, setStats] = useState({
    totalConnections: 0,
    messagesSent: 0,
    videoCalls: 0,
    scheduledCalls: 0,
  })

  useEffect(() => {
    // Load user data
    const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}

    setUsername(storedUser.username || "")
    setProfile({
      username: storedUser.username || "",
      bio: storedUser.bio || "",
      skills: storedUser.skills || [],
    })

    // Set greeting based on time of day
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")

    // Fetch stats from backend
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setStats(res.data)
      } catch (err) {
        console.error("Failed to fetch stats", err)
      }
    }

    fetchStats()
  }, [])

  const handleProfileSave = async (updatedProfile) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/profile`,
        updatedProfile,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is included
          },
        },
      )

      setProfile(response.data)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      window.location.reload()
    } catch (error) {
      console.error("Error updating profile:", error.response ? error.response.data : error)
    }
  }

  const statsCards = [
    {
      icon: Users,
      title: "Total Connections",
      value: stats.totalConnections,
      trend: "+12%",
      color: "purple",
      description: "Active network members",
    },
    {
      icon: Video,
      title: "Video Calls",
      value: stats.videoCalls,
      trend: "+8%",
      color: "blue",
      description: "Sessions completed",
    },
    {
      icon: MessageSquare,
      title: "Messages Sent",
      value: stats.messagesSent,
      trend: "+24%",
      color: "green",
      description: "Conversations started",
    },
    {
      icon: Calendar,
      title: "Scheduled Calls",
      value: stats.scheduledCalls,
      trend: "+5%",
      color: "orange",
      description: "Upcoming meetings",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-700 dark:to-pink-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg border border-white/30">
                  {profile.username?.charAt(0) || username?.charAt(0) || "U"}
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                    {greeting}, {profile.username || username} 👋
                  </h1>
                  <p className="text-purple-100 text-lg">Ready to connect and learn something new today?</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl hover:bg-white/20 transition-all duration-200"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
              <Link
                to="/home"
                className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-2xl hover:bg-gray-100 transition-all duration-200 shadow-lg font-medium"
              >
                <Users className="w-4 h-4" />
                Connect with People
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("user")
                  localStorage.removeItem("userProfile")
                  localStorage.removeItem("token")
                  window.location.href = "/login"
                }}
                className="px-6 py-3 bg-red-500/20 border border-red-400/30 text-red-100 rounded-2xl hover:bg-red-500/30 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        {/* Profile Section */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-3xl p-8 mb-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Overview</h2>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Bio</h3>
              <p className="text-gray-900 dark:text-white leading-relaxed">
                {profile.bio || "No bio added yet. Tell others about yourself!"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                Skills ({profile.skills?.length || 0})
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile && profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill) => <SkillBadge key={skill} skill={skill} />)
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">No skills added yet</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Last 7 days</span>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: Video,
                  title: "Video call with Alex Johnson",
                  time: "45 minutes ago",
                  duration: "32m 16s",
                  color: "blue",
                },
                {
                  icon: MessageSquare,
                  title: "New message from Sarah Chen",
                  time: "2 hours ago",
                  duration: "5 messages",
                  color: "green",
                },
                {
                  icon: Users,
                  title: "Connected with Mike Rodriguez",
                  time: "1 day ago",
                  duration: "New connection",
                  color: "purple",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl px-4 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        activity.color === "blue"
                          ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                          : activity.color === "green"
                            ? "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400"
                            : "bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400"
                      }`}
                    >
                      <activity.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{activity.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full">
                    {activity.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
              <Activity className="w-6 h-6 text-gray-400" />
            </div>

            <div className="space-y-4">
              <Link
                to="/home"
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/10 border border-purple-200 dark:border-purple-500/20 rounded-2xl hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-500/20 dark:hover:to-pink-500/20 transition-all duration-200 group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    Find New Connections
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Discover people with complementary skills</p>
                </div>
              </Link>

              <Link
                to="/matches"
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10 border border-blue-200 dark:border-blue-500/20 rounded-2xl hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-500/20 dark:hover:to-cyan-500/20 transition-all duration-200 group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    View My Matches
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Chat with your connected peers</p>
                </div>
              </Link>

              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Skill Progress</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Track your learning journey</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-500/10 dark:to-red-500/10 border border-orange-200 dark:border-orange-500/20 rounded-2xl">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Set Goals</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Define your learning objectives</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSave={handleProfileSave}
      />
    </div>
  )
}

export default Dashboard
