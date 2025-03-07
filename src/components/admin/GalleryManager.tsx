import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/supabase';

type GalleryImage = Database['public']['Tables']['gallery']['Row'];

const GalleryManager = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      // Upload image to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);

      // Save to gallery table
      const { error: dbError } = await supabase
        .from('gallery')
        .insert([
          {
            image_url: publicUrl,
            caption: caption,
            published: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

      if (dbError) throw dbError;

      setCaption('');
      fetchImages();
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      // Delete from storage
      const filePath = imageUrl.split('/').pop();
      if (filePath) {
        await supabase.storage
          .from('public')
          .remove([`gallery/${filePath}`]);
      }

      // Delete from database
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const togglePublished = async (image: GalleryImage) => {
    try {
      const { error } = await supabase
        .from('gallery')
        .update({
          published: !image.published,
          updated_at: new Date().toISOString(),
        })
        .eq('id', image.id);

      if (error) throw error;
      fetchImages();
    } catch (error) {
      console.error('Error updating image:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-saasha-rose"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-saasha-brown dark:text-dark-text mb-6">
          Add New Image
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Caption
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saasha-rose dark:bg-dark-primary dark:border-dark-border dark:text-dark-text"
              placeholder="Add a caption (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saasha-rose dark:bg-dark-primary dark:border-dark-border dark:text-dark-text"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-secondary rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative group rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-primary"
            >
              <img
                src={image.image_url}
                alt={image.caption || 'Gallery image'}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                <button
                  onClick={() => togglePublished(image)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    image.published
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-gray-500 hover:bg-gray-600'
                  } text-white`}
                >
                  {image.published ? 'Published' : 'Draft'}
                </button>
                <button
                  onClick={() => handleDelete(image.id, image.image_url)}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-red-500 hover:bg-red-600 text-white"
                >
                  Delete
                </button>
              </div>
              {image.caption && (
                <div className="p-3 bg-white dark:bg-dark-secondary">
                  <p className="text-sm text-gray-600 dark:text-gray-300">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryManager;
