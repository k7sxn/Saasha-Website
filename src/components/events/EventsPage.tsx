import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/supabase';
import PageLayout from '../layout/PageLayout';
import EventCard from './EventCard';

type Event = Database['public']['Tables']['events']['Row'];

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('published', true)
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-saasha-brown dark:text-dark-text mb-4">
              Our Events
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Join us in making a difference through our various events and initiatives
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-saasha-brown"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                No events are currently scheduled. Please check back later!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default EventsPage;
