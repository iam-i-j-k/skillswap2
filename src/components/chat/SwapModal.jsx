import React,{ useState } from "react"
import { X, ArrowRightLeft } from "lucide-react"

const SwapModal = ({ activeModal, setActiveModal, recipient, currentUser, recipientSkills = [], userSkills = [] }) => {
  const [selectedSkill, setSelectedSkill] = useState("")
  const [desiredSkill, setDesiredSkill] = useState("")

  if (activeModal !== "swap") return null

  const handleSubmit = () => {
    if (selectedSkill && desiredSkill) {
      // Handle skill swap proposal logic here
      console.log("Skill swap proposal:", { selectedSkill, desiredSkill })
      setActiveModal(null)
      setSelectedSkill("")
      setDesiredSkill("")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Propose Skill Exchange</h3>
            <button
              onClick={() => setActiveModal(null)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors text-gray-500 dark:text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center mb-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Exchange skills with{" "}
              <span className="font-semibold text-purple-600 dark:text-purple-400">{recipient?.username}</span>
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Your Skill to Offer
              </label>
              <select
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
              >
                <option value="">Select your skill</option>
                {userSkills.map((skill, idx) => (
                  <option key={idx} value={skill} className="bg-white dark:bg-slate-800">
                    {skill}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-500/20 rounded-full">
                <ArrowRightLeft className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Skill You Want to Learn
              </label>
              <select
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                value={desiredSkill}
                onChange={(e) => setDesiredSkill(e.target.value)}
              >
                <option value="">Select their skill</option>
                {recipientSkills.map((skill, idx) => (
                  <option key={idx} value={skill} className="bg-white dark:bg-slate-800">
                    {skill}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setActiveModal(null)}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className={`flex-1 px-4 py-3 rounded-2xl font-medium transition-all duration-200 ${
                !selectedSkill || !desiredSkill
                  ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500 dark:text-gray-400"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl"
              }`}
              disabled={!selectedSkill || !desiredSkill}
            >
              Send Proposal
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SwapModal
