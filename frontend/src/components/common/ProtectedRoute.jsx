"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initializeAuth();
      setHasInitialized(true);
    };
    init();
  }, [initializeAuth]);

  useEffect(() => {
    // Only redirect after we have finished initializing
    if (hasInitialized && !isLoading && !isAuthenticated) {
      // Allow access to login/signup even if unauthenticated
      if (!pathname.startsWith('/login') && !pathname.startsWith('/signup')) {
        router.push('/login');
      }
    }
  }, [hasInitialized, isLoading, isAuthenticated, router, pathname]);

  if (!hasInitialized || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium tracking-wide">Authenticating...</p>
      </div>
    );
  }

  // If we are on an auth page, or if authenticated, render children
  if (pathname.startsWith('/login') || pathname.startsWith('/signup') || isAuthenticated) {
    return <>{children}</>;
  }

  // Fallback while redirecting
  return null;
};

export default ProtectedRoute;
