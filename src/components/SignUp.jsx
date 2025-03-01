import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { X, Check, ChevronDown, Loader2 } from "lucide-react"

const PREDEFINED_SKILLS = [
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

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    skills: [],
    bio: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false)
  const [customSkill, setCustomSkill] = useState("")
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const toggleSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
    }))
  }

  const addCustomSkill = () => {
    if (customSkill.trim() && !formData.skills.includes(customSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, customSkill.trim()],
      }))
      setCustomSkill("")
    }
  }

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    try {
      setIsLoading(true)
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        skills: formData.skills,
        bio: formData.bio,
      })

      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      navigate("/dashboard")
    } catch (error) {
      setError(error.response?.data?.error || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Create Account</h2>
          <p className="mt-2 text-gray-600">Join our community and connect with others</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-purple-100">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <X className="w-4 h-4" />
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              {/* Username Input */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="JohnDoe"
                />
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>

              {/* Skills Selection */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>

                {/* Selected Skills */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                    >
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Skills Dropdown Trigger */}
                <button
                  type="button"
                  onClick={() => setShowSkillsDropdown(!showSkillsDropdown)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors flex items-center justify-between"
                >
                  <span className="text-gray-500">Select or add skills...</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {/* Skills Dropdown */}
                {showSkillsDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="p-2">
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={customSkill}
                          onChange={(e) => setCustomSkill(e.target.value)}
                          placeholder="Add custom skill..."
                          className="flex-1 px-2 py-1 border border-gray-300 rounded-md text-sm"
                        />
                        <button
                          type="button"
                          onClick={addCustomSkill}
                          className="px-2 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {PREDEFINED_SKILLS.map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className="w-full text-left px-3 py-2 hover:bg-purple-50 rounded-md text-sm flex items-center justify-between"
                          >
                            {skill}
                            {formData.skills.includes(skill) && <Check className="w-4 h-4 text-purple-600" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bio Input */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  required
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500 transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignUp

