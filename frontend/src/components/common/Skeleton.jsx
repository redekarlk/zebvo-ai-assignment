import React from 'react';

export const Skeleton = ({ className = '', type = 'rect' }) => {
  const baseClass = "bg-gray-200 animate-pulse";
  
  if (type === 'circle') {
    return <div className={`${baseClass} rounded-full ${className}`} />;
  }
  
  if (type === 'text') {
    return <div className={`${baseClass} rounded-md h-4 ${className}`} />;
  }
  
  return <div className={`${baseClass} rounded-lg ${className}`} />;
};

export const DashboardSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 h-48 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
            <Skeleton className="w-1/2 h-6" />
            <Skeleton className="w-20 h-5 rounded-full" />
          </div>
          <Skeleton type="text" className="w-3/4 mb-2" />
          <Skeleton type="text" className="w-1/3 mt-4" />
        </div>
        <div className="flex gap-2 border-t border-gray-100 pt-3">
          <Skeleton className="flex-1 h-9" />
          <Skeleton className="flex-1 h-9" />
        </div>
      </div>
    ))}
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
