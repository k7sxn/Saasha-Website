import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/supabase';
import PageLayout from '../layout/PageLayout';
import { format } from 'date-fns';

type Event = Database['public']['Tables']['events']['Row'];

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [view, setView] = useState<'list' | 'grid'>('grid');

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
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = (events: Event[]) => {
    const now = new Date();
    switch (filter) {
      case 'upcoming':
        return events.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= now && !event.completed;
        });
      case 'past':
        return events.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate < now || event.completed;
        });
      default:
        return events;
    }
  };

  const filteredEvents = filterEvents(events);

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
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-saasha-brown dark:text-dark-text mb-4">
              Events
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Join us at our upcoming events or browse through our past events
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
            <div className="flex bg-white dark:bg-dark-secondary rounded-lg shadow-sm p-1 space-x-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-300 ${
                  filter === 'all'
                    ? 'bg-saasha-rose text-white shadow-md transform scale-105'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-secondary/80'
                }`}
              >
                All Events
              </button>
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-300 ${
                  filter === 'upcoming'
                    ? 'bg-saasha-rose text-white shadow-md transform scale-105'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-secondary/80'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilter('past')}
                className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-300 ${
                  filter === 'past'
                    ? 'bg-saasha-rose text-white shadow-md transform scale-105'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-secondary/80'
                }`}
              >
                Past Events
              </button>
            </div>

            <div className="flex bg-white dark:bg-dark-secondary rounded-lg shadow-sm p-1 space-x-1">
              <button
                onClick={() => setView('list')}
                className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-300 ${
                  view === 'list'
                    ? 'bg-saasha-rose text-white shadow-md transform scale-105'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-secondary/80'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setView('grid')}
                className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-300 ${
                  view === 'grid'
                    ? 'bg-saasha-rose text-white shadow-md transform scale-105'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-secondary/80'
                }`}
              >
                Grid View
              </button>
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="text-center text-gray-600 dark:text-gray-400">
              No {filter === 'upcoming' ? 'upcoming' : filter === 'past' ? 'past' : ''} events at the moment.
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <Link
                  key={event.id}
                  to={`/event/${event.id}`}
                  className="bg-white dark:bg-dark-secondary rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-102 hover:shadow-xl"
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={event.header_image || '/default-event.jpg'}
                      alt={event.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold text-saasha-brown dark:text-dark-text line-clamp-2">
                        {event.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.completed
                          ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          : new Date(event.date) < new Date()
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {event.completed ? 'Completed' : new Date(event.date) < new Date() ? 'Past' : 'Upcoming'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{format(new Date(event.date), 'MMM d, yyyy - h:mm a')}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredEvents.map((event) => (
                <Link
                  key={event.id}
                  to={`/event/${event.id}`}
                  className="block bg-white dark:bg-dark-secondary rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-102 hover:shadow-xl"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-64 h-48">
                      <img
                        src={event.header_image || '/default-event.jpg'}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold text-saasha-brown dark:text-dark-text">
                          {event.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.completed
                            ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            : new Date(event.date) < new Date()
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {event.completed ? 'Completed' : new Date(event.date) < new Date() ? 'Past' : 'Upcoming'}
                        </span>
                      </div>
                      <div className="prose prose-sm dark:prose-invert line-clamp-2 mb-4">
                        <div dangerouslySetInnerHTML={{ __html: event.description || '' }} />
                      </div>
                      <div className="flex items-center space-x-6 text-gray-600 dark:text-gray-300">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{format(new Date(event.date), 'MMM d, yyyy - h:mm a')}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
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
