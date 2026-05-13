"use client";

import React from 'react';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-[#0A0A0A] border-r border-[#222] flex flex-col flex-shrink-0 text-[#888]">
      {/* Top Section */}
      <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#111] transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-[#0099FF] text-white flex items-center justify-center text-xs font-bold">
            M
          </div>
          <span className="text-white text-sm font-medium">My Workspace</span>
        </div>
        <svg className="w-4 h-4 text-[#666]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <div className="px-4 pb-4">
        <div className="relative">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-[#1A1A1A] text-white placeholder-[#666] text-sm rounded-lg pl-9 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-accent border border-transparent focus:border-accent"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-2">
          <div className="text-xs font-bold text-white mb-2 px-2">Projects</div>
          <div className="space-y-0.5">
            <button className="w-full text-left px-2 py-1.5 rounded-md bg-[#2A2A2A] text-white text-sm font-medium flex items-center gap-2">
              <svg className="w-4 h-4 text-[#888]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2l2 2h8a2 2 0 012 2v2M4 6v12a2 2 0 002 2h12a2 2 0 002-2v-12" />
              </svg>
              All
            </button>
            <button className="w-full text-left px-2 py-1.5 rounded-md hover:bg-[#1A1A1A] text-[#888] hover:text-white text-sm font-medium flex items-center gap-2 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              Archive
            </button>
            <button className="w-full text-left px-2 py-1.5 rounded-md hover:bg-[#1A1A1A] text-[#888] hover:text-white text-sm font-medium flex items-center gap-2 transition-colors mt-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Folder...
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-[#222] flex items-center justify-between">
        <button className="flex items-center gap-2 text-sm font-medium text-[#888] hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Invite your team
        </button>
        <button className="px-3 py-1 bg-[#222] hover:bg-[#333] text-white text-xs font-medium rounded-md transition-colors">
          Copy Link
        </button>
      </div>
    </div>
  );
}
