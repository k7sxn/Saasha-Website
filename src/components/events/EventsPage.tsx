import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/supabase';
import { Link, useSearchParams } from 'react-router-dom';
import PageLayout from '../layout/PageLayout';
import { ImageIcon } from 'lucide-react';

type Event = Database['public']['Tables']['events']['Row'];

const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(searchParams.get('filter') || 'all');
  const [view, setView] = useState(searchParams.get('view') || 'list');

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  useEffect(() => {
    setSearchParams(params => {
      if (filter !== 'all') params.set('filter', filter);
      else params.delete('filter');
      if (view !== 'list') params.set('view', view);
      else params.delete('view');
      return params;
    });
  }, [filter, view, setSearchParams]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const now = new Date().toISOString();
      let query = supabase
        .from('events')
        .select('*')
        .eq('published', true);

      if (filter === 'upcoming') {
        query = query.gte('date', now);
      } else if (filter === 'past') {
        query = query.lt('date', now);
      }

      const { data, error } = await query.order('date', { ascending: filter !== 'past' });

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
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-saasha-brown dark:text-dark-text mb-4">
              Our Events
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Join us in making a difference through our various events and initiatives
            </p>

            <div className="flex justify-center space-x-4 mb-8">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                  filter === 'all'
                    ? 'bg-saasha-rose text-white'
                    : 'bg-white dark:bg-dark-secondary text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-secondary/80'
                }`}
              >
                All Events
              </button>
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                  filter === 'upcoming'
                    ? 'bg-saasha-rose text-white'
                    : 'bg-white dark:bg-dark-secondary text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-secondary/80'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilter('past')}
                className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                  filter === 'past'
                    ? 'bg-saasha-rose text-white'
                    : 'bg-white dark:bg-dark-secondary text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-secondary/80'
                }`}
              >
                Past Events
              </button>
            </div>

            <div className="flex justify-center space-x-4 mb-8">
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                  view === 'list'
                    ? 'bg-saasha-rose text-white'
                    : 'bg-white dark:bg-dark-secondary text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-secondary/80'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setView('gallery')}
                className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                  view === 'gallery'
                    ? 'bg-saasha-rose text-white'
                    : 'bg-white dark:bg-dark-secondary text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-secondary/80'
                }`}
              >
                Gallery View
              </button>
            </div>
          </div>

          {events.length === 0 ? (
            <div className="text-center text-gray-600 dark:text-gray-400">
              No {filter === 'upcoming' ? 'upcoming' : filter === 'past' ? 'past' : ''} events at the moment.
            </div>
          ) : view === 'gallery' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {events.map((event) => (
                <Link
                  key={event.id}
                  to={`/event/${event.id}`}
                  className="group relative aspect-square bg-gray-100 dark:bg-dark-secondary rounded-lg overflow-hidden transform transition duration-300 hover:scale-105"
                >
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white text-lg font-semibold mb-2">
                        {event.title}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <Link
                  key={event.id}
                  to={`/event/${event.id}`}
                  className="bg-white dark:bg-dark-secondary rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
                >
                  {event.image && (
                    <div className="relative h-48">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-bold text-saasha-brown dark:text-dark-text">
                        {event.title}
                      </h2>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${event.status === 'upcoming' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          event.status === 'ongoing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
                      >
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </div>

                    <div className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      <div className="flex items-center mb-2">
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(event.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="flex items-center">
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                      </div>
                    </div>

                    <div className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 prose prose-sm dark:prose-invert
                      prose-headings:text-saasha-brown dark:prose-headings:text-dark-text
                      prose-h1:text-lg prose-h1:font-bold
                      prose-h2:text-base prose-h2:font-semibold
                      prose-h3:text-sm prose-h3:font-medium
                      prose-h4:text-sm
                      prose-p:text-sm prose-p:text-gray-600 dark:prose-p:text-gray-400
                      prose-a:text-saasha-rose hover:prose-a:text-saasha-rose/80
                      prose-strong:text-saasha-brown dark:prose-strong:text-dark-text
                      prose-ul:ml-4 prose-ul:list-disc prose-ul:list-outside
                      prose-ol:ml-4 prose-ol:list-decimal prose-ol:list-outside
                      prose-li:my-1 prose-li:text-gray-600 dark:prose-li:text-gray-400
                      marker:text-gray-600 dark:marker:text-gray-400" 
                      dangerouslySetInnerHTML={{ __html: event.description || '' }} 
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default EventsPage;
