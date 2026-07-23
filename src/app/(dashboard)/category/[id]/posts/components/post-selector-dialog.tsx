"use client";

import {
  useDeleteApiV10PostCategoryId,
  usePostApiV10PostCategory,
  usePutApiV10PostCategoryId,
} from "@/api/endpoints/post-category";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toaster";
import type { News } from "@/types/news";
import { extractErrorMessage } from "@/utils/error";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useQueryClient } from "@tanstack/react-query";
import parse from "html-react-parser";
import {
  Archive,
  Briefcase,
  ClipboardList,
  FileText,
  Loader2,
  Newspaper,
  Plus,
  Search,
  SearchX,
  Sparkles,
  Trash2,
  Calendar,
  CalendarX2,
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

// Import from local modules
import { useAllPosts } from "../hooks/use-all-posts";
import { useCategoryPostIds } from "../hooks/use-category-post-ids";
import { PostImage } from "./post-image";
import { SortablePostItem } from "./sortable-post-item";
import type { PostInCategory, PostManagerPanelProps } from "../types";

// Helper function để format ngày
const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export function PostManagerPanel({
  categoryId,
  pageId,
  postsInCategory,
  onRefresh,
  fetchNextCategoryPage,
  hasNextCategoryPage,
  isFetchingNextCategoryPage,
}: PostManagerPanelProps) {
  const [searchQ, setSearchQ] = useState("");
  const [localPosts, setLocalPosts] =
    useState<PostInCategory[]>(postsInCategory);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [addingIds, setAddingIds] = useState<Set<string>>(new Set());
  const [selectedPostIds, setSelectedPostIds] = useState<Set<string>>(
    new Set(),
  );
  const [selectedCategoryPostIds, setSelectedCategoryPostIds] = useState<
    Set<string>
  >(new Set());
  const [isUpdatingPosition, setIsUpdatingPosition] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "news" | "service">(
    "all",
  );
  const [availablePostsFilterType, setAvailablePostsFilterType] = useState<
    "all" | "news" | "service"
  >("all");
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const sortedPosts = [...postsInCategory].sort(
      (a, b) => a.position - b.position,
    );
    setLocalPosts(sortedPosts);
  }, [postsInCategory]);

  const createPostCategory = usePostApiV10PostCategory();
  const updatePostCategory = usePutApiV10PostCategoryId();
  const deletePostCategory = useDeleteApiV10PostCategoryId();

  const {
    data: allPosts = [],
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useAllPosts(searchQ);

  const { data: categoryPostIds = [] } = useCategoryPostIds(categoryId, pageId);
  const queryClient = useQueryClient();

  // Filter available posts - use categoryPostIds for accurate filtering
  const availablePosts = useMemo(() => {
    const inCategoryIds = new Set([
      ...categoryPostIds,
      ...localPosts.map((p) => p.id),
    ]);
    let filtered = allPosts.filter((p) => !inCategoryIds.has(p.id));

    // Filter by post type (news/service)
    if (availablePostsFilterType === "news") {
      filtered = filtered.filter((p) => !p.is_service);
    } else if (availablePostsFilterType === "service") {
      filtered = filtered.filter((p) => p.is_service);
    }

    if (searchQ.trim()) {
      const searchLower = searchQ.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.code.toLowerCase().includes(searchLower) ||
          (p.summary && p.summary.toLowerCase().includes(searchLower)),
      );
    }

    return filtered;
  }, [
    allPosts,
    categoryPostIds,
    localPosts,
    searchQ,
    availablePostsFilterType,
  ]);

  // Filter local posts by is_service type
  const filteredLocalPosts = useMemo(() => {
    if (filterType === "all") return localPosts;
    if (filterType === "news") return localPosts.filter((p) => !p.is_service);
    if (filterType === "service") return localPosts.filter((p) => p.is_service);
    return localPosts;
  }, [localPosts, filterType]);

  // Cache sortable items IDs to prevent re-calculation on every render
  const sortableItems = useMemo(
    () => filteredLocalPosts.map((p) => p.postCategoryId),
    [filteredLocalPosts],
  );

  // Cache active post for DragOverlay - use filteredLocalPosts to match current view
  const activePost = useMemo(
    () => filteredLocalPosts.find((p) => p.postCategoryId === activeId),
    [filteredLocalPosts, activeId],
  );

  const activePostIndex = useMemo(
    () => filteredLocalPosts.findIndex((p) => p.postCategoryId === activeId),
    [filteredLocalPosts, activeId],
  );

  // Update all positions at once
  const updateAllPositions = useCallback(
    async (items: Array<{ postCategoryId: string; position: number }>) => {
      setIsUpdatingPosition(true);
      try {
        await Promise.all(
          items.map((item) =>
            updatePostCategory.mutateAsync({
              id: item.postCategoryId,
              data: { position: item.position },
            }),
          ),
        );
        toast.success({
          title: "Thành công",
          content: "Đã cập nhật vị trí tất cả bài viết",
        });
        onRefresh();
      } catch (error) {
        console.error("Error updating positions:", error);
        const msg = extractErrorMessage(error);
        toast.error({ title: "Cập nhật vị trí thất bại", content: msg });
        onRefresh();
      } finally {
        setIsUpdatingPosition(false);
      }
    },
    [updatePostCategory, onRefresh],
  );

  // Add post to category
  const handleAddPost = async (post: News) => {
    setAddingIds(new Set([post.id]));
    try {
      const maxPosition = Math.max(...localPosts.map((p) => p.position), 0);
      const newPosition = maxPosition + 1;

      const data: {
        post_id: string;
        category_id: string;
        page_id?: string;
        position: number;
      } = {
        post_id: post.id,
        category_id: categoryId,
        position: newPosition,
      };

      if (pageId) {
        data.page_id = pageId;
      }

      await createPostCategory.mutateAsync({ data });

      toast.success({
        title: "Thành công",
        content: `Đã thêm "${post.title}" vào danh mục`,
      });

      queryClient.invalidateQueries({
        queryKey: ["category-post-ids", categoryId],
      });
      onRefresh();
    } catch (error) {
      console.error("Error adding post:", error);
      const msg = extractErrorMessage(error);
      toast.error({ title: "Thêm thất bại", content: msg });
    } finally {
      setAddingIds(new Set());
    }
  };

  const handleAddMultiplePosts = async () => {
    const selectedPosts = availablePosts.filter((p) =>
      selectedPostIds.has(p.id),
    );

    if (selectedPosts.length === 0) return;

    setAddingIds(new Set(selectedPosts.map((p) => p.id)));

    try {
      const maxPosition = Math.max(...localPosts.map((p) => p.position), 0);

      await Promise.all(
        selectedPosts.map((post, i) => {
          const data: {
            post_id: string;
            category_id: string;
            page_id?: string;
            position: number;
          } = {
            post_id: post.id,
            category_id: categoryId,
            position: maxPosition + i + 1,
          };

          if (pageId) {
            data.page_id = pageId;
          }

          return createPostCategory.mutateAsync({ data });
        }),
      );

      toast.success({
        title: "Thành công",
        content: `Đã thêm ${selectedPosts.length} bài viết vào danh mục`,
      });

      setSelectedPostIds(new Set());
      queryClient.invalidateQueries({
        queryKey: ["category-post-ids", categoryId],
      });
      onRefresh();
    } catch (error) {
      console.error("Error adding posts:", error);
      const msg = extractErrorMessage(error);
      toast.error({ title: "Thêm thất bại", content: msg });
    } finally {
      setAddingIds(new Set());
    }
  };

  // Remove post from category
  const handleRemovePost = async (postCategoryId: string, title: string) => {
    setRemovingId(postCategoryId);
    try {
      await deletePostCategory.mutateAsync({ id: postCategoryId });
      toast.success({
        title: "Đã xóa",
        content: `Đã xóa "${title}" khỏi danh mục`,
      });
      queryClient.invalidateQueries({
        queryKey: ["category-post-ids", categoryId],
      });
      onRefresh();
    } catch (error) {
      console.error("Error removing post:", error);
      const msg = extractErrorMessage(error);
      toast.error({ title: "Xóa thất bại", content: msg });
    } finally {
      setRemovingId(null);
    }
  };

  // Remove multiple posts from category
  const handleRemoveMultiplePosts = async () => {
    const selectedPosts = localPosts.filter((p) =>
      selectedCategoryPostIds.has(p.postCategoryId),
    );

    if (selectedPosts.length === 0) return;

    setRemovingIds(new Set(selectedPosts.map((p) => p.postCategoryId)));

    try {
      await Promise.all(
        selectedPosts.map((post) =>
          deletePostCategory.mutateAsync({ id: post.postCategoryId }),
        ),
      );

      toast.success({
        title: "Thành công",
        content: `Đã xóa ${selectedPosts.length} bài viết khỏi danh mục`,
      });

      setSelectedCategoryPostIds(new Set());
      queryClient.invalidateQueries({
        queryKey: ["category-post-ids", categoryId],
      });
      onRefresh();
    } catch (error) {
      console.error("Error removing posts:", error);
      const msg = extractErrorMessage(error);
      toast.error({ title: "Xóa thất bại", content: msg });
    } finally {
      setRemovingIds(new Set());
    }
  };

  // Drag and drop sensors with optimized activation constraints
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Balanced for responsiveness
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // Prevent accidental drags
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      setActiveId(null);

      if (!over || active.id === over.id) return;

      // Optimistic update - update UI immediately without blocking
      setLocalPosts((items) => {
        const oldIndex = items.findIndex((i) => i.postCategoryId === active.id);
        const newIndex = items.findIndex((i) => i.postCategoryId === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        const updatedItems = newItems.map((item, index) => ({
          ...item,
          position: index + 1,
        }));

        // Call API async without blocking UI
        setTimeout(() => {
          updateAllPositions(
            updatedItems.map((item) => ({
              postCategoryId: item.postCategoryId,
              position: item.position,
            })),
          );
        }, 0);

        return updatedItems;
      });
    },
    [updateAllPositions],
  );

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      const isNearBottom =
        target.scrollHeight - target.scrollTop <= target.clientHeight + 100;

      if (isNearBottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  const handleCategoryScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      const isNearBottom =
        target.scrollHeight - target.scrollTop <= target.clientHeight + 100;

      if (
        isNearBottom &&
        hasNextCategoryPage &&
        !isFetchingNextCategoryPage &&
        fetchNextCategoryPage
      ) {
        fetchNextCategoryPage();
      }
    },
    [hasNextCategoryPage, isFetchingNextCategoryPage, fetchNextCategoryPage],
  );

  return (
    <div className="grid grid-cols-2 gap-6 h-[calc(100vh-150px)]">
      {/* Left: Available Posts */}
      <div className="flex flex-col border border-gray-200 rounded-xl overflow-hidden bg-gradient-to-b from-gray-50 to-white shadow-sm">
        <div className="p-5 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3">
              <Archive className="h-5 w-5 text-blue-500 relative top-[1.5px]" />
              Kho bài viết
            </h3>
            {selectedPostIds.size > 0 && (
              <Button
                size="sm"
                onClick={handleAddMultiplePosts}
                disabled={addingIds.size > 0}
                className="bg-blue-500 hover:bg-blue-600 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                Thêm đã chọn ({selectedPostIds.size})
              </Button>
            )}
          </div>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo tên, mã, tóm tắt..."
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg"
            />
          </div>
          {/* Tabs filter for available posts */}
          <div>
            <Tabs
              value={availablePostsFilterType}
              onValueChange={(value) =>
                setAvailablePostsFilterType(value as "all" | "news" | "service")
              }
              className="w-full"
            >
              <TabsList className="inline-flex h-auto w-full gap-1 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger
                  value="all"
                  className="flex-1 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm px-3 py-2 rounded-md text-sm font-medium transition-all"
                >
                  Tất cả (
                  {
                    allPosts.filter(
                      (p) =>
                        !new Set([
                          ...categoryPostIds,
                          ...localPosts.map((lp) => lp.id),
                        ]).has(p.id),
                    ).length
                  }
                  )
                </TabsTrigger>
                <TabsTrigger
                  value="news"
                  className="flex-1 data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm px-3 py-2 rounded-md text-sm font-medium transition-all"
                >
                  <Newspaper className="h-4 w-4 mr-1.5" />
                  Tin tức (
                  {
                    allPosts.filter(
                      (p) =>
                        !p.is_service &&
                        !new Set([
                          ...categoryPostIds,
                          ...localPosts.map((lp) => lp.id),
                        ]).has(p.id),
                    ).length
                  }
                  )
                </TabsTrigger>
                <TabsTrigger
                  value="service"
                  className="flex-1 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm px-3 py-2 rounded-md text-sm font-medium transition-all"
                >
                  <Briefcase className="h-4 w-4 mr-1.5" />
                  Dịch vụ (
                  {
                    allPosts.filter(
                      (p) =>
                        p.is_service &&
                        !new Set([
                          ...categoryPostIds,
                          ...localPosts.map((lp) => lp.id),
                        ]).has(p.id),
                    ).length
                  }
                  )
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4" onScroll={handleScroll}>
          <div className="space-y-2">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="text-sm font-medium text-gray-600">
                  Đang tải bài viết...
                </span>
              </div>
            ) : availablePosts.length === 0 ? (
              <div className="text-center py-12 px-4">
                {searchQ.trim() ? (
                  <>
                    <SearchX className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <div className="font-bold text-gray-900 text-lg mb-2">
                      Không tìm thấy bài viết khả dụng
                    </div>
                    <div className="text-sm text-gray-600 max-w-sm mx-auto">
                      {allPosts.length > 0
                        ? "Các bài viết tìm được đã được thêm vào danh mục này"
                        : `Không có kết quả cho "${searchQ}"`}
                    </div>
                  </>
                ) : allPosts.length > 0 ? (
                  <>
                    <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <div className="font-bold text-gray-900 text-lg">
                      Tất cả bài viết đã được thêm vào danh mục
                    </div>
                  </>
                ) : (
                  <>
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <div className="font-bold text-gray-900 text-lg">
                      Không tìm thấy bài viết nào
                    </div>
                  </>
                )}
              </div>
            ) : (
              availablePosts.map((post) => (
                <div
                  key={post.id}
                  className={`group flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${
                    selectedPostIds.has(post.id)
                      ? "bg-blue-50 border-blue-400 shadow-md ring-2 ring-blue-200"
                      : "bg-white border-gray-200 hover:shadow-md hover:border-blue-500/30"
                  }`}
                >
                  <Checkbox
                    checked={selectedPostIds.has(post.id)}
                    onCheckedChange={(checked) => {
                      const newSelected = new Set(selectedPostIds);
                      if (checked) {
                        newSelected.add(post.id);
                      } else {
                        newSelected.delete(post.id);
                      }
                      setSelectedPostIds(newSelected);
                    }}
                    disabled={addingIds.size > 0}
                    className="h-5 w-5 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                  />
                  <PostImage
                    src={
                      post.thumbnail_compress_info?.mobile ||
                      post.thumbnail_path ||
                      null
                    }
                    alt={post.title}
                    className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 line-clamp-2 mb-1">
                      {post.title}
                    </div>
                    <div className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {post.summary ? parse(post.summary) : "Không có tóm tắt"}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant="outline"
                        className="text-xs font-medium border-blue-500/30 text-blue-600 bg-blue-50"
                      >
                        {post.code}
                      </Badge>
                      {post.is_hidden && (
                        <Badge
                          variant="destructive"
                          className="text-xs font-medium shadow-sm"
                        >
                          Ẩn
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      {post.published_at && (
                        <span
                          className="flex items-center gap-1 text-green-600"
                          title="Ngày xuất bản"
                        >
                          <Calendar className="h-3 w-3" />
                          <span className="font-medium">Xuất bản:</span>{" "}
                          {formatDate(post.published_at)}
                        </span>
                      )}
                      {post.expired_at && (
                        <span
                          className="flex items-center gap-1 text-red-600"
                          title="Ngày hết hạn"
                        >
                          <CalendarX2 className="h-3 w-3" />
                          <span className="font-medium">Hết hạn:</span>{" "}
                          {formatDate(post.expired_at)}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddPost(post)}
                    disabled={addingIds.has(post.id)}
                    className="bg-blue-100 rounded-full border border-blue-200 hover:bg-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all duration-200 shrink-0"
                  >
                    {addingIds.has(post.id) ? (
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                    ) : (
                      <Plus className="h-5 w-5 text-blue-600" />
                    )}
                  </Button>
                </div>
              ))
            )}
            {isFetchingNextPage && (
              <div className="flex items-center justify-center py-4 gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                <span className="text-sm font-medium text-gray-600">
                  Đang tải thêm...
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Posts in Category (Sortable) */}
      <div className="flex flex-col border border-gray-200 rounded-xl overflow-hidden bg-gradient-to-b from-gray-50 to-white shadow-sm">
        <div className="p-5 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 flex-shrink-0">
                <ClipboardList className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Bài viết trong danh mục
                </h3>
                <p className="text-sm text-gray-500">Kéo thả để sắp xếp</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {selectedCategoryPostIds.size > 0 && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleRemoveMultiplePosts}
                  disabled={removingIds.size > 0}
                  className="bg-red-500 hover:bg-red-600 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {removingIds.size > 0 ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-1" />
                  )}
                  Xóa đã chọn ({selectedCategoryPostIds.size})
                </Button>
              )}
              {isUpdatingPosition && (
                <div className="flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang cập nhật...</span>
                </div>
              )}
              <div className="flex items-center gap-2 bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full shadow-sm">
                <ClipboardList className="h-4 w-4" />
                <span className="text-sm font-semibold whitespace-nowrap">
                  {localPosts.length} bài viết
                </span>
              </div>
            </div>
          </div>
          {/* Tabs filter for is_service */}
          <div className="mt-4">
            <Tabs
              value={filterType}
              onValueChange={(value) =>
                setFilterType(value as "all" | "news" | "service")
              }
              className="w-full"
            >
              <TabsList className="inline-flex h-auto w-full gap-1 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger
                  value="all"
                  className="flex-1 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm px-3 py-2 rounded-md text-sm font-medium transition-all"
                >
                  Tất cả ({localPosts.length})
                </TabsTrigger>
                <TabsTrigger
                  value="news"
                  className="flex-1 data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm px-3 py-2 rounded-md text-sm font-medium transition-all"
                >
                  <Newspaper className="h-4 w-4 mr-1.5" />
                  Tin tức ({localPosts.filter((p) => !p.is_service).length})
                </TabsTrigger>
                <TabsTrigger
                  value="service"
                  className="flex-1 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm px-3 py-2 rounded-md text-sm font-medium transition-all"
                >
                  <Briefcase className="h-4 w-4 mr-1.5" />
                  Dịch vụ ({localPosts.filter((p) => p.is_service).length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        <div
          className="flex-1 overflow-y-auto p-4"
          onScroll={handleCategoryScroll}
        >
          {filteredLocalPosts.length === 0 ? (
            <div className="text-center py-16 px-4">
              <ClipboardList className="w-20 h-20 mx-auto mb-4 text-gray-400" />
              <div className="font-bold text-gray-900 text-lg mb-2">
                Chưa có bài viết nào trong danh mục
              </div>
              <div className="text-sm text-gray-600 max-w-sm mx-auto">
                Chọn bài viết từ danh sách bên trái để thêm vào danh mục này
              </div>
            </div>
          ) : (
            <div className="relative">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
              >
                <SortableContext
                  items={sortableItems}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {isUpdatingPosition && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
                        <div className="flex items-center gap-3 bg-blue-500 text-white px-6 py-3 rounded-xl shadow-2xl">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span className="font-semibold">
                            Đang cập nhật vị trí...
                          </span>
                        </div>
                      </div>
                    )}
                    {filteredLocalPosts.map((post, index) => (
                      <SortablePostItem
                        key={post.postCategoryId}
                        post={post}
                        index={index}
                        onRemove={() =>
                          handleRemovePost(post.postCategoryId, post.title)
                        }
                        isRemoving={
                          removingId === post.postCategoryId ||
                          removingIds.has(post.postCategoryId)
                        }
                        isSelected={selectedCategoryPostIds.has(
                          post.postCategoryId,
                        )}
                        onSelectChange={(checked) => {
                          const newSelected = new Set(selectedCategoryPostIds);
                          if (checked) {
                            newSelected.add(post.postCategoryId);
                          } else {
                            newSelected.delete(post.postCategoryId);
                          }
                          setSelectedCategoryPostIds(newSelected);
                        }}
                        isMultiSelectMode={selectedCategoryPostIds.size > 0}
                      />
                    ))}
                  </div>
                </SortableContext>
                <DragOverlay dropAnimation={null}>
                  {activeId && activePost ? (
                    <div className="cursor-grabbing">
                      <SortablePostItem
                        post={activePost}
                        index={activePostIndex}
                        onRemove={() => {}}
                        isRemoving={false}
                        isSelected={false}
                        onSelectChange={() => {}}
                        isMultiSelectMode={false}
                      />
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            </div>
          )}
          {isFetchingNextCategoryPage && (
            <div className="flex items-center justify-center py-4 gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span className="text-sm font-medium text-gray-600">
                Đang tải thêm...
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
