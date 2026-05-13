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
          className="bg-black border border-white/[0.08] w-full max-w-xl rounded-sm overflow-hidden shadow-2xl shadow-black"
        >
          {/* Header */}
          <div className="px-10 py-12 border-b border-white/[0.05] relative">
             
             <div className="relative z-10 flex items-center gap-6">
                <div className="w-16 h-16 rounded-sm bg-white flex items-center justify-center flex-shrink-0">
                   <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                       <div className="w-2 h-2 rounded-full bg-white/20"></div>
                       <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Site Deployed</span>
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
                    <div className="flex-1 bg-white/[0.03] border border-white/5 rounded-sm px-6 py-5 text-white/80 text-sm font-mono break-all min-h-[60px] flex items-center">
                       {activeUrl || 'Fetching deployment link...'}
                    </div>
                    <button 
                       onClick={() => {
                         if (activeUrl) {
                           navigator.clipboard.writeText(activeUrl);
                           alert("URL Copied!");
                         }
                       }}
                       className="px-6 bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] rounded-sm transition-all text-white/40 hover:text-white group"
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
                    className={`flex items-center justify-center gap-3 py-6 rounded-sm text-[12px] font-bold uppercase tracking-[0.2em] transition-all ${activeUrl ? 'bg-white text-black hover:bg-white/90' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
                 >
                    Visit Website
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                 </a>
                 <button 
                    onClick={onClose}
                    className="flex items-center justify-center py-6 bg-white/[0.03] border border-white/5 rounded-sm text-[12px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white hover:bg-white/[0.08] transition-all"
                 >
                    Back to Studio
                 </button>
             </div>
          </div>

          {/* Infrastructure Bar */}
           <div className="px-10 py-6 bg-white/[0.02] border-t border-white/[0.05] flex items-center justify-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500/50"></div>
              <p className="text-[10px] font-medium text-white/20 uppercase tracking-[0.2em]">
                 Edge Nodes Synchronized • Global SSL Active
              </p>
           </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DeploymentModal;
