import { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/supabase';
import PageLayout from '../layout/PageLayout';

type Event = Database['public']['Tables']['events']['Row'];

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const filter = searchParams.get('filter') || 'all';
  const view = searchParams.get('view') || 'list';

  useEffect(() => {
    fetchEvents();
  }, [filter]);

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

      const { data, error } = await query.order('date', { ascending: filter === 'upcoming' });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (newFilter: string) => {
    setSearchParams({ filter: newFilter, view });
  };

  const updateView = (newView: string) => {
    setSearchParams({ filter, view: newView });
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-saasha-brown dark:text-dark-text mb-4">
            Our Events
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Join us in making a difference
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="flex space-x-4 mb-4 sm:mb-0">
            <button
              onClick={() => updateFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filter === 'all'
                  ? 'bg-saasha-rose text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-saasha-rose dark:hover:text-saasha-rose/80'
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => updateFilter('upcoming')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filter === 'upcoming'
                  ? 'bg-saasha-rose text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-saasha-rose dark:hover:text-saasha-rose/80'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => updateFilter('past')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filter === 'past'
                  ? 'bg-saasha-rose text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-saasha-rose dark:hover:text-saasha-rose/80'
              }`}
            >
              Past Events
            </button>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => updateView('list')}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                view === 'list'
                  ? 'bg-saasha-rose text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-saasha-rose dark:hover:text-saasha-rose/80'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => updateView('gallery')}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                view === 'gallery'
                  ? 'bg-saasha-rose text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-saasha-rose dark:hover:text-saasha-rose/80'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
        </div>

        {view === 'list' ? (
          <div className="space-y-8">
            {events.map((event) => (
              <Link
                key={event.id}
                to={`/event/${event.id}`}
                className="block bg-white dark:bg-dark-secondary rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
              >
                <div className="md:flex">
                  <div className="md:flex-shrink-0">
                    <img
                      className="h-48 w-full md:w-64 object-cover"
                      src={event.header_image || '/placeholder.jpg'}
                      alt={event.title}
                    />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        new Date(event.date) > new Date()
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-saasha-brown dark:text-dark-text mb-2">
                      {event.title}
                    </h2>
                    <div 
                      className="prose prose-sm dark:prose-invert line-clamp-3
                        prose-headings:text-saasha-brown dark:prose-headings:text-dark-text
                        prose-p:text-sm prose-p:text-gray-600 dark:prose-p:text-gray-400"
                      dangerouslySetInnerHTML={{ __html: event.content || '' }}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Link
                key={event.id}
                to={`/event/${event.id}`}
                className="block bg-white dark:bg-dark-secondary rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
              >
                <img
                  className="h-48 w-full object-cover"
                  src={event.header_image || '/placeholder.jpg'}
                  alt={event.title}
                />
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      new Date(event.date) > new Date()
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-saasha-brown dark:text-dark-text mb-2">
                    {event.title}
                  </h2>
                  <div 
                    className="prose prose-sm dark:prose-invert line-clamp-2
                      prose-headings:text-saasha-brown dark:prose-headings:text-dark-text
                      prose-p:text-sm prose-p:text-gray-600 dark:prose-p:text-gray-400"
                    dangerouslySetInnerHTML={{ __html: event.content || '' }}
                  />
                </div>
              </Link>
            ))}
          </div>
        )}

        {events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 dark:text-gray-300">
              No events found for the selected filter.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default EventsPage;
