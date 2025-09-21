/**
 * 📄 Resume Scoring API Endpoint
 * 
 * This endpoint handles PDF resume uploads and provides comprehensive
 * ATS-style scoring with detailed feedback and improvement suggestions.
 */

import { NextRequest, NextResponse } from 'next/server';
import { processResumeDocument, analyzeResumeContent } from '@/lib/resume-scoring-engine';

// Configure API route for file uploads
export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds timeout

// File upload limits
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['application/pdf'];

export async function POST(request: NextRequest) {
  try {
    console.log('📄 Resume scoring API called');

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('resume') as File;
    const targetRole = formData.get('targetRole') as string || 'Software Engineer';
    const targetIndustry = formData.get('targetIndustry') as string || 'Software Engineering';

    // Validate file
    if (!file) {
      return NextResponse.json(
        { error: 'No resume file provided' },
        { status: 400 }
      );
    }

    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    console.log(`📊 Processing resume: ${file.name} (${Math.round(file.size / 1024)}KB)`);

    // Convert file to buffer
    console.log('🔄 Converting file to buffer...');
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);
    
    console.log(`📋 Buffer created: ${fileBuffer.length} bytes`);

    // Step 1: Extract text from PDF using Document AI
    console.log('🔍 Extracting text from PDF...');
    const extractedText = await processResumeDocument(fileBuffer, file.name);

    if (!extractedText || extractedText.length < 100) {
      return NextResponse.json(
        { error: 'Unable to extract sufficient text from the resume. Please ensure the PDF contains readable text.' },
        { status: 400 }
      );
    }

    // Step 2: Analyze resume content
    console.log('🧠 Analyzing resume content...');
    const analysisResult = await analyzeResumeContent(
      extractedText,
      targetRole,
      targetIndustry
    );

    // Step 3: Add processing metadata
    const response = {
      success: true,
      data: {
        ...analysisResult,
        metadata: {
          fileName: file.name,
          fileSize: file.size,
          targetRole,
          targetIndustry,
          processedAt: new Date().toISOString(),
          textLength: extractedText.length
        }
      },
      message: 'Resume analyzed successfully'
    };

    console.log(`✅ Resume analysis completed. Score: ${analysisResult.overallScore}/100`);
    
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Resume scoring API error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('Document AI')) {
        return NextResponse.json(
          { error: 'Failed to process PDF. Please ensure the file is not corrupted and contains readable text.' },
          { status: 500 }
        );
      }
      
      if (error.message.includes('API key') || error.message.includes('authentication')) {
        return NextResponse.json(
          { error: 'Service configuration error. Please try again later.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred while analyzing the resume. Please try again.' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'GET method not supported. Use POST to upload a resume.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'PUT method not supported. Use POST to upload a resume.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'DELETE method not supported. Use POST to upload a resume.' },
    { status: 405 }
  );
}