"use client";

import React, { useState, useRef, useEffect } from 'react';
import exportService from '@/services/export.service';

const ExportDropdown = ({ projectId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(null); // 'html', 'json', 'zip', or null
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = async (format) => {
    try {
      setIsExporting(format);
      await exportService.downloadExport(projectId, format);
      setIsOpen(false);
    } catch (error) {
      alert(`Failed to export as ${format.toUpperCase()}`);
    } finally {
      setIsExporting(null);
    }
  };

  const ExportIcon = ({ isLoading, defaultIcon }) => {
    if (isLoading) {
      return (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      );
    }
    return defaultIcon;
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex justify-center w-full rounded-sm border border-[#333] px-3 py-1.5 bg-[#1A1A1A] text-[13px] font-medium text-white hover:bg-[#222] focus:outline-none transition-colors"
          id="menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          Export
          <svg className="-mr-1 ml-2 h-4 w-4 text-[#888]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div 
          className="origin-top-right absolute right-0 mt-2 w-48 rounded-sm shadow-xl bg-[#111111] border border-[#222] focus:outline-none z-50 overflow-hidden" 
          role="menu" 
          aria-orientation="vertical" 
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            <button
              onClick={() => handleExport('html')}
              disabled={isExporting !== null}
              className="flex items-center w-full text-left px-4 py-2 text-[13px] text-[#888] hover:bg-[#222] hover:text-white disabled:opacity-50 transition-colors"
              role="menuitem"
            >
              <ExportIcon isLoading={isExporting === 'html'} defaultIcon={
                <svg className="mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              }/>
              Export HTML
            </button>
            <button
              onClick={() => handleExport('zip')}
              disabled={isExporting !== null}
              className="flex items-center w-full text-left px-4 py-2 text-[13px] text-[#888] hover:bg-[#222] hover:text-white disabled:opacity-50 transition-colors"
              role="menuitem"
            >
              <ExportIcon isLoading={isExporting === 'zip'} defaultIcon={
                <svg className="mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
              }/>
              Export as ZIP
            </button>
            <button
              onClick={() => handleExport('json')}
              disabled={isExporting !== null}
              className="flex items-center w-full text-left px-4 py-2 text-[13px] text-[#888] hover:bg-[#222] hover:text-white disabled:opacity-50 transition-colors border-t border-[#222] mt-1 pt-2"
              role="menuitem"
            >
              <ExportIcon isLoading={isExporting === 'json'} defaultIcon={
                <svg className="mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
              }/>
              Export JSON
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;
