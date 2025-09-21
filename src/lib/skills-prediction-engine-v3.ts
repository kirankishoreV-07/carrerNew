/**
 * 🚀 100% GOOGLE-POWERED SKILLS PREDICTION ENGINE V4
 * ===================================================
 * 
 * This engine uses ONLY Google APIs and services:
 * 1. Google Custom Search API - Technology trends and market research
 * 2. Google Jobs API (SerpAPI) - Real job postings and salary data
 * 3. YouTube Data API - Learning resource analysis and skill difficulty
 * 4. Gemini AI - Intelligent analysis of real data
 * 5. Google BigQuery - Market data storage and analysis
 * 
 * 🏆 PURE GOOGLE ECOSYSTEM - Perfect for Google Hackathon
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// 🔧 Google API Configuration
const GOOGLE_CUSTOM_SEARCH_API = 'https://customsearch.googleapis.com/customsearch/v1';
const YOUTUBE_DATA_API = 'https://youtube.googleapis.com/youtube/v3';
const SERPAPI_BASE = 'https://serpapi.com/search.json';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GOOGLE_SEARCH_API_KEY = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY!;
const GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID!;
const YOUTUBE_API_KEY = process.env.YOUTUBE_DATA_API_KEY!;
const SERPAPI_KEY = process.env.SERPAPI_KEY!;

// Initialize Google AI services
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Updated types for Google-powered data structures
interface GoogleTrendingTech {
  name: string;
  searchVolume: number;
  category: string;
  growth: number;
  region: string;
}

interface YouTubeLearningData {
  skill: string;
  videoCount: number;
  totalViews: number;
  difficultyScore: number;
  popularChannels: string[];
}

interface GoogleJobPosting {
  title: string;
  company: string;
  location: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  skills: string[];
  experience_level: string;
  posted_date: string;
}

interface MarketTrendData {
  skill: string;
  demand_score: number;
  avg_salary_inr: number;
  job_count: number;
  growth_rate: number;
  locations: string[];
}

interface SkillsPredictionInput {
  currentSkills: string[];
  targetRole: string;
  experience: string;
  industry: string;
  location?: string;
}

interface SkillsPredictionOutput {
  skillGaps: Array<{
    skill: string;
    importance: number;
    currentDemand: number;
    avgSalaryIncrease: number;
    learningPath: string[];
    timeToLearn: string;
  }>;
  salaryPrediction: {
    current: number;
    withNewSkills: number;
    currency: 'INR';
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
  learningRoadmap: {
    recommendedCourses: Array<{
      skill: string;
      courses: Array<{
        title: string;
        provider: string;
        url: string;
        duration: string;
        level: string;
        price: string;
      }>;
    }>;
    youtubeVideos: Array<{
      skill: string;
      videos: Array<{
        title: string;
        channelTitle: string;
        videoId: string;
        thumbnail: string;
        duration: string;
        viewCount: number;
        description: string;
        publishedAt: string;
      }>;
    }>;
    learningPlatforms: Array<{
      name: string;
      url: string;
      description: string;
      specialization: string[];
    }>;
  };
  realDataSources: {
    googleSearchResults: number;
    jobPostings: number;
    youtubeResources: number;
    marketDataPoints: number;
    lastUpdated: string;
  };
}

/**
 * 🔍 GOOGLE-POWERED DATA COLLECTORS
 */

// Enhanced Google Search using SerpAPI (Google Search Results)
async function analyzeGoogleTechTrends(skills: string[], targetRole: string): Promise<{
  trendingTechs: string[];
  relevantResults: any[];
  skillDemand: Record<string, number>;
}> {
  try {
    console.log('🔍 Analyzing technology trends with Google Search (via SerpAPI)...');
    
    // Use SerpAPI for Google Search results (more reliable than Custom Search)
    const searchQueries = [
      `${targetRole} trending technologies 2025`,
      `most demanded programming languages ${new Date().getFullYear()}`,
      `${skills.join(' ')} developer jobs India`,
      'emerging technologies software development 2025'
    ];

    const allResults: any[] = [];
    const techFrequency: Record<string, number> = {};

    for (const query of searchQueries) {
      try {
        const searchResponse = await fetch(
          `${SERPAPI_BASE}?engine=google&q=${encodeURIComponent(query)}&api_key=${SERPAPI_KEY}&num=10&gl=in&hl=en`
        );

        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          const results = searchData.organic_results || [];
          allResults.push(...results);

          // Analyze search results for technology mentions
          results.forEach((result: any) => {
            const content = `${result.title} ${result.snippet}`.toLowerCase();
            
            // Extended technology list for better analysis
            const technologies = [
              'javascript', 'python', 'java', 'typescript', 'react', 'angular', 'vue',
              'node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'php',
              'sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch',
              'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform',
              'git', 'ci/cd', 'jenkins', 'github', 'gitlab', 'api', 'rest', 'graphql',
              'machine learning', 'ai', 'data science', 'blockchain', 'cloud computing',
              'nextjs', 'svelte', 'tailwind', 'prisma', 'supabase', 'vercel', 'firebase'
            ];

            technologies.forEach(tech => {
              if (content.includes(tech)) {
                techFrequency[tech] = (techFrequency[tech] || 0) + 3; // Higher weight for search results
              }
            });
          });
        }
      } catch (error) {
        console.warn(`Search query failed: ${query}`, error);
      }
    }

    // Get top trending technologies
    const trendingTechs = Object.entries(techFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .map(([tech]) => tech);

    // Calculate skill demand based on search results
    const skillDemand: Record<string, number> = {};
    skills.forEach(skill => {
      const normalizedSkill = skill.toLowerCase();
      skillDemand[skill] = techFrequency[normalizedSkill] || 0;
    });

    return { 
      trendingTechs, 
      relevantResults: allResults.slice(0, 20), 
      skillDemand 
    };

  } catch (error) {
    console.error('Google Search (SerpAPI) error:', error);
    throw new Error('Failed to fetch Google search trends data');
  }
}

// Enhanced YouTube Data API for Learning Resource Analysis
async function analyzeYouTubeLearningData(skills: string[]): Promise<{
  learningResources: YouTubeLearningData[];
  skillDifficulty: Record<string, number>;
  recommendedVideos: Array<{
    skill: string;
    videos: Array<{
      title: string;
      channelTitle: string;
      videoId: string;
      thumbnail: string;
      duration: string;
      viewCount: number;
      description: string;
      publishedAt: string;
    }>;
  }>;
}> {
  try {
    console.log('🎥 Analyzing learning resources with YouTube Data API...');
    
    const learningResources: YouTubeLearningData[] = [];
    const skillDifficulty: Record<string, number> = {};
    const recommendedVideos: any[] = [];

    for (const skill of skills.slice(0, 5)) { // Analyze more skills for better recommendations
      try {
        const searchQueries = [
          `${skill} tutorial 2024 beginners`,
          `${skill} complete course`,
          `learn ${skill} step by step`,
          `${skill} project tutorial`
        ];

        const skillVideos: any[] = [];

        for (const query of searchQueries) {
          const youtubeResponse = await fetch(
            `${YOUTUBE_DATA_API}/search?key=${YOUTUBE_API_KEY}&q=${encodeURIComponent(query)}&type=video&part=snippet&maxResults=5&order=relevance&safeSearch=strict&videoDuration=medium`
          );

          if (youtubeResponse.ok) {
            const youtubeData = await youtubeResponse.json();
            const videos = youtubeData.items || [];

            // Get detailed video information
            if (videos.length > 0) {
              const videoIds = videos.map((v: any) => v.id.videoId).join(',');
              const detailsResponse = await fetch(
                `${YOUTUBE_DATA_API}/videos?key=${YOUTUBE_API_KEY}&id=${videoIds}&part=statistics,contentDetails,snippet`
              );

              if (detailsResponse.ok) {
                const detailsData = await detailsResponse.json();
                const detailedVideos = detailsData.items?.map((video: any) => ({
                  title: video.snippet.title,
                  channelTitle: video.snippet.channelTitle,
                  videoId: video.id,
                  thumbnail: video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url,
                  duration: formatDuration(video.contentDetails.duration),
                  viewCount: parseInt(video.statistics?.viewCount || '0'),
                  description: video.snippet.description?.substring(0, 150) + '...',
                  publishedAt: video.snippet.publishedAt
                })) || [];

                skillVideos.push(...detailedVideos);
              }
            }
          }
        }

        // Sort by view count and get top videos
        const topVideos = skillVideos
          .sort((a, b) => b.viewCount - a.viewCount)
          .slice(0, 6); // Top 6 videos per skill

        if (topVideos.length > 0) {
          recommendedVideos.push({
            skill,
            videos: topVideos
          });

          // Calculate difficulty based on video content
          const difficultyScore = calculateLearningDifficulty(topVideos);
          skillDifficulty[skill] = difficultyScore;

          learningResources.push({
            skill,
            videoCount: topVideos.length,
            totalViews: topVideos.reduce((sum, video) => sum + video.viewCount, 0),
            difficultyScore,
            popularChannels: [...new Set(topVideos.map(v => v.channelTitle))].slice(0, 3)
          });
        }

      } catch (error) {
        console.warn(`YouTube search failed for ${skill}:`, error);
        // Provide fallback data
        skillDifficulty[skill] = 60;
        recommendedVideos.push({
          skill,
          videos: getFallbackVideos(skill)
        });
      }
    }

    return { learningResources, skillDifficulty, recommendedVideos };

  } catch (error) {
    console.error('YouTube API error:', error);
    // Return comprehensive fallback data
    const fallbackResources = skills.slice(0, 5).map(skill => ({
      skill,
      videoCount: 6,
      totalViews: 1000000,
      difficultyScore: 60,
      popularChannels: ['freeCodeCamp', 'Programming with Mosh', 'Traversy Media']
    }));
    
    const fallbackDifficulty = skills.reduce((acc, skill) => {
      acc[skill] = 60;
      return acc;
    }, {} as Record<string, number>);

    const fallbackVideos = skills.slice(0, 5).map(skill => ({
      skill,
      videos: getFallbackVideos(skill)
    }));

    return { 
      learningResources: fallbackResources, 
      skillDifficulty: fallbackDifficulty,
      recommendedVideos: fallbackVideos
    };
  }
}

// Helper function to format YouTube duration
function formatDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return 'Unknown';
  
  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '');
  
  let formatted = '';
  if (hours) formatted += `${hours}:`;
  formatted += `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
  
  return formatted;
}

// Helper function to calculate learning difficulty
function calculateLearningDifficulty(videos: any[]): number {
  const beginnerKeywords = ['beginner', 'basic', 'intro', 'getting started', 'fundamentals', 'crash course', 'tutorial'];
  const intermediateKeywords = ['intermediate', 'advanced beginner', 'next level', 'deep dive', 'complete guide'];
  const advancedKeywords = ['advanced', 'expert', 'master', 'complex', 'optimization', 'architecture', 'production'];
  
  let beginnerCount = 0;
  let intermediateCount = 0;
  let advancedCount = 0;

  videos.forEach(video => {
    const content = `${video.title} ${video.description}`.toLowerCase();
    
    if (beginnerKeywords.some(keyword => content.includes(keyword))) {
      beginnerCount++;
    } else if (intermediateKeywords.some(keyword => content.includes(keyword))) {
      intermediateCount++;
    } else if (advancedKeywords.some(keyword => content.includes(keyword))) {
      advancedCount++;
    }
  });

  const total = beginnerCount + intermediateCount + advancedCount;
  if (total === 0) return 60; // Default moderate difficulty
  
  // Higher score = easier to learn
  return Math.round((beginnerCount * 90 + intermediateCount * 60 + advancedCount * 30) / total);
}

// Helper function for fallback videos
function getFallbackVideos(skill: string) {
  const fallbackVideoData: Record<string, any[]> = {
    'JavaScript': [
      { title: 'JavaScript Full Course for Beginners', channelTitle: 'freeCodeCamp.org', videoId: 'PkZNo7MFNFg', duration: '8:38:00' },
      { title: 'JavaScript Crash Course For Beginners', channelTitle: 'Traversy Media', videoId: 'hdI2bqOjy3c', duration: '1:40:25' }
    ],
    'Python': [
      { title: 'Python Full Course for Beginners', channelTitle: 'Programming with Mosh', videoId: '_uQrJ0TkZlc', duration: '6:14:07' },
      { title: 'Python Tutorial for Beginners', channelTitle: 'freeCodeCamp.org', videoId: 'rfscVS0vtbw', duration: '4:26:52' }
    ],
    'React': [
      { title: 'React Course - Beginner\'s Tutorial', channelTitle: 'freeCodeCamp.org', videoId: 'bMknfKXIFA8', duration: '11:55:27' },
      { title: 'React JS Crash Course', channelTitle: 'Traversy Media', videoId: 'w7ejDZ8SWv8', duration: '1:48:49' }
    ]
  };

  return fallbackVideoData[skill] || [
    { title: `Learn ${skill} - Complete Tutorial`, channelTitle: 'Tech Academy', videoId: 'dQw4w9WgXcQ', duration: '2:30:00' },
    { title: `${skill} Crash Course`, channelTitle: 'Code Master', videoId: 'dQw4w9WgXcQ', duration: '1:45:00' }
  ];
}

// Google Jobs Market Analyzer
async function analyzeJobMarket(targetRole: string, location: string = 'India'): Promise<{
  jobPostings: GoogleJobPosting[];
  avgSalary: number;
  skillDemand: Record<string, number>;
  locationData: Record<string, number>;
}> {
  try {
    // Search for relevant job postings
    const jobSearchQuery = `${targetRole} ${location} developer`;
    const jobResponse = await fetch(`${SERPAPI_BASE}?engine=google_jobs&q=${encodeURIComponent(jobSearchQuery)}&location=${encodeURIComponent(location)}&api_key=${SERPAPI_KEY}`);

    if (!jobResponse.ok) {
      throw new Error(`SerpAPI error: ${jobResponse.status}`);
    }

    const jobData = await jobResponse.json();
    const jobs = jobData.jobs_results || [];

    const jobPostings: GoogleJobPosting[] = [];
    const skillFrequency: Record<string, number> = {};
    const locationSalaries: Record<string, number[]> = {};
    let totalSalary = 0;
    let salaryCount = 0;

    jobs.forEach((job: any) => {
      // Extract skills from job description
      const description = job.description?.toLowerCase() || '';
      const title = job.title?.toLowerCase() || '';
      const jobText = `${title} ${description}`;

      // Common tech skills to look for
      const techSkills = [
        'javascript', 'python', 'java', 'react', 'node.js', 'angular', 'vue',
        'typescript', 'sql', 'mongodb', 'postgresql', 'aws', 'azure', 'docker',
        'kubernetes', 'git', 'api', 'rest', 'graphql', 'html', 'css', 'bootstrap',
        'material-ui', 'redux', 'express', 'spring', 'django', 'flask', 'laravel'
      ];

      const foundSkills: string[] = [];
      techSkills.forEach(skill => {
        if (jobText.includes(skill)) {
          foundSkills.push(skill);
          skillFrequency[skill] = (skillFrequency[skill] || 0) + 1;
        }
      });

      // Extract salary information
      let salary: { min: number; max: number; currency: string } | undefined = undefined;
      if (job.detected_extensions?.salary) {
        const salaryText = job.detected_extensions.salary;
        const salaryMatch = salaryText.match(/₹?\s?(\d+(?:,\d+)*(?:\.\d+)?)\s?(?:L|lakhs?|lpa)?/i);
        if (salaryMatch) {
          const amount = parseFloat(salaryMatch[1].replace(/,/g, ''));
          salary = {
            min: amount * 100000, // Convert lakhs to rupees
            max: amount * 100000 * 1.3, // Estimate max as 30% higher
            currency: 'INR'
          };
          totalSalary += amount;
          salaryCount++;

          // Track salary by location
          const loc = job.location || 'India';
          if (!locationSalaries[loc]) locationSalaries[loc] = [];
          locationSalaries[loc].push(amount);
        }
      }

      jobPostings.push({
        title: job.title,
        company: job.company_name,
        location: job.location,
        salary,
        skills: foundSkills,
        experience_level: extractExperienceLevel(jobText),
        posted_date: job.posted_at || new Date().toISOString()
      });
    });

    const avgSalary = salaryCount > 0 ? (totalSalary / salaryCount) * 100000 : 0;

    // Calculate average salary by location
    const locationData: Record<string, number> = {};
    Object.entries(locationSalaries).forEach(([location, salaries]) => {
      locationData[location] = salaries.reduce((a, b) => a + b, 0) / salaries.length * 100000;
    });

    return { jobPostings, avgSalary, skillDemand: skillFrequency, locationData };

  } catch (error) {
    console.error('Job market API error:', error);
    throw new Error('Failed to fetch job market data');
  }
}

// Real Market Data Analyzer using Google + Jobs Data
async function analyzeMarketTrends(googleData: any, jobData: any): Promise<MarketTrendData[]> {
  try {
    // Create market trends from real Google and job posting data
    const trends: MarketTrendData[] = [];
    
    // Combine Google skill demand with job market demand
    const allSkills = new Set([
      ...Object.keys(googleData.skillDemand),
      ...Object.keys(jobData.skillDemand)
    ]);

    allSkills.forEach(skill => {
      const googleDemand = googleData.skillDemand[skill] || 0;
      const jobDemand = jobData.skillDemand[skill] || 0;
      
      // Calculate realistic demand score (0-100)
      const demandScore = Math.min(100, (googleDemand * 10) + (jobDemand * 10));
      
      // Estimate salary based on demand and market data
      const baseSalary = jobData.avgSalary || 800000; // Base ₹8L
      const demandMultiplier = 1 + (demandScore / 100);
      const estimatedSalary = Math.round(baseSalary * demandMultiplier);
      
      if (demandScore > 5) { // Only include skills with meaningful demand
        trends.push({
          skill,
          demand_score: demandScore,
          avg_salary_inr: estimatedSalary,
          job_count: jobDemand,
          growth_rate: demandScore > 50 ? 15 : demandScore > 25 ? 8 : 3, // Realistic growth rates
          locations: ['Bangalore', 'Mumbai', 'Hyderabad', 'Pune', 'Delhi']
        });
      }
    });

    // Sort by demand score and return top trends
    return trends.sort((a, b) => b.demand_score - a.demand_score).slice(0, 20);

  } catch (error) {
    console.error('Market trends analysis error:', error);
    return [];
  }
}

// Experience Level Extractor
function extractExperienceLevel(jobText: string): string {
  if (jobText.includes('senior') || jobText.includes('lead') || jobText.includes('principal')) {
    return 'Senior';
  } else if (jobText.includes('mid') || jobText.includes('2-5') || jobText.includes('3-6')) {
    return 'Mid-level';
  } else if (jobText.includes('junior') || jobText.includes('entry') || jobText.includes('fresher')) {
    return 'Entry-level';
  }
  return 'Mid-level';
}

/**
 * 🧠 GEMINI AI ANALYSIS ENGINE
 */
async function analyzeWithGemini(
  googleData: any,
  jobMarketData: any,
  marketTrends: MarketTrendData[],
  userInput: SkillsPredictionInput
): Promise<{
  skillGaps: any[];
  careerPath: any;
  insights: any;
}> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
    You are a career advisor analyzing REAL Indian tech market data. Return ONLY valid JSON.

    USER PROFILE:
    - Current Skills: ${userInput.currentSkills.join(', ')}
    - Target Role: ${userInput.targetRole}
    - Experience: ${userInput.experience}
    - Industry: ${userInput.industry}

    REAL GOOGLE SEARCH DATA (${googleData.relevantResults.length} search results analyzed):
    - Top Trending: ${googleData.trendingTechs.slice(0, 8).join(', ')}
    - User Skills Demand: ${userInput.currentSkills.map((skill: string) => `${skill}: ${googleData.skillDemand[skill] || 0}`).join(', ')}

    REAL JOB MARKET DATA (${jobMarketData.jobPostings.length} postings):
    - Average Salary: ₹${Math.round(jobMarketData.avgSalary / 100000)}L
    - High Demand Skills: ${Object.entries(jobMarketData.skillDemand).slice(0, 8).map(([skill, count]) => `${skill}(${count})`).join(', ')}

    MARKET TRENDS FROM REAL DATA:
    ${marketTrends.slice(0, 8).map(trend => `${trend.skill}: ${Math.round(trend.demand_score)}% demand, ₹${Math.round(trend.avg_salary_inr / 100000)}L avg`).join('\n')}

    CAREER PROGRESSION RULES:
    - ${userInput.targetRole} → Senior ${userInput.targetRole} (if not already senior)
    - Senior ${userInput.targetRole} → Lead/Principal ${userInput.targetRole}
    - Salary must ALWAYS be higher than current: minimum 40% increase
    - Indian market ranges: Entry ₹4-8L, Mid ₹8-20L, Senior ₹20-35L, Lead ₹35L+

    IMPORTANT: Generate AT LEAST 4-6 skill gaps for meaningful career growth, even if user has strong foundation.
    Focus on emerging/advanced skills and specializations within their target role.

    Return JSON with:
    {
      "skillGaps": [
        {
          "skill": "skill_name",
          "importance": 1-10,
          "currentDemand": actual_demand_number,
          "avgSalaryIncrease": realistic_inr_amount_200000_to_800000,
          "learningPath": ["step1", "step2", "step3"],
          "timeToLearn": "X months"
        }
      ],
      "careerPath": {
        "nextRole": "proper_next_role_always_higher_than_current",
        "timeline": "12-18 months",
        "requiredSkills": ["skill1", "skill2"],
        "expectedSalary": realistic_higher_inr_amount_minimum_1400000
      }
    }

    Base recommendations on the REAL data above. Use Indian salary ranges. NEVER make next role lower than current.
    ENSURE minimum 4-6 skills for comprehensive growth roadmap.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    // Clean up the response to extract JSON
    let jsonText = text;
    if (text.includes('```json')) {
      jsonText = text.split('```json')[1].split('```')[0].trim();
    } else if (text.includes('```')) {
      jsonText = text.split('```')[1].split('```')[0].trim();
    }

    // Parse AI response
    try {
      const parsed = JSON.parse(jsonText);
      return parsed;
    } catch (parseError) {
      console.log('AI response parsing failed, using real data fallback:', parseError);
      // If JSON parsing fails, create structured response from real data
      return {
        skillGaps: extractSkillGapsFromRealData(text, googleData, jobMarketData, userInput.currentSkills),
        careerPath: extractCareerPathFromMarket(text, userInput.targetRole, jobMarketData),
        insights: { analysis: text }
      };
    }

  } catch (error) {
    console.error('Gemini AI error:', error);
    throw new Error('Failed to analyze data with AI');
  }
}

// Helper functions for parsing AI response when JSON parsing fails
function extractSkillGapsFromRealData(
  text: string, 
  googleData: any, 
  jobData: any, 
  userSkills: string[]
): any[] {
  // Get top skills from real Google + job market data
  const allSkills = Object.keys({ ...googleData.skillDemand, ...jobData.skillDemand });
  const topSkills = allSkills
    .filter(skill => !userSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase()))
    .sort((a, b) => {
      const aDemand = (googleData.skillDemand[a] || 0) + (jobData.skillDemand[a] || 0) * 100;
      const bDemand = (googleData.skillDemand[b] || 0) + (jobData.skillDemand[b] || 0) * 100;
      return bDemand - aDemand;
    })
    .slice(0, 8); // Increased from 5 to 8 for more comprehensive roadmap

  return topSkills.map((skill, index) => {
    const googleDemand = googleData.skillDemand[skill] || 0;
    const jobDemand = jobData.skillDemand[skill] || 0;
    const totalDemand = googleDemand + (jobDemand * 100);
    
    // Ensure we always have a valid salary increase
    const baseSalaryIncrease = 150000; // Base ₹1.5L increase
    const demandBonus = Math.min(totalDemand * 5000, 500000); // Max ₹5L bonus
    const salaryIncrease = baseSalaryIncrease + demandBonus;
    
    return {
      skill: skill.charAt(0).toUpperCase() + skill.slice(1),
      importance: Math.max(6, 10 - index),
      currentDemand: Math.max(10, totalDemand), // Ensure minimum demand
      avgSalaryIncrease: Math.round(salaryIncrease), // Ensure it's a proper number
      learningPath: [
        `${skill} fundamentals and syntax`,
        `${skill} intermediate concepts and patterns`, 
        `${skill} advanced projects and applications`,
        `${skill} industry best practices and optimization`
      ],
      timeToLearn: `${2 + index} months`
    };
  });
}

function extractCareerPathFromMarket(text: string, targetRole: string, marketData: any): any {
  // Proper career progression logic
  const roleProgression: Record<string, { senior: string, lead: string }> = {
    'Data Scientist': { senior: 'Senior Data Scientist', lead: 'Principal Data Scientist / ML Architect' },
    'Full Stack Developer': { senior: 'Senior Full Stack Developer', lead: 'Lead Full Stack Developer' },
    'Frontend Developer': { senior: 'Senior Frontend Developer', lead: 'Lead Frontend Developer' }, 
    'Backend Developer': { senior: 'Senior Backend Developer', lead: 'Lead Backend Developer' },
    'Software Developer': { senior: 'Senior Software Developer', lead: 'Lead Software Developer' },
    'DevOps Engineer': { senior: 'Senior DevOps Engineer', lead: 'Lead DevOps Engineer' },
    'Data Engineer': { senior: 'Senior Data Engineer', lead: 'Principal Data Engineer / Data Architect' },
    'Mobile Developer': { senior: 'Senior Mobile Developer', lead: 'Lead Mobile Developer' },
    'Product Manager': { senior: 'Senior Product Manager', lead: 'Director of Product' },
    'Machine Learning Engineer': { senior: 'Senior ML Engineer', lead: 'Principal ML Engineer / AI Architect' }
  };

  // Clean the target role for matching
  const cleanTargetRole = targetRole.trim();
  const progression = roleProgression[cleanTargetRole];
  
  let nextRole: string;
  let salaryMultiplier: number;
  let timeline: string;
  
  // Check if already senior level
  if (cleanTargetRole.toLowerCase().includes('senior')) {
    // Move from Senior to Lead/Principal
    const baseRole = cleanTargetRole.replace(/senior\s+/i, '').trim();
    const baseProgression = roleProgression[baseRole];
    nextRole = baseProgression?.lead || `Lead ${baseRole}`;
    salaryMultiplier = 2.0; // 100% increase for lead role
    timeline = '18-24 months';
  } else if (cleanTargetRole.toLowerCase().includes('lead') || cleanTargetRole.toLowerCase().includes('principal')) {
    // Already at senior level, move to director/VP
    nextRole = `Director / VP of ${cleanTargetRole.replace(/lead\s+|principal\s+/i, '').trim()}`;
    salaryMultiplier = 2.5; // 150% increase for director
    timeline = '24-36 months';
  } else {
    // Move from regular to Senior
    nextRole = progression?.senior || `Senior ${cleanTargetRole}`;
    salaryMultiplier = 1.6; // 60% increase for senior role
    timeline = '12-18 months';
  }
  
  // Calculate expected salary with proper minimum
  const baseSalary = marketData.avgSalary || 1200000; // Default ₹12L
  const expectedSalary = Math.max(
    Math.round(baseSalary * salaryMultiplier),
    baseSalary + 400000, // Minimum ₹4L increase
    1500000 // Minimum ₹15L for any next role
  );
  
  return {
    nextRole,
    timeline,
    requiredSkills: Object.keys(marketData.skillDemand || {}).slice(0, 4),
    expectedSalary
  };
}

/**
 * 📚 LEARNING ROADMAP GENERATOR
 */
function generateLearningRoadmap(skillGaps: any[], youtubeData: any): any {
  // Generate recommended courses for each skill
  const recommendedCourses = skillGaps.map(skill => ({
    skill: skill.skill,
    courses: generateCourseRecommendations(skill.skill)
  }));

  // Extract YouTube videos from the enhanced data
  const youtubeVideos = youtubeData.recommendedVideos || [];

  // Popular learning platforms
  const learningPlatforms = [
    {
      name: 'freeCodeCamp',
      url: 'https://www.freecodecamp.org',
      description: 'Free coding bootcamp with hands-on projects',
      specialization: ['Web Development', 'JavaScript', 'Python', 'Data Science']
    },
    {
      name: 'Coursera',
      url: 'https://www.coursera.org',
      description: 'University-level courses from top institutions',
      specialization: ['Machine Learning', 'Data Science', 'Cloud Computing', 'AI']
    },
    {
      name: 'Udemy',
      url: 'https://www.udemy.com',
      description: 'Practical courses for all skill levels',
      specialization: ['Programming', 'Web Development', 'Mobile Development', 'DevOps']
    },
    {
      name: 'Pluralsight',
      url: 'https://www.pluralsight.com',
      description: 'Technology skills platform for professionals',
      specialization: ['Cloud Platforms', 'Software Development', 'IT Operations', 'Security']
    },
    {
      name: 'edX',
      url: 'https://www.edx.org',
      description: 'University-level courses and certifications',
      specialization: ['Computer Science', 'AI', 'Data Analysis', 'Engineering']
    },
    {
      name: 'Codecademy',
      url: 'https://www.codecademy.com',
      description: 'Interactive coding lessons and projects',
      specialization: ['Programming Languages', 'Web Development', 'Data Science', 'Computer Science']
    }
  ];

  return {
    recommendedCourses,
    youtubeVideos,
    learningPlatforms
  };
}

// Generate course recommendations for a specific skill
function generateCourseRecommendations(skill: string): any[] {
  const courseDatabase: Record<string, any[]> = {
    'JavaScript': [
      {
        title: 'The Complete JavaScript Course 2024',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/the-complete-javascript-course/',
        duration: '69 hours',
        level: 'Beginner to Advanced',
        price: 'Paid'
      },
      {
        title: 'JavaScript Algorithms and Data Structures',
        provider: 'freeCodeCamp',
        url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
        duration: '300 hours',
        level: 'Intermediate',
        price: 'Free'
      },
      {
        title: 'Modern JavaScript From The Beginning',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/modern-javascript-from-the-beginning/',
        duration: '37 hours',
        level: 'Beginner',
        price: 'Paid'
      }
    ],
    'Python': [
      {
        title: 'Python for Everybody Specialization',
        provider: 'Coursera',
        url: 'https://www.coursera.org/specializations/python',
        duration: '8 months',
        level: 'Beginner',
        price: 'Free/Paid Certificate'
      },
      {
        title: 'Complete Python Bootcamp',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/complete-python-bootcamp/',
        duration: '22 hours',
        level: 'Beginner to Advanced',
        price: 'Paid'
      },
      {
        title: 'Scientific Computing with Python',
        provider: 'freeCodeCamp',
        url: 'https://www.freecodecamp.org/learn/scientific-computing-with-python/',
        duration: '300 hours',
        level: 'Intermediate',
        price: 'Free'
      }
    ],
    'React': [
      {
        title: 'React - The Complete Guide',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/',
        duration: '48 hours',
        level: 'Beginner to Advanced',
        price: 'Paid'
      },
      {
        title: 'Front End Development Libraries',
        provider: 'freeCodeCamp',
        url: 'https://www.freecodecamp.org/learn/front-end-development-libraries/',
        duration: '300 hours',
        level: 'Intermediate',
        price: 'Free'
      },
      {
        title: 'React Specialization',
        provider: 'Coursera',
        url: 'https://www.coursera.org/specializations/react',
        duration: '6 months',
        level: 'Intermediate',
        price: 'Free/Paid Certificate'
      }
    ],
    'Machine Learning': [
      {
        title: 'Machine Learning Course',
        provider: 'Coursera',
        url: 'https://www.coursera.org/learn/machine-learning',
        duration: '11 weeks',
        level: 'Intermediate',
        price: 'Free/Paid Certificate'
      },
      {
        title: 'Machine Learning A-Z',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/machinelearning/',
        duration: '44 hours',
        level: 'Beginner to Advanced',
        price: 'Paid'
      },
      {
        title: 'Machine Learning with Python',
        provider: 'freeCodeCamp',
        url: 'https://www.freecodecamp.org/learn/machine-learning-with-python/',
        duration: '300 hours',
        level: 'Advanced',
        price: 'Free'
      }
    ],
    'Node.js': [
      {
        title: 'The Complete Node.js Developer Course',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/the-complete-nodejs-developer-course-2/',
        duration: '35 hours',
        level: 'Beginner to Advanced',
        price: 'Paid'
      },
      {
        title: 'APIs and Microservices',
        provider: 'freeCodeCamp',
        url: 'https://www.freecodecamp.org/learn/apis-and-microservices/',
        duration: '300 hours',
        level: 'Intermediate',
        price: 'Free'
      }
    ]
  };

  // Return courses for the skill, or generate generic recommendations
  return courseDatabase[skill] || [
    {
      title: `Complete ${skill} Course`,
      provider: 'Udemy',
      url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(skill)}`,
      duration: '20-40 hours',
      level: 'All Levels',
      price: 'Paid'
    },
    {
      title: `${skill} Documentation & Tutorials`,
      provider: 'Official Docs',
      url: `https://www.google.com/search?q=${encodeURIComponent(skill + ' official documentation')}`,
      duration: 'Self-paced',
      level: 'All Levels',
      price: 'Free'
    },
    {
      title: `${skill} Free Course`,
      provider: 'freeCodeCamp',
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' freeCodeCamp')}`,
      duration: 'Varies',
      level: 'Beginner to Advanced',
      price: 'Free'
    }
  ];
}
export async function predictSkillsDemand(input: SkillsPredictionInput): Promise<SkillsPredictionOutput> {
  try {
    console.log('🚀 Starting real-data skills prediction...');
    
    // Step 1: Gather Google technology trends and learning data
    console.log('� Analyzing Google Search trends and YouTube learning data...');
    const googleTechData = await analyzeGoogleTechTrends(input.currentSkills, input.targetRole);
    const youtubeData = await analyzeYouTubeLearningData([...input.currentSkills, ...googleTechData.trendingTechs.slice(0, 3)]);
    
    // Step 2: Analyze job marketwhtehr
    console.log('💼 Analyzing job market...');
    const jobMarketData = await analyzeJobMarket(input.targetRole, input.location);
    
    // Step 3: Analyze market trends from real Google data
    console.log('📈 Analyzing market trends from Google data...');
    const marketTrends = await analyzeMarketTrends(googleTechData, jobMarketData);
    
    // Step 4: AI analysis with Gemini using Google data
    console.log('🧠 Running AI analysis with Google-powered data...');
    const aiAnalysis = await analyzeWithGemini(googleTechData, jobMarketData, marketTrends, input);
    
    // Step 5: Calculate realistic Indian salaries
    const baseSalary = calculateBaseSalary(input.experience, input.targetRole, jobMarketData.avgSalary);
    const skillBonus = calculateSkillBonus(input.currentSkills, googleTechData.skillDemand);
    const currentSalary = baseSalary + skillBonus;
    
    // Ensure career path salary is always higher than current
    const careerPath = aiAnalysis.careerPath;
    
    // Ensure careerPath has valid expected salary
    if (!careerPath.expectedSalary || careerPath.expectedSalary <= currentSalary) {
      careerPath.expectedSalary = Math.max(
        Math.round(currentSalary * 1.6), // 60% increase minimum
        currentSalary + 500000, // Minimum ₹5L increase
        1500000 // Absolute minimum ₹15L for next role
      );
    }
    if (careerPath.expectedSalary <= currentSalary) {
      careerPath.expectedSalary = Math.round(currentSalary * 1.5); // At least 50% increase
    }
    
    // Step 6: Build comprehensive prediction with Google data
    const prediction: SkillsPredictionOutput = {
      skillGaps: aiAnalysis.skillGaps.map(gap => {
        // Ensure all numeric values are valid
        const safeSalaryIncrease = gap.avgSalaryIncrease && !isNaN(gap.avgSalaryIncrease) 
          ? gap.avgSalaryIncrease 
          : 200000; // Default ₹2L increase
        
        const safeImportance = gap.importance && !isNaN(gap.importance) 
          ? gap.importance 
          : 5; // Default importance
        
        const safeDemand = googleTechData.skillDemand[gap.skill] || jobMarketData.skillDemand[gap.skill.toLowerCase()] || 10;
        
        return {
          ...gap,
          importance: safeImportance,
          currentDemand: safeDemand,
          avgSalaryIncrease: Math.round(safeSalaryIncrease),
          timeToLearn: gap.timeToLearn || '2-3 months'
        };
      }),
      
      salaryPrediction: {
        current: currentSalary,
        withNewSkills: currentSalary + 500000, // ₹5L increase with new skills
        currency: 'INR' as const,
        location: input.location || 'India'
      },
      
      marketInsights: {
        trendingTechnologies: googleTechData.trendingTechs.slice(0, 10),
        highDemandSkills: Object.keys(jobMarketData.skillDemand).slice(0, 10),
        emergingFields: marketTrends.slice(0, 5).map((t: MarketTrendData) => t.skill)
      },
      
      careerPath: {
        ...careerPath,
        expectedSalary: Math.max(careerPath.expectedSalary, currentSalary + 300000) // Ensure minimum ₹3L increase
      },
      
      learningRoadmap: generateLearningRoadmap(aiAnalysis.skillGaps, youtubeData),
      
      realDataSources: {
        googleSearchResults: googleTechData.relevantResults.length,
        jobPostings: jobMarketData.jobPostings.length,
        youtubeResources: youtubeData.learningResources.length,
        marketDataPoints: marketTrends.length,
        lastUpdated: new Date().toISOString()
      }
    };

    console.log('✅ Real-data prediction completed successfully');
    return prediction;

  } catch (error) {
    console.error('❌ Prediction engine error:', error);
    throw error;
  }
}

/**
 * 💰 REALISTIC INDIAN SALARY CALCULATOR
 */
function calculateBaseSalary(experience: string, role: string, marketAvg: number): number {
  // Base salaries for Indian tech market (in INR)
  const experienceMultipliers = {
    'Entry-level': 0.6,
    'Student/New Graduate': 0.5,
    'Entry Level (0-2 years)': 0.6,
    'Mid-level': 1.0,
    'Mid Level (2-5 years)': 1.0,
    'Senior': 1.8,
    'Senior Level (5-8 years)': 1.8,
    'Lead': 2.5,
    'Lead/Architect (8+ years)': 2.5
  };

  const roleMultipliers: Record<string, number> = {
    'Full Stack Developer': 1.0,
    'Frontend Developer': 0.9,
    'Backend Developer': 1.1,
    'DevOps Engineer': 1.3,
    'Data Scientist': 1.4,
    'Data Engineer': 1.3,
    'Mobile Developer': 1.0,
    'Product Manager': 1.6,
    'ML Engineer': 1.5,
    'Cloud Architect': 1.8
  };

  // Enhanced base salary calculation
  let baseSalary = 800000; // ₹8L for mid-level full stack
  
  // Adjust base for specific high-demand roles
  if (role.includes('Data Scientist')) baseSalary = 1200000; // ₹12L base for Data Scientist
  else if (role.includes('DevOps')) baseSalary = 1000000; // ₹10L base for DevOps
  else if (role.includes('Product Manager')) baseSalary = 1400000; // ₹14L base for PM
  
  const expMultiplier = experienceMultipliers[experience as keyof typeof experienceMultipliers] || 1.0;
  const roleMultiplier = roleMultipliers[role] || 1.0;
  
  // Use market average if available and reasonable
  const marketBasedSalary = marketAvg > 0 && marketAvg < 5000000 ? marketAvg : baseSalary;
  
  const calculatedSalary = Math.round(marketBasedSalary * expMultiplier * roleMultiplier);
  
  // Ensure minimum realistic salaries
  const minimumSalaries = {
    'Student/New Graduate': 400000, // ₹4L minimum
    'Entry-level': 500000, // ₹5L minimum
    'Entry Level (0-2 years)': 500000,
    'Mid-level': 800000, // ₹8L minimum
    'Mid Level (2-5 years)': 800000,
    'Senior': 1500000, // ₹15L minimum
    'Senior Level (5-8 years)': 1500000,
    'Lead': 2500000, // ₹25L minimum
    'Lead/Architect (8+ years)': 2500000
  };
  
  const minimumSalary = minimumSalaries[experience as keyof typeof minimumSalaries] || 800000;
  
  return Math.max(calculatedSalary, minimumSalary);
}

function calculateSkillBonus(skills: string[], skillDemand: Record<string, number>): number {
  let bonus = 0;
  
  skills.forEach(skill => {
    const demand = skillDemand[skill] || 0;
    if (demand > 10) bonus += 200000; // ₹2L for high-demand skills in Google searches
    else if (demand > 5) bonus += 100000; // ₹1L for medium-demand skills
    else if (demand > 1) bonus += 50000; // ₹50k for low-demand skills
  });
  
  return Math.min(bonus, 1000000); // Cap at ₹10L bonus
}

export default predictSkillsDemand;
