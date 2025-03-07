import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/supabase';
import PageLayout from '../layout/PageLayout';

type Event = Database['public']['Tables']['events']['Row'];

const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'gallery'>(searchParams.get('view') as 'list' | 'gallery' || 'gallery');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>(searchParams.get('filter') as 'all' | 'upcoming' | 'past' || 'all');

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (filter !== 'all') {
      params.set('filter', filter);
    } else {
      params.delete('filter');
    }
    if (view !== 'gallery') {
      params.set('view', view);
    } else {
      params.delete('view');
    }
    setSearchParams(params);
  }, [filter, view, setSearchParams]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
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

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const now = new Date();

    switch (filter) {
      case 'upcoming':
        return eventDate >= now;
      case 'past':
        return eventDate < now;
      default:
        return true;
    }
  });

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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <h1 className="text-4xl font-bold text-saasha-brown dark:text-dark-text">
            Events
          </h1>
          <div className="flex space-x-4">
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'upcoming' | 'past')}
                className="appearance-none bg-white dark:bg-dark-secondary border border-gray-300 dark:border-dark-border rounded-lg py-2 pl-4 pr-10 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:ring-2 focus:ring-saasha-rose focus:border-transparent"
              >
                <option value="all">All Events</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
            <div className="flex border border-gray-300 dark:border-dark-border rounded-lg overflow-hidden">
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 ${
                  view === 'list'
                    ? 'bg-saasha-rose text-white'
                    : 'bg-white dark:bg-dark-secondary text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-hover'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => setView('gallery')}
                className={`px-4 py-2 ${
                  view === 'gallery'
                    ? 'bg-saasha-rose text-white'
                    : 'bg-white dark:bg-dark-secondary text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-hover'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {view === 'gallery' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <Link
                key={event.id}
                to={`/event/${event.id}`}
                className="group bg-white dark:bg-dark-secondary rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
              >
                {event.header_image && (
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={event.header_image}
                      alt={event.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-saasha-brown dark:text-dark-text mb-2 group-hover:text-saasha-rose">
                    {event.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <div 
                    className="prose prose-sm dark:prose-invert line-clamp-3
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
        ) : (
          <div className="space-y-8">
            {filteredEvents.map((event) => (
              <Link
                key={event.id}
                to={`/event/${event.id}`}
                className="block bg-white dark:bg-dark-secondary rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-[1.02]"
              >
                <div className="flex flex-col md:flex-row">
                  {event.header_image && (
                    <div className="md:w-1/3">
                      <img
                        src={event.header_image}
                        alt={event.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <div className="flex-1 p-6">
                    <h2 className="text-2xl font-semibold text-saasha-brown dark:text-dark-text mb-2 group-hover:text-saasha-rose">
                      {event.title}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <div 
                      className="prose prose-sm dark:prose-invert line-clamp-3
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
                </div>
              </Link>
            ))}
          </div>
        )}

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              No events found for the selected filter.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default EventsPage;
