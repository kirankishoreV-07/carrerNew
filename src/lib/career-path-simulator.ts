import { GoogleGenerativeAI } from '@google/generative-ai';

export interface UserProfile {
  skills: string[];
  interests: string[];
  experience: string;
  education: string;
  location: string;
  preferredIndustries: string[];
  careerGoals: string;
  timeHorizon: '1-year' | '3-year' | '5-year' | '10-year';
}

export interface CareerMilestone {
  timeframe: string;
  title: string;
  description: string;
  requiredSkills: string[];
  skillsToAcquire: string[];
  averageSalary: string;
  jobMarketDemand: 'Low' | 'Medium' | 'High' | 'Very High';
  projectsSuggestions: string[];
  certifications: string[];
  courses: string[];
}

export interface CareerPath {
  id: string;
  title: string;
  description: string;
  matchScore: number;
  growthPotential: 'Low' | 'Medium' | 'High' | 'Exponential';
  industryDemand: 'Declining' | 'Stable' | 'Growing' | 'Booming' | 'Very High' | 'High';
  averageStartingSalary: string;
  averageMidCareerSalary: string;
  keyCompanies: string[];
  milestones: CareerMilestone[];
  totalSkillGap: number;
  estimatedTimeToReady: string;
  alternativePaths: string[];
  emergingOpportunities: string[];
}

export interface SimulationResult {
  recommendedPaths: CareerPath[];
  skillGapAnalysis: {
    criticalGaps: string[];
    quickWins: string[];
    longTermSkills: string[];
  };
  marketInsights: {
    trendingSkills: string[];
    decliningSkills: string[];
    emergingRoles: string[];
    industryGrowth: Record<string, string>;
  };
  personalizedRecommendations: {
    immediateActions: string[];
    shortTermGoals: string[];
    longTermStrategy: string[];
  };
}

class CareerPathSimulator {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key not found. Please set GEMINI_API_KEY in your environment variables.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    this.model = this.genAI.getGenerativeModel({ model: modelName });
  }

  async simulateCareerPaths(userProfile: UserProfile): Promise<SimulationResult> {
    try {
      const prompt = this.buildCareerSimulationPrompt(userProfile);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseSimulationResponse(text, userProfile);
    } catch (error) {
      console.error('Error in career path simulation:', error);
      throw new Error('Failed to simulate career paths');
    }
  }

  private buildCareerSimulationPrompt(profile: UserProfile): string {
    return `
You are an expert AI career advisor specializing in the Indian job market and global opportunities. 
Analyze the following student profile and provide a comprehensive career path simulation.

STUDENT PROFILE:
- Current Skills: ${profile.skills.join(', ')}
- Interests: ${profile.interests.join(', ')}
- Experience Level: ${profile.experience}
- Education: ${profile.education}
- Location: ${profile.location}
- Preferred Industries: ${profile.preferredIndustries.join(', ')}
- Career Goals: ${profile.careerGoals}
- Time Horizon: ${profile.timeHorizon}

TASK: Generate a detailed career simulation with the following structure:

1. RECOMMENDED CAREER PATHS (Top 5):
For each path, provide:
- Path title and description
- Match score (0-100) based on profile
- Growth potential and industry demand
- Salary progression (starting to mid-career)
- Key companies hiring in India
- Detailed milestone timeline with:
  * Timeframe (6 months, 1 year, 2 years, etc.)
  * Job titles and responsibilities
  * Skills to acquire at each stage
  * Specific projects/portfolio recommendations
  * Certifications and courses
  * Expected salary ranges in INR
  * Job market demand rating

2. SKILL GAP ANALYSIS:
- Critical skills missing for top career paths
- Quick wins (skills learnable in 3-6 months)
- Long-term skills requiring 1-2 years investment
- Skills becoming obsolete to avoid

3. MARKET INSIGHTS:
- Trending skills in Indian tech market (2024-2025)
- Emerging job roles not widely known
- Industry growth predictions
- Remote work opportunities

4. PERSONALIZED ACTION PLAN:
- Immediate actions (next 30 days)
- Short-term goals (3-6 months)
- Long-term strategy (1-3 years)
- Specific learning resources and platforms
- Networking and industry engagement tips

Focus on:
- Indian job market specifics and salary ranges
- Remote/hybrid opportunities
- Startup ecosystem vs MNC paths
- Skills-based hiring trends
- AI/automation impact on careers
- Realistic timelines and expectations

Please provide detailed, actionable insights in a structured JSON format that can be parsed programmatically.
`;
  }

  private parseSimulationResponse(response: string, profile: UserProfile): SimulationResult {
    try {
      // Extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback: Parse structured text response
      return this.parseTextResponse(response, profile);
    } catch (error) {
      console.error('Error parsing simulation response:', error);
      return this.generateFallbackResponse(profile);
    }
  }

  private parseTextResponse(response: string, profile: UserProfile): SimulationResult {
    // This is a simplified parser - in a real implementation, you'd want more robust parsing
    const lines = response.split('\n').filter(line => line.trim());
    
    // Generate sample career paths based on user skills
    const samplePaths = this.generateSampleCareerPaths(profile);
    
    return {
      recommendedPaths: samplePaths,
      skillGapAnalysis: {
        criticalGaps: this.identifyCriticalGaps(profile.skills),
        quickWins: ['Communication Skills', 'Basic Programming', 'Project Management'],
        longTermSkills: ['AI/ML Expertise', 'System Design', 'Leadership']
      },
      marketInsights: {
        trendingSkills: ['Generative AI', 'Cloud Computing', 'Data Science', 'Cybersecurity'],
        decliningSkills: ['Legacy Systems', 'Manual Testing'],
        emergingRoles: ['AI Prompt Engineer', 'Sustainability Consultant', 'Remote Work Facilitator'],
        industryGrowth: {
          'Technology': 'Very High',
          'Healthcare': 'High',
          'FinTech': 'High',
          'EdTech': 'Medium'
        }
      },
      personalizedRecommendations: {
        immediateActions: [
          'Update LinkedIn profile with current skills',
          'Start a personal project portfolio',
          'Join relevant professional communities'
        ],
        shortTermGoals: [
          'Complete 2-3 online certifications',
          'Build 1-2 substantial projects',
          'Network with industry professionals'
        ],
        longTermStrategy: [
          'Specialize in emerging technologies',
          'Develop leadership and soft skills',
          'Build a strong professional brand'
        ]
      }
    };
  }

  private generateSampleCareerPaths(profile: UserProfile): CareerPath[] {
    const basePaths = [
      {
        id: 'fullstack-developer',
        title: 'Full Stack Developer',
        description: 'Build end-to-end web applications using modern technologies',
        matchScore: this.calculateMatchScore(profile.skills, ['JavaScript', 'React', 'Node.js']),
        growthPotential: 'High' as const,
        industryDemand: 'Booming' as const,
        averageStartingSalary: '₹6-12 LPA',
        averageMidCareerSalary: '₹15-30 LPA'
      },
      {
        id: 'data-scientist',
        title: 'Data Scientist',
        description: 'Extract insights from data to drive business decisions',
        matchScore: this.calculateMatchScore(profile.skills, ['Python', 'Statistics', 'Machine Learning']),
        growthPotential: 'Exponential' as const,
        industryDemand: 'Very High' as const,
        averageStartingSalary: '₹8-15 LPA',
        averageMidCareerSalary: '₹20-40 LPA'
      },
      {
        id: 'product-manager',
        title: 'Product Manager',
        description: 'Drive product strategy and coordinate cross-functional teams',
        matchScore: this.calculateMatchScore(profile.skills, ['Strategy', 'Analytics', 'Communication']),
        growthPotential: 'High' as const,
        industryDemand: 'High' as const,
        averageStartingSalary: '₹10-18 LPA',
        averageMidCareerSalary: '₹25-50 LPA'
      }
    ];

    return basePaths.map(path => ({
      ...path,
      keyCompanies: ['Google', 'Microsoft', 'Amazon', 'Flipkart', 'Swiggy', 'Zomato'],
      milestones: this.generateMilestones(path.id, profile.timeHorizon),
      totalSkillGap: Math.max(0, 100 - path.matchScore),
      estimatedTimeToReady: this.estimateTimeToReady(path.matchScore),
      alternativePaths: ['DevOps Engineer', 'Technical Architect', 'Startup Founder'],
      emergingOpportunities: ['AI Integration Specialist', 'Remote Team Lead', 'Tech Content Creator']
    }));
  }

  private generateMilestones(pathId: string, timeHorizon: string): CareerMilestone[] {
    const baseMilestones = [
      {
        timeframe: '6 months',
        title: 'Junior Developer',
        description: 'Entry-level position with mentorship',
        requiredSkills: ['Basic Programming', 'Problem Solving'],
        skillsToAcquire: ['Framework Fundamentals', 'Version Control'],
        averageSalary: '₹3-6 LPA',
        jobMarketDemand: 'High' as const,
        projectsSuggestions: ['Personal Portfolio', 'Simple CRUD App'],
        certifications: ['Google IT Support', 'FreeCodeCamp'],
        courses: ['The Complete Web Developer Course', 'Data Structures Algorithms']
      },
      {
        timeframe: '2 years',
        title: 'Mid-Level Developer',
        description: 'Independent contributor with project ownership',
        requiredSkills: ['Advanced Framework Knowledge', 'Database Design'],
        skillsToAcquire: ['System Design', 'Performance Optimization'],
        averageSalary: '₹8-15 LPA',
        jobMarketDemand: 'Very High' as const,
        projectsSuggestions: ['E-commerce Platform', 'Real-time Chat App'],
        certifications: ['AWS Solutions Architect', 'Google Cloud Professional'],
        courses: ['System Design Interview', 'Advanced React Patterns']
      }
    ];

    return baseMilestones;
  }

  private calculateMatchScore(userSkills: string[], requiredSkills: string[]): number {
    const matches = userSkills.filter(skill => 
      requiredSkills.some(req => 
        skill.toLowerCase().includes(req.toLowerCase()) || 
        req.toLowerCase().includes(skill.toLowerCase())
      )
    ).length;
    
    return Math.min(100, (matches / requiredSkills.length) * 100 + Math.random() * 20);
  }

  private identifyCriticalGaps(currentSkills: string[]): string[] {
    const allCriticalSkills = [
      'Machine Learning', 'Cloud Computing', 'System Design', 
      'Data Structures', 'Algorithms', 'API Development',
      'Database Design', 'Security Best Practices'
    ];
    
    return allCriticalSkills.filter(skill => 
      !currentSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase())
      )
    ).slice(0, 5);
  }

  private estimateTimeToReady(matchScore: number): string {
    if (matchScore >= 80) return '3-6 months';
    if (matchScore >= 60) return '6-12 months';
    if (matchScore >= 40) return '1-2 years';
    return '2-3 years';
  }

  private generateFallbackResponse(profile: UserProfile): SimulationResult {
    return {
      recommendedPaths: this.generateSampleCareerPaths(profile),
      skillGapAnalysis: {
        criticalGaps: ['System Design', 'Cloud Computing', 'Data Structures'],
        quickWins: ['Git/GitHub', 'Basic Programming', 'Communication'],
        longTermSkills: ['Machine Learning', 'Leadership', 'Architecture']
      },
      marketInsights: {
        trendingSkills: ['AI/ML', 'Cloud Computing', 'Cybersecurity', 'Data Science'],
        decliningSkills: ['Legacy Systems', 'Manual Processes'],
        emergingRoles: ['AI Engineer', 'Cloud Architect', 'Data Engineer'],
        industryGrowth: {
          'Technology': 'Very High',
          'FinTech': 'High',
          'HealthTech': 'High'
        }
      },
      personalizedRecommendations: {
        immediateActions: [
          'Create a strong LinkedIn profile',
          'Start building a portfolio',
          'Join tech communities'
        ],
        shortTermGoals: [
          'Complete relevant certifications',
          'Build 2-3 projects',
          'Network with professionals'
        ],
        longTermStrategy: [
          'Specialize in high-demand skills',
          'Develop leadership abilities',
          'Build industry expertise'
        ]
      }
    };
  }

  async analyzeSkillGap(userSkills: string[], targetRole: string): Promise<{
    missing: string[];
    recommendations: string[];
    timeline: string;
  }> {
    const prompt = `
Analyze the skill gap for someone with skills: ${userSkills.join(', ')}
Who wants to become: ${targetRole}

Provide:
1. Missing critical skills
2. Learning recommendations
3. Realistic timeline

Keep it focused on the Indian job market and actionable advice.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse the response (simplified)
      return {
        missing: ['System Design', 'Advanced Algorithms', 'Cloud Platforms'],
        recommendations: [
          'Complete System Design course',
          'Practice coding problems daily',
          'Get hands-on with AWS/GCP'
        ],
        timeline: '6-12 months with consistent practice'
      };
    } catch (error) {
      console.error('Error analyzing skill gap:', error);
      throw new Error('Failed to analyze skill gap');
    }
  }
}

export { CareerPathSimulator };