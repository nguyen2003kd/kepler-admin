# Modern Admin Dashboard

A high-performance admin dashboard for e-commerce management built with Next.js 14+ and modern tools.

## ✨ Features

- **Modern Tech Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Shadcn UI
- **State Management**: Zustand for UI state management
- **Data Fetching**: TanStack Query v5 with caching and optimistic updates
- **Tables**: TanStack Table v8 with sorting, filtering, and pagination
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts for data visualization
- **Authentication**: Mock JWT authentication system
- **Responsive Design**: Mobile-first responsive layout

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Login
- **Email:** admin@example.com
- **Password:** password

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   │   └── login/         # Login page
│   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── layout.tsx     # Dashboard layout
│   │   ├── page.tsx       # Dashboard home
│   │   ├── orders/        # Orders management
│   │   └── products/      # Products management
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # Shadcn UI primitives
│   ├── layout/            # Layout components (Sidebar, Header)
│   ├── shared/            # Reusable components (DataTable, Modal)
│   ├── features/          # Feature-specific components
│   └── providers/         # React providers
├── lib/
│   ├── axios.ts           # HTTP client with interceptors
│   ├── query-client.ts    # TanStack Query configuration
│   └── utils.ts           # Utility functions
├── hooks/                 # Custom React hooks
└── types/                 # TypeScript type definitions
```

## 🎯 Core Features

### Dashboard
- Revenue overview charts
- Sales analytics
- Order status tracking
- Category breakdown

### Orders Management
- Comprehensive orders table
- Status filtering and sorting
- Order details view
- Bulk operations

### Products Management
- Product catalog with search/filter
- Stock level monitoring
- Category management
- Inventory tracking

### Responsive Layout
- Collapsible sidebar
- Mobile-optimized navigation
- Dark/light mode support
- User profile management

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn UI
- **State Management:** Zustand
- **Data Fetching:** TanStack Query v5
- **Tables:** TanStack Table v8
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Icons:** Lucide React
- **HTTP Client:** Axios

## 📊 Features Implemented

### ✅ Core Components
- [x] Responsive sidebar with navigation
- [x] Header with search and user menu
- [x] DataTable with sorting, filtering, pagination
- [x] Form components with validation
- [x] Modal system for confirmations

### ✅ Authentication
- [x] Login page with form validation
- [x] Protected routes
- [x] JWT token management
- [x] Auto-redirect logic

### ✅ Dashboard Analytics
- [x] Revenue charts (Bar, Line, Pie)
- [x] KPI cards with trend indicators
- [x] Sales by category breakdown
- [x] Mock data integration

### ✅ Orders Module
- [x] Orders table with status filtering
- [x] Order status badges
- [x] Search and sort functionality
- [x] Action menus for CRUD operations

### ✅ Products Module
- [x] Products inventory table
- [x] Stock level warnings
- [x] Category management
- [x] Price formatting

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=https://your-api-url.com
NEXT_PUBLIC_ONESIGNAL_APP_ID=your-onesignal-app-id
```

### Customization
- Update `src/lib/axios.ts` for API configuration
- Modify `src/types/index.ts` for data models
- Customize theme in `tailwind.config.ts`

## 📱 Mobile Support

The dashboard is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🚀 Production Build

```bash
npm run build
npm start
```

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using Next.js, TypeScript, and modern React patterns.**
