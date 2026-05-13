"use client";

import React, { useState } from 'react';
import exportService from '@/services/export.service';

const PublishButton = ({ project, onStatusChange }) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [publicUrl, setPublicUrl] = useState('');
  const [copied, setCopied] = useState(false);

  // If already published, we can just show the modal with the URL
  const handleOpenModal = () => {
    if (project.status === 'published' && project.slug) {
      setPublicUrl(`${process.env.NEXT_PUBLIC_CLIENT_URL || window.location.origin}/preview/${project.slug}`);
    }
    setShowModal(true);
  };

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      const projectId = project._id || project.id;
      const response = await exportService.publishProject(projectId);
      
      const data = response.data?.data || response.data;
      setPublicUrl(data.publicUrl);
      
      if (onStatusChange) {
        onStatusChange({ status: 'published', slug: data.slug });
      }
    } catch (error) {
      console.error('Failed to publish project:', error);
      alert('Failed to publish website. Please try again later.');
    } finally {
      setIsPublishing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isPublished = project.status === 'published' && project.slug;

  return (
    <>
      <button
        onClick={handleOpenModal}
        className={`inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-sm font-medium focus:outline-none transition-colors ${
          isPublished 
            ? 'border-green-500 text-green-700 bg-green-50 hover:bg-green-100' 
            : 'border-transparent text-white bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isPublished ? 'Published' : 'Publish'}
      </button>

      {/* Publish Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowModal(false)}></div>

            {/* Modal panel */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-bold text-gray-900" id="modal-title">
                    {publicUrl ? 'Your Website is Live!' : 'Publish Website'}
                  </h3>
                  <div className="mt-2">
                    {publicUrl ? (
                      <div>
                        <p className="text-sm text-gray-500 mb-4">
                          Anyone with this link can view your website.
                        </p>
                        <div className="flex rounded-md shadow-sm">
                          <input
                            type="text"
                            readOnly
                            value={publicUrl}
                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 bg-gray-50"
                          />
                          <button
                            onClick={copyToClipboard}
                            className={`inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium ${copied ? 'text-green-600' : 'text-gray-700 hover:bg-gray-100'}`}
                          >
                            {copied ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <a 
                            href={publicUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                          >
                            Open Link
                          </a>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Are you ready to publish your website? This will generate a public link that you can share with the world.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                {!publicUrl && (
                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {isPublishing ? 'Publishing...' : 'Publish Now'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  {publicUrl ? 'Close' : 'Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PublishButton;
