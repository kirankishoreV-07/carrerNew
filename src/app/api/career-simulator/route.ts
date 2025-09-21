import { NextRequest, NextResponse } from 'next/server';
import { CareerPathSimulator, UserProfile } from '@/lib/career-path-simulator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { 
      skills, 
      interests, 
      experience, 
      education, 
      location, 
      preferredIndustries,
      careerGoals,
      timeHorizon 
    } = body;

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return NextResponse.json(
        { error: 'Skills array is required and cannot be empty' },
        { status: 400 }
      );
    }

    if (!interests || !Array.isArray(interests) || interests.length === 0) {
      return NextResponse.json(
        { error: 'Interests array is required and cannot be empty' },
        { status: 400 }
      );
    }

    if (!experience || !education || !location) {
      return NextResponse.json(
        { error: 'Experience, education, and location are required' },
        { status: 400 }
      );
    }

    // Create user profile
    const userProfile: UserProfile = {
      skills: skills.map((skill: string) => skill.trim()),
      interests: interests.map((interest: string) => interest.trim()),
      experience: experience.trim(),
      education: education.trim(),
      location: location.trim(),
      preferredIndustries: preferredIndustries?.map((industry: string) => industry.trim()) || [],
      careerGoals: careerGoals?.trim() || '',
      timeHorizon: timeHorizon || '3-year'
    };

    // Initialize career path simulator
    const simulator = new CareerPathSimulator();
    
    // Generate career simulation
    const simulationResult = await simulator.simulateCareerPaths(userProfile);

    // Add metadata
    const response = {
      ...simulationResult,
      metadata: {
        userId: body.userId || 'anonymous',
        timestamp: new Date().toISOString(),
        profileSummary: {
          totalSkills: userProfile.skills.length,
          experienceLevel: userProfile.experience,
          primaryInterests: userProfile.interests.slice(0, 3),
          targetTimeframe: userProfile.timeHorizon
        }
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in career simulation API:', error);
    
    // Return detailed error for development, generic for production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return NextResponse.json(
      {
        error: 'Failed to generate career simulation',
        details: isDevelopment ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Career Path Simulator API',
    version: '1.0.0',
    endpoints: {
      POST: '/api/career-simulator - Generate career path simulation',
    },
    requiredFields: {
      skills: 'Array of current skills',
      interests: 'Array of interests/preferences', 
      experience: 'Experience level (e.g., "Fresher", "1-2 years")',
      education: 'Educational background',
      location: 'Current location',
      preferredIndustries: 'Array of preferred industries (optional)',
      careerGoals: 'Career aspirations (optional)',
      timeHorizon: 'Planning timeframe: 1-year, 3-year, 5-year, 10-year (optional, defaults to 3-year)'
    },
    sampleRequest: {
      skills: ['JavaScript', 'React', 'Node.js', 'Python'],
      interests: ['Web Development', 'Data Science', 'AI/ML'],
      experience: 'Fresher',
      education: 'B.Tech Computer Science',
      location: 'Bangalore, India',
      preferredIndustries: ['Technology', 'FinTech', 'Startups'],
      careerGoals: 'Become a senior software engineer with expertise in AI',
      timeHorizon: '5-year'
    }
  });
}