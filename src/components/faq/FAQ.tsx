import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/supabase';
import PageLayout from '../layout/PageLayout';

type FAQ = Database['public']['Tables']['faqs']['Row'];

const FAQ = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('published', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-saasha-rose"></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <section className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-saasha-brown dark:text-dark-text mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Find answers to common questions about our organization and initiatives
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white dark:bg-dark-secondary rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-saasha-brown dark:text-dark-text mb-4">
                    {faq.question}
                  </h2>
                  <div 
                    className="prose prose-lg dark:prose-invert max-w-none
                      prose-headings:text-saasha-brown dark:prose-headings:text-dark-text
                      prose-p:text-gray-700 dark:prose-p:text-gray-300
                      prose-a:text-saasha-rose hover:prose-a:text-saasha-rose/80
                      prose-strong:text-saasha-brown dark:prose-strong:text-dark-text
                      prose-ul:ml-6 prose-ul:list-disc prose-ul:list-outside
                      prose-ol:ml-6 prose-ol:list-decimal prose-ol:list-outside
                      prose-li:my-2 prose-li:text-gray-700 dark:prose-li:text-gray-300
                      marker:text-gray-700 dark:marker:text-gray-300"
                    dangerouslySetInnerHTML={{ __html: faq.answer || '' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default FAQ;
