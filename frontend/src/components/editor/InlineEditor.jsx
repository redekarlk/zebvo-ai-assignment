'use client';

import { useState, useContext, useMemo } from 'react';
import { EditModeContext } from '@/context/EditModeContext';
import { useEditableSection } from '@/hooks/useEditableSection';
import { getEditableFields } from '@/lib/componentRegistry';
import Input from '@/components/common/Input';
import Textarea from '@/components/common/Textarea';
import Button from '@/components/common/Button';
import { motion, AnimatePresence } from 'framer-motion';

export default function InlineEditor({ sectionId, section }) {
  const { editMode, setSelectedSection } = useContext(EditModeContext);
  const { updateField, getFieldValue } = useEditableSection(sectionId);
  const [editingField, setEditingField] = useState(null);
  const [activeTab, setActiveTab] = useState('content'); // content, style, advanced

  const fields = useMemo(() => {
    return section?.type ? getEditableFields(section.type) : [];
  }, [section?.type]);

  if (!editMode || !section) return null;

  const handleFieldChange = (fieldPath, value) => {
    updateField(fieldPath, value);
  };

  return (
    <div className="flex flex-col h-full bg-[#111111] text-white border-l border-[#222] shadow-2xl overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-bottom border-[#222] bg-[#161616]">
        <div>
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1 block">Active Section</span>
          <h3 className="text-sm font-semibold text-white/90 capitalize flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            {section.type} Settings
          </h3>
        </div>
        <button
          className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
          onClick={() => setSelectedSection(null)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex px-4 py-2 bg-[#161616] border-bottom border-[#222] gap-1">
        {['content', 'style', 'advanced'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider rounded-md transition-all ${
              activeTab === tab ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-white/30 hover:text-white/60'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Fields Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'content' ? (
            <motion.div
              key="content"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              {fields.map((field) => {
                const fieldValue = getFieldValue(field.path);
                const isEditing = editingField === field.field;

                return (
                  <div key={field.field} className="group flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider group-focus-within:text-blue-500 transition-colors">
                      {field.field}
                    </label>

                    {field.type === 'textarea' ? (
                      <textarea
                        value={fieldValue || ''}
                        onChange={(e) => handleFieldChange(field.path, e.target.value)}
                        placeholder={`Write ${field.field}...`}
                        rows={4}
                        className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-4 text-sm text-white/80 focus:outline-none focus:border-blue-600/50 focus:ring-4 focus:ring-blue-600/10 transition-all resize-none placeholder:text-white/10"
                      />
                    ) : field.type === 'array' ? (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          {(Array.isArray(fieldValue) ? fieldValue : []).map((item, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-[#1A1A1A] border border-[#333] rounded-lg group/item hover:border-blue-600/30 transition-all">
                              <span className="text-[10px] font-mono text-white/20">{index + 1}</span>
                              <div className="flex-1 truncate text-xs text-white/60">
                                {typeof item === 'object' ? (item.title || item.question || item.name || 'Untitled') : item}
                              </div>
                              <button className="opacity-0 group-item-hover:opacity-100 p-1 hover:text-red-400 transition-all">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                        <button className="w-full py-3 border-2 border-dashed border-[#333] rounded-xl text-[11px] font-bold text-white/20 uppercase tracking-widest hover:border-blue-600/50 hover:text-blue-500 transition-all">
                          + Add New {field.field.slice(0, -1)}
                        </button>
                      </div>
                    ) : (
                      <input
                        value={fieldValue || ''}
                        onChange={(e) => handleFieldChange(field.path, e.target.value)}
                        type="text"
                        className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-3 text-sm text-white/80 focus:outline-none focus:border-blue-600/50 focus:ring-4 focus:ring-blue-600/10 transition-all placeholder:text-white/10"
                      />
                    )}
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 text-white/20">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Coming Soon</h4>
              <p className="text-[11px] text-white/20 mt-2 max-w-[180px]">Advanced visual styling controls are being unlocked for this template.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      <div className="p-6 bg-[#161616] border-t border-[#222] space-y-3">
        <button 
          className="w-full py-4 bg-white text-black font-black text-[11px] uppercase tracking-[0.2em] rounded-lg hover:bg-blue-500 hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95"
          onClick={() => setSelectedSection(null)}
        >
          Done Editing
        </button>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
