import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import RichTextEditor from './RichTextEditor';

interface FAQ {
  id?: number;
  question: string;
  answer: string;
  order: number;
}

const FAQManager = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [newFaq, setNewFaq] = useState<FAQ>({
    question: '',
    answer: '',
    order: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('order');
      
      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      alert('Failed to load FAQs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (faq: FAQ) => {
    try {
      if (faq.id) {
        // Update existing FAQ
        const { error } = await supabase
          .from('faqs')
          .update({
            question: faq.question,
            answer: faq.answer,
            order: faq.order,
          })
          .eq('id', faq.id);
        
        if (error) throw error;
      } else {
        // Create new FAQ
        const { error } = await supabase
          .from('faqs')
          .insert([{
            question: faq.question,
            answer: faq.answer,
            order: faqs.length, // Add to end of list
          }]);
        
        if (error) throw error;
      }

      fetchFAQs();
      setEditingFaq(null);
      setNewFaq({
        question: '',
        answer: '',
        order: 0,
      });
    } catch (error) {
      console.error('Error saving FAQ:', error);
      alert('Failed to save FAQ');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchFAQs();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      alert('Failed to delete FAQ');
    }
  };

  const handleReorder = async (id: number, newOrder: number) => {
    try {
      const { error } = await supabase
        .from('faqs')
        .update({ order: newOrder })
        .eq('id', id);
      
      if (error) throw error;
      fetchFAQs();
    } catch (error) {
      console.error('Error reordering FAQ:', error);
      alert('Failed to reorder FAQ');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-saasha-brown"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Add new FAQ form */}
      <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-saasha-brown dark:text-dark-text mb-4">
          Add New FAQ
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Question
            </label>
            <input
              type="text"
              value={newFaq.question}
              onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-saasha-rose dark:bg-dark-primary dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Answer
            </label>
            <RichTextEditor
              content={newFaq.answer}
              onChange={(content) => setNewFaq({ ...newFaq, answer: content })}
            />
          </div>
          <button
            onClick={() => handleSave(newFaq)}
            disabled={!newFaq.question || !newFaq.answer}
            className="bg-saasha-brown text-white px-4 py-2 rounded-md hover:bg-saasha-brown/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add FAQ
          </button>
        </div>
      </div>

      {/* Existing FAQs */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={faq.id} className="bg-white dark:bg-dark-secondary rounded-lg shadow p-6">
            {editingFaq?.id === faq.id ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editingFaq.question}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-saasha-rose dark:bg-dark-primary dark:border-gray-600"
                />
                <RichTextEditor
                  content={editingFaq.answer}
                  onChange={(content) => setEditingFaq({ ...editingFaq, answer: content })}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSave(editingFaq)}
                    className="bg-saasha-brown text-white px-4 py-2 rounded-md hover:bg-saasha-brown/90"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingFaq(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-saasha-brown dark:text-dark-text">
                    {faq.question}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingFaq(faq)}
                      className="text-saasha-rose hover:text-saasha-rose/80"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id!)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                    <div className="flex space-x-1">
                      {index > 0 && (
                        <button
                          onClick={() => handleReorder(faq.id!, index - 1)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          ↑
                        </button>
                      )}
                      {index < faqs.length - 1 && (
                        <button
                          onClick={() => handleReorder(faq.id!, index + 1)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          ↓
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className="prose prose-sm dark:prose-invert max-w-none
                    prose-headings:text-saasha-brown dark:prose-headings:text-dark-text
                    prose-p:text-gray-600 dark:prose-p:text-gray-400"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQManager;
