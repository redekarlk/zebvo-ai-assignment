"use client";

import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import EditorSidebar from '@/components/editor/EditorSidebar';
import WebsiteRenderer from '@/components/preview/WebsiteRenderer';
import projectService from '@/services/project.service';
import { useEditorStore } from '@/store/editorStore';
import { EditorSkeleton } from '@/components/common/Skeleton';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import TopNavbar from '@/components/editor/TopNavbar';
import SectionEditor from '@/components/editor/SectionEditor';
import { EditModeContext } from '@/context/EditModeContext';

const EditorPage = () => {
  const params = useParams();
  const { id } = params || {};
  
  const [loading, setLoading] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(380);
  const isResizing = useRef(false);
  
  const project = useEditorStore((state) => state.project);
  const setProject = useEditorStore((state) => state.setProject);
  const error = useEditorStore((state) => state.error);
  const hasUnsavedChanges = useEditorStore((state) => state.hasUnsavedChanges);
  const previewMode = useEditorStore((state) => state.previewMode || 'desktop');

  const startResizing = useCallback((e) => {
    isResizing.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResizing);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const stopResizing = useCallback(() => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopResizing);
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isResizing.current) return;
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth > 280 && newWidth < 600) {
      setSidebarWidth(newWidth);
    }
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await projectService.getProject(id);
        const projectData = response.data?.data || response.data || response;
        setProject(projectData);
        useEditorStore.getState().setUnsavedChanges(false);
      } catch (err) {
        console.error("Failed to load project:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
    return () => setProject(null);
  }, [id, setProject]);

  if (loading) {
    return (
      <div className="flex w-full h-screen overflow-hidden bg-[#0A0A0A]">
        <div className="w-[260px] flex-shrink-0 h-full border-r border-[#222] bg-[#111]">
           <EditorSkeleton />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-sm animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <ProtectedRoute>
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        * { scrollbar-width: none; }
        *::-webkit-scrollbar { display: none; }
      `}</style>
      <div className="flex flex-col w-full h-screen overflow-hidden bg-[#000000] font-sans">
        <TopNavbar project={project} onSave={() => useEditorStore.getState().saveProject()} isSaving={useEditorStore.getState().isSaving} />

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-[260px] flex-shrink-0 h-full bg-[#111111] border-r border-[#222] z-10 flex-col hidden md:flex">
             <EditorSidebar />
          </div>

          {/* Main Canvas */}
          <div data-editor-canvas-scroll="true" className="flex-1 h-full overflow-y-auto no-scrollbar bg-[#0A0A0A] p-4 md:p-6">
            <div
              className={`h-full mx-auto transition-all duration-300 ${previewMode === 'mobile' ? 'w-full max-w-sm' : 'w-full'}`}
            >
              <WebsiteRenderer project={project} />
            </div>
          </div>

          {/* Resizer Handle */}
          <div 
            onMouseDown={startResizing}
            className="w-1 hover:w-1.5 bg-transparent hover:bg-blue-600/50 cursor-col-resize z-50 transition-all active:bg-blue-600"
          />

          {/* Right Sidebar Editor */}
          <div 
            style={{ width: `${sidebarWidth}px` }}
            className="flex-shrink-0 h-full bg-[#0D0D0D] border-l border-[#222] z-10 overflow-hidden flex flex-col shadow-2xl relative"
          >
            <SectionEditor />
          </div>
        </div>

        {/* Error Toast */}
        {error && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-sm z-50 shadow-2xl font-bold animate-pulse">
            {error}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default EditorPage;
