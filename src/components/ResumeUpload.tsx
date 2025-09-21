'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Download } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File, targetRole: string, targetIndustry: string) => void;
  isLoading: boolean;
  error: string | null;
}

const INDUSTRY_OPTIONS = [
  'Software Engineering',
  'Data Science',
  'Digital Marketing',
  'Product Management',
  'Finance',
  'Consulting',
  'Sales',
  'Human Resources',
  'Design',
  'Operations'
];

const ROLE_SUGGESTIONS = {
  'Software Engineering': ['Software Engineer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'DevOps Engineer'],
  'Data Science': ['Data Scientist', 'Data Analyst', 'Machine Learning Engineer', 'Business Intelligence Analyst', 'Data Engineer'],
  'Digital Marketing': ['Digital Marketing Manager', 'SEO Specialist', 'Content Marketing Manager', 'Social Media Manager', 'Growth Marketer'],
  'Product Management': ['Product Manager', 'Senior Product Manager', 'Product Owner', 'Technical Product Manager', 'Growth Product Manager'],
  'Finance': ['Financial Analyst', 'Investment Banker', 'Financial Planner', 'Risk Analyst', 'Portfolio Manager']
};

export default function ResumeUpload({ onFileUpload, isLoading, error }: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [targetIndustry, setTargetIndustry] = useState('Software Engineering');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      setSelectedFile(pdfFile);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    }
  }, []);

  const handleSubmit = useCallback(() => {
    if (selectedFile && !isLoading) {
      onFileUpload(selectedFile, targetRole, targetIndustry);
    }
  }, [selectedFile, targetRole, targetIndustry, onFileUpload, isLoading]);

  const getRoleSuggestions = () => {
    return ROLE_SUGGESTIONS[targetIndustry as keyof typeof ROLE_SUGGESTIONS] || [];
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Industry and Role Selection */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Industry
          </label>
          <select
            value={targetIndustry}
            onChange={(e) => {
              setTargetIndustry(e.target.value);
              const suggestions = ROLE_SUGGESTIONS[e.target.value as keyof typeof ROLE_SUGGESTIONS];
              if (suggestions && suggestions.length > 0) {
                setTargetRole(suggestions[0]);
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {INDUSTRY_OPTIONS.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Role
          </label>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {getRoleSuggestions().map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      {/* File Upload Area */}
      <motion.div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          dragOver
            ? 'border-blue-400 bg-blue-50'
            : selectedFile
            ? 'border-green-400 bg-green-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          id="resume-upload"
        />
        
        <AnimatePresence mode="wait">
          {selectedFile ? (
            <motion.div
              key="file-selected"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="space-y-3"
            >
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
              <div>
                <p className="text-lg font-semibold text-green-700">File Selected</p>
                <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="upload-prompt"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="space-y-3"
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-lg font-semibold text-gray-700">
                  Drop your resume here or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  PDF format only, max 10MB
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Analysis Failed</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      <motion.button
        onClick={handleSubmit}
        disabled={!selectedFile || isLoading}
        className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
          !selectedFile || isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
        }`}
        whileHover={!selectedFile || isLoading ? {} : { scale: 1.02 }}
        whileTap={!selectedFile || isLoading ? {} : { scale: 0.98 }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing Resume...
          </div>
        ) : (
          'Analyze My Resume'
        )}
      </motion.button>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">🎯 What We Analyze</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>ATS Compatibility:</strong> Format and parsing readiness</li>
          <li>• <strong>Content Quality:</strong> Writing clarity and impact</li>
          <li>• <strong>Keyword Optimization:</strong> Industry-relevant terms</li>
          <li>• <strong>Structure & Formatting:</strong> Professional presentation</li>
          <li>• <strong>Experience Relevance:</strong> Role alignment analysis</li>
        </ul>
      </div>
    </div>
  );
}