import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/supabase';
import PageLayout from '../layout/PageLayout';

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

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    const now = new Date();
    const isPast = eventDate < now;

    switch (filter) {
      case 'upcoming':
        return !isPast && !event.completed;
      case 'past':
        return isPast || event.completed;
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
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-saasha-brown dark:text-dark-text mb-4">
              Events
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Join us in our upcoming events or explore our past initiatives
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
            <div className="inline-flex p-1 bg-gray-100 dark:bg-dark-secondary rounded-xl">
              <button
                onClick={() => setFilter('all')}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  filter === 'all'
                    ? 'bg-white dark:bg-dark-primary text-saasha-rose shadow-md transform scale-105'
                    : 'text-gray-600 dark:text-gray-300 hover:text-saasha-rose dark:hover:text-saasha-rose/80'
                }`}
              >
                All Events
              </button>
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  filter === 'upcoming'
                    ? 'bg-white dark:bg-dark-primary text-saasha-rose shadow-md transform scale-105'
                    : 'text-gray-600 dark:text-gray-300 hover:text-saasha-rose dark:hover:text-saasha-rose/80'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilter('past')}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  filter === 'past'
                    ? 'bg-white dark:bg-dark-primary text-saasha-rose shadow-md transform scale-105'
                    : 'text-gray-600 dark:text-gray-300 hover:text-saasha-rose dark:hover:text-saasha-rose/80'
                }`}
              >
                Past
              </button>
            </div>

            <div className="inline-flex p-1 bg-gray-100 dark:bg-dark-secondary rounded-xl">
              <button
                onClick={() => setView('list')}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  view === 'list'
                    ? 'bg-white dark:bg-dark-primary text-saasha-rose shadow-md transform scale-105'
                    : 'text-gray-600 dark:text-gray-300 hover:text-saasha-rose dark:hover:text-saasha-rose/80'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setView('grid')}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  view === 'grid'
                    ? 'bg-white dark:bg-dark-primary text-saasha-rose shadow-md transform scale-105'
                    : 'text-gray-600 dark:text-gray-300 hover:text-saasha-rose dark:hover:text-saasha-rose/80'
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
                  className="bg-white dark:bg-dark-secondary rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={event.header_image || '/placeholder.jpg'}
                      alt={event.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-saasha-brown dark:text-dark-text line-clamp-2">
                        {event.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.completed
                          ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          : new Date(event.date) < new Date()
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {event.completed
                          ? 'Completed'
                          : new Date(event.date) < new Date()
                          ? 'Past'
                          : 'Upcoming'}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date(event.date).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </div>
                      {event.location && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {event.location}
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
                  className="block bg-white dark:bg-dark-secondary rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-64 h-48 md:h-auto">
                      <img
                        src={event.header_image || '/placeholder.jpg'}
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
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {event.completed
                            ? 'Completed'
                            : new Date(event.date) < new Date()
                            ? 'Past'
                            : 'Upcoming'}
                        </span>
                      </div>
                      <div className="prose prose-sm dark:prose-invert line-clamp-3 mb-4"
                        dangerouslySetInnerHTML={{ __html: event.description || '' }}
                      />
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {new Date(event.date).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </div>
                        {event.location && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {event.location}
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
