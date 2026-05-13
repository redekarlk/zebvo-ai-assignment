"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SignupForm from '@/components/auth/SignupForm';
import { useAuthStore } from '@/store/authStore';
import TemplateGrid from '@/components/landing/TemplateGrid';

const SignupPage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-12 h-12 border-4 border-white/10 border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex w-full">
      {/* Left Panel: Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center relative bg-black z-10 px-8">
        <SignupForm />
      </div>
      
      {/* Right Panel: Showcase (Hidden on smaller screens) */}
      <div className="hidden lg:block w-1/2 h-screen overflow-hidden bg-black border-l border-[#222]">
        <div className="scale-75 origin-top-left w-[133%] h-[133%] pointer-events-none">
          <TemplateGrid />
          <TemplateGrid />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
