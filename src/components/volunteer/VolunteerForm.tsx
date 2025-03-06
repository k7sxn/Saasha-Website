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

    try {
      const { error } = await supabase
        .from('volunteer_registrations')
        .insert([{
          ...formData,
          status: 'pending',
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
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-saasha-brown dark:text-dark-text">
          Personal Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name *
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              required
              value={formData.full_name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-saasha-rose focus:ring-saasha-rose dark:bg-dark-secondary dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-saasha-rose focus:ring-saasha-rose dark:bg-dark-secondary dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-saasha-rose focus:ring-saasha-rose dark:bg-dark-secondary dark:border-gray-600 dark:text-white"
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-saasha-rose focus:ring-saasha-rose dark:bg-dark-secondary dark:border-gray-600 dark:text-white"
          placeholder="Please share any relevant volunteer experience..."
        />
      </div>

      {/* Submit Button */}
      <div className="flex flex-col items-center space-y-4">
        <button
          type="submit"
          disabled={submitting}
          className="w-full md:w-auto px-8 py-3 bg-saasha-rose text-white rounded-lg hover:bg-saasha-rose/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saasha-rose disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : 'Submit Application'}
        </button>

        {submitStatus === 'success' && (
          <p className="text-green-600 dark:text-green-400">
            Thank you for your interest! We'll be in touch soon.
          </p>
        )}
        
        {submitStatus === 'error' && (
          <p className="text-red-600 dark:text-red-400">
            There was an error submitting your application. Please try again.
          </p>
        )}
      </div>
    </form>
  );
};

export default VolunteerForm;
