/**
 * 🎯 Skills Radar API Endpoint
 * 
 * This endpoint powers the AI-driven Skills Radar feature,
 * providing personalized skill predictions and career insights.
 */

import { NextRequest, NextResponse } from 'next/server';
import { predictSkillsDemand } from '@/lib/skills-prediction-engine-v3';

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 Skills Radar API called');
    
    // Parse user profile from request
    const userProfile = await request.json();
    
    // Validate required fields
    if (!userProfile.currentSkills || !userProfile.targetRole) {
      return NextResponse.json(
        { error: 'Missing required fields: currentSkills, targetRole' },
        { status: 400 }
      );
    }

    // Generate predictions using the new real-data engine
    console.log('🧠 Generating AI predictions with real data...');
    const skillsRadarData = await predictSkillsDemand({
      currentSkills: userProfile.currentSkills || [],
      targetRole: userProfile.targetRole || 'Software Developer',
      experience: userProfile.experience || 'Mid-level',
      industry: userProfile.industry || 'Technology',
      location: userProfile.location || 'India'
    });

    console.log('✅ Predictions generated successfully');
    
    // Return the predictions
    return NextResponse.json({
      success: true,
      data: skillsRadarData,
      message: 'Skills predictions generated successfully'
    });

  } catch (error) {
    console.error('❌ Skills Radar API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate skills predictions',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for testing
export async function GET() {
  return NextResponse.json({
    message: 'Skills Radar API is running',
    endpoints: {
      'POST /api/skills-radar': 'Generate personalized skills predictions'
    },
    requiredFields: [
      'currentSkills: string[]',
      'targetRole: string',
      'experience?: string',
      'industry?: string'
    ]
  });
}
