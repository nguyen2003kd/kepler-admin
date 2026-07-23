export default function ServicesLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-96 bg-gray-100 rounded animate-pulse"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-36 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white p-4 rounded-lg border">
            <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-20 bg-gray-100 rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Filters Skeleton */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="space-y-4">
          <div className="h-10 w-full bg-gray-100 rounded animate-pulse"></div>
          <div className="flex gap-3">
            <div className="h-10 w-48 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-10 w-48 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white p-6 rounded-lg border">
        <div className="space-y-3">
          {/* Table Header */}
          <div className="flex gap-4">
            <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          {/* Table Rows */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex gap-4 py-2">
              <div className="h-4 w-8 bg-gray-100 rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-100 rounded animate-pulse"></div>
              <div className="h-4 w-48 bg-gray-100 rounded animate-pulse"></div>
              <div className="h-4 w-32 bg-gray-100 rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-100 rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-gray-100 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}