import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/supabase';
import PageLayout from '../layout/PageLayout';

type Event = Database['public']['Tables']['events']['Row'];

const Gallery = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('published', true)
        .order('date', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-saasha-brown dark:text-dark-text mb-8">
          Event Gallery
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            event.header_image && (
              <div
                key={event.id}
                className="group relative overflow-hidden rounded-lg shadow-lg bg-white dark:bg-dark-secondary transform transition duration-300 hover:scale-105"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={event.header_image}
                    alt={event.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-200">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Gallery;
