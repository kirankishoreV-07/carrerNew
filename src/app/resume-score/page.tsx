'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Zap, Target, TrendingUp, Shield } from 'lucide-react';
import Link from 'next/link';
import ResumeUpload from '@/components/ResumeUpload';
import ResumeResults from '@/components/ResumeResults';

interface AnalysisResult {
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
  metadata: {
    fileName: string;
    fileSize: number;
    targetRole: string;
    targetIndustry: string;
    processedAt: string;
    textLength: number;
  };
}

export default function ResumeScorePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File, targetRole: string, targetIndustry: string) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('targetRole', targetRole);
      formData.append('targetIndustry', targetIndustry);

      const response = await fetch('/api/resume-score', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze resume');
      }

      if (data.success && data.data) {
        setResults(data.data);
      } else {
        throw new Error(data.error || 'No analysis data received');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold text-lg">
                Resume Scorer
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!results ? (
          <>
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
                <FileText className="w-8 h-8 text-white" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                AI-Powered Resume Scorer
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Get comprehensive ATS analysis and personalized feedback to optimize your resume 
                for your target role. Powered by Google's advanced AI technology.
              </p>

              {/* Feature Highlights */}
              <div className="grid md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
                {[
                  {
                    icon: Zap,
                    title: 'Instant Analysis',
                    description: 'Get results in seconds with our AI engine'
                  },
                  {
                    icon: Target,
                    title: 'ATS Optimized',
                    description: 'Ensure your resume passes applicant tracking systems'
                  },
                  {
                    icon: TrendingUp,
                    title: 'Industry Insights',
                    description: 'Tailored feedback for your specific field'
                  },
                  {
                    icon: Shield,
                    title: 'Privacy First',
                    description: 'Your data is processed securely and not stored'
                  }
                ].map(({ icon: Icon, title, description }, index) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-gray-200"
                  >
                    <Icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                    <p className="text-sm text-gray-600">{description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Upload Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 p-8"
            >
              <ResumeUpload
                onFileUpload={handleFileUpload}
                isLoading={isLoading}
                error={error}
              />
            </motion.div>

            {/* How It Works */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-16 text-center"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-8">How It Works</h2>
              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {[
                  {
                    step: '1',
                    title: 'Upload Your Resume',
                    description: 'Drop your PDF resume and select your target role and industry'
                  },
                  {
                    step: '2',
                    title: 'AI Analysis',
                    description: 'Our Google Cloud AI analyzes content, keywords, and ATS compatibility'
                  },
                  {
                    step: '3',
                    title: 'Get Insights',
                    description: 'Receive detailed feedback, scores, and actionable improvement suggestions'
                  }
                ].map(({ step, title, description }, index) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + 0.1 * index }}
                    className="relative"
                  >
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mx-auto mb-4">
                      {step}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-600">{description}</p>
                    
                    {index < 2 && (
                      <div className="hidden md:block absolute top-6 left-1/2 w-full h-px bg-gradient-to-r from-blue-200 to-purple-200 transform translate-x-6" />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        ) : (
          /* Results Section */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Analysis Results</h1>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Analyze Another Resume
              </button>
            </div>
            
            <ResumeResults 
              results={results} 
              metadata={{
                fileName: results.metadata.fileName,
                targetRole: results.metadata.targetRole,
                targetIndustry: results.metadata.targetIndustry,
                processedAt: results.metadata.processedAt
              }}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}