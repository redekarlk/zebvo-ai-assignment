'use client';

import { useState } from 'react';
import projectService from '@/services/project.service';

export default function BusinessInfoForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    businessName: '',
    businessDescription: '',
    businessType: '',
    industry: '',
    targetAudience: '',
    contactEmail: '',
    contactPhone: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit?.(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="business-info-form">
      <input
        type="text"
        name="businessName"
        placeholder="Business Name"
        value={formData.businessName}
        onChange={handleChange}
        required
      />
      <textarea
        name="businessDescription"
        placeholder="Business Description"
        value={formData.businessDescription}
        onChange={handleChange}
      />
      <input
        type="text"
        name="businessType"
        placeholder="Business Type"
        value={formData.businessType}
        onChange={handleChange}
      />
      <input
        type="text"
        name="industry"
        placeholder="Industry"
        value={formData.industry}
        onChange={handleChange}
      />
      <input
        type="text"
        name="targetAudience"
        placeholder="Target Audience"
        value={formData.targetAudience}
        onChange={handleChange}
      />
      <input
        type="email"
        name="contactEmail"
        placeholder="Contact Email"
        value={formData.contactEmail}
        onChange={handleChange}
      />
      <input
        type="tel"
        name="contactPhone"
        placeholder="Contact Phone"
        value={formData.contactPhone}
        onChange={handleChange}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Project'}
      </button>
    </form>
  );
}
