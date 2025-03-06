import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/supabase';
import RichTextEditor from './RichTextEditor';
import { uploadImage } from '@/lib/cloudinary';

type Event = Database['public']['Tables']['events']['Row'];

const EventManager = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    description: '',
    image: '',
    date: '',
    location: '',
    status: 'upcoming',
    published: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        setIsSubmitting(true);
        const imageUrl = await uploadImage(file);
        setFormData(prev => ({ ...prev, image: imageUrl }));
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please check your Cloudinary configuration and try again.');
      } finally {
        setIsSubmitting(false);
      }
    };
    input.click();
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.location) return;

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('events')
        .upsert({
          id: editingId || undefined,
          title: formData.title,
          description: formData.description || '',
          image: formData.image || '',
          date: formData.date,
          location: formData.location,
          status: formData.status,
          published: false, // Always set to false when creating/updating
        });

      if (error) throw error;

      await fetchEvents();
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        image: '',
        date: '',
        location: '',
        status: 'upcoming',
        published: false,
      });
      setEditingId(null);
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (event: Event) => {
    setFormData(event);
    setEditingId(event.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      setDeletingId(id);
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      setUpdatingId(id);
      const { error } = await supabase
        .from('events')
        .update({ published: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      fetchEvents();
    } catch (error) {
      console.error('Error toggling publish status:', error);
      alert('Failed to update publish status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredEvents = events.filter(event => 
    filter === 'all' ? true : event.status === filter
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-saasha-brown dark:text-dark-text">
            Event Management
          </h2>
          <div className="flex items-center space-x-4">
            <label className="text-sm text-gray-700 dark:text-gray-300">Filter:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="rounded-md border-gray-300 shadow-sm focus:border-saasha-rose focus:ring-saasha-rose dark:bg-dark-secondary dark:border-gray-600 dark:text-white"
            >
              <option value="all">All</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        <button
          onClick={() => {
            if (!showForm) {
              setFormData({
                title: '',
                description: '',
                image: '',
                date: '',
                location: '',
                status: 'upcoming',
                published: false,
              });
              setEditingId(null);
            }
            setShowForm(!showForm);
          }}
          className="bg-saasha-rose text-white px-4 py-2 rounded-md hover:bg-saasha-rose/90"
        >
          {showForm ? 'Cancel' : 'Create New Event'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-secondary rounded-lg p-8 shadow-lg space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-saasha-rose focus:ring-saasha-rose dark:bg-dark-secondary dark:border-gray-600 dark:text-white"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-saasha-rose focus:ring-saasha-rose dark:bg-dark-secondary dark:border-gray-600 dark:text-white"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="datetime-local"
                required
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-saasha-rose focus:ring-saasha-rose dark:bg-dark-secondary dark:border-gray-600 dark:text-white"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Event['status'] }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-saasha-rose focus:ring-saasha-rose dark:bg-dark-secondary dark:border-gray-600 dark:text-white"
                disabled={isSubmitting}
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <RichTextEditor
              value={formData.description || ''}
              onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Event Image
            </label>
            {formData.image && (
              <img
                src={formData.image}
                alt="Event preview"
                className="w-full max-w-md h-48 object-cover rounded-lg mb-4"
              />
            )}
            <button
              type="button"
              onClick={handleImageUpload}
              disabled={isSubmitting}
              className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upload Image
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-saasha-rose text-white px-6 py-2 rounded-md hover:bg-saasha-rose/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {editingId ? 'Saving...' : 'Creating Event...'}
                </span>
              ) : editingId ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Event
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Published
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-secondary divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Loading events...
                  </td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No events found
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => (
                  <tr key={event.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {event.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {event.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(event.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${event.status === 'upcoming' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          event.status === 'ongoing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
                      >
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {event.published ? 'Yes' : 'No'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => togglePublish(event.id, event.published)}
                        disabled={updatingId === event.id}
                        className="text-saasha-rose hover:text-saasha-rose/80 mr-4 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updatingId === event.id ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Updating...
                          </span>
                        ) : event.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => handleEdit(event)}
                        className="text-saasha-rose hover:text-saasha-rose/80 mr-4"
                        disabled={updatingId === event.id || deletingId === event.id}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        disabled={updatingId === event.id || deletingId === event.id}
                        className="text-red-600 hover:text-red-900 dark:hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === event.id ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Deleting...
                          </span>
                        ) : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EventManager;
