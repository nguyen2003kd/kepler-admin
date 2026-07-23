export type SidebarIconKey =
  | 'dashboard'
  | 'news'
  | 'category'
  | 'image-library'
  | 'video-library'
  | 'document-library'
  | 'quotation'
  | 'users'
  | 'permissions'
  | 'settings'
  | 'contact'
  | 'template-type'
  | 'footer'
  | 'service'
  | 'organizational-chart'
  | 'work-schedule'
  | 'circleCheckBig'
  | 'recruitment'
  | 'shieldCheck'
  | 'info'

export type AppRouteAccessRule = {
  resources: string[]
  requiredActions?: string[]
  /**
   * Các resource khác được phép xem child routes của route này.
   * Ví dụ: user có 'post-approval-2' có thể vào /news/abc123 nhưng không vào /news.
   * Chỉ áp dụng khi pathname là child của route (không phải exact match).
   */
  extraViewerResources?: string[]
  /**
   * Actions bắt buộc cho extraViewerResources.
   * Nếu có extraViewerActions, user cần có resource + action đúng mới được vào.
   */
  extraViewerActions?: string[]
}

export type AppRouteConfig = {
  path: string
  access: AppRouteAccessRule
  sidebar?: {
    label: string
    icon: SidebarIconKey
  }
}

export const APP_ROUTES: AppRouteConfig[] = [
  {
    path: '/dashboard',
    access: { resources: ['dashboard'] },
    sidebar: { label: 'Dashboard', icon: 'dashboard' },
  },
  {
    path: '/news',
    access: { resources: ['news'] },
    sidebar: { label: 'Tin tức', icon: 'news' },
  },
  {
    path: '/news/create',
    access: { resources: ['news'], requiredActions: ['create_post_info'] },
  },
  {
  path: '/news/[id]',
  access: { 
    resources: ['news'],
    requiredActions: ['view_detail'],
    extraViewerResources: ['post-approval-1', 'post-approval-2'],
    extraViewerActions: ['view_post']
  },
},
  {
    path: '/news/[id]/edit',
    access: { resources: ['news'], requiredActions: ['update'] },
  },
  {
    path: '/post-approval-l1',
    access: { resources: ['post-approval-1'] },
    sidebar: { label: 'Duyệt bài cấp 1', icon: 'news' },
  },
  {
    path: '/post-approval-l2',
    access: { resources: ['post-approval-2'] },
    sidebar: { label: 'Duyệt bài cấp 2', icon: 'news' },
  },
  {
    path: '/category',
    access: { resources: ['category'] },
    sidebar: { label: 'Danh mục', icon: 'category' },
  },
    {
      path: '/question',
      sidebar: {
        label: 'Câu Hỏi Tuyển Dụng',
        icon: 'quotation',
      },
      access: {
        resources: ['settings'],
      },
    },
  {
    path: '/list-img',
    access: { resources: ['gallery'] },
    sidebar: { label: 'Kho ảnh', icon: 'image-library' },
  },
  {
    path: '/list-video',
    access: { resources: ['gallery_video'] },
    sidebar: { label: 'Kho video', icon: 'video-library' },
  },
  {
    path: '/list-file',
    access: { resources: ['gallery_document'] },
    sidebar: { label: 'Kho tài liệu', icon: 'document-library' },
  },
  {
    path: '/quotation',
    access: { resources: ['quotation'] },
    sidebar: { label: 'Báo Giá', icon: 'quotation' },
  },
  {
    path: '/customers',
    access: { resources: ['users'] },
    sidebar: { label: 'Tài khoản', icon: 'users' },
  },
  {
    path: '/permissions',
    access: { resources: ['role', 'user_role'] },
    sidebar: { label: 'Phân quyền', icon: 'permissions' },
  },
  {
    path: '/base-config',
    access: { resources: ['settings'] },
    sidebar: { label: 'Cài đặt chung', icon: 'settings' },
  },
  {
    path: '/introduction',
    access: { resources: ['introduction'] },
    sidebar: { label: 'Trang giới thiệu', icon: 'info' },
  },
  // {
  //   path: '/certification-config',
  //   access: { resources: ['settings'] },
  //   sidebar: { label: 'Cấu hình chứng nhận', icon: 'shieldCheck' },
  // },
    {
    path: '/recruitment',
    access: { resources: ['recruitment'] },
    sidebar: { label: 'Tin Tuyển Dụng', icon: 'recruitment' },
  },
    {
      path: '/candidate',
      access: { resources: ['candidate'] },
      sidebar: { label: 'Ứng viên', icon: 'users' },
    },
  {
    path: '/contact',
    access: { resources: ['contact'] },
    sidebar: { label: 'Liên hệ', icon: 'contact' },
  },
  {
    path: '/quotation-status',
    access: { resources: ['template_type'] },
    sidebar: { label: 'Quản lý loại mẫu', icon: 'template-type' },
  },
  {
    path: '/footer',
    access: { resources: ['footer'] },
    sidebar: { label: 'Footer', icon: 'footer' },
  },
  {
    path: '/footer/create',
    access: { resources: ['footer'], requiredActions: ['create'] },
  },
  {
    path: '/footer/edit',
    access: {
      resources: ['footer'],
      requiredActions: [
        'update_system',
        'update_basic_info',
        'update_address',
        'update_social',
      ],
    },
  },
  {
    path: '/organizational-chart',
    access: { resources: ['diagram'] },
    sidebar: { label: 'Sơ đồ tổ chức', icon: 'organizational-chart' },
  },
  {
    path: '/work-schedule',
    access: { resources: ['work-schedule'] },
    sidebar: { label: 'Lịch Công tác', icon: 'work-schedule' },
  },
  {
    path: '/service',
    access: { resources: ['service'] },
    sidebar: { label: 'Dịch vụ', icon: 'service' },
  },
  {
    path: '/department',
    access: { resources: ['department'] },
    sidebar: { label: 'Phòng ban / Khối', icon: 'organizational-chart' },
  },

  // {
  //   path: '/recruitment',
  //   access: { resources: ['recruitment'] },
  //   sidebar: { label: 'Tuyển dụng', icon: 'recruitment' },
  // },
]
