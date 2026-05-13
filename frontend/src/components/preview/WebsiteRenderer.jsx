import React, { useEffect, useMemo, useRef, useState } from 'react';
import exportService from '@/services/export.service';
import { useEditorStore } from '@/store/editorStore';

const WebsiteRenderer = ({ project }) => {
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewError, setPreviewError] = useState(null);
  const [isFrameReady, setIsFrameReady] = useState(true);
  const iframeRef = useRef(null);
  const scrollRestoreRef = useRef(null);
  const canvasScrollRestoreRef = useRef(null);
  const pendingSectionRef = useRef(null);
  const lockRafRef = useRef(null);
  const selectedSection = useEditorStore((state) => state.selectedSection);
  const previewMode = useEditorStore((state) => state.previewMode || 'desktop');
  const [isSectionEditing, setIsSectionEditing] = useState(false);

  const injectScrollBootstrap = (rawHtml, y) => {
    const scrollY = Number.isFinite(y) ? Math.max(0, Math.floor(y)) : 0;
    const script = `<script>(function(){var y=${scrollY};function apply(){window.scrollTo(0,y);}document.addEventListener('DOMContentLoaded',apply);requestAnimationFrame(apply);setTimeout(apply,0);})();</script>`;
    const patchListener = `<script>(function(){window.__applyPatch=(sectionId,patches)=>{try{var root=document.getElementById(sectionId);if(!root)return;Object.keys(patches||{}).forEach(function(key){var el=root.querySelector('[data-field="'+key+'"]');if(!el)return;var val=patches[key];if(key==='content'){el.innerHTML=val;}else{el.textContent=val;}});}catch(e){console.error('patch apply error',e)}};window.addEventListener('message',function(e){try{var d=e.data; if(!d||d.type!=='patch')return; __applyPatch(d.sectionId,d.patches);}catch(e){}});})();</script>`;

    if (typeof rawHtml !== 'string' || !rawHtml) return rawHtml;
    if (rawHtml.includes('</body>')) {
      return rawHtml.replace('</body>', `${script}${patchListener}</body>`);
    }
    return `${rawHtml}${script}${patchListener}`;
  };

  const getCanvasScrollContainer = () => {
    if (!iframeRef.current) return null;
    return iframeRef.current.closest('[data-editor-canvas-scroll="true"]');
  };

  const stopCanvasLock = () => {
    if (lockRafRef.current) {
      cancelAnimationFrame(lockRafRef.current);
      lockRafRef.current = null;
    }
  };

  const startCanvasLock = () => {
    stopCanvasLock();

    const tick = () => {
      const canvas = getCanvasScrollContainer();
      if (canvas && canvasScrollRestoreRef.current !== null) {
        canvas.scrollTop = canvasScrollRestoreRef.current;
      }
      lockRafRef.current = requestAnimationFrame(tick);
    };

    lockRafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (project?.seo) {
      if (project.seo.title) {
        document.title = project.seo.title;
      }
      if (project.seo.description) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.name = 'description';
          document.head.appendChild(metaDesc);
        }
        metaDesc.content = project.seo.description;
      }
    }
  }, [project?.seo]);

  const projectPayload = useMemo(() => {
    if (!project) return null;
    return {
      ...project,
      sections: Array.isArray(project.sections) ? project.sections : []
    };
  }, [project]);

  const prevProjectRef = useRef(null);


  const scrollToSectionInIframe = (sectionId, behavior = 'smooth') => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument;
    const win = iframe.contentWindow;
    if (!doc || !win) return;

    if (!sectionId || sectionId === 'page') {
      win.scrollTo({ top: 0, behavior });
      return;
    }

    const el = doc.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior, block: 'start' });
    }
  };

  useEffect(() => {
    const checkEditingState = () => {
      const active = document.activeElement;
      const editing = !!active && !!active.closest?.('[data-section-editor="true"]');
      setIsSectionEditing(editing);
    };

    document.addEventListener('focusin', checkEditingState);
    document.addEventListener('focusout', checkEditingState);

    return () => {
      document.removeEventListener('focusin', checkEditingState);
      document.removeEventListener('focusout', checkEditingState);
    };
  }, []);

  useEffect(() => {
    if (!projectPayload || !projectPayload.sections?.length) {
      setHtml('');
      prevProjectRef.current = projectPayload;
      return;
    }

    // Attempt to send incremental DOM patches to iframe when possible
    const sendPatchesIfPossible = () => {
      const prev = prevProjectRef.current;
      if (!prev) return false;
      if (!Array.isArray(prev.sections)) return false;

      const iframe = iframeRef.current;
      if (!iframe || !iframe.contentWindow) return false;

      let structuralChange = false;
      const fieldsToCheck = ['headline', 'title', 'subheadline', 'description', 'content', 'ctaText', 'buttonText'];

      for (const s of projectPayload.sections) {
        const prevS = prev.sections.find(p => p.id === s.id);
        if (!prevS) {
          structuralChange = true; break;
        }
        if (prevS.type !== s.type) { structuralChange = true; break; }
      }

      if (structuralChange) return false;

      // Build and send patches
      for (const s of projectPayload.sections) {
        const prevS = prev.sections.find(p => p.id === s.id);
        if (!prevS) continue;
        const patches = {};
        const props = s.props || s;
        const prevProps = prevS.props || prevS;
        for (const key of fieldsToCheck) {
          const vNew = props[key] ?? null;
          const vOld = prevProps[key] ?? null;
          const nNew = vNew == null ? '' : String(Array.isArray(vNew) ? vNew.join('\n\n') : vNew);
          const nOld = vOld == null ? '' : String(Array.isArray(vOld) ? vOld.join('\n\n') : vOld);
          if (nNew !== nOld) {
            if (['headline','title'].includes(key)) patches.headline = nNew;
            else if (['subheadline','description'].includes(key)) patches.subheadline = nNew;
            else if (key === 'content') patches.content = nNew;
            else if (['ctaText','buttonText'].includes(key)) patches.cta = nNew;
          }
        }

        if (Object.keys(patches).length > 0) {
          try {
            iframe.contentWindow.postMessage({ type: 'patch', sectionId: s.id, patches }, '*');
          } catch (e) {
            return false;
          }
        }
      }

      prevProjectRef.current = projectPayload;
      return true;
    };

    if (isSectionEditing) {
      const sent = sendPatchesIfPossible();
      if (sent) return; // patches applied while editing, skip full refresh
    }

    let isActive = true;
    setLoading(true);
    setPreviewError(null);

    const timer = setTimeout(async () => {
      try {
        const iframe = iframeRef.current;
        if (iframe?.contentWindow) {
          scrollRestoreRef.current = iframe.contentWindow.scrollY || 0;
        }

        const canvas = getCanvasScrollContainer();
        if (canvas) {
          canvasScrollRestoreRef.current = canvas.scrollTop || 0;
        }

        startCanvasLock();
        setIsFrameReady(false);

        const generatedHtml = await exportService.getPreviewHTML(projectPayload);
        if (isActive) {
          const nextHtml = typeof generatedHtml === 'string'
            ? injectScrollBootstrap(generatedHtml, scrollRestoreRef.current || 0)
            : '';
          setHtml(nextHtml);
          prevProjectRef.current = projectPayload;
        }
      } catch (error) {
        if (isActive) {
          setPreviewError('Failed to render deploy-accurate preview.');
          setHtml('');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }, 350);

    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, [projectPayload, isSectionEditing]);

  useEffect(() => {
    if (!selectedSection?.id) return;
    pendingSectionRef.current = selectedSection.id;
    scrollToSectionInIframe(selectedSection.id);
  }, [selectedSection?.id]);

  const handleIframeLoad = () => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;

    if (scrollRestoreRef.current !== null) {
      iframe.contentWindow.scrollTo({ top: scrollRestoreRef.current, behavior: 'auto' });
    }

    const canvas = getCanvasScrollContainer();
    if (canvas && canvasScrollRestoreRef.current !== null) {
      canvas.scrollTop = canvasScrollRestoreRef.current;
    }

    if (pendingSectionRef.current) {
      scrollToSectionInIframe(pendingSectionRef.current, 'smooth');
      pendingSectionRef.current = null;
    }

    requestAnimationFrame(() => {
      stopCanvasLock();
      setIsFrameReady(true);
    });
  };

  useEffect(() => {
    return () => {
      stopCanvasLock();
    };
  }, []);

  if (!project || !project.sections) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-500">
        <p className="text-xl">No project data available.</p>
      </div>
    );
  }

  if (loading && !html) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-500">
        <p className="text-xl">Updating live preview...</p>
      </div>
    );
  }

  if (previewError && !html) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-red-500">
        <p className="text-lg">{previewError}</p>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-full relative"
      style={{ 
        overflow: previewMode === 'desktop' ? 'visible' : 'hidden',
        minHeight: '100%'
      }}
    >
      <iframe
        ref={iframeRef}
        title="Website Preview"
        srcDoc={html}
        onLoad={handleIframeLoad}
        className="bg-white transition-all duration-500 ease-in-out shadow-2xl"
        style={{ 
          border: 0, 
          opacity: isFrameReady ? 1 : 0,
          width: previewMode === 'desktop' ? '142.85%' : '100%',
          height: previewMode === 'desktop' ? '142.85%' : '100%',
          minHeight: previewMode === 'desktop' ? '142.85vh' : '100vh',
          transform: previewMode === 'desktop' ? 'scale(0.7)' : 'scale(1)',
          transformOrigin: 'top center',
          marginLeft: previewMode === 'desktop' ? '-21.425%' : '0',
          borderRadius: previewMode === 'mobile' ? '12px' : '0',
        }}
      />
    </div>
  );
};

export default WebsiteRenderer;
