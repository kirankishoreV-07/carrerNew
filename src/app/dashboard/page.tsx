"use client"

import { useAuthState } from 'react-firebase-hooks/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { auth } from '@/lib/firebase'
import { signOutUser } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Brain, User, LogOut, BarChart3, Target, Users, FileText, Rocket } from 'lucide-react'

export default function Dashboard() {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    try {
      await signOutUser()
      router.push('/auth')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Brain className="w-8 h-8 text-blue-500 mr-3" />
              <h1 className="text-xl font-bold text-white">CareerAI Advisor</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-slate-300">
                <User className="w-4 h-4" />
                <span className="text-sm">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-slate-400 hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user.displayName || 'Student'}! 👋
            </h2>
            <p className="text-slate-400">
              Ready to explore your career future with AI-powered insights?
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Feature 1: Skills Radar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="glass rounded-xl p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300 group cursor-pointer"
              onClick={() => router.push('/skills-radar')}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-600/30 transition-colors">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Future Skills Radar</h3>
                  <p className="text-slate-400 text-sm">AI-powered skill forecasting</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm mb-4">
                Discover which skills will be in demand 2-5 years from now and create your personalized learning timeline.
              </p>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 rounded-lg text-sm font-medium">
                🎯 Launch AI Radar →
              </div>
            </motion.div>

            {/* Feature 2: Career Path Simulator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="glass rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300 group cursor-pointer"
              onClick={() => router.push('/career-simulator')}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mr-4 group-hover:bg-purple-600/30 transition-colors">
                  <Target className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">AI Career Path Simulator</h3>
                  <p className="text-slate-400 text-sm">Interactive career journey</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm mb-4">
                Simulate your career journey with AI-powered predictions, skill gap analysis, and personalized roadmaps.
              </p>
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 rounded-lg text-sm font-medium">
                🚀 Simulate Career Path →
              </div>
            </motion.div>

            {/* Feature 3: Resume Scorer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="glass rounded-xl p-6 border border-white/10 hover:border-green-500/30 transition-all duration-300 group cursor-pointer"
              onClick={() => router.push('/resume-score')}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-600/30 transition-colors">
                  <FileText className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">AI Resume Scorer</h3>
                  <p className="text-slate-400 text-sm">ATS-optimized analysis</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm mb-4">
                Get comprehensive ATS scoring and personalized feedback to optimize your resume for any role.
              </p>
              <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white text-center py-2 rounded-lg text-sm font-medium">
                📄 Score My Resume →
              </div>
            </motion.div>

            {/* Feature 4: Experience Simulator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="glass rounded-xl p-6 border border-white/10 hover:border-yellow-500/30 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center mr-4 group-hover:bg-yellow-600/30 transition-colors">
                  <Users className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Experience Simulator</h3>
                  <p className="text-slate-400 text-sm">Virtual career experiences</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm mb-4">
                Experience day-in-the-life scenarios of different careers through AI-powered simulations.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Start Simulation →
              </Button>
            </motion.div>
          </div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="glass rounded-xl p-6 border border-white/10"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Your Journey</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">0</div>
                <div className="text-slate-400 text-sm">Skills Explored</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">0</div>
                <div className="text-slate-400 text-sm">Career Paths</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">0</div>
                <div className="text-slate-400 text-sm">Resumes Scored</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">0</div>
                <div className="text-slate-400 text-sm">Simulations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-400 mb-1">0%</div>
                <div className="text-slate-400 text-sm">Profile Complete</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
