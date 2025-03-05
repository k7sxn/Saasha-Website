export interface BlogPost {
  id: string;
  title: string;
  content: string;
  headerImage: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export interface BlogFormData {
  title: string;
  content: string;
  headerImage: string;
  tags: string[];
}
