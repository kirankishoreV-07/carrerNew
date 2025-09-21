'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Target,
  FileText,
  Award,
  Lightbulb,
  BarChart3,
  Users,
  Clock,
  Download
} from 'lucide-react';

interface ResumeAnalysisResult {
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

interface ResultsDisplayProps {
  results: ResumeAnalysisResult;
  metadata: {
    fileName: string;
    targetRole: string;
    targetIndustry: string;
    processedAt: string;
  };
}

export default function ResumeResults({ results, metadata }: ResultsDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <TrendingUp className="w-5 h-5 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    return <TrendingDown className="w-5 h-5 text-red-600" />;
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getFeedbackIcon = (feedback: string) => {
    if (feedback.includes('✅')) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (feedback.includes('⚠️')) return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    if (feedback.includes('❌')) return <XCircle className="w-4 h-4 text-red-500" />;
    return <FileText className="w-4 h-4 text-gray-500" />;
  };

  const CircularProgress = ({ score, size = 120 }: { score: number; size?: number }) => {
    const radius = (size - 20) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500'}
            style={{
              transition: 'stroke-dashoffset 1s ease-in-out',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
              {score}
            </div>
            <div className="text-xs text-gray-500">out of 100</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header with Overall Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl border-2 p-8 ${getScoreBg(results.overallScore)}`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Resume Analysis Complete</h2>
            <p className="text-gray-600">
              <span className="font-semibold">{metadata.fileName}</span> • 
              Targeting <span className="font-semibold">{metadata.targetRole}</span> in {metadata.targetIndustry}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <CircularProgress score={results.overallScore} />
            {getScoreIcon(results.overallScore)}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold">{results.extractedData.skills?.length || 0}</div>
            <div className="text-sm text-gray-600">Skills Found</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{results.extractedData.experience?.length || 0}</div>
            <div className="text-sm text-gray-600">Experiences</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{results.sections.keywordOptimization.matchedKeywords.length}</div>
            <div className="text-sm text-gray-600">Keywords Matched</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">
              {results.overallScore >= 80 ? 'Excellent' : results.overallScore >= 60 ? 'Good' : 'Needs Work'}
            </div>
            <div className="text-sm text-gray-600">Overall Rating</div>
          </div>
        </div>
      </motion.div>

      {/* Section Scores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {[
          { 
            key: 'atsCompatibility', 
            title: 'ATS Compatibility', 
            icon: Target,
            description: 'How well your resume passes ATS systems'
          },
          { 
            key: 'contentQuality', 
            title: 'Content Quality', 
            icon: FileText,
            description: 'Writing clarity and impact of your content'
          },
          { 
            key: 'keywordOptimization', 
            title: 'Keyword Optimization', 
            icon: BarChart3,
            description: 'Industry-relevant keyword coverage'
          },
          { 
            key: 'formatting', 
            title: 'Formatting', 
            icon: Award,
            description: 'Structure and professional presentation'
          },
          { 
            key: 'experienceRelevance', 
            title: 'Experience Relevance', 
            icon: Users,
            description: 'Alignment with your target role'
          }
        ].map(({ key, title, icon: Icon, description }) => {
          const section = results.sections[key as keyof typeof results.sections];
          return (
            <div
              key={key}
              className={`rounded-lg border p-6 ${getScoreBg(section.score)}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6 text-gray-700" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                    <p className="text-xs text-gray-600">{description}</p>
                  </div>
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(section.score)}`}>
                  {section.score}
                </div>
              </div>
              
              <div className="space-y-2">
                {section.feedback.slice(0, 2).map((feedback, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    {getFeedbackIcon(feedback)}
                    <span className="text-gray-700">{feedback.replace(/[✅⚠️❌]/g, '').trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Keyword Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Keyword Analysis
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Matched Keywords */}
          <div>
            <h4 className="font-medium text-green-700 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Keywords Found ({results.sections.keywordOptimization.matchedKeywords.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {results.sections.keywordOptimization.matchedKeywords.slice(0, 15).map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                >
                  {keyword}
                </span>
              ))}
              {results.sections.keywordOptimization.matchedKeywords.length > 15 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                  +{results.sections.keywordOptimization.matchedKeywords.length - 15} more
                </span>
              )}
            </div>
          </div>

          {/* Missing Keywords */}
          <div>
            <h4 className="font-medium text-red-700 mb-3 flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              Missing Keywords ({results.sections.keywordOptimization.missingKeywords.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {results.sections.keywordOptimization.missingKeywords.slice(0, 10).map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full"
                >
                  {keyword}
                </span>
              ))}
              {results.sections.keywordOptimization.missingKeywords.length > 10 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                  +{results.sections.keywordOptimization.missingKeywords.length - 10} more
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Detailed Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid md:grid-cols-2 gap-6"
      >
        {/* Strengths */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Strengths
          </h3>
          <ul className="space-y-2">
            {results.detailedAnalysis.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-green-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5" />
            Areas for Improvement
          </h3>
          <ul className="space-y-2">
            {results.detailedAnalysis.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-red-700">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Personalized Recommendations
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-blue-700 mb-3">Action Items</h4>
            <ul className="space-y-2">
              {results.detailedAnalysis.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-blue-700">
                  <Target className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-700 mb-3">Industry Comparison</h4>
            <p className="text-sm text-blue-700">{results.detailedAnalysis.industryComparison}</p>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2">
          <Download className="w-5 h-5" />
          Download Report
        </button>
        <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Analyze Another Resume
        </button>
      </motion.div>
    </div>
  );
}