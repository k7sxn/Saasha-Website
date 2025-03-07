import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/supabase';
import PageLayout from '../layout/PageLayout';

type GalleryImage = Database['public']['Tables']['gallery']['Row'];

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-saasha-brown dark:text-dark-text mb-4">
            Our Gallery
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Capturing moments of impact and inspiration
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-lg shadow-lg bg-white dark:bg-dark-secondary transform transition duration-300 hover:scale-105"
            >
              <img
                src={image.image_url}
                alt={image.caption || 'Gallery image'}
                className="w-full h-64 object-cover"
              />
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-sm">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Gallery;
