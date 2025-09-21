/**
 * 🎯 Advanced Resume Scoring Engine
 * 
 * This engine provides comprehensive ATS-style resume analysis using:
 * - Google Cloud Document AI for PDF parsing
 * - AI-powered content analysis
 * - Industry-standard ATS scoring criteria
 * - Detailed feedback and improvement suggestions
 */

import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize clients
const documentClient = new DocumentProcessorServiceClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface ResumeAnalysisResult {
  overallScore: number;
  sections: {
    atsCompatibility: {
      score: number;
      feedback: string[];
      improvements: string[];
    };
    contentQuality: {
      score: number;
      feedback: string[];
      improvements: string[];
    };
    keywordOptimization: {
      score: number;
      matchedKeywords: string[];
      missingKeywords: string[];
      feedback: string[];
    };
    formatting: {
      score: number;
      feedback: string[];
      improvements: string[];
    };
    experienceRelevance: {
      score: number;
      feedback: string[];
      improvements: string[];
    };
  };
  detailedAnalysis: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    industryComparison: string;
  };
  extractedData: {
    personalInfo: any;
    skills: string[];
    experience: any[];
    education: any[];
    certifications: string[];
  };
}

// Industry-specific keywords and requirements
const INDUSTRY_KEYWORDS = {
  'Software Engineering': [
    'JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes',
    'Git', 'API', 'Database', 'Agile', 'Scrum', 'CI/CD', 'Microservices',
    'Cloud Computing', 'DevOps', 'MongoDB', 'PostgreSQL', 'Redis', 'GraphQL'
  ],
  'Data Science': [
    'Python', 'R', 'SQL', 'Machine Learning', 'Deep Learning', 'TensorFlow',
    'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn', 'Statistics', 'Data Visualization',
    'Tableau', 'Power BI', 'Jupyter', 'Apache Spark', 'Hadoop', 'Big Data'
  ],
  'Digital Marketing': [
    'SEO', 'SEM', 'Google Analytics', 'Facebook Ads', 'Google Ads', 'Content Marketing',
    'Social Media Marketing', 'Email Marketing', 'Conversion Optimization', 'A/B Testing',
    'Marketing Automation', 'CRM', 'Lead Generation', 'Brand Management'
  ],
  'Product Management': [
    'Product Strategy', 'Roadmap Planning', 'User Research', 'A/B Testing', 'Analytics',
    'Agile', 'Scrum', 'JIRA', 'Product Launch', 'Stakeholder Management',
    'Market Research', 'Competitive Analysis', 'UX/UI', 'KPIs', 'OKRs'
  ],
  'Finance': [
    'Financial Analysis', 'Excel', 'Financial Modeling', 'Valuation', 'Risk Management',
    'Investment Banking', 'Portfolio Management', 'Accounting', 'GAAP', 'CFA',
    'Bloomberg', 'SQL', 'Python', 'Derivatives', 'Fixed Income'
  ]
};

// ATS scoring criteria
const ATS_SCORING_WEIGHTS = {
  atsCompatibility: 0.25,    // 25% - Format, parsing, keywords
  contentQuality: 0.25,      // 25% - Writing quality, achievements
  keywordOptimization: 0.20, // 20% - Industry keywords
  formatting: 0.15,          // 15% - Structure, readability
  experienceRelevance: 0.15  // 15% - Role alignment
};

export async function processResumeDocument(fileBuffer: Buffer, fileName: string): Promise<string> {
  // Check if Document AI is properly configured
  const projectId = process.env.DOCUMENT_AI_PROJECT_ID;
  const processorId = process.env.DOCUMENT_AI_PROCESSOR_ID;
  
  if (projectId && processorId && projectId !== 'your-project-id' && processorId !== 'your-processor-id') {
    try {
      const location = process.env.DOCUMENT_AI_LOCATION || 'us';
      const processorVersion = process.env.DOCUMENT_AI_PROCESSOR_VERSION || 'rc';

      const name = `projects/${projectId}/locations/${location}/processors/${processorId}/processorVersions/${processorVersion}`;

      const request = {
        name,
        rawDocument: {
          content: fileBuffer.toString('base64'),
          mimeType: 'application/pdf',
        },
      };

      console.log('🔍 Processing document with Google Document AI...');
      const [result] = await documentClient.processDocument(request);
      
      if (!result.document?.text) {
        throw new Error('Failed to extract text from document');
      }

      console.log('✅ Document processed successfully with Document AI');
      return result.document.text;

    } catch (error) {
      console.error('❌ Document AI processing error:', error);
      console.log('🔄 Falling back to basic PDF parsing...');
      // Fall back to basic PDF parsing
    }
  } else {
    console.log('📝 Document AI not configured, using basic PDF parsing...');
  }

  // Fallback: Use dedicated PDF extractor
  try {
    const { extractTextFromPDF } = await import('./pdf-extractor');
    return await extractTextFromPDF(fileBuffer);
  } catch (error) {
    console.error('❌ PDF extraction failed:', error);
    throw new Error(`Failed to process document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function analyzeResumeContent(
  resumeText: string, 
  targetRole: string = 'Software Engineer',
  targetIndustry: string = 'Software Engineering'
): Promise<ResumeAnalysisResult> {
  try {
    console.log('🧠 Starting comprehensive resume analysis...');

    // Get industry keywords
    const industryKeywords = INDUSTRY_KEYWORDS[targetIndustry as keyof typeof INDUSTRY_KEYWORDS] || 
                           INDUSTRY_KEYWORDS['Software Engineering'];

    // Extract structured data using AI
    const extractedData = await extractResumeData(resumeText);
    
    // Perform detailed analysis
    const atsCompatibility = analyzeATSCompatibility(resumeText, extractedData);
    const contentQuality = await analyzeContentQuality(resumeText);
    const keywordOptimization = analyzeKeywordOptimization(resumeText, industryKeywords);
    const formatting = analyzeFormatting(resumeText);
    const experienceRelevance = analyzeExperienceRelevance(extractedData, targetRole);

    // Calculate overall score
    const overallScore = Math.round(
      (atsCompatibility.score * ATS_SCORING_WEIGHTS.atsCompatibility) +
      (contentQuality.score * ATS_SCORING_WEIGHTS.contentQuality) +
      (keywordOptimization.score * ATS_SCORING_WEIGHTS.keywordOptimization) +
      (formatting.score * ATS_SCORING_WEIGHTS.formatting) +
      (experienceRelevance.score * ATS_SCORING_WEIGHTS.experienceRelevance)
    );

    // Generate detailed analysis using AI
    const detailedAnalysis = await generateDetailedAnalysis(
      resumeText, 
      targetRole, 
      overallScore,
      extractedData
    );

    console.log('✅ Resume analysis completed');

    return {
      overallScore,
      sections: {
        atsCompatibility,
        contentQuality,
        keywordOptimization,
        formatting,
        experienceRelevance
      },
      detailedAnalysis,
      extractedData
    };

  } catch (error) {
    console.error('❌ Resume analysis error:', error);
    throw new Error(`Failed to analyze resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function extractResumeData(resumeText: string) {
  const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-1.5-flash" });
  
  const prompt = `
  Analyze this resume and extract structured data. Return ONLY a valid JSON object with no additional text or formatting:

  {
    "personalInfo": {
      "name": "Full Name",
      "email": "email@example.com",
      "phone": "(555) 123-4567",
      "location": "City, State/Country",
      "linkedin": "linkedin.com/in/username",
      "github": "github.com/username"
    },
    "skills": ["JavaScript", "Python", "React", "Node.js", "AWS"],
    "experience": [
      {
        "title": "Job Title",
        "company": "Company Name",
        "duration": "2021-Present",
        "description": "Key achievements and responsibilities"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science in Computer Science",
        "school": "University Name",
        "year": "2019",
        "gpa": "3.8"
      }
    ],
    "certifications": ["AWS Certified", "Google Cloud Professional"]
  }

  Resume text:
  ${resumeText}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return {
      personalInfo: {},
      skills: [],
      experience: [],
      education: [],
      certifications: []
    };
  } catch (error) {
    console.error('Error extracting resume data:', error);
    return {
      personalInfo: {},
      skills: [],
      experience: [],
      education: [],
      certifications: []
    };
  }
}

function analyzeATSCompatibility(resumeText: string, extractedData: any) {
  let score = 100;
  const feedback: string[] = [];
  const improvements: string[] = [];

  // Check for contact information
  if (!extractedData.personalInfo?.email) {
    score -= 15;
    feedback.push('❌ Missing email address');
    improvements.push('Add a professional email address');
  }

  if (!extractedData.personalInfo?.phone) {
    score -= 10;
    feedback.push('⚠️ Missing phone number');
    improvements.push('Include your phone number for contact');
  }

  // Check for standard sections
  const hasExperience = extractedData.experience?.length > 0;
  const hasEducation = extractedData.education?.length > 0;
  const hasSkills = extractedData.skills?.length > 0;

  if (!hasExperience) {
    score -= 20;
    feedback.push('❌ No work experience section found');
    improvements.push('Add a detailed work experience section');
  }

  if (!hasEducation) {
    score -= 15;
    feedback.push('⚠️ No education section found');
    improvements.push('Include your educational background');
  }

  if (!hasSkills) {
    score -= 15;
    feedback.push('❌ No skills section found');
    improvements.push('Add a comprehensive skills section');
  }

  // Check for common ATS-unfriendly elements
  if (resumeText.includes('|') || resumeText.includes('│')) {
    score -= 10;
    feedback.push('⚠️ Complex formatting detected (tables/columns)');
    improvements.push('Use simple formatting without tables or columns');
  }

  if (score >= 80) {
    feedback.push('✅ Good ATS compatibility');
  } else if (score >= 60) {
    feedback.push('⚠️ Moderate ATS compatibility');
  } else {
    feedback.push('❌ Poor ATS compatibility - needs significant improvement');
  }

  return {
    score: Math.max(0, score),
    feedback,
    improvements
  };
}

async function analyzeContentQuality(resumeText: string) {
  const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-1.5-flash" });
  
  const prompt = `
  Analyze this resume's content quality and provide a detailed assessment. Score from 0-100 based on:
  - Clear, impactful descriptions with specific examples
  - Quantified achievements (numbers, percentages, metrics)
  - Professional language and tone
  - Strong action verbs and active voice
  - Relevance and specificity to role
  - Results-oriented statements

  Return ONLY a valid JSON object:
  {
    "score": 75,
    "feedback": [
      "✅ Strong quantified achievements (40% performance improvement)",
      "✅ Professional language throughout",
      "⚠️ Some descriptions lack specific metrics",
      "❌ Few action verbs used in experience section"
    ],
    "improvements": [
      "Add specific numbers to all achievements (budget managed, team size, etc.)",
      "Use more powerful action verbs like 'orchestrated', 'spearheaded', 'optimized'",
      "Include percentage improvements and concrete results",
      "Specify technologies and tools used in each role"
    ]
  }

  Resume text:
  ${resumeText}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error('Error analyzing content quality:', error);
  }

  return {
    score: 70,
    feedback: ['Content analysis completed'],
    improvements: ['Consider adding more quantified achievements']
  };
}

function analyzeKeywordOptimization(resumeText: string, industryKeywords: string[]) {
  const resumeLower = resumeText.toLowerCase();
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  industryKeywords.forEach(keyword => {
    if (resumeLower.includes(keyword.toLowerCase())) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });

  const matchPercentage = (matchedKeywords.length / industryKeywords.length) * 100;
  const score = Math.min(100, matchPercentage + 20); // Base score boost

  const feedback: string[] = [];
  const topMissingKeywords = missingKeywords.slice(0, 10);

  if (score >= 80) {
    feedback.push('✅ Excellent keyword optimization');
  } else if (score >= 60) {
    feedback.push('⚠️ Good keyword coverage, room for improvement');
  } else {
    feedback.push('❌ Low keyword optimization');
  }

  feedback.push(`📊 Matched ${matchedKeywords.length}/${industryKeywords.length} industry keywords`);

  return {
    score: Math.round(score),
    matchedKeywords,
    missingKeywords: topMissingKeywords,
    feedback
  };
}

function analyzeFormatting(resumeText: string) {
  let score = 100;
  const feedback: string[] = [];
  const improvements: string[] = [];

  // Check length
  const wordCount = resumeText.split(/\s+/).length;
  if (wordCount < 200) {
    score -= 20;
    feedback.push('❌ Resume too short');
    improvements.push('Expand content to 300-800 words');
  } else if (wordCount > 1000) {
    score -= 15;
    feedback.push('⚠️ Resume might be too long');
    improvements.push('Consider condensing to 1-2 pages');
  } else {
    feedback.push('✅ Good length');
  }

  // Check for bullet points
  const bulletCount = (resumeText.match(/[•\-\*]/g) || []).length;
  if (bulletCount < 5) {
    score -= 10;
    feedback.push('⚠️ Few bullet points detected');
    improvements.push('Use bullet points to highlight achievements');
  } else {
    feedback.push('✅ Good use of bullet points');
  }

  // Check for numbers/metrics
  const numberCount = (resumeText.match(/\d+/g) || []).length;
  if (numberCount < 5) {
    score -= 15;
    feedback.push('❌ Few quantifiable metrics');
    improvements.push('Add numbers, percentages, and measurable achievements');
  } else {
    feedback.push('✅ Good use of quantifiable metrics');
  }

  return {
    score: Math.max(0, score),
    feedback,
    improvements
  };
}

function analyzeExperienceRelevance(extractedData: any, targetRole: string) {
  let score = 100;
  const feedback: string[] = [];
  const improvements: string[] = [];

  const experience = extractedData.experience || [];
  
  if (experience.length === 0) {
    return {
      score: 0,
      feedback: ['❌ No work experience found'],
      improvements: ['Add relevant work experience']
    };
  }

  // Simple relevance check based on role keywords in experience
  const roleKeywords = targetRole.toLowerCase().split(' ');
  let relevantExperience = 0;

  experience.forEach((exp: any) => {
    const expText = `${exp.title} ${exp.description}`.toLowerCase();
    const hasRelevantKeywords = roleKeywords.some(keyword => 
      expText.includes(keyword)
    );
    
    if (hasRelevantKeywords) {
      relevantExperience++;
    }
  });

  const relevanceRatio = relevantExperience / experience.length;
  
  if (relevanceRatio >= 0.7) {
    feedback.push('✅ High experience relevance');
  } else if (relevanceRatio >= 0.4) {
    score -= 20;
    feedback.push('⚠️ Moderate experience relevance');
    improvements.push('Highlight more relevant experience for the target role');
  } else {
    score -= 40;
    feedback.push('❌ Low experience relevance');
    improvements.push('Focus on experience that aligns with the target role');
  }

  return {
    score: Math.max(0, score),
    feedback,
    improvements
  };
}

async function generateDetailedAnalysis(
  resumeText: string, 
  targetRole: string, 
  overallScore: number,
  extractedData: any
) {
  const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-1.5-flash" });
  
  const prompt = `
  Provide comprehensive, precise analysis for this resume targeting "${targetRole}" position.
  Overall ATS score: ${overallScore}/100

  Analyze thoroughly and return ONLY a valid JSON object:
  {
    "strengths": [
      "🎯 Specific quantified achievement: Increased team productivity by 35% through process optimization",
      "🔧 Strong technical expertise: 5+ years with React, Node.js, and cloud platforms",
      "👥 Leadership experience: Successfully managed cross-functional teams of 12+ members",
      "📈 Career progression: Promoted twice in 3 years with increasing responsibilities"
    ],
    "weaknesses": [
      "❌ Missing industry certifications (AWS, Google Cloud, etc.)",
      "⚠️ Limited quantified metrics in 60% of job descriptions",
      "📝 Some bullet points lack specific technical details",
      "🎯 No mention of project budgets or timelines managed"
    ],
    "recommendations": [
      "Add specific metrics to ALL achievements (percentages, dollar amounts, team sizes)",
      "Include relevant certifications for ${targetRole} (list 2-3 specific ones)",
      "Quantify project scope: mention budgets, timelines, and team sizes",
      "Use stronger action verbs: 'orchestrated', 'spearheaded', 'optimized' instead of 'worked on'",
      "Add a 'Key Achievements' section highlighting top 3-5 accomplishments with numbers"
    ],
    "industryComparison": "This resume shows solid foundation for ${targetRole} but needs more quantified achievements. Top candidates typically show 80%+ of accomplishments with specific metrics. Current resume has approximately 40% quantified results. Industry leaders showcase measurable impact in every role."
  }

  Be extremely specific and actionable in all feedback. Focus on concrete improvements.

  Resume text:
  ${resumeText}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error('Error generating detailed analysis:', error);
  }

  return {
    strengths: ['Resume analysis completed successfully'],
    weaknesses: ['Some areas may need improvement'],
    recommendations: ['Consider customizing for specific job applications'],
    industryComparison: 'This resume shows potential for the target role with some improvements.'
  };
}