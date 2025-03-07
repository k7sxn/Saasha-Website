import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import PageLayout from '../layout/PageLayout';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  order: number;
}

const FAQPage = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-saasha-brown dark:text-dark-text mb-8">
          Frequently Asked Questions
        </h1>
        
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-saasha-brown"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white dark:bg-dark-secondary rounded-lg shadow-sm p-6"
              >
                <h2 className="text-xl font-semibold text-saasha-brown dark:text-dark-text mb-4">
                  {faq.question}
                </h2>
                <div
                  className="prose prose-lg dark:prose-invert max-w-none
                    prose-headings:text-saasha-brown dark:prose-headings:text-dark-text
                    prose-h1:text-4xl prose-h1:font-bold
                    prose-h2:text-3xl prose-h2:font-semibold
                    prose-h3:text-2xl prose-h3:font-medium
                    prose-h4:text-xl
                    prose-p:text-base prose-p:text-gray-700 dark:prose-p:text-gray-300
                    prose-a:text-saasha-rose hover:prose-a:text-saasha-rose/80
                    prose-strong:text-saasha-brown dark:prose-strong:text-dark-text
                    prose-ul:ml-6 prose-ul:list-disc prose-ul:list-outside
                    prose-ol:ml-6 prose-ol:list-decimal prose-ol:list-outside
                    prose-li:my-2 prose-li:text-gray-700 dark:prose-li:text-gray-300
                    marker:text-gray-700 dark:marker:text-gray-300"
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
