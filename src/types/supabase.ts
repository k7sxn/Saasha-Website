export interface Database {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          id: string;
          title: string;
          content: string;
          header_image: string;
          tags: string[];
          created_at: string;
          updated_at: string;
          slug: string;
          published: boolean;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          header_image: string;
          tags: string[];
          created_at?: string;
          updated_at?: string;
          slug: string;
          published?: boolean;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          header_image?: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
          slug?: string;
          published?: boolean;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          image: string;
          date: string;
          location: string;
          status: 'upcoming' | 'ongoing' | 'completed';
          created_at: string;
          updated_at: string;
          slug: string;
          published: boolean;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          image: string;
          date: string;
          location: string;
          status?: 'upcoming' | 'ongoing' | 'completed';
          created_at?: string;
          updated_at?: string;
          slug: string;
          published?: boolean;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          image?: string;
          date?: string;
          location?: string;
          status?: 'upcoming' | 'ongoing' | 'completed';
          created_at?: string;
          updated_at?: string;
          slug?: string;
          published?: boolean;
        };
      };
      faqs: {
        Row: {
          id: string;
          question: string;
          answer: string | null;
          order: number;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          question: string;
          answer?: string | null;
          order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          question?: string;
          answer?: string | null;
          order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      volunteer_registrations: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string;
          interests: string[];
          availability: string[];
          skills: string[];
          experience: string;
          created_at: string;
          status: 'pending' | 'approved' | 'rejected';
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          phone: string;
          interests: string[];
          availability: string[];
          skills: string[];
          experience: string;
          created_at?: string;
          status?: 'pending' | 'approved' | 'rejected';
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string;
          interests?: string[];
          availability?: string[];
          skills?: string[];
          experience?: string;
          created_at?: string;
          status?: 'pending' | 'approved' | 'rejected';
        };
      };
    };
  };
}
