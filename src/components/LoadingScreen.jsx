
import React,{ useState, useEffect } from "react"
import { Sparkles, Users, MessageSquare, Award } from "lucide-react"

const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const loadingSteps = [
    { icon: Sparkles, text: "Initializing SkillSwap...", duration: 800 },
    { icon: Users, text: "Connecting to community...", duration: 600 },
    { icon: MessageSquare, text: "Loading conversations...", duration: 500 },
    { icon: Award, text: "Preparing your dashboard...", duration: 400 },
  ]

  useEffect(() => {
    let progressInterval
    let stepTimeout

    const startLoading = () => {
      // Progress bar animation
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            setTimeout(() => {
              onLoadingComplete()
            }, 300)
            return 100
          }
          return prev + 2
        })
      }, 50)

      // Step progression
      let currentStepIndex = 0
      const nextStep = () => {
        if (currentStepIndex < loadingSteps.length) {
          setCurrentStep(currentStepIndex)
          stepTimeout = setTimeout(() => {
            currentStepIndex++
            nextStep()
          }, loadingSteps[currentStepIndex]?.duration || 500)
        }
      }
      nextStep()
    }

    startLoading()

    return () => {
      clearInterval(progressInterval)
      clearTimeout(stepTimeout)
    }
  }, [onLoadingComplete])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center z-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\60\ height=\60\ viewBox=\0 0 60 60\ xmlns=\http://www.w3.org/2000/svg\%3E%3Cg fill=\none\ fillRule=\evenodd\%3E%3Cg fill=\%239C92AC\ fillOpacity=\0.1\%3E%3Ccircle cx=\30\ cy=\30\ r=\2\/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="relative text-center max-w-md mx-auto px-6">
        {/* Logo */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl">
              <Sparkles className="w-10 h-10 text-white animate-spin" style={{ animationDuration: "3s" }} />
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Skill<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Swap</span>
          </h1>
          <p className="text-slate-400 text-lg">Connect. Learn. Grow.</p>
        </div>

        {/* Loading Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            {loadingSteps.map((step, index) => {
              const StepIcon = step.icon
              const isActive = index === currentStep
              const isCompleted = index < currentStep

              return (
                <div
                  key={index}
                  className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 scale-110 shadow-lg"
                      : isCompleted
                        ? "bg-green-500 scale-100"
                        : "bg-white/10 scale-90"
                  }`}
                >
                  <StepIcon
                    className={`w-6 h-6 transition-all duration-300 ${
                      isActive ? "text-white animate-pulse" : isCompleted ? "text-white" : "text-slate-400"
                    }`}
                  />
                  {isActive && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 animate-ping opacity-20"></div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Current Step Text */}
          <div className="h-6 mb-6">
            <p className="text-slate-300 text-sm font-medium animate-fade-in">
              {loadingSteps[currentStep]?.text || "Almost ready..."}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-slate-400 text-xs">Loading...</span>
            <span className="text-slate-300 text-xs font-medium">{progress}%</span>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-4 opacity-60">
          <div className="text-center">
            <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Users className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xs text-slate-400">Connect</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <MessageSquare className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xs text-slate-400">Chat</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Award className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xs text-slate-400">Learn</p>
          </div>
        </div>
      </div>

      {/* Loading Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
