import type { News, PostCategoryItem } from "@/types/news";

// Type cho infinite query response
export type PostCategoryPage = {
  page?: number;
  pageSize?: number;
  count?: number;
  rows: PostCategoryItem[];
};

// Type cho stats
export interface CategoryPostStats {
  total: number;
  published: number;
  hidden: number;
  expired: number;
}

// Type cho page tab
export interface PageTabItem {
  id: string;
  name: string;
}

// Props interfaces for page components
export interface StatsCardsProps {
  stats: CategoryPostStats;
}

export interface PageTabsProps {
  pages: PageTabItem[];
  selectedPageId: string | undefined;
  onPageChange: (pageId: string | undefined) => void;
  isPagesLoading: boolean;
  children: React.ReactNode;
}

export interface PageHeaderProps {
  categoryName?: string;
}

// Post selector types
export interface PostInCategory extends News {
  postCategoryId: string;
  position: number;
  page_id?: string;
}

export interface PostManagerPanelProps {
  categoryId: string;
  pageId?: string;
  postsInCategory: PostInCategory[];
  onRefresh: () => void;
  fetchNextCategoryPage?: () => void;
  hasNextCategoryPage?: boolean;
  isFetchingNextCategoryPage?: boolean;
}

export interface PostImageProps {
  src: string | null;
  alt: string;
  className?: string;
}

export interface SortablePostItemProps {
  post: PostInCategory;
  onRemove: () => void;
  isRemoving: boolean;
  index: number;
  isSelected: boolean;
  onSelectChange: (checked: boolean) => void;
  isMultiSelectMode: boolean;
}
