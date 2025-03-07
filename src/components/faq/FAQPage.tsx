import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import PageLayout from '../layout/PageLayout';
import type { FAQ } from '../../types/faq';

const FAQPage = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-saasha-brown dark:text-dark-text mb-8">
          Frequently Asked Questions
        </h1>
        
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-saasha-rose"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white dark:bg-dark-secondary rounded-lg shadow-sm p-6"
              >
                <h3 className="text-xl font-semibold text-saasha-brown dark:text-dark-text mb-3">
                  {faq.question}
                </h3>
                <div 
                  className="prose prose-lg dark:prose-invert max-w-none
                    prose-p:text-base prose-p:text-gray-700 dark:prose-p:text-gray-300"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default FAQPage;
