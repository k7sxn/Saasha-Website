import React from 'react';
import { Link } from 'react-router-dom';
import { Database } from '../../types/supabase';

type Event = Database['public']['Tables']['events']['Row'];

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const statusColors = {
    upcoming: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    ongoing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    completed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  };

  return (
    <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-lg overflow-hidden">
      <img 
        src={event.image} 
        alt={event.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-saasha-brown dark:text-dark-text">
            {event.title}
          </h3>
          <span className={`px-3 py-1 rounded-full text-sm ${statusColors[event.status]}`}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(event.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {event.location}
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {event.description}
        </p>

        <Link 
          to={`/events/${event.slug}`}
          className="inline-block bg-saasha-rose text-white px-4 py-2 rounded-lg hover:bg-saasha-rose/90 transition-colors"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
