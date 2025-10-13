import React from "react"
import { ArrowLeft, Shield, Users, MessageSquare, Database, Eye, AlertTriangle } from "lucide-react"
import { useNavigate } from "react-router-dom"

const TermsOfService = () => {
  const navigate = useNavigate()

  const sections = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      icon: Shield,
      content: `By accessing and using SkillSwap ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`,
    },
    {
      id: "description",
      title: "2. Service Description",
      icon: Users,
      content: `SkillSwap is a platform that connects individuals for skill sharing and learning. Users can create profiles, connect with others, exchange messages, share resources, and participate in skill-swapping activities.`,
    },
    {
      id: "user-accounts",
      title: "3. User Accounts",
      icon: Users,
      content: `You are responsible for safeguarding the password and for maintaining the confidentiality of your account. You agree not to disclose your password to any third party and to take sole responsibility for activities that occur under your account.`,
    },
    {
      id: "acceptable-use",
      title: "4. Acceptable Use",
      icon: Shield,
      content: `You agree to use SkillSwap only for lawful purposes and in accordance with these Terms. You agree not to use the service to:
      • Harass, abuse, or harm other users
      • Share inappropriate, offensive, or illegal content
      • Impersonate others or provide false information
      • Spam or send unsolicited messages
      • Violate any applicable laws or regulations`,
    },
    {
      id: "content",
      title: "5. User Content",
      icon: MessageSquare,
      content: `You retain ownership of content you post on SkillSwap. However, by posting content, you grant us a non-exclusive, worldwide, royalty-free license to use, modify, and display your content in connection with the Service. You are responsible for ensuring your content doesn't violate any third-party rights.`,
    },
    {
      id: "privacy",
      title: "6. Privacy",
      icon: Eye,
      content: `Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices regarding the collection and use of your personal information.`,
    },
    {
      id: "termination",
      title: "7. Termination",
      icon: AlertTriangle,
      content: `We may terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.`,
    },
    {
      id: "disclaimers",
      title: "8. Disclaimers",
      icon: AlertTriangle,
      content: `SkillSwap is provided "as is" without any warranties. We do not guarantee the accuracy, completeness, or usefulness of any information on the Service. We are not responsible for the conduct of users or the content they share.`,
    },
    {
      id: "limitation",
      title: "9. Limitation of Liability",
      icon: Shield,
      content: `In no event shall SkillSwap be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.`,
    },
    {
      id: "changes",
      title: "10. Changes to Terms",
      icon: Database,
      content: `We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the Service. Your continued use of the Service after such modifications constitutes acceptance of the updated terms.`,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-6 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 text-gray-700 dark:text-gray-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Terms of Service</h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Please read these terms carefully before using SkillSwap
            </p>
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">Last updated: January 15, 2025</div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8">
            {/* Introduction */}
            <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/10 border border-purple-200 dark:border-purple-500/20 rounded-2xl">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Welcome to SkillSwap</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                These Terms of Service ("Terms") govern your use of the SkillSwap platform and services. By creating an
                account or using our services, you agree to these terms.
              </p>
            </div>

            {/* Terms Sections */}
            <div className="space-y-8">
              {sections.map((section) => (
                <div key={section.id} className="border-b border-gray-200 dark:border-white/10 pb-8 last:border-b-0">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-500/20 dark:to-pink-500/20 rounded-2xl flex items-center justify-center">
                        <section.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{section.title}</h3>
                      <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        {section.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>


          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsOfService
