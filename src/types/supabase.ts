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
    };
  };
}
