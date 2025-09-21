'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Brain, 
  TrendingUp, 
  Clock, 
  Zap, 
  Target, 
  AlertTriangle,
  DollarSign,
  Users,
  BarChart3,
  Star,
  Award,
  BookOpen,
  Calendar,
  Briefcase,
  Map,
  CheckCircle,
  Circle,
  Play,
  ChevronRight,
  Trophy,
  Flame,
  TrendingDown,
  ArrowRight,
  ArrowUp,
  BookMarked,
  GraduationCap,
  Lightbulb,
  Code,
  Database,
  Server,
  Smartphone,
  Globe,
  Shield,
  Cpu,
  GitBranch,
  Package,
  Monitor,
  Layers,
  Settings,
  Rocket,
  Heart,
  Coffee,
  User,
  MapPin,
  Building
} from 'lucide-react';

// Enhanced interfaces for new API structure
interface SkillGap {
  skill: string;
  importance: number;
  currentDemand: number;
  avgSalaryIncrease: number;
  learningPath: string[];
  timeToLearn: string;
}

interface SkillsRadarData {
  skillGaps: SkillGap[];
  salaryPrediction: {
    current: number;
    withNewSkills: number;
    currency: string;
    location: string;
  };
  marketInsights: {
    trendingTechnologies: string[];
    highDemandSkills: string[];
    emergingFields: string[];
  };
  careerPath: {
    nextRole: string;
    timeline: string;
    requiredSkills: string[];
    expectedSalary: number;
  };
  realDataSources: {
    googleSearchResults: number;
    jobPostings: number;
    youtubeResources: number;
    marketDataPoints: number;
    lastUpdated: string;
  };
  learningRoadmap?: {
    youtubeVideos?: Array<{
      skill: string;
      videos: Array<{
        videoId: string;
        title: string;
        thumbnail?: string;
        duration?: string;
        channelTitle?: string;
        viewCount?: number;
      }>;
    }>;
    recommendedCourses?: Array<{
      skill: string;
      courses: Array<{
        title: string;
        url: string;
        provider: string;
        price: string;
        duration: string;
        level: string;
      }>;
    }>;
    learningPlatforms?: Array<{
      name: string;
      url: string;
      description: string;
      specialization?: string[];
    }>;
  };
}

interface SkillsRadarProps {
  userProfile: {
    currentSkills: string[];
    targetRole: string;
    experience: string;
    industry: string;
    location?: string;
  };
}

// Enhanced color schemes and animations
const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6366F1', '#84CC16'];
const PRIORITY_COLORS = {
  high: 'from-red-500 to-pink-500',
  medium: 'from-yellow-500 to-orange-500',
  low: 'from-green-500 to-emerald-500'
};

// Skill icons mapping
const SKILL_ICONS: Record<string, any> = {
  'JavaScript': Code,
  'TypeScript': Code,
  'React': Monitor,
  'Angular': Monitor,
  'Vue': Monitor,
  'Node.js': Server,
  'Python': Code,
  'Java': Coffee,
  'C#': Code,
  'PHP': Code,
  'Go': Rocket,
  'Rust': Shield,
  'Swift': Smartphone,
  'Kotlin': Smartphone,
  'SQL': Database,
  'MongoDB': Database,
  'PostgreSQL': Database,
  'AWS': Globe,
  'Azure': Globe,
  'GCP': Globe,
  'Docker': Package,
  'Kubernetes': Layers,
  'Git': GitBranch,
  'GraphQL': Globe,
  'REST': Globe,
  'default': Code
};

export default function EnhancedSkillsRadar({ userProfile }: SkillsRadarProps) {
  const [radarData, setRadarData] = useState<SkillsRadarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<SkillGap | null>(null);
  const [activeTab, setActiveTab] = useState('roadmap');
  const [checkedSkills, setCheckedSkills] = useState<Set<string>>(new Set());
  const [selectedTimeframe, setSelectedTimeframe] = useState('6-months');

  // Enhanced skill progress tracking
  const [skillProgress, setSkillProgress] = useState<Record<string, number>>({});

  // Initialize checked skills with user's current skills once radarData is loaded
  useEffect(() => {
    if (radarData && userProfile.currentSkills.length > 0) {
      const currentSkillsNormalized = userProfile.currentSkills.map(skill => skill.toLowerCase().trim());
      const initialCheckedSkills = new Set<string>();
      
      // Check which skills from the prediction match the user's current skills
      radarData.skillGaps.forEach(skillGap => {
        const skillName = skillGap.skill.toLowerCase().trim();
        
        // Enhanced matching logic for better skill recognition
        const isSkillMatched = currentSkillsNormalized.some(userSkill => {
          // Direct match
          if (userSkill === skillName) return true;
          
          // Partial matches for common variations
          if (userSkill.includes(skillName) || skillName.includes(userSkill)) return true;
          
          // Special cases for common skill variations
          const skillVariations: Record<string, string[]> = {
            'python': ['python', 'py'],
            'javascript': ['javascript', 'js', 'node', 'nodejs'],
            'sql': ['sql', 'database', 'db'],
            'aws': ['aws', 'amazon web services', 'cloud'],
            'react': ['react', 'reactjs', 'react.js'],
            'nodejs': ['nodejs', 'node.js', 'node'],
            'docker': ['docker', 'containerization'],
            'kubernetes': ['kubernetes', 'k8s'],
            'data science': ['data science', 'data scientist', 'datascience'],
            'machine learning': ['machine learning', 'ml', 'ai'],
            'data engineering': ['data engineering', 'data engineer', 'dataengineer'],
          };
          
          // Check variations
          for (const [key, variations] of Object.entries(skillVariations)) {
            if (variations.includes(skillName) && variations.some(v => userSkill.includes(v))) {
              return true;
            }
          }
          
          return false;
        });
        
        if (isSkillMatched) {
          initialCheckedSkills.add(skillGap.skill);
        }
      });
      
      setCheckedSkills(initialCheckedSkills);
      console.log('🎯 User current skills:', userProfile.currentSkills);
      console.log('🎯 Available skill gaps:', radarData.skillGaps.map(s => s.skill));
      console.log('🎯 Initialized completed skills:', Array.from(initialCheckedSkills));
    }
  }, [radarData, userProfile.currentSkills]);

  // Load skills predictions from the API
  const loadSkillsPredictions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/skills-radar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userProfile),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch skills predictions');
      }

      const result = await response.json();
      setRadarData(result.data);
    } catch (error) {
      console.error('Error loading skills predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkillsPredictions();
  }, []);

  // Enhanced utility functions
  const getSkillIcon = (skill: string) => {
    const IconComponent = SKILL_ICONS[skill] || SKILL_ICONS.default;
    return IconComponent;
  };

  const getPriorityLevel = (importance: number) => {
    if (importance >= 8) return 'high';
    if (importance >= 5) return 'medium';
    return 'low';
  };

  const getPriorityColor = (priority: string) => {
    return PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS];
  };

  const formatSalary = (amount: number | undefined) => {
    if (!amount || isNaN(amount) || amount === 0) {
      return '1-3'; // Default salary range
    }
    return Math.round(amount / 100000).toString();
  };

  const getSafeSkillData = (skill: any) => {
    return {
      ...skill,
      avgSalaryIncrease: skill.avgSalaryIncrease || 200000, // Default ₹2L increase
      importance: skill.importance || 5,
      currentDemand: skill.currentDemand || 10,
      timeToLearn: skill.timeToLearn || '2-3 months'
    };
  };

  const toggleSkillProgress = (skill: string) => {
    setCheckedSkills(prev => {
      const newSet = new Set(prev);
      if (newSet.has(skill)) {
        newSet.delete(skill);
      } else {
        newSet.add(skill);
      }
      return newSet;
    });
  };

  const calculateOverallProgress = () => {
    if (!radarData) return 0;
    return (checkedSkills.size / radarData.skillGaps.length) * 100;
  };

  // Enhanced roadmap data preparation
  const roadmapData = radarData?.skillGaps.map((skill, index) => {
    const safeSkill = getSafeSkillData(skill);
    return {
      ...safeSkill,
      order: index + 1,
      isCompleted: checkedSkills.has(skill.skill),
      estimatedWeeks: parseInt(safeSkill.timeToLearn.split(' ')[0]) * 4 || 12,
      category: safeSkill.importance >= 8 ? 'Critical' : safeSkill.importance >= 5 ? 'Important' : 'Beneficial'
    };
  }) || [];

  // Filter roadmap by timeframe - show skills that can be learned within the timeframe
  const getFilteredRoadmap = () => {
    const timeframeLimits = {
      '3-months': 12,
      '6-months': 24,
      '12-months': 48,
      'all': Infinity
    };
    
    const maxWeeks = timeframeLimits[selectedTimeframe as keyof typeof timeframeLimits];
    
    // Filter skills that can be learned within the timeframe (not cumulative)
    const filteredSkills = roadmapData.filter(skill => skill.estimatedWeeks <= maxWeeks);
    
    // If filtering results in too few skills, show at least the most important ones
    if (filteredSkills.length < 3 && roadmapData.length > 0) {
      return roadmapData.slice(0, Math.min(6, roadmapData.length)); // Show top 6 skills
    }
    
    return filteredSkills;
  };

  // Loading state with enhanced animation
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-6"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-xl font-medium text-gray-700 mb-2">Analyzing Real Market Data...</p>
            <p className="text-sm text-gray-500">Fetching from Google APIs, Job Market & AI Analysis</p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!radarData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">Failed to load skills analysis</p>
          <button 
            onClick={loadSkillsPredictions}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header with Progress */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl"
              >
                <Brain className="text-white w-8 h-8" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  AI Skills Roadmap
                </h1>
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-gray-600">
                    {userProfile.targetRole} • {radarData.realDataSources.googleSearchResults} trends • {radarData.realDataSources.jobPostings} jobs analyzed
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600 font-medium">Live Data</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Overall Progress</div>
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-indigo-600">
                  {Math.round(calculateOverallProgress())}%
                </div>
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${calculateOverallProgress()}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-200 w-fit">
          {[
            { id: 'roadmap', label: 'Learning Roadmap', icon: Map, color: 'indigo' },
            { id: 'courses', label: 'Learning Resources', icon: BookOpen, color: 'emerald' },
            { id: 'overview', label: 'Skills Overview', icon: BarChart3, color: 'blue' },
            { id: 'salary', label: 'Salary Impact', icon: DollarSign, color: 'green' },
            { id: 'career', label: 'Career Path', icon: TrendingUp, color: 'purple' }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r from-${tab.color}-500 to-${tab.color}-600 text-white shadow-md`
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Enhanced Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <AnimatePresence mode="wait">
          {activeTab === 'roadmap' && (
            <motion.div
              key="roadmap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Roadmap Controls */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-indigo-600" />
                    Your Personalized Learning Roadmap
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">Timeframe:</label>
                      <select 
                        value={selectedTimeframe}
                        onChange={(e) => setSelectedTimeframe(e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="3-months">Next 3 Months</option>
                        <option value="6-months">Next 6 Months</option>
                        <option value="12-months">Next 12 Months</option>
                        <option value="all">Show All</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Progress Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-900">Completed</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {(() => {
                        const completedCount = checkedSkills.size;
                        console.log('🎯 Roadmap Stats Debug:', {
                          totalSkillGaps: radarData?.skillGaps?.length || 0,
                          roadmapDataLength: roadmapData.length,
                          filteredRoadmapLength: getFilteredRoadmap().length,
                          checkedSkillsSize: completedCount,
                          checkedSkillsList: Array.from(checkedSkills),
                          selectedTimeframe,
                          userCurrentSkills: userProfile.currentSkills
                        });
                        return completedCount;
                      })()}
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Remaining</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{Math.max(0, getFilteredRoadmap().length - checkedSkills.size)}</div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-purple-900">Est. Time</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(getFilteredRoadmap().reduce((acc, skill) => acc + skill.estimatedWeeks, 0) / 4)} months
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium text-yellow-900">Salary Boost</span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-600">
                      +₹{formatSalary(getFilteredRoadmap().reduce((acc, skill) => acc + (skill.avgSalaryIncrease || 200000), 0))}L
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Roadmap Timeline */}
              <div className="space-y-4">
                {getFilteredRoadmap().map((skill, index) => {
                  const Icon = getSkillIcon(skill.skill);
                  const priority = getPriorityLevel(skill.importance);
                  const isCompleted = checkedSkills.has(skill.skill);
                  
                  return (
                    <motion.div
                      key={skill.skill}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative bg-white rounded-xl shadow-sm border-2 transition-all duration-300 ${
                        isCompleted 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'
                      }`}
                    >
                      {/* Timeline Line */}
                      {index < getFilteredRoadmap().length - 1 && (
                        <div className="absolute left-8 top-20 w-0.5 h-16 bg-gradient-to-b from-gray-300 to-transparent z-0" />
                      )}

                      <div className="relative z-10 p-6">
                        <div className="flex items-start gap-4">
                          {/* Skill Icon & Checkbox */}
                          <div className="flex flex-col items-center gap-3">
                            <motion.button
                              onClick={() => toggleSkillProgress(skill.skill)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                                isCompleted
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : 'bg-white border-gray-300 hover:border-indigo-400'
                              }`}
                            >
                              {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6 text-gray-600" />}
                            </motion.button>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              priority === 'high' ? 'bg-red-100 text-red-800' :
                              priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {skill.category}
                            </div>
                          </div>

                          {/* Skill Content */}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className={`text-xl font-semibold ${isCompleted ? 'text-green-700 line-through' : 'text-gray-900'}`}>
                                {skill.skill}
                              </h4>
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <div className="text-sm text-gray-500">Salary Impact</div>
                                  <div className="font-bold text-green-600">+₹{formatSalary(skill.avgSalaryIncrease)}L</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm text-gray-500">Time Investment</div>
                                  <div className="font-bold text-indigo-600">{skill.timeToLearn}</div>
                                </div>
                              </div>
                            </div>

                            {/* Priority & Demand Indicators */}
                            <div className="flex items-center gap-4 mb-4">
                              <div className="flex items-center gap-2">
                                <Flame className="w-4 h-4 text-red-500" />
                                <span className="text-sm text-gray-600">Priority: {skill.importance}/10</span>
                                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                                    style={{ width: `${skill.importance * 10}%` }}
                                  />
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-blue-500" />
                                <span className="text-sm text-gray-600">Market Demand: {skill.currentDemand}</span>
                              </div>
                            </div>

                            {/* Learning Path */}
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                Learning Path
                              </h5>
                              <div className="space-y-2">
                                {skill.learningPath.map((step: string, stepIndex: number) => (
                                  <div key={stepIndex} className="flex items-start gap-3">
                                    <div className="bg-indigo-100 text-indigo-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mt-0.5">
                                      {stepIndex + 1}
                                    </div>
                                    <span className="text-sm text-gray-700 flex-1">{step}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3 mt-4">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedSkill(skill)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                              >
                                View Details
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                              >
                                Find Resources
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Roadmap Summary */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Complete This Roadmap & Transform Your Career!</h3>
                    <p className="text-indigo-100">
                      Expected outcome: {radarData.careerPath.nextRole} earning ₹{Math.round(radarData.careerPath.expectedSalary / 100000)}L annually
                    </p>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/20 rounded-full p-4"
                  >
                    <Trophy className="w-8 h-8" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'courses' && (
            <motion.div
              key="courses"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Learning Resources Header */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  Comprehensive Learning Resources
                </h3>
                <p className="text-gray-600">
                  Curated learning materials from top platforms, YouTube channels, and course providers to accelerate your skill development.
                </p>
              </div>

              {/* YouTube Video Recommendations */}
              {radarData.learningRoadmap?.youtubeVideos?.map((skillVideos, index) => (
                <div key={skillVideos.skill} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Play className="w-5 h-5 text-red-600" />
                    {skillVideos.skill} - YouTube Learning Videos
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {skillVideos.videos?.slice(0, 6).map((video: any, videoIndex: number) => (
                      <motion.div
                        key={video.videoId}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: videoIndex * 0.1 }}
                        className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all duration-300 cursor-pointer"
                        onClick={() => window.open(`https://www.youtube.com/watch?v=${video.videoId}`, '_blank')}
                      >
                        <div className="relative mb-3">
                          <img 
                            src={video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                            alt={video.title}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-xs">
                            {video.duration || 'Video'}
                          </div>
                        </div>
                        <h5 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                          {video.title}
                        </h5>
                        <p className="text-sm text-gray-600 mb-2">{video.channelTitle}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{video.viewCount ? `${Math.round(video.viewCount / 1000)}K views` : 'Popular'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Course Recommendations */}
              {radarData.learningRoadmap?.recommendedCourses?.map((skillCourses, index) => (
                <div key={skillCourses.skill} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    {skillCourses.skill} - Recommended Courses
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {skillCourses.courses?.map((course: any, courseIndex: number) => (
                      <motion.div
                        key={courseIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: courseIndex * 0.1 }}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300 cursor-pointer"
                        onClick={() => window.open(course.url, '_blank')}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h5 className="font-medium text-gray-900 text-sm flex-1">{course.title}</h5>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            course.price === 'Free' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {course.price}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{course.provider}</p>
                        <div className="space-y-1 text-xs text-gray-500">
                          <div>Duration: {course.duration}</div>
                          <div>Level: {course.level}</div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs text-blue-600">View Course</span>
                          <ArrowRight className="w-4 h-4 text-blue-600" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Learning Platforms */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-600" />
                  Top Learning Platforms
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {radarData.learningRoadmap?.learningPlatforms?.map((platform: any, index: number) => (
                    <motion.div
                      key={platform.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300 cursor-pointer"
                      onClick={() => window.open(platform.url, '_blank')}
                    >
                      <h5 className="font-semibold text-gray-900 mb-2">{platform.name}</h5>
                      <p className="text-sm text-gray-600 mb-3">{platform.description}</p>
                      <div className="space-y-1 mb-3">
                        <p className="text-xs font-medium text-gray-700">Specializations:</p>
                        <div className="flex flex-wrap gap-1">
                          {platform.specialization?.slice(0, 3).map((spec: string, specIndex: number) => (
                            <span key={specIndex} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-purple-600">Visit Platform</span>
                        <ArrowRight className="w-4 h-4 text-purple-600" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Learning Tips */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
                <h4 className="text-lg font-semibold text-emerald-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Learning Success Tips
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-emerald-800">
                  <div className="space-y-2">
                    <p><strong>• Set Clear Goals:</strong> Define what you want to achieve with each skill</p>
                    <p><strong>• Practice Daily:</strong> Consistency is key to mastering new technologies</p>
                    <p><strong>• Build Projects:</strong> Apply your learning through real-world projects</p>
                  </div>
                  <div className="space-y-2">
                    <p><strong>• Join Communities:</strong> Connect with others learning the same skills</p>
                    <p><strong>• Track Progress:</strong> Monitor your advancement and celebrate milestones</p>
                    <p><strong>• Stay Updated:</strong> Technology evolves fast, keep learning new features</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Skills Radar Chart */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  Skills Demand Analysis
                </h3>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={roadmapData.slice(0, 8)}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="skill" className="text-sm" />
                      <PolarRadiusAxis angle={90} domain={[0, 10]} className="text-xs" />
                      <Radar
                        name="Importance"
                        dataKey="importance"
                        stroke="#8B5CF6"
                        fill="#8B5CF6"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Radar
                        name="Current Demand"
                        dataKey="currentDemand"
                        stroke="#06B6D4"
                        fill="#06B6D4"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                      <Tooltip />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roadmapData.slice(0, 6).map((skill, index) => {
                  const Icon = getSkillIcon(skill.skill);
                  const priority = getPriorityLevel(skill.importance);
                  
                  return (
                    <motion.div
                      key={skill.skill}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-gradient-to-br ${getPriorityColor(priority)} p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <Icon className="w-8 h-8" />
                        <div className="text-right">
                          <div className="text-2xl font-bold">{skill.importance}/10</div>
                          <div className="text-sm opacity-90">Priority</div>
                        </div>
                      </div>
                      <h4 className="text-xl font-semibold mb-2">{skill.skill}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Salary Impact:</span>
                          <span className="font-semibold">+₹{formatSalary(skill.avgSalaryIncrease)}L</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Learning Time:</span>
                          <span className="font-semibold">{skill.timeToLearn}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Market Demand:</span>
                          <span className="font-semibold">{skill.currentDemand}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'salary' && (
            <motion.div
              key="salary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Salary Comparison */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Salary Impact Analysis
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Current vs Future Salary */}
                  <div>
                    <h4 className="text-lg font-medium mb-4">Salary Progression</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: 'Current', salary: radarData.salaryPrediction.current / 100000 },
                          { name: 'With New Skills', salary: radarData.salaryPrediction.withNewSkills / 100000 }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis label={{ value: 'Salary (₹L)', angle: -90, position: 'insideLeft' }} />
                          <Tooltip formatter={(value) => [`₹${value}L`, 'Annual Salary']} />
                          <Bar dataKey="salary" fill="#10B981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Skill-wise Salary Impact */}
                  <div>
                    <h4 className="text-lg font-medium mb-4">Skill-wise Impact</h4>
                    <div className="space-y-3">
                      {roadmapData.slice(0, 5).map((skill, index) => (
                        <div key={skill.skill} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {React.createElement(getSkillIcon(skill.skill), { className: "w-5 h-5 text-indigo-600" })}
                            <span className="font-medium">{skill.skill}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-green-600 font-bold">+₹{formatSalary(skill.avgSalaryIncrease)}L</div>
                            <div className="text-xs text-gray-500">{skill.timeToLearn}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ROI Analysis */}
                <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <h4 className="text-lg font-semibold text-green-900 mb-3">Return on Investment</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        ₹{Math.round((radarData.salaryPrediction.withNewSkills - radarData.salaryPrediction.current) / 100000)}L
                      </div>
                      <div className="text-sm text-green-700">Annual Increase</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(((radarData.salaryPrediction.withNewSkills - radarData.salaryPrediction.current) / radarData.salaryPrediction.current) * 100)}%
                      </div>
                      <div className="text-sm text-green-700">Percentage Increase</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">12-18</div>
                      <div className="text-sm text-green-700">Months to Achieve</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'career' && (
            <motion.div
              key="career"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Career Path */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Your Career Progression Path
                </h3>

                {/* Current vs Next Role */}
                <div className="flex items-center justify-between mb-8 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-2">Current Target</div>
                    <div className="text-xl font-semibold text-purple-900">{userProfile.targetRole}</div>
                    <div className="text-green-600 font-bold mt-1">₹{Math.round(radarData.salaryPrediction.current / 100000)}L</div>
                  </div>
                  <ArrowRight className="w-8 h-8 text-purple-500" />
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-2">Next Role</div>
                    <div className="text-xl font-semibold text-purple-900">{radarData.careerPath.nextRole}</div>
                    <div className="text-green-600 font-bold mt-1">₹{Math.round(radarData.careerPath.expectedSalary / 100000)}L</div>
                  </div>
                </div>

                {/* Career Timeline */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Career Timeline</h4>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-purple-200"></div>
                    
                    {/* Current State */}
                    <div className="relative flex items-start gap-4 pb-6">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">Current Skills</h5>
                        <p className="text-gray-600 text-sm">{userProfile.currentSkills.join(', ')}</p>
                      </div>
                    </div>

                    {/* Learning Phase */}
                    <div className="relative flex items-start gap-4 pb-6">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">Learning Phase ({radarData.careerPath.timeline})</h5>
                        <p className="text-gray-600 text-sm">Acquire: {radarData.careerPath.requiredSkills.join(', ')}</p>
                        <div className="mt-2 w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-blue-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${(checkedSkills.size / roadmapData.length) * 100}%` }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Future Role */}
                    <div className="relative flex items-start gap-4">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">{radarData.careerPath.nextRole}</h5>
                        <p className="text-gray-600 text-sm">Target salary: ₹{Math.round(radarData.careerPath.expectedSalary / 100000)}L</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Market Insights */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h5 className="font-semibold text-blue-900 mb-2">Trending Technologies</h5>
                    <div className="space-y-1">
                      {radarData.marketInsights.trendingTechnologies.slice(0, 4).map((tech, index) => (
                        <div key={index} className="text-sm text-blue-700 flex items-center gap-2">
                          <ArrowUp className="w-3 h-3" />
                          {tech}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h5 className="font-semibold text-green-900 mb-2">High Demand Skills</h5>
                    <div className="space-y-1">
                      {radarData.marketInsights.highDemandSkills.slice(0, 4).map((skill, index) => (
                        <div key={index} className="text-sm text-green-700 flex items-center gap-2">
                          <Flame className="w-3 h-3" />
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h5 className="font-semibold text-purple-900 mb-2">Emerging Fields</h5>
                    <div className="space-y-1">
                      {radarData.marketInsights.emergingFields.slice(0, 4).map((field, index) => (
                        <div key={index} className="text-sm text-purple-700 flex items-center gap-2">
                          <Lightbulb className="w-3 h-3" />
                          {field}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Enhanced Skill Detail Modal */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedSkill(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-96 overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {React.createElement(getSkillIcon(selectedSkill.skill), { className: "w-8 h-8 text-indigo-600" })}
                  <h3 className="text-2xl font-bold text-gray-900">{selectedSkill.skill}</h3>
                </div>
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Enhanced metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border border-red-200">
                    <p className="text-sm text-red-700 font-medium">Priority Level</p>
                    <p className="text-2xl font-bold text-red-600">{selectedSkill.importance}/10</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700 font-medium">Salary Increase</p>
                    <p className="text-2xl font-bold text-green-600">+₹{formatSalary(selectedSkill.avgSalaryIncrease)}L</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700 font-medium">Time to Learn</p>
                    <p className="text-2xl font-bold text-blue-600">{selectedSkill.timeToLearn}</p>
                  </div>
                </div>

                {/* Enhanced learning path */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                    Detailed Learning Path
                  </h4>
                  <div className="space-y-3">
                    {selectedSkill.learningPath.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mt-0.5">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <span className="text-gray-800 font-medium">{step}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 mt-0.5" />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Market insights */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Market Intelligence
                  </h4>
                  <p className="text-sm text-blue-800">
                    Based on analysis of {radarData?.realDataSources.googleSearchResults} search trends and {radarData?.realDataSources.jobPostings} job postings, 
                    <strong> {selectedSkill.skill}</strong> shows high demand with current market interest score of <strong>{selectedSkill.currentDemand}</strong>.
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleSkillProgress(selectedSkill.skill)}
                    className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                      checkedSkills.has(selectedSkill.skill)
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {checkedSkills.has(selectedSkill.skill) ? 'Mark as In Progress' : 'Start Learning'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Find Courses
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
