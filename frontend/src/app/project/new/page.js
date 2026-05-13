"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CreateProjectForm from '@/components/dashboard/CreateProjectForm';
import ProjectSetupChat from '@/components/dashboard/ProjectSetupChat';
import { useProjectStore } from '@/store/projectStore';
import aiService from '@/services/ai.service';

import ProtectedRoute from '@/components/common/ProtectedRoute';

const NewProjectPage = () => {
  const router = useRouter();
  const createProject = useProjectStore((state) => state.createProject);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState(null);
  
  const [step, setStep] = useState(1);
  const [createdProject, setCreatedProject] = useState(null);

  const handleCreateProject = async (formData) => {
    setIsSubmitting(true);
    setGlobalError(null);

    try {
      const newProject = await createProject(formData);
      setCreatedProject(newProject);
      setStep(2);
    } catch (err) {
      console.error('Project creation failed:', err);
      setGlobalError(err.response?.data?.message || err.message || 'An unexpected error occurred during project creation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateWebsite = async (userInstructions = '') => {
    if (!createdProject) return;
    
    setIsSubmitting(true);
    try {
      const projectId = createdProject._id || createdProject.id;
      await aiService.generateWebsite(projectId, userInstructions);
      router.push(`/project/${projectId}`);
    } catch (err) {
      console.error('Website generation failed:', err);
      setGlobalError(err.response?.data?.message || err.message || 'An unexpected error occurred during website generation.');
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#000000] py-12 flex justify-center overflow-y-auto no-scrollbar">
        <div className="max-w-3xl w-full px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/dashboard" className="inline-flex items-center text-[13px] font-bold text-[#888] hover:text-white transition-colors">
              <svg className="mr-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
          </div>

          <div className="mb-10 flex items-center justify-between">
            <div>
              <h1 className="text-[32px] font-bold text-white tracking-tight mb-2">
                {step === 1 ? 'Create New Project' : 'Tailor your Website'}
              </h1>
              <p className="text-[15px] text-[#888]">
                {step === 1 
                  ? 'Tell us about the business to get started.' 
                  : 'Refine your design and content with BuilderAI before we generate your site.'}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-[#0099FF]' : 'bg-[#222]'}`}></div>
              <div className="w-4 h-[1px] bg-[#222]"></div>
              <div className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-[#0099FF]' : 'bg-[#222]'}`}></div>
            </div>
          </div>

          {globalError && (
            <div className="mb-8 bg-red-500/10 border border-red-500/50 p-4 rounded-sm">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-[13px] text-red-400 font-bold">
                    {globalError}
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 1 ? (
            <CreateProjectForm onSubmit={handleCreateProject} isSubmitting={isSubmitting} />
          ) : (
            <ProjectSetupChat 
              projectId={createdProject?._id || createdProject?.id} 
              businessInfo={createdProject?.businessInfo} 
              onGenerate={handleGenerateWebsite} 
            />
          )}
          
          {/* Loading Overlay */}
          {isSubmitting && step === 2 && (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#000000]/80 backdrop-blur-sm">
              <div className="w-12 h-12 border-4 border-[#333] border-t-[#0099FF] rounded-full animate-spin mb-6"></div>
              <h2 className="text-xl font-bold text-white mb-2">Generating Website...</h2>
              <p className="text-[#888] font-medium text-[13px]">Our AI is designing your perfect site based on your instructions.</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default NewProjectPage;
