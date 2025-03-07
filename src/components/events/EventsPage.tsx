import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/supabase';
import PageLayout from '../layout/PageLayout';

type Event = Database['public']['Tables']['events']['Row'];

const EventsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'gallery'>('list');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>(() => {
    const params = new URLSearchParams(location.search);
    return (params.get('filter') as 'all' | 'upcoming' | 'past') || 'all';
  });

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filterParam = params.get('filter');
    if (filterParam && ['all', 'upcoming', 'past'].includes(filterParam)) {
      setFilter(filterParam as 'all' | 'upcoming' | 'past');
    }
  }, [location.search]);

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

  const handleFilterChange = (newFilter: 'all' | 'upcoming' | 'past') => {
    setFilter(newFilter);
    navigate(`/events?filter=${newFilter}`);
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <h1 className="text-4xl font-bold text-saasha-brown dark:text-dark-text">
            Our Events
          </h1>
          <div className="flex space-x-4">
            <div className="inline-flex rounded-lg border border-gray-200 dark:border-dark-border">
              <button
                onClick={() => handleFilterChange('all')}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  filter === 'all'
                    ? 'bg-saasha-rose text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:text-saasha-rose dark:hover:text-saasha-rose/80'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleFilterChange('upcoming')}
                className={`px-4 py-2 text-sm font-medium border-l border-gray-200 dark:border-dark-border ${
                  filter === 'upcoming'
                    ? 'bg-saasha-rose text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:text-saasha-rose dark:hover:text-saasha-rose/80'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => handleFilterChange('past')}
                className={`px-4 py-2 text-sm font-medium border-l border-gray-200 dark:border-dark-border rounded-r-lg ${
                  filter === 'past'
                    ? 'bg-saasha-rose text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:text-saasha-rose dark:hover:text-saasha-rose/80'
                }`}
              >
                Past
              </button>
            </div>
            <div className="inline-flex rounded-lg border border-gray-200 dark:border-dark-border">
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  view === 'list'
                    ? 'bg-saasha-rose text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:text-saasha-rose dark:hover:text-saasha-rose/80'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setView('gallery')}
                className={`px-4 py-2 text-sm font-medium border-l border-gray-200 dark:border-dark-border rounded-r-lg ${
                  view === 'gallery'
                    ? 'bg-saasha-rose text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:text-saasha-rose dark:hover:text-saasha-rose/80'
                }`}
              >
                Gallery
              </button>
            </div>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400">
            No {filter === 'upcoming' ? 'upcoming' : filter === 'past' ? 'past' : ''} events at the moment.
          </div>
        ) : view === 'list' ? (
          <div className="space-y-8">
            {events.map((event) => (
              <Link
                key={event.id}
                to={`/event/${event.id}`}
                className="block bg-white dark:bg-dark-secondary rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
              >
                <div className="md:flex">
                  {event.image && (
                    <div className="md:flex-shrink-0">
                      <img
                        className="h-48 w-full object-cover md:h-full md:w-48"
                        src={event.image}
                        alt={event.title}
                      />
                    </div>
                  )}
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <h2 className="text-2xl font-bold text-saasha-brown dark:text-dark-text">
                        {event.title}
                      </h2>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          new Date(event.date) > new Date()
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {new Date(event.date) > new Date() ? 'Upcoming' : 'Past'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              event.image && (
                <Link
                  key={event.id}
                  to={`/event/${event.id}`}
                  className="group relative overflow-hidden rounded-lg shadow-lg bg-white dark:bg-dark-secondary transform transition duration-300 hover:scale-105"
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {event.title}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            new Date(event.date) > new Date()
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {new Date(event.date) > new Date() ? 'Upcoming' : 'Past'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-200">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default EventsPage;
