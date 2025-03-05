import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BlogFormData } from '../../types/blog';
import RichTextEditor from './RichTextEditor';
import { supabase, uploadImage } from '../../lib/supabase';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    content: '',
    headerImage: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Create slug from title
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      // Insert into Supabase
      const { data, error: insertError } = await supabase
        .from('blog_posts')
        .insert([
          {
            title: formData.title,
            content: formData.content,
            header_image: formData.headerImage,
            tags: formData.tags,
            slug,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // Reset form
      setFormData({
        title: '',
        content: '',
        headerImage: '',
        tags: [],
      });
      setTagInput('');

      // Navigate to the new blog post
      navigate(`/blog/${slug}`);
    } catch (err) {
      setError('Failed to create blog post. Please try again.');
      console.error('Error creating blog post:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHeaderImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imageUrl = await uploadImage(file);
        setFormData(prev => ({ ...prev, headerImage: imageUrl }));
      } catch (error) {
        console.error('Failed to upload header image:', error);
      }
    }
  };

  const handleTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-saasha-brown dark:text-white">Admin Dashboard</h1>
          <button
            onClick={() => {
              logout();
              navigate('/admin');
            }}
            className="bg-saasha-rose text-white px-4 py-2 rounded-md hover:bg-saasha-rose/90"
          >
            Logout
          </button>
        </div>

        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-saasha-brown dark:text-white">Create New Blog Post</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-saasha-brown dark:text-gray-200 mb-1">
                Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-saasha-rose focus:border-saasha-rose bg-white dark:bg-dark-secondary text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-saasha-brown dark:text-gray-200 mb-1">
                Header Image
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeaderImageUpload}
                  className="text-sm text-gray-500 dark:text-gray-300
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-saasha-rose file:text-white
                  hover:file:bg-saasha-rose/90"
                />
                {formData.headerImage && (
                  <img 
                    src={formData.headerImage} 
                    alt="Header preview" 
                    className="h-20 w-20 object-cover rounded"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-saasha-brown dark:text-gray-200 mb-1">
                Tags (Press Enter to add)
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagAdd}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-saasha-rose focus:border-saasha-rose bg-white dark:bg-dark-secondary text-gray-900 dark:text-white"
                placeholder="Enter tags..."
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-saasha-rose text-white"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      className="ml-1 hover:text-saasha-cream"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-saasha-brown dark:text-gray-200 mb-1">
                Content
              </label>
              <RichTextEditor
                content={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-saasha-rose text-white py-2 px-4 rounded-md hover:bg-saasha-rose/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saasha-rose disabled:opacity-50"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Blog Post'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
