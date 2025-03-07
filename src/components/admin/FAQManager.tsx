import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import RichTextEditor from './RichTextEditor';
import type { FAQ } from '../../types/faq';

const FAQManager = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FAQ>({
    question: '',
    answer: '',
    order: 0
  });

  useEffect(() => {
    fetchFAQs();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from('faqs')
          .update(formData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('faqs')
          .insert([{ ...formData, order: faqs.length }]);
        if (error) throw error;
      }

      // Reset form
      setFormData({ question: '', answer: '', order: 0 });
      setEditingId(null);
      await fetchFAQs();
    } catch (error) {
      console.error('Error saving FAQ:', error);
      alert('Failed to save FAQ. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (faq: FAQ) => {
    setFormData(faq);
    setEditingId(faq.id!);
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
      await fetchFAQs();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      alert('Failed to delete FAQ. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (id: number, newOrder: number) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('faqs')
        .update({ order: newOrder })
        .eq('id', id);
      
      if (error) throw error;
      await fetchFAQs();
    } catch (error) {
      console.error('Error reordering FAQ:', error);
      alert('Failed to reorder FAQ. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
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

      <div className="bg-white dark:bg-dark-secondary rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-saasha-brown dark:text-dark-text mb-4">
            Manage FAQs
          </h2>
          
          {loading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-saasha-rose"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={faq.id}
                  className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex-grow mr-4">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{faq.question}</h3>
                    <div 
                      className="mt-1 text-sm text-gray-500 dark:text-gray-400 prose dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    {index > 0 && (
                      <button
                        onClick={() => handleReorder(faq.id!, index - 1)}
                        className="p-1 text-gray-400 hover:text-gray-500"
                      >
                        ↑
                      </button>
                    )}
                    {index < faqs.length - 1 && (
                      <button
                        onClick={() => handleReorder(faq.id!, index + 1)}
                        className="p-1 text-gray-400 hover:text-gray-500"
                      >
                        ↓
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(faq)}
                      className="p-1 text-saasha-rose hover:text-saasha-rose/80"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id!)}
                      className="p-1 text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQManager;
