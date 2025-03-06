import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { Database } from '../../lib/database.types';
import parse from 'html-react-parser';
import PageLayout from '../layout/PageLayout';

type Event = Database['public']['Tables']['events']['Row'];

const EventPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .eq('published', true)
          .single();

        if (error) throw error;
        setEvent(data);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-saasha-rose"></div>
        </div>
      </PageLayout>
    );
  }

  if (error || !event) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-saasha-brown dark:text-dark-text mb-4">
              {error || 'Event not found'}
            </h1>
            <a
              href="/events"
              className="text-saasha-rose hover:text-saasha-rose/80"
            >
              Back to Events
            </a>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-lg overflow-hidden">
            {event.image && (
              <div className="relative h-64 sm:h-96">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-saasha-brown dark:text-dark-text">
                  {event.title}
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium
                  ${event.status === 'upcoming' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    event.status === 'ongoing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
                >
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
              </div>

              <div className="flex items-center text-gray-600 dark:text-gray-400 mb-6">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>

              <div className="flex items-center text-gray-600 dark:text-gray-400 mb-8">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{event.location}</span>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                {parse(event.description || '')}
              </div>

              <div className="mt-8 flex justify-center">
                <a
                  href="/events"
                  className="text-saasha-rose hover:text-saasha-rose/80"
                >
                  Back to Events
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default EventPage;
