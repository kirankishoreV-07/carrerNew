'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  UserProfile, 
  SimulationResult, 
  CareerPath, 
  CareerMilestone 
} from '@/lib/career-path-simulator';
import { 
  User, 
  Target, 
  Clock, 
  TrendingUp, 
  MapPin, 
  Briefcase, 
  Star,
  ChevronRight,
  BookOpen,
  Award,
  DollarSign,
  BarChart3,
  Lightbulb,
  Rocket,
  CheckCircle,
  AlertCircle,
  Info,
  Calendar,
  Users,
  Zap
} from 'lucide-react';

// Simple inline UI components
const Card = ({ children, className = '', ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
  <div className={`rounded-lg border bg-white text-gray-900 shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-sm text-gray-600 ${className}`}>
    {children}
  </p>
);

const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const Badge = ({ 
  children, 
  className = '', 
  variant = 'default',
  ...props 
}: { 
  children: React.ReactNode; 
  className?: string; 
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  [key: string]: any;
}) => {
  const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
  const variantClasses = {
    default: "border-transparent bg-blue-600 text-white hover:bg-blue-700",
    secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200",
    destructive: "border-transparent bg-red-600 text-white hover:bg-red-700",
    outline: "text-gray-900 border-gray-300 hover:bg-gray-50",
  };
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

interface CareerSimulatorProps {
  className?: string;
}

interface FormData {
  skills: string;
  interests: string;
  experience: string;
  education: string;
  location: string;
  preferredIndustries: string;
  careerGoals: string;
  timeHorizon: '1-year' | '3-year' | '5-year' | '10-year';
}

export default function CareerSimulator({ className }: CareerSimulatorProps) {
  const [formData, setFormData] = useState<FormData>({
    skills: '',
    interests: '',
    experience: '',
    education: '',
    location: '',
    preferredIndustries: '',
    careerGoals: '',
    timeHorizon: '3-year'
  });

  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPath, setSelectedPath] = useState<CareerPath | null>(null);
  const [activeTab, setActiveTab] = useState<'input' | 'results' | 'details'>('input');

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSimulate = async () => {
    setIsLoading(true);
    try {
      const userProfile: UserProfile = {
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        interests: formData.interests.split(',').map(s => s.trim()).filter(s => s),
        experience: formData.experience,
        education: formData.education,
        location: formData.location,
        preferredIndustries: formData.preferredIndustries.split(',').map(s => s.trim()).filter(s => s),
        careerGoals: formData.careerGoals,
        timeHorizon: formData.timeHorizon
      };

      const response = await fetch('/api/career-simulator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userProfile),
      });

      if (!response.ok) {
        throw new Error('Failed to generate career simulation');
      }

      const result = await response.json();
      setSimulationResult(result);
      setActiveTab('results');
    } catch (error) {
      console.error('Error generating simulation:', error);
      alert('Failed to generate career simulation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'Very High': return 'bg-green-500';
      case 'High': return 'bg-green-400';
      case 'Booming': return 'bg-emerald-500';
      case 'Growing': return 'bg-blue-400';
      case 'Medium': return 'bg-yellow-400';
      case 'Low': return 'bg-orange-400';
      case 'Declining': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  const getGrowthColor = (growth: string) => {
    switch (growth) {
      case 'Exponential': return 'text-green-600';
      case 'High': return 'text-green-500';
      case 'Medium': return 'text-blue-500';
      case 'Low': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  const renderInputForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            <BookOpen className="inline w-4 h-4 mr-2" />
            Current Skills (comma-separated)
          </label>
          <Input
            placeholder="e.g., JavaScript, React, Python, Data Analysis"
            value={formData.skills}
            onChange={(e) => handleInputChange('skills', e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            <Star className="inline w-4 h-4 mr-2" />
            Interests (comma-separated)
          </label>
          <Input
            placeholder="e.g., Web Development, AI/ML, Data Science"
            value={formData.interests}
            onChange={(e) => handleInputChange('interests', e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            <Briefcase className="inline w-4 h-4 mr-2" />
            Experience Level
          </label>
          <Input
            placeholder="e.g., Fresher, 1-2 years, 3-5 years"
            value={formData.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            <Award className="inline w-4 h-4 mr-2" />
            Education
          </label>
          <Input
            placeholder="e.g., B.Tech Computer Science, MBA, B.Sc Mathematics"
            value={formData.education}
            onChange={(e) => handleInputChange('education', e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            <MapPin className="inline w-4 h-4 mr-2" />
            Location
          </label>
          <Input
            placeholder="e.g., Bangalore, Mumbai, Delhi, Pune"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            <Clock className="inline w-4 h-4 mr-2" />
            Time Horizon
          </label>
          <select
            value={formData.timeHorizon}
            onChange={(e) => handleInputChange('timeHorizon', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1-year">1 Year</option>
            <option value="3-year">3 Years</option>
            <option value="5-year">5 Years</option>
            <option value="10-year">10 Years</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          <Target className="inline w-4 h-4 mr-2" />
          Preferred Industries (comma-separated, optional)
        </label>
        <Input
          placeholder="e.g., Technology, FinTech, Healthcare, E-commerce"
          value={formData.preferredIndustries}
          onChange={(e) => handleInputChange('preferredIndustries', e.target.value)}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          <Rocket className="inline w-4 h-4 mr-2" />
          Career Goals (optional)
        </label>
        <Input
          placeholder="e.g., Become a senior software engineer, Start my own company"
          value={formData.careerGoals}
          onChange={(e) => handleInputChange('careerGoals', e.target.value)}
          className="w-full"
        />
      </div>

      <Button 
        onClick={handleSimulate} 
        disabled={isLoading || !formData.skills || !formData.interests || !formData.experience}
        className="w-full py-3 text-lg"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Generating Your Career Path...
          </>
        ) : (
          <>
            <Zap className="w-5 h-5 mr-2" />
            Simulate Career Paths
          </>
        )}
      </Button>
    </div>
  );

  const renderCareerPath = (path: CareerPath, index: number) => (
    <Card 
      key={path.id} 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        selectedPath?.id === path.id ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => setSelectedPath(path)}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center">
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full mr-3">
                #{index + 1}
              </span>
              {path.title}
            </CardTitle>
            <CardDescription className="mt-2">{path.description}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{Math.round(path.matchScore)}%</div>
            <div className="text-xs text-gray-500">Match</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              Growth
            </div>
            <div className={`font-medium ${getGrowthColor(path.growthPotential)}`}>
              {path.growthPotential}
            </div>
          </div>
          <div>
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <BarChart3 className="w-4 h-4 mr-1" />
              Demand
            </div>
            <Badge className={`${getDemandColor(path.industryDemand)} text-white`}>
              {path.industryDemand}
            </Badge>
          </div>
          <div>
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <DollarSign className="w-4 h-4 mr-1" />
              Starting
            </div>
            <div className="font-medium">{path.averageStartingSalary}</div>
          </div>
          <div>
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <Clock className="w-4 h-4 mr-1" />
              Time to Ready
            </div>
            <div className="font-medium">{path.estimatedTimeToReady}</div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {path.keyCompanies.slice(0, 4).map((company, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {company}
            </Badge>
          ))}
          {path.keyCompanies.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{path.keyCompanies.length - 4} more
            </Badge>
          )}
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedPath(path);
            setActiveTab('details');
          }}
        >
          View Detailed Roadmap <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );

  const renderMilestone = (milestone: CareerMilestone, index: number) => (
    <div key={index} className="relative pl-8 pb-8">
      <div className="absolute left-0 top-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
        <div className="w-2 h-2 bg-white rounded-full"></div>
      </div>
      {index < (selectedPath?.milestones.length || 0) - 1 && (
        <div className="absolute left-3 top-6 w-0.5 h-full bg-blue-200"></div>
      )}
      
      <Card className="ml-4">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{milestone.title}</CardTitle>
              <CardDescription>{milestone.description}</CardDescription>
            </div>
            <Badge variant="outline">{milestone.timeframe}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 mr-1" />
                Expected Salary
              </div>
              <div className="text-lg font-bold text-green-600">{milestone.averageSalary}</div>
            </div>
            <div>
              <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <BarChart3 className="w-4 h-4 mr-1" />
                Market Demand
              </div>
              <Badge className={`${getDemandColor(milestone.jobMarketDemand)} text-white`}>
                {milestone.jobMarketDemand}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Skills to Acquire</h4>
              <div className="flex flex-wrap gap-2">
                {milestone.skillsToAcquire.map((skill, idx) => (
                  <Badge key={idx} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2">Recommended Projects</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                {milestone.projectsSuggestions.map((project, idx) => (
                  <li key={idx}>{project}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2">Certifications</h4>
              <div className="flex flex-wrap gap-2">
                {milestone.certifications.map((cert, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    <Award className="w-3 h-3 mr-1" />
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderResults = () => {
    if (!simulationResult) return null;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Your Personalized Career Simulation</h2>
          <p className="text-gray-600">Based on your profile, here are the top career paths for you</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {simulationResult.recommendedPaths.map((path, index) => renderCareerPath(path, index))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
                Skill Gap Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-red-600 mb-2">Critical Gaps</h4>
                  <div className="flex flex-wrap gap-2">
                    {simulationResult.skillGapAnalysis.criticalGaps.map((skill, idx) => (
                      <Badge key={idx} variant="destructive">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-green-600 mb-2">Quick Wins</h4>
                  <div className="flex flex-wrap gap-2">
                    {simulationResult.skillGapAnalysis.quickWins.map((skill, idx) => (
                      <Badge key={idx} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                Market Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-green-600 mb-2">Trending Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {simulationResult.marketInsights.trendingSkills.map((skill, idx) => (
                      <Badge key={idx} className="bg-green-100 text-green-800">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-blue-600 mb-2">Emerging Roles</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {simulationResult.marketInsights.emergingRoles.map((role, idx) => (
                      <li key={idx}>{role}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
              Your Personalized Action Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-blue-600 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Immediate Actions (30 days)
                </h4>
                <ul className="space-y-2">
                  {simulationResult.personalizedRecommendations.immediateActions.map((action, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-orange-600 mb-3 flex items-center">
                  <Target className="w-4 h-4 mr-1" />
                  Short-term Goals (3-6 months)
                </h4>
                <ul className="space-y-2">
                  {simulationResult.personalizedRecommendations.shortTermGoals.map((goal, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-purple-600 mb-3 flex items-center">
                  <Rocket className="w-4 h-4 mr-1" />
                  Long-term Strategy (1-3 years)
                </h4>
                <ul className="space-y-2">
                  {simulationResult.personalizedRecommendations.longTermStrategy.map((strategy, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{strategy}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCareerDetails = () => {
    if (!selectedPath) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => setActiveTab('results')}>
            ← Back to Results
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{selectedPath.title}</h2>
            <p className="text-gray-600">{selectedPath.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{Math.round(selectedPath.matchScore)}%</div>
              <div className="text-sm text-gray-500">Profile Match</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className={`text-lg font-bold ${getGrowthColor(selectedPath.growthPotential)}`}>
                {selectedPath.growthPotential}
              </div>
              <div className="text-sm text-gray-500">Growth Potential</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Badge className={`${getDemandColor(selectedPath.industryDemand)} text-white`}>
                {selectedPath.industryDemand}
              </Badge>
              <div className="text-sm text-gray-500 mt-2">Market Demand</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-lg font-bold text-green-600">{selectedPath.averageMidCareerSalary}</div>
              <div className="text-sm text-gray-500">Mid-Career Salary</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Top Hiring Companies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedPath.keyCompanies.map((company, idx) => (
                <Badge key={idx} variant="outline" className="text-sm px-3 py-1">
                  {company}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Career Roadmap & Milestones
            </CardTitle>
            <CardDescription>
              Your step-by-step journey to becoming a {selectedPath.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {selectedPath.milestones.map((milestone, index) => renderMilestone(milestone, index))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                Alternative Paths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {selectedPath.alternativePaths.map((path, idx) => (
                  <li key={idx} className="flex items-center">
                    <ChevronRight className="w-4 h-4 mr-2 text-gray-400" />
                    {path}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                Emerging Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {selectedPath.emergingOpportunities.map((opportunity, idx) => (
                  <li key={idx} className="flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-blue-500" />
                    {opportunity}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className={`max-w-7xl mx-auto p-6 ${className}`}>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          AI Career Path Simulator
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover personalized career paths, visualize your journey, and get AI-powered recommendations 
          for skills, projects, and growth opportunities in the Indian job market.
        </p>
      </div>

      <div className="mb-8">
        <div className="flex justify-center space-x-1 bg-gray-100 p-1 rounded-lg max-w-md mx-auto">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'input' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('input')}
          >
            <User className="w-4 h-4 mr-2 inline" />
            Profile Setup
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'results' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('results')}
            disabled={!simulationResult}
          >
            <BarChart3 className="w-4 h-4 mr-2 inline" />
            Results
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'details' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('details')}
            disabled={!selectedPath}
          >
            <Info className="w-4 h-4 mr-2 inline" />
            Roadmap
          </button>
        </div>
      </div>

      <Card className="min-h-[600px]">
        <CardContent className="p-8">
          {activeTab === 'input' && renderInputForm()}
          {activeTab === 'results' && renderResults()}
          {activeTab === 'details' && renderCareerDetails()}
        </CardContent>
      </Card>
    </div>
  );
}