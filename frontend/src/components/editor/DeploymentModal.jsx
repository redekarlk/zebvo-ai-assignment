import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditorStore } from '@/store/editorStore';

const DeploymentModal = ({ isOpen, onClose, liveUrl: propUrl, projectName }) => {
  const project = useEditorStore((state) => state.project);
  
  // Use the most fresh URL available
  const activeUrl = propUrl || project?.deployment?.liveUrl;

  console.log("Active URL:", activeUrl);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[#0D0D0D] border border-white/10 w-full max-w-xl rounded-sm shadow-[0_0_100px_rgba(59,130,246,0.3)] overflow-hidden"
        >
          {/* Header */}
          <div className="px-10 py-12 border-b border-white/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] transform translate-x-1/3 -translate-y-1/3"></div>
             
             <div className="relative z-10 flex items-center gap-6">
                <div className="w-16 h-16 rounded-sm bg-blue-600 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.5)] flex-shrink-0">
                   <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div className="flex flex-col">
                   <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Site Deployed</span>
                   </div>
                   <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">
                      Success!
                   </h2>
                </div>
             </div>
          </div>

          {/* Content */}
          <div className="p-10 space-y-10">
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">Public Site Address</label>
                   {!activeUrl && <span className="text-[9px] font-bold text-yellow-500 animate-pulse">GENERATING LINK...</span>}
                </div>
                
                <div className="flex gap-2">
                   <div className="flex-1 bg-[#141414] border border-[#222] rounded-sm px-6 py-5 text-blue-400 text-sm font-mono break-all min-h-[60px] flex items-center">
                      {activeUrl || 'Fetching deployment link...'}
                   </div>
                   <button 
                      onClick={() => {
                        if (activeUrl) {
                          navigator.clipboard.writeText(activeUrl);
                          alert("URL Copied!");
                        }
                      }}
                      className="px-6 bg-white/5 border border-white/10 hover:bg-white/10 rounded-sm transition-all text-white/60 hover:text-white group"
                   >
                      <svg className="w-5 h-5 group-active:scale-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                   </button>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-5">
                <a 
                   href={activeUrl || '#'} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className={`flex items-center justify-center gap-3 py-6 rounded-sm text-[12px] font-black uppercase tracking-[0.2em] text-white transition-all shadow-2xl ${activeUrl ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20' : 'bg-white/5 cursor-not-allowed opacity-50'}`}
                >
                   Visit Website
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
                <button 
                   onClick={onClose}
                   className="flex items-center justify-center py-6 bg-white/5 border border-white/10 rounded-sm text-[12px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white hover:bg-white/10 transition-all"
                >
                   Back to Studio
                </button>
             </div>
          </div>

          {/* Infrastructure Bar */}
          <div className="px-10 py-6 bg-blue-600/5 border-t border-white/5 flex items-center justify-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
             <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                Edge Nodes Synchronized • Global SSL Active
             </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DeploymentModal;
