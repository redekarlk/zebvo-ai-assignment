"use client";

import { useContext, useState } from 'react';
import Link from 'next/link';
import ExportDropdown from './ExportDropdown';
import DeploymentModal from './DeploymentModal';
import { EditModeContext } from '@/context/EditModeContext';
import { useEditorStore } from '@/store/editorStore';

const TopNavbar = ({ project, onSave, isSaving }) => {
  const { setSelectedSection } = useContext(EditModeContext);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [deployedData, setDeployedData] = useState(null);
  
  const isDeploying = useEditorStore((state) => state.isDeploying);
  const deployProject = useEditorStore((state) => state.deployProject);
  const previewMode = useEditorStore((state) => state.previewMode || 'desktop');
  const setPreviewMode = useEditorStore((state) => state.setPreviewMode);

  const handleDeploy = async () => {
    try {
      const data = await deployProject();
      setDeployedData(data);
      setShowDeployModal(true);
    } catch (err) {
      console.error("Deploy failed:", err);
    }
  };

  return (
    <div className="h-14 bg-[#111111] border-b border-[#222] flex items-center justify-between px-6 flex-shrink-0 z-50">
      {/* Left items: Brand & Tools */}
      <div className="flex items-center gap-8">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center group-hover:scale-110 transition-transform">
             <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
             </svg>
          </div>
          <span className="text-white font-black text-sm tracking-tighter uppercase">Studio</span>
        </Link>
        
        <div className="h-6 w-[1px] bg-[#222]"></div>

        <div className="flex items-center gap-1">
          <button 
            onClick={() => setSelectedSection('global-theme')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-sm text-[11px] font-bold text-white/50 hover:text-white hover:bg-white/5 transition-all"
          >
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
            GLOBAL THEME
          </button>
        </div>
      </div>

      {/* Center items: Project Status */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-1.5 bg-[#161616] border border-[#222] rounded-full">
        <div className={`w-2 h-2 rounded-full ${project?.deployment?.status === 'live' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-yellow-500 animate-pulse'}`}></div>
        <span className="text-[11px] font-black text-white/70 tracking-wide uppercase">
          {project?.name || 'Live Project'}
        </span>
        <div className="h-3 w-[1px] bg-[#222]"></div>
        {project?.deployment?.status === 'live' ? (
          <a 
            href={project?.deployment?.liveUrl} 
            target="_blank" 
            className="text-[10px] font-black text-blue-500 hover:text-blue-400 tracking-widest uppercase transition-colors"
          >
            LIVE URL
          </a>
        ) : (
          <span className="text-[10px] font-bold text-white/20 tracking-widest uppercase">
            STAGING
          </span>
        )}
      </div>

      {/* Right items: Actions */}
      <div className="flex items-center gap-4">
        <div className="flex items-center p-1 bg-[#1A1A1A] border border-[#333] rounded-sm">
          <button
            onClick={() => setPreviewMode('desktop')}
            className={`px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-sm transition-colors ${
              previewMode === 'desktop' ? 'bg-blue-600 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
            title="Desktop Preview"
          >
            Desktop
          </button>
          <button
            onClick={() => setPreviewMode('mobile')}
            className={`px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-sm transition-colors ${
              previewMode === 'mobile' ? 'bg-blue-600 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
            title="Mobile Preview"
          >
            Mobile
          </button>
        </div>

        <ExportDropdown projectId={project?._id || project?.id} />

        <button 
          onClick={handleDeploy}
          disabled={isDeploying || isSaving}
          className="relative group overflow-hidden bg-white px-6 py-2 rounded-sm transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-white/5"
        >
          <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <span className="relative z-10 text-[11px] font-black uppercase tracking-widest text-black group-hover:text-white transition-colors flex items-center gap-2">
            {isDeploying ? (
              <>
                <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Deploying...
              </>
            ) : (
              'Deploy to Live'
            )}
          </span>
        </button>
      </div>

      {/* Success Modal */}
      <DeploymentModal 
        isOpen={showDeployModal} 
        onClose={() => setShowDeployModal(false)}
        liveUrl={deployedData?.liveUrl}
        projectName={project?.name}
      />
    </div>
  );
};

export default TopNavbar;
