import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { supabase, uploadImage } from '../../lib/supabase';
import { BlogFormData } from '../../types/blog';
import RichTextEditor from './RichTextEditor';

const EditBlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    content: '',
    headerImage: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (location.state?.post) {
      const { post } = location.state;
      setFormData({
        title: post.title,
        content: post.content,
        headerImage: post.header_image,
        tags: post.tags,
      });
      setLoading(false);
    } else {
      fetchPost();
    }
  }, [location.state, slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          title: data.title,
          content: data.content,
          headerImage: data.header_image,
          tags: data.tags,
        });
      }
    } catch (err) {
      console.error('Error fetching post:', err);
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Create new slug from title if title has changed
      const newSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({
          title: formData.title,
          content: formData.content,
          header_image: formData.headerImage,
          tags: formData.tags,
          slug: newSlug,
        })
        .eq('slug', slug);

      if (updateError) throw updateError;

      // Navigate to the updated blog post
      navigate(`/blog/${newSlug}`);
    } catch (err) {
      console.error('Error updating post:', err);
      setError('Failed to update blog post');
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-saasha-rose"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-saasha-brown dark:text-white">
          Edit Blog Post
        </h2>

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

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-saasha-rose text-white rounded-md hover:bg-saasha-rose/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saasha-rose disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlogPost;
