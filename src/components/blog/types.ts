export interface Profile {
  id: string;
  name: string | null;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  author_id: string | null;
  is_published: boolean | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  profiles: Profile | null;
}