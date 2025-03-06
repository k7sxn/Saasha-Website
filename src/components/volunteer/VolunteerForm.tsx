import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface FormData {
  full_name: string;
  email: string;
  phone: string;
  interests: string[];
  availability: string[];
  skills: string[];
  experience: string;
}

const INTERESTS_OPTIONS = [
  'Education',
  'Healthcare',
  'Community Service',
  'Environmental',
  'Social Justice',
  'Arts & Culture',
  'Youth Mentoring',
];

const AVAILABILITY_OPTIONS = [
  'Weekday Mornings',
  'Weekday Afternoons',
  'Weekday Evenings',
  'Weekend Mornings',
  'Weekend Afternoons',
  'Weekend Evenings',
];

const SKILLS_OPTIONS = [
  'Teaching',
  'Healthcare',
  'Social Work',
  'Event Planning',
  'Marketing',
  'Technology',
  'Administration',
  'Leadership',
  'Other',
];

const VolunteerForm = () => {
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    email: '',
    phone: '',
    interests: [],
    availability: [],
    skills: [],
    experience: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Validate required fields
      if (!formData.full_name || !formData.email || !formData.phone) {
        throw new Error('Please fill in all required fields');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate phone format (basic validation)
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      if (!phoneRegex.test(formData.phone)) {
        throw new Error('Please enter a valid phone number');
      }

      // Validate at least one interest and availability
      if (formData.interests.length === 0) {
        throw new Error('Please select at least one area of interest');
      }
      if (formData.availability.length === 0) {
        throw new Error('Please select your availability');
      }

      const { error } = await supabase
        .from('volunteer_registrations')
        .insert([{
          ...formData,
          status: 'pending',
          created_at: new Date().toISOString(),
        }]);

      if (error) throw error;
      
      setSubmitStatus('success');
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        interests: [],
        availability: [],
        skills: [],
        experience: '',
      });
    } catch (error) {
      console.error('Error submitting volunteer application:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'There was an error submitting your application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-dark-secondary rounded-lg p-8 shadow-lg">
      {submitStatus === 'success' && (
        <div className="bg-green-50 dark:bg-green-900 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Thank you for your interest! Your application has been submitted successfully.
              </p>
            </div>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="bg-red-50 dark:bg-red-900 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                {errorMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-saasha-brown dark:text-dark-text">
          Personal Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              required
              value={formData.full_name}
              onChange={handleInputChange}
              disabled={submitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-saasha-rose focus:border-saasha-rose dark:bg-dark-secondary dark:border-gray-600 dark:text-white disabled:opacity-50"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              disabled={submitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-saasha-rose focus:border-saasha-rose dark:bg-dark-secondary dark:border-gray-600 dark:text-white disabled:opacity-50"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
              disabled={submitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-saasha-rose focus:border-saasha-rose dark:bg-dark-secondary dark:border-gray-600 dark:text-white disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {/* Interests */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-saasha-brown dark:text-dark-text">
          Areas of Interest
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {INTERESTS_OPTIONS.map((interest) => (
            <label key={interest} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.interests.includes(interest)}
                onChange={() => handleCheckboxChange('interests', interest)}
                disabled={submitting}
                className="rounded text-saasha-rose focus:ring-saasha-rose"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{interest}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-saasha-brown dark:text-dark-text">
          Availability
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {AVAILABILITY_OPTIONS.map((time) => (
            <label key={time} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.availability.includes(time)}
                onChange={() => handleCheckboxChange('availability', time)}
                disabled={submitting}
                className="rounded text-saasha-rose focus:ring-saasha-rose"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{time}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-saasha-brown dark:text-dark-text">
          Skills & Expertise
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {SKILLS_OPTIONS.map((skill) => (
            <label key={skill} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.skills.includes(skill)}
                onChange={() => handleCheckboxChange('skills', skill)}
                disabled={submitting}
                className="rounded text-saasha-rose focus:ring-saasha-rose"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{skill}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-saasha-brown dark:text-dark-text">
          Previous Volunteer Experience
        </h3>
        <textarea
          name="experience"
          rows={4}
          value={formData.experience}
          onChange={handleInputChange}
          disabled={submitting}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-saasha-rose focus:border-saasha-rose dark:bg-dark-secondary dark:border-gray-600 dark:text-white disabled:opacity-50"
          placeholder="Please share any relevant volunteer experience..."
        />
      </div>

      {/* Submit Button */}
      <div className="flex flex-col items-center space-y-4">
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-saasha-rose text-white py-2 px-4 rounded-md hover:bg-saasha-rose/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saasha-rose disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : 'Submit Application'}
        </button>
      </div>
    </form>
  );
};

export default VolunteerForm;
