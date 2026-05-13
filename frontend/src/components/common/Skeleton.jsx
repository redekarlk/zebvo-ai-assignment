import React from 'react';

export const Skeleton = ({ className = '', type = 'rect' }) => {
  const baseClass = "bg-white/[0.05] animate-pulse";
  
  if (type === 'circle') {
    return <div className={`${baseClass} rounded-full ${className}`} />;
  }
  
  if (type === 'text') {
    return <div className={`${baseClass} rounded-sm h-3 ${className}`} />;
  }
  
  return <div className={`${baseClass} rounded-sm ${className}`} />;
};

export const DashboardSkeleton = () => (
  <div className="flex-1 flex flex-col p-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="bg-[#1A1A1A] rounded-sm overflow-hidden border border-white/[0.05] flex flex-col">
          {/* Thumbnail Skeleton */}
          <div className="h-48 p-4">
            <div className="w-full h-full bg-[#0A0A0A] rounded-sm border border-white/[0.05] flex flex-col p-4 items-center justify-center gap-3">
               <Skeleton className="w-3/4 h-3 rounded-full" />
               <Skeleton className="w-1/2 h-2.5 rounded-full" />
            </div>
          </div>
          
          {/* Footer Skeleton */}
          <div className="p-3 flex items-start justify-between">
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton className="w-2/3 h-4" />
              <Skeleton className="w-1/3 h-3" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-10 h-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const EditorSkeleton = () => (
  <div className="p-4 space-y-6">
    <Skeleton className="w-full h-12" />
    <Skeleton className="w-full h-32" />
    <Skeleton className="w-3/4 h-8" />
    <Skeleton className="w-full h-24" />
  </div>
);
