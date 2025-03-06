import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/supabase';
import RichTextEditor from './RichTextEditor';

type Event = Database['public']['Tables']['events']['Row'];

const CLOUDINARY_PRESET = 'saasha_events';

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

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleImageUpload = () => {
    if (!window.cloudinary) {
      alert('Image upload is initializing. Please try again in a moment.');
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'daoicwuqc',
        uploadPreset: CLOUDINARY_PRESET,
        sources: ['local', 'url', 'camera'],
        multiple: false,
        maxFiles: 1,
        maxFileSize: 5000000, // 5MB
      },
      (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          setFormData(prev => ({
            ...prev,
            image: result.info.secure_url
          }));
        }
      }
    );

    widget.open();
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const slug = generateSlug(formData.title!);
      const eventData = { ...formData, slug };
      let error;

      if (editingId) {
        ({ error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingId));
      } else {
        ({ error } = await supabase
          .from('events')
          .insert([eventData]));
      }

      if (error) throw error;

      fetchEvents();
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
      setShowForm(false);
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
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-saasha-brown dark:text-dark-text">
          Event Management
        </h2>
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
        <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-secondary rounded-lg p-6 shadow-lg space-y-6">
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
              className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Upload Image
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                className="rounded text-saasha-rose focus:ring-saasha-rose"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Publish Event
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-saasha-rose text-white px-6 py-2 rounded-md hover:bg-saasha-rose/90 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : editingId ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Published
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-secondary divide-y divide-gray-200 dark:divide-gray-700">
              {events.map((event) => (
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
                      onClick={() => handleEdit(event)}
                      className="text-saasha-rose hover:text-saasha-rose/80 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EventManager;
