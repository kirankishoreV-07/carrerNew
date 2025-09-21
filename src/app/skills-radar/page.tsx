'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SkillsRadar from '@/components/EnhancedSkillsRadar';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { 
  User, 
  Briefcase, 
  Clock, 
  Building, 
  ChevronRight,
  Sparkles 
} from 'lucide-react';

export default function SkillsRadarPage() {
  const [user, loading] = useAuthState(auth);
  const [userProfile, setUserProfile] = useState({
    currentSkills: [] as string[],
    targetRole: '',
    experience: '',
    industry: ''
  });
  const [showRadar, setShowRadar] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  // Handle skill input
  const addSkill = () => {
    if (skillInput.trim() && !userProfile.currentSkills.includes(skillInput.trim())) {
      setUserProfile(prev => ({
        ...prev,
        currentSkills: [...prev.currentSkills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setUserProfile(prev => ({
      ...prev,
      currentSkills: prev.currentSkills.filter(skill => skill !== skillToRemove)
    }));
  };

  // Handle form submission
  const generateRadar = () => {
    if (userProfile.currentSkills.length > 0 && userProfile.targetRole && userProfile.experience) {
      setShowRadar(true);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Sparkles className="w-16 h-16 mx-auto text-blue-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Skills Radar</h1>
          <p className="text-gray-600 mb-6">Please sign in to access your personalized skills analysis</p>
          <a href="/auth" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  // Show radar if profile is complete
  if (showRadar) {
    return <SkillsRadar userProfile={userProfile} />;
  }

  // Profile setup form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🎯 AI-Powered Skills Radar
          </h1>
          <p className="text-lg text-gray-600">
            Get personalized predictions for skills that will be in demand 2-5 years from now
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <User className="w-6 h-6 mr-2 text-blue-600" />
            Tell us about yourself
          </h2>

          <div className="space-y-6">
            {/* Current Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Technical Skills *
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  placeholder="e.g., React, Python, JavaScript..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={addSkill}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {userProfile.currentSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Target Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="w-4 h-4 inline mr-1" />
                Target Career Role *
              </label>
              <select
                value={userProfile.targetRole}
                onChange={(e) => setUserProfile(prev => ({ ...prev, targetRole: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select your target role</option>
                <option value="Full-Stack Developer">Full-Stack Developer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Mobile Developer">Mobile Developer</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="Data Engineer">Data Engineer</option>
                <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
                <option value="Cloud Architect">Cloud Architect</option>
                <option value="Cybersecurity Specialist">Cybersecurity Specialist</option>
                <option value="Product Manager">Product Manager</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="Software Architect">Software Architect</option>
              </select>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Experience Level *
              </label>
              <select
                value={userProfile.experience}
                onChange={(e) => setUserProfile(prev => ({ ...prev, experience: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select your experience level</option>
                <option value="Student/New Graduate">Student/New Graduate</option>
                <option value="Entry Level (0-2 years)">Entry Level (0-2 years)</option>
                <option value="Mid Level (2-5 years)">Mid Level (2-5 years)</option>
                <option value="Senior Level (5-8 years)">Senior Level (5-8 years)</option>
                <option value="Lead/Architect (8+ years)">Lead/Architect (8+ years)</option>
              </select>
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="w-4 h-4 inline mr-1" />
                Target Industry
              </label>
              <select
                value={userProfile.industry}
                onChange={(e) => setUserProfile(prev => ({ ...prev, industry: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select your target industry (optional)</option>
                <option value="Technology">Technology</option>
                <option value="Financial Services">Financial Services</option>
                <option value="Healthcare">Healthcare</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Education">Education</option>
                <option value="Gaming">Gaming</option>
                <option value="Media & Entertainment">Media & Entertainment</option>
                <option value="Government">Government</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Consulting">Consulting</option>
                <option value="Startup">Startup</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>

            {/* Generate Button */}
            <motion.button
              onClick={generateRadar}
              disabled={!userProfile.currentSkills.length || !userProfile.targetRole || !userProfile.experience}
              whileHover={{ scale: userProfile.currentSkills.length && userProfile.targetRole && userProfile.experience ? 1.02 : 1 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center ${
                userProfile.currentSkills.length && userProfile.targetRole && userProfile.experience
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate AI Skills Radar
              <ChevronRight className="w-5 h-5 ml-2" />
            </motion.button>

            <p className="text-sm text-gray-500 text-center">
              * Required fields. This analysis uses Google Cloud AI to predict future skill demands.
            </p>
          </div>
        </motion.div>

        {/* Sample Skills for Quick Setup */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white rounded-lg p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4">Quick Setup - Popular Skills</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript',
              'SQL', 'AWS', 'Docker', 'Git', 'HTML/CSS',
              'MongoDB', 'Express.js', 'Next.js', 'Vue.js', 'Angular'
            ].map(skill => (
              <button
                key={skill}
                onClick={() => {
                  if (!userProfile.currentSkills.includes(skill)) {
                    setUserProfile(prev => ({
                      ...prev,
                      currentSkills: [...prev.currentSkills, skill]
                    }));
                  }
                }}
                className={`p-2 text-sm rounded-lg border transition-colors ${
                  userProfile.currentSkills.includes(skill)
                    ? 'bg-blue-100 border-blue-300 text-blue-800'
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
