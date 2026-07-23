import { NewsDetail, CreateNewsRequest, NewsSection } from '@/types/news';

// Mock detailed news data
export const mockNewsDetails: NewsDetail[] = [
  {
    id: '001',
    title: 'Lễ tách định chuyên bào nghĩa tử chúng sĩ',
    category: 'Tin tức',
    author: 'Admin',
    date: '2024-12-04',
    status: 'published',
    summary: 'Tổng quan về lễ tách định chuyên bào nghĩa tử chúng sĩ và ý nghĩa của nó.',
    sections: [
      {
        id: 'sect-1',
        type: 'image',
        order: 1,
        images: ['/assets/images/news-1.jpg', '/assets/images/news-2.jpg'],
        columns: 2,
        caption: 'Hình ảnh từ lễ tách định'
      },
      {
        id: 'sect-2',
        type: 'text',
        order: 2,
        content: 'Đây là nội dung chi tiết về lễ tách định chuyên bào nghĩa tử chúng sĩ. Sự kiện này có ý nghĩa quan trọng trong việc tôn vinh những đóng góp to lớn của các chúng sĩ.'
      },
      {
        id: 'sect-3',
        type: 'image',
        order: 3,
        images: ['/assets/images/news-3.jpg'],
        columns: 1,
        caption: 'Moment quan trọng của buổi lễ'
      },
      {
        id: 'sect-4',
        type: 'text',
        order: 4,
        content: 'Tiếp tục nội dung về các hoạt động trong buổi lễ và những phản hồi tích cực từ cộng đồng.'
      }
    ],
    createdAt: '2024-12-04T10:00:00Z',
    updatedAt: '2024-12-04T15:30:00Z',
    views: 245
  },
  {
    id: '002',
    title: 'Chi tiết của bản kê trọn vẹ đường như đơn lọc lẫn lộn',
    category: 'Sự kiện',
    author: 'Editor',
    date: '2024-12-03',
    status: 'published',
    summary: 'Phân tích chi tiết về bản kê trọn vẹ và các vấn đề liên quan.',
    sections: [
      {
        id: 'sect-5',
        type: 'text',
        order: 1,
        content: 'Mở đầu bài viết về bản kê trọn vẹ đường như đơn lọc lẫn lộn.'
      },
      {
        id: 'sect-6',
        type: 'image',
        order: 2,
        images: ['/assets/images/event-1.jpg', '/assets/images/event-2.jpg', '/assets/images/event-3.jpg'],
        columns: 3,
        caption: 'Các hình ảnh minh họa cho sự kiện'
      }
    ],
    createdAt: '2024-12-03T09:00:00Z',
    updatedAt: '2024-12-03T14:20:00Z',
    views: 189
  }
];

// Mock API functions
export async function fetchNewsDetail(id: string): Promise<NewsDetail | null> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const news = mockNewsDetails.find(n => n.id === id);
  return news || null;
}

export async function createNews(data: CreateNewsRequest): Promise<NewsDetail> {
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const newId = `#${String(mockNewsDetails.length + 1).padStart(3, '0')}`;
  const now = new Date().toISOString();
  
  type ImageInput = { type: 'image'; order: number; images?: string[]; columns?: 1|2|3|4; caption?: string };
  type TextInput = { type: 'text'; order: number; content?: string };

  const isImageInput = (s: Omit<NewsSection, 'id'>): s is ImageInput => 'images' in s;

  const newNews: NewsDetail = {
    id: newId,
    title: data.title,
    category: data.category,
    author: 'Admin', // Current user
    date: now.split('T')[0],
    status: data.status,
    summary: data.summary,
    sections: data.sections.map((section: Omit<NewsSection, 'id'>, index) => {
      const id = `sect-${Date.now()}-${index}`;
      if (isImageInput(section)) {
        return {
          id,
          type: 'image',
          order: index + 1,
          images: section.images || [],
          columns: section.columns || 2,
          caption: section.caption,
        } as NewsSection;
      }

      const st = section as TextInput;
      return {
        id,
        type: 'text',
        order: index + 1,
        content: st.content || '',
      } as NewsSection;
    }) as NewsSection[],
    createdAt: now,
    updatedAt: now,
    views: 0
  };
  
  mockNewsDetails.push(newNews);
  return newNews;
}

export async function updateNews(id: string, data: CreateNewsRequest): Promise<NewsDetail | null> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const idx = mockNewsDetails.findIndex((n) => n.id === id);
  if (idx === -1) return null;

  const now = new Date().toISOString();

  const updated: NewsDetail = {
    ...mockNewsDetails[idx],
    title: data.title,
    category: data.category,
    summary: data.summary,
    status: data.status,
    sections: data.sections.map((section, index) => {
      const maybeId = (section as unknown as { id?: string }).id;
      return {
        ...(section as object),
        id: maybeId ?? `sect-${Date.now()}-${index}`,
        order: index + 1,
      } as NewsSection;
    }) as NewsSection[],
    updatedAt: now,
  };

  mockNewsDetails[idx] = updated;
  return updated;
}