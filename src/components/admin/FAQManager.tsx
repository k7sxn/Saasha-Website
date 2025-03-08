import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import RichTextEditor from './RichTextEditor';
import type { Database } from '../../types/supabase';

type FAQ = Database['public']['Tables']['faqs']['Row'];
type FAQInsert = Database['public']['Tables']['faqs']['Insert'];
type FAQUpdate = Database['public']['Tables']['faqs']['Update'];

const FAQManager = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FAQInsert>({
    question: '',
    answer: '',
    order: 0
  });
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  const fetchFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      showNotification('Failed to fetch FAQs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        const updateData: FAQUpdate = {
          question: formData.question,
          answer: formData.answer,
          order: formData.order
        };
        
        const { error } = await supabase
          .from('faqs')
          .update(updateData)
          .eq('id', editingId);
          
        if (error) {
          console.error('Supabase update error:', error);
          throw error;
        }
        showNotification('FAQ updated successfully', 'success');
      } else {
        const insertData: FAQInsert = {
          question: formData.question,
          answer: formData.answer,
          order: faqs.length
        };

        const { error } = await supabase
          .from('faqs')
          .insert([insertData]);

        if (error) throw error;
        showNotification('FAQ published successfully', 'success');
      }

      setFormData({ question: '', answer: '', order: 0 });
      setEditingId(null);
      setShowForm(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      await fetchFAQs();
    } catch (error) {
      console.error('Error saving FAQ:', error);
      showNotification(
        `Failed to save FAQ: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (faq: FAQ) => {
    const editData: FAQInsert = {
      question: faq.question,
      answer: faq.answer,
      order: faq.order
    };
    setFormData(editData);
    setEditingId(faq.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      showNotification('FAQ deleted successfully', 'success');
      await fetchFAQs();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      showNotification('Failed to delete FAQ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (id: number, direction: 'up' | 'down') => {
    const currentIndex = faqs.findIndex(faq => faq.id === id);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= faqs.length) return;

    try {
      setLoading(true);
      
      const otherFaq = faqs[newIndex];
      
      const updates = [
        supabase
          .from('faqs')
          .update({ order: otherFaq.order })
          .eq('id', id),
        supabase
          .from('faqs')
          .update({ order: faqs[currentIndex].order })
          .eq('id', otherFaq.id)
      ];
      
      const results = await Promise.all(updates);
      if (results.some(result => result.error)) {
        throw new Error('Failed to reorder FAQs');
      }
      
      showNotification('FAQ reordered successfully', 'success');
      await fetchFAQs();
    } catch (error) {
      console.error('Error reordering FAQ:', error);
      showNotification('Failed to reorder FAQ', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {notification && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg z-50 transition-opacity duration-300 ${
            notification.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          {notification.message}
        </div>
      )}

      {!showForm ? (
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-saasha-brown dark:text-dark-text">
                FAQs
              </h2>
              <button
                onClick={() => setShowForm(true)}
                className="bg-saasha-rose text-white px-4 py-2 rounded-md hover:bg-saasha-rose/90"
              >
                Create New FAQ
              </button>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-saasha-rose"></div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Question
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-dark-secondary divide-y divide-gray-200 dark:divide-gray-700">
                  {faqs.map((faq) => (
                    <tr key={faq.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        {faq.question}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {faq.order}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(faq)}
                          className="text-saasha-rose hover:text-saasha-rose/80 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(faq.id!)}
                          className="text-red-600 hover:text-red-700 mr-4"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleReorder(faq.id!, 'up')}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600 mr-2"
                          disabled={faq.order === 0}
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleReorder(faq.id!, 'down')}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600"
                          disabled={faq.order === faqs.length - 1}
                        >
                          ↓
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-secondary rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-saasha-brown dark:text-dark-text mb-4">
            {editingId ? 'Edit FAQ' : 'Add New FAQ'}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Question
              </label>
              <input
                type="text"
                id="question"
                value={formData.question}
                onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-saasha-rose focus:ring-saasha-rose dark:bg-dark-primary dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="answer" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Answer
              </label>
              <RichTextEditor
                value={formData.answer}
                onChange={(value) => setFormData(prev => ({ ...prev, answer: value }))}
              />
            </div>

            <div className="flex justify-end space-x-3">
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ question: '', answer: '', order: 0 });
                    setEditingId(null);
                    setShowForm(false);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-dark-primary dark:text-gray-300 dark:border-gray-600 dark:hover:bg-dark-primary/90"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-saasha-brown hover:bg-saasha-brown/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saasha-brown disabled:opacity-50"
              >
                {loading ? 'Saving...' : editingId ? 'Update FAQ' : 'Add FAQ'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default FAQManager;
