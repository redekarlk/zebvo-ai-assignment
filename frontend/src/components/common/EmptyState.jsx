import React from 'react';
import Link from 'next/link';

export const EmptyState = ({ title, description, actionText, actionLink, icon }) => {
  return (
    <div className="bg-[#1A1A1A] border border-[#222] rounded-sm p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-16 h-16 bg-[#222] rounded-sm flex items-center justify-center text-white mb-6 border border-[#333]">
        {icon || (
          <svg className="w-8 h-8 text-[#888]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        )}
      </div>
      <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-[#888] max-w-md mx-auto mb-8 text-[15px]">
        {description}
      </p>
      {actionText && actionLink && (
        <Link 
          href={actionLink} 
          className="px-6 py-2.5 bg-[#0099FF] hover:bg-[#0088EE] text-white text-[15px] font-medium rounded-sm transition-colors"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
};
