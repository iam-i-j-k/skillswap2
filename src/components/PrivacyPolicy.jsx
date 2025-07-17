import React from "react"
import { ArrowLeft, Shield, Database, Eye, Users, Lock, Globe, AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

const PrivacyPolicy = () => {
  const navigate = useNavigate()

  const sections = [
    {
      id: "information-collection",
      title: "1. Information We Collect",
      icon: Database,
      content: `We collect information you provide directly to us, such as:
      • Account information (username, email, password)
      • Profile information (bio, skills, location)
      • Messages and communications
      • Files and resources you share
      • Usage data and analytics

We also automatically collect certain information when you use our service, including device information, IP address, browser type, and usage patterns.`,
    },
    {
      id: "information-use",
      title: "2. How We Use Your Information",
      icon: Users,
      content: `We use the information we collect to:
      • Provide and maintain our services
      • Connect you with other users
      • Facilitate skill sharing and learning
      • Send you notifications and updates
      • Improve our platform and user experience
      • Ensure platform security and prevent abuse
      • Comply with legal obligations`,
    },
    {
      id: "information-sharing",
      title: "3. Information Sharing",
      icon: Globe,
      content: `We may share your information in the following circumstances:
      • With other users as part of the skill-sharing platform
      • With service providers who assist in operating our platform
      • When required by law or to protect our rights
      • In connection with a business transaction (merger, acquisition)
      • With your explicit consent

We do not sell your personal information to third parties for marketing purposes.`,
    },
    {
      id: "data-security",
      title: "4. Data Security",
      icon: Lock,
      content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
      • Encryption of data in transit and at rest
      • Regular security assessments
      • Access controls and authentication
      • Employee training on data protection

However, no method of transmission over the internet is 100% secure.`,
    },
    {
      id: "data-retention",
      title: "5. Data Retention",
      icon: Database,
      content: `We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. Specifically:
      • Account information: Until you delete your account
      • Messages: Until deleted by users or account closure
      • Usage data: Up to 2 years for analytics purposes
      • Legal compliance: As required by applicable laws

You can request deletion of your data at any time.`,
    },
    {
      id: "your-rights",
      title: "6. Your Rights",
      icon: Shield,
      content: `You have the following rights regarding your personal information:
      • Access: Request a copy of your personal data
      • Correction: Update or correct inaccurate information
      • Deletion: Request deletion of your personal data
      • Portability: Request transfer of your data
      • Objection: Object to certain processing activities
      • Restriction: Request limitation of processing

To exercise these rights, contact us at privacy@skillswap.com.`,
    },
    {
      id: "cookies",
      title: "7. Cookies and Tracking",
      icon: Eye,
      content: `We use cookies and similar technologies to:
      • Remember your preferences and settings
      • Analyze platform usage and performance
      • Provide personalized content and features
      • Ensure platform security

You can control cookie settings through your browser, but disabling cookies may affect platform functionality.`,
    },
    {
      id: "third-party",
      title: "8. Third-Party Services",
      icon: Globe,
      content: `Our platform may integrate with third-party services such as:
      • Authentication providers
      • File storage services
      • Analytics tools
      • Communication platforms

These services have their own privacy policies, and we encourage you to review them.`,
    },
    {
      id: "children",
      title: "9. Children's Privacy",
      icon: AlertCircle,
      content: `SkillSwap is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.`,
    },
    {
      id: "international",
      title: "10. International Transfers",
      icon: Globe,
      content: `Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this privacy policy and applicable data protection laws.`,
    },
    {
      id: "changes",
      title: "11. Changes to This Policy",
      icon: Database,
      content: `We may update this privacy policy from time to time. We will notify you of any material changes by:
      • Posting the updated policy on our platform
      • Sending you an email notification
      • Displaying a prominent notice on our website

Your continued use of our services after such changes constitutes acceptance of the updated policy.`,
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-6 shadow-xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Privacy Policy</h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Learn how we collect, use, and protect your personal information
            </p>
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">Last updated: January 15, 2024</div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8">
            {/* Introduction */}
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10 border border-blue-200 dark:border-blue-500/20 rounded-2xl">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Your Privacy Matters</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                At SkillSwap, we are committed to protecting your privacy and ensuring the security of your personal
                information. This Privacy Policy explains how we collect, use, share, and protect your information when
                you use our platform.
              </p>
            </div>

            {/* Privacy Sections */}
            <div className="space-y-8">
              {sections.map((section) => (
                <div key={section.id} className="border-b border-gray-200 dark:border-white/10 pb-8 last:border-b-0">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-500/20 dark:to-cyan-500/20 rounded-2xl flex items-center justify-center">
                        <section.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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

            {/* Data Protection Summary */}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl text-center">
                <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Secure</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your data is encrypted and protected</p>
              </div>

              <div className="p-6 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-2xl text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Transparent</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Clear policies on data usage</p>
              </div>

              <div className="p-6 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-2xl text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">User Control</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">You control your personal data</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
