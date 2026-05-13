'use client';

import { useState } from 'react';
import Modal from '@/components/common/Modal';
import TemplateGallery from './TemplateGallery';
import Button from '@/components/common/Button';

export default function CreateProjectModal({ onClose, onCreate }) {
  const [step, setStep] = useState('template'); // 'template' or 'details'
  const [name, setName] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelectTemplate = (templateId) => {
    setSelectedTemplateId(templateId);
  };

  const handleContinue = () => {
    if (selectedTemplateId || step === 'details') {
      setStep('details');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a project name');
      return;
    }

    setLoading(true);
    try {
      await onCreate({
        name: name.trim(),
        templateId: selectedTemplateId,
      });
      onClose();
    } catch (err) {
      alert('Failed to create project: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {step === 'template' ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Choose a Template</h2>
              <p className="text-gray-600">Select a template to get started with your website</p>
            </div>

            <TemplateGallery
              onSelectTemplate={handleSelectTemplate}
              selectedTemplateId={selectedTemplateId}
            />

            <div className="flex gap-3 justify-end mt-8 pt-6 border-t">
              <Button onClick={onClose} variant="secondary">
                Cancel
              </Button>
              <Button
                onClick={handleContinue}
                disabled={!selectedTemplateId}
                variant="primary"
              >
                Continue
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Project Details</h2>
              <p className="text-gray-600">Give your project a name</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., My Awesome Website"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  autoFocus
                />
              </div>

              <div className="flex gap-3 justify-end pt-6 border-t">
                <Button onClick={() => setStep('template')} variant="secondary">
                  Back
                </Button>
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Project'}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </Modal>
  );
}
