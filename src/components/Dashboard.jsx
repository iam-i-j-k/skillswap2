import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { Users, Video, MessageSquare, Calendar, X, Plus, Edit2, Save } from "lucide-react";

const StatsCard = ({ icon: Icon, title, value, trend }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex items-center">
        <Icon className="h-6 w-6 text-blue-500" />
        <div className="ml-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-gray-500">{value}</p>
        </div>
      </div>
    </div>
  );
};

const SkillBadge = ({ skill, onRemove }) => (
  <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
    {skill}
    {onRemove && (
      <button onClick={() => onRemove(skill)} className="hover:text-red-500">
        <X className="w-3 h-3" />
      </button>
    )}
  </span>
);



// Predefined Skills List
const skillOptions = [
  // Programming & Development
  "JavaScript", "TypeScript", "React.js", "Next.js", "Vue.js", "Angular", "Node.js",
  "Express.js", "Python", "Django", "Flask", "Java", "Spring Boot", "Kotlin", "Swift",
  "C", "C++", "C#", ".NET", "PHP", "Laravel", "Ruby", "Ruby on Rails", "Go (Golang)",
  "Rust", "GraphQL", "REST APIs", "WebSockets", "HTML", "CSS", "Tailwind CSS",
  "Bootstrap", "Sass", "Material UI",
  
  // DevOps & Cloud
  "Docker", "Kubernetes", "CI/CD Pipelines", "GitHub Actions", "GitLab CI/CD",
  "Jenkins", "AWS", "AWS Lambda", "Azure", "Google Cloud Platform (GCP)",
  "Firebase", "Terraform", "Ansible", "Linux Administration", "Bash Scripting",
  "Nginx", "Apache",
  
  // Data Science & AI
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Scikit-Learn",
  "NumPy", "Pandas", "Matplotlib", "Seaborn", "OpenCV", "Natural Language Processing (NLP)",
  "Computer Vision", "Big Data", "Apache Spark", "Hadoop", "SQL", "NoSQL",
  "MongoDB", "PostgreSQL", "MySQL", "Redis",
  
  // UI/UX & Design
  "Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator", "UI/UX Principles",
  "Wireframing", "Prototyping", "Responsive Design", "Accessibility (WCAG)",
  
  // Mobile Development
  "Android Development", "iOS Development", "Flutter", "React Native",
  "SwiftUI", "Jetpack Compose",
  
  // Cybersecurity
  "Ethical Hacking", "Penetration Testing", "Network Security", "Cryptography",
  "OWASP Top 10", "Security Best Practices", "ISO 27001",
  
  // Mathematics & Algorithms
  "Data Structures & Algorithms", "Competitive Programming", "Discrete Mathematics",
  "Linear Algebra", "Probability & Statistics",
  
  // Business & Soft Skills
  "Agile Methodology", "Scrum", "Kanban", "Project Management",
  "Communication Skills", "Leadership", "Team Collaboration", "Time Management",
  "Problem-Solving", "Critical Thinking", "Creativity", "Adaptability",
  ]

const ProfileModal = ({ isOpen, onClose, profile, onSave }) => {
  const [editedProfile, setEditedProfile] = useState(profile);
  const [selectedSkill, setSelectedSkill] = useState("");

  const handleAddSkill = () => {
    if (selectedSkill && !editedProfile.skills.includes(selectedSkill)) {
      setEditedProfile({
        ...editedProfile,
        skills: [...editedProfile.skills, selectedSkill],
      });
      setSelectedSkill(""); // Reset selection
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setEditedProfile({
      ...editedProfile,
      skills: editedProfile.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(editedProfile);
            onClose();
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={editedProfile.username}
                onChange={(e) => setEditedProfile({ ...editedProfile, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                value={editedProfile.bio}
                onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {editedProfile.skills.map((skill) => (
                  <SkillBadge key={skill} skill={skill} onRemove={handleRemoveSkill} />
                ))}
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select a skill</option>
                  {skillOptions.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddSkill}
                  type="button"
                  className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// SkillBadge Component




const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [greeting, setGreeting] = useState("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profile, setProfile] = useState({
    username: "",
    bio: "",
    skills: [],
  });

  useEffect(() => {
    // Load user data
    const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {};

    setUsername(storedUser.username || "");
    setProfile({
      username: storedUser.username || "",
      bio: storedUser.bio || "",
      skills: storedUser.skills || [],
    });

    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const handleProfileSave = async (updatedProfile) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/profile`, 
        updatedProfile, 
        {
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}` // Ensure token is included
          }
        }
      );
      
      console.log("API Response:", response.data.user);
  
      setProfile(response.data);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error.response ? error.response.data : error);
    }
  };
  

  const stats = [
    {
      icon: Users,
      title: "Total Connections",
      value: "2,345",
      trend: 12.5,
    },
    {
      icon: Video,
      title: "Video Calls",
      value: "432",
      trend: 8.2,
    },
    {
      icon: MessageSquare,
      title: "Messages Sent",
      value: "12.5k",
      trend: -2.4,
    },
    {
      icon: Calendar,
      title: "Scheduled Calls",
      value: "8",
      trend: 4.1,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {greeting}, {profile.username || username} 👋
              </h1>
              <p className="text-indigo-100">Here's what's happening with your account today.</p>
            </div>
            <div className="mt-6 md:mt-0 space-x-4 space-y-4">
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="bg-white/10 text-white px-6 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors"
              >
                Edit Profile
              </button>
              <button
                onClick={() => (window.location.href = "/home")}
                className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
              >
                Connect with People
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  localStorage.removeItem("userProfile");
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
                className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Profile</h2>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="text-indigo-600 hover:text-indigo-700 flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Bio</h3>
              <p className="mt-1">{profile.bio || "No bio added yet"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile && profile.skills ? (
                  profile.skills.map(skill => <SkillBadge key={skill} skill={skill}/>)
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Video className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium">Video call with Alex Johnson</p>
                    <p className="text-sm text-gray-500">45 minutes ago</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">32m 16s</span>
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
  );
};

export default Dashboard;
