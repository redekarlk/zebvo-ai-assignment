"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

const LoginForm = () => {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (formError) setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.email || !formData.password) {
      setFormError('Please fill in all fields');
      return;
    }

    try {
      await login(formData);
      router.push('/dashboard');
    } catch (err) {
      // Error is handled by the store, but we catch it here just in case
      console.error('Login failed', err);
    }
  };

  const inputClasses = "appearance-none relative block w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent sm:text-sm transition-all";

  return (
    <div className="w-full max-w-[360px] mx-auto space-y-8 bg-black">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 flex flex-col justify-between pt-[2px] mb-8">
          <svg viewBox="0 0 14 21" fill="none" className="w-8 h-8">
             <path d="M0 0H14V7H7L0 0Z" fill="white"/>
             <path d="M0 7H14V14H7L0 21V7Z" fill="white"/>
          </svg>
        </div>
        <h2 className="text-center text-[28px] font-bold text-white tracking-tight leading-tight">
          Welcome to Builder
        </h2>
        <p className="text-center text-[28px] font-bold text-muted tracking-tight leading-tight">
          Start publishing now.
        </p>
      </div>
      
      <div className="mt-8">
        <button className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-sm bg-white text-black font-medium text-[15px] hover:bg-gray-100 transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#333]"></div>
          </div>
          <div className="relative flex justify-center text-[11px] uppercase">
            <span className="bg-black px-2 text-[#666]">OR</span>
          </div>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          {(error || formError) && (
            <div className="text-sm text-red-400 text-center font-medium">
              {formError || error}
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none block w-full px-4 py-3 bg-[#222] border-none placeholder-[#888] text-white rounded-sm focus:outline-none focus:ring-1 focus:ring-accent sm:text-[15px] transition-all"
              placeholder="Enter your work email..."
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none block w-full px-4 py-3 bg-[#222] border-none placeholder-[#888] text-white rounded-sm focus:outline-none focus:ring-1 focus:ring-accent sm:text-[15px] transition-all"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-[15px] font-medium rounded-sm text-white bg-[#333] hover:bg-[#444] focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? '...' : 'Continue'}
            </button>
          </div>
        </form>
        
        <p className="mt-8 text-center text-xs text-[#666]">
          Don't have an account?{' '}
          <Link href="/signup" className="text-white hover:underline transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
