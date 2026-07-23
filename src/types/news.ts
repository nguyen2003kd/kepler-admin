export type NewsSection = {
  id: string;
  type: "image" | "text";
  order: number;
} & (
  | {
      type: "image";
      images: string[];
      columns: 1 | 2 | 3 | 4;
      caption?: string;
    }
  | {
      type: "text";
      content: string;
    }
);

export type NewsDetail = {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  status: "published" | "draft" | "pending";
  summary?: string;
  sections: NewsSection[];
  createdAt: string;
  updatedAt: string;
  views: number;
};

export type CreateNewsRequest = {
  title: string;
  category: string;
  summary?: string;
  sections: Omit<NewsSection, "id">[];
  status: "published" | "draft" | "pending";
};
export type News = {
  id: string;
  title: string;
  code: string;
  slug: string;
  thumbnail_path: string | null;
  summary: string | null;
  position: number;
  is_hidden: boolean;
  expired_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  is_service: boolean;
  thumbnail_compress_info?: {
    mobile: string;
    tablet: string;
    desktop: string;
    preload: string;
  } | null;
};
export type PostPage = {
  page?: number;
  pageSize?: number;
  count?: number;
  rows: News[];
};

export type PageInfo = {
  id: string;
  name: string;
};

export type PostCategoryItem = {
  id: string;
  post_id: string;
  category_id: string;
  page_id: string;
  position: number;
  created_at: string;
  post: News;
  page?: PageInfo;
};
