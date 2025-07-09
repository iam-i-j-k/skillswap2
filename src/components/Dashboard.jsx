import React,{ useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { Users, Video, MessageSquare, Calendar, X, Plus, Edit2, Save, TrendingUp, Clock } from "lucide-react"

const StatsCard = ({ icon: Icon, title, value, trend, color = "purple" }) => {
  const colorClasses = {
    purple: "from-purple-500 to-purple-600",
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    orange: "from-orange-500 to-orange-600",
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-2xl bg-gradient-to-r ${colorClasses[color]} shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
        </div>
        {trend && (
          <div className="flex items-center text-green-400 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend}
          </div>
        )}
      </div>
    </div>
  )
}

const SkillBadge = ({ skill, onRemove, variant = "default" }) => {
  const variants = {
    default: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    removable:
      "bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30",
  }

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-all duration-200 ${variants[variant]}`}
    >
      {skill}
      {onRemove && (
        <button onClick={() => onRemove(skill)} className="hover:text-red-400 transition-colors">
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
      <div className="bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
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
            <label className="block text-sm font-medium text-slate-200 mb-2">Full Name</label>
            <input
              type="text"
              value={editedProfile.username}
              onChange={(e) => setEditedProfile({ ...editedProfile, username: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Bio</label>
            <textarea
              value={editedProfile.bio}
              onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Skills</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {editedProfile.skills.map((skill) => (
                <SkillBadge key={skill} skill={skill} onRemove={handleRemoveSkill} variant="removable" />
              ))}
            </div>
            <div className="flex gap-2">
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select a skill</option>
                {skillOptions.map((skill) => (
                  <option key={skill} value={skill} className="bg-slate-800">
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
              className="px-6 py-3 border border-white/20 text-slate-300 rounded-2xl hover:bg-white/5 transition-all duration-200"
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
    },
    {
      icon: Video,
      title: "Video Calls",
      value: stats.videoCalls,
      trend: "+8%",
      color: "blue",
    },
    {
      icon: MessageSquare,
      title: "Messages Sent",
      value: stats.messagesSent,
      trend: "+24%",
      color: "green",
    },
    {
      icon: Calendar,
      title: "Scheduled Calls",
      value: stats.scheduledCalls,
      trend: "+5%",
      color: "orange",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\60\ height=\60\ viewBox=\0 0 60 60\ xmlns=\http://www.w3.org/2000/svg\%3E%3Cg fill=\none\ fillRule=\evenodd\%3E%3Cg fill=\%239C92AC\ fillOpacity=\0.05\%3E%3Ccircle cx=\30\ cy=\30\ r=\2\/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      {/* Welcome Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {profile.username?.charAt(0) || username?.charAt(0) || "U"}
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                    {greeting}, {profile.username || username} 👋
                  </h1>
                  <p className="text-slate-400 text-lg">Ready to connect and learn something new today?</p>
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
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg"
              >
                <Users className="w-4 h-4" />
                Connect with People
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  localStorage.removeItem("userProfile");
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
                className="px-6 py-3 bg-red-500/20 border border-red-500/30 text-red-300 rounded-2xl hover:bg-red-500/30 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Profile Section */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Profile Overview</h2>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-3">Bio</h3>
              <p className="text-white leading-relaxed">{profile.bio || "No bio added yet. Tell others about yourself!"}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-3">Skills ({profile.skills?.length || 0})</h3>
              <div className="flex flex-wrap gap-2">
                {profile && profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map(skill => <SkillBadge key={skill} skill={skill} />)
                ) : (
                  <p className="text-slate-400 italic">No skills added yet</p>
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

        {/* Recent Activity */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Last 7 days</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {[
              { icon: Video, title: "Video call with Alex Johnson", time: "45 minutes ago", duration: "32m 16s", color: "blue" },
              { icon: MessageSquare, title: "New message from Sarah Chen", time: "2 hours ago", duration: "5 messages", color: "green" },
              { icon: Users, title: "Connected with Mike Rodriguez", time: "1 day ago", duration: "New connection", color: "purple" }
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-4 border-b border-white/10 last:border-0 hover:bg-white/5 rounded-2xl px-4 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    activity.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                    activity.color === 'green' ? 'bg-green-500/20 text-green-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    <activity.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{activity.title}</p>
                    <p className="text-sm text-slate-400">{activity.time}</p>
                  </div>
                </div>
                <span className="text-sm text-slate-400 bg-white/5 px-3 py-1 rounded-full">
                  {activity.duration}
                </span>
              </div>
            ))}
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
