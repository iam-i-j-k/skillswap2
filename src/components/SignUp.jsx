import React,{ useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { X, Check, ChevronDown, Loader2, Eye, EyeOff, Sparkles, Plus } from "lucide-react"

const PREDEFINED_SKILLS = [
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
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showVerifyNotice, setShowVerifyNotice] = useState(false)
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

    setIsLoading(true)
    try {
      await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        skills: formData.skills,
        bio: formData.bio,
      })
      setShowVerifyNotice(true)
    } catch (error) {
      setError(error.response?.data?.error || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\60\ height=\60\ viewBox=\0 0 60 60\ xmlns=\http://www.w3.org/2000/svg\%3E%3Cg fill=\none\ fillRule=\evenodd\%3E%3Cg fill=\%239C92AC\ fillOpacity=\0.05\%3E%3Ccircle cx=\30\ cy=\30\ r=\2\/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative max-w-lg mx-auto">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-xl">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Join SkillSwap</h1>
          <p className="text-gray-600 dark:text-gray-400">Create your account and start connecting</p>
        </div>

        {/* Signup Card */}
        <div className="bg-white dark:bg-slate-800 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center gap-3 text-red-600 dark:text-red-400">
              <X className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          {showVerifyNotice && (
            <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-2xl text-green-800 dark:text-green-200 text-center mt-8">
              <Check className="inline w-6 h-6 mr-2 align-middle" />
              Check your email to verify your account.
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Username Input */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="block w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="JohnDoe"
              />
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="you@example.com"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full px-4 pr-12 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full px-4 pr-12 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Skills Selection */}
            <div className="relative space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Skills</label>

              {/* Selected Skills */}
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-full text-sm border border-purple-200 dark:border-purple-500/30"
                    >
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Skills Dropdown Trigger */}
              <button
                type="button"
                onClick={() => setShowSkillsDropdown(!showSkillsDropdown)}
                className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl text-gray-500 dark:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 flex items-center justify-between"
              >
                <span>Select or add skills...</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showSkillsDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Skills Dropdown */}
              {showSkillsDropdown && (
                <div className="absolute z-10 mt-2 w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl">
                  <div className="p-4">
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={customSkill}
                        onChange={(e) => setCustomSkill(e.target.value)}
                        placeholder="Add custom skill..."
                        className="flex-1 px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={addCustomSkill}
                        className="px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {PREDEFINED_SKILLS.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl text-sm text-gray-700 dark:text-gray-300 flex items-center justify-between transition-colors"
                        >
                          {skill}
                          {formData.skills.includes(skill) && <Check className="w-4 h-4 text-purple-500" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bio Input */}
            <div className="space-y-2">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                required
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="block w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>

        {/* Sign In Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp
