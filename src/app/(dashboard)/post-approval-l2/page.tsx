"use client";

import React from "react";
import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getApiV10Post,
  useGetApiV10PostIdApprovalHistories,
  usePostApiV10PostIdResult,
} from "@/api/endpoints/post";
import {
  PostApprovalResultStatus,
  type PostStatus as PostStatusType,
  PostStatus,
} from "@/api/models";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toaster";
import { useAbility } from "@/hooks/use-ability";
import { extractErrorMessage } from "@/utils/error";
import { CheckCircle2, Clock3, Eye, History, Search, XCircle, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

type ApprovalPost = {
  id: string;
  title: string;
  code: string;
  status: PostStatusType;
  created_at: string;
};

type ApprovalHistoryItem = {
  id: string;
  approval_level: number;
  action: string;
  note: string | null;
  created_at: string;
};

type TabKey = "pending" | "approved" | "rejected";

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("vi-VN");
};

const getStatusBadge = (status?: string | null) => {
  if (status === PostStatus.PENDING_L1) return <Badge className="bg-amber-100 text-amber-800">Chờ duyệt L1</Badge>;
  if (status === PostStatus.PENDING_L2) return <Badge className="bg-blue-100 text-blue-800">Chờ duyệt L2</Badge>;
  if (status === PostStatus.PUBLISHED) return <Badge className="bg-green-100 text-green-800">Đã xuất bản</Badge>;
  if (status === PostStatus.REJECTED) return <Badge className="bg-red-100 text-red-800">Từ chối</Badge>;
  return <Badge variant="outline">{status || "Không rõ"}</Badge>;
};

export default function NewsApprovalL2Page() {
  const ability = useAbility();
  const [searchQ, setSearchQ] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<TabKey>("pending");
  const [resultDialogOpen, setResultDialogOpen] = React.useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = React.useState(false);
  const [activePost, setActivePost] = React.useState<ApprovalPost | null>(null);
  const [submitStatus, setSubmitStatus] = React.useState<"PUBLISHED" | "REJECTED" | null>(null);
  const [note, setNote] = React.useState("");

  const canApprovePost =
    ability.can("approve_post", "post-approval-2") || ability.can("approve_post", "news");
  const canViewPost = ability.can("view_post", "post-approval-2")|| ability.can("approve_post", "news");
  const canViewHistory =
    ability.can("view_history", "post-approval-2") || ability.can("view_history", "news");

  const pageSize = 10;
  const statusByTab: Record<TabKey, string> = {
    pending: PostStatus.PENDING_L2,
    approved: PostStatus.PUBLISHED,
    rejected: PostStatus.REJECTED,
  };
  const currentStatus = statusByTab[activeTab];

  const {
    data: infiniteData,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["post-approval-l2", activeTab, searchQ],
    queryFn: async ({ pageParam = 1, signal }) => {
      const trimmed = searchQ.trim();
      const statusFilter = `status==${currentStatus}`;
      const filters = trimmed
        ? `(title|summary|code)@=${encodeURI(trimmed)},${statusFilter}`
        : statusFilter;

      const response = await getApiV10Post(
        {
          page: pageParam,
          pageSize,
          sortOrder: "desc",
          filters,
          filterBy: "ADMIN",
        },
        signal
      );

      if (response.status !== "success") {
        throw new Error(response.message || "Không lấy được danh sách bài viết");
      }

      const responseData =
        (response as {
          responseData?: {
            rows?: Array<Record<string, unknown>>;
            count?: number;
            page?: number;
            pageSize?: number;
          };
        }).responseData || {};

      const rows = Array.isArray(responseData.rows) ? responseData.rows : [];
      const normalizedRows: ApprovalPost[] = rows
        .filter(item => item.id && String(item.id) !== '[id]')
        .map((item) => ({
          id: String(item.id),
          title: String(item.title || ''),
          code: String(item.code || ''),
          status: (item.status as PostStatusType) || null,
          created_at: String(item.created_at || ''),
        }));

      return {
        page: responseData.page ?? Number(pageParam),
        pageSize: responseData.pageSize ?? pageSize,
        count: typeof responseData.count === "number" ? responseData.count : 0,
        rows: normalizedRows,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const p = lastPage.page ?? 1;
      const ps = lastPage.pageSize ?? pageSize;
      const total = lastPage.count ?? 0;
      const totalPages = ps > 0 ? Math.ceil(total / ps) : undefined;
      return totalPages && p < totalPages ? p + 1 : undefined;
    },
    staleTime: 60_000,
  });

  const posts = React.useMemo(() => {
    if (!infiniteData?.pages) return [] as ApprovalPost[];
    return infiniteData.pages.flatMap((page) => page.rows || []);
  }, [infiniteData]);

  const totalCount = React.useMemo(() => {
    return infiniteData?.pages?.[0]?.count ?? 0;
  }, [infiniteData]);

  const resultMutation = usePostApiV10PostIdResult();

  const historyQuery = useGetApiV10PostIdApprovalHistories(
    activePost?.id || "",
    {
      page: 1,
      pageSize: 100,
      sortField: "created_at",
      sortOrder: "desc",
    },
    {
      query: {
        enabled: historyDialogOpen && !!activePost?.id,
      },
    }
  );

  const approvalHistories = React.useMemo(() => {
    const rows =
      (historyQuery.data as { responseData?: { rows?: Array<Record<string, unknown>> } } | undefined)
        ?.responseData?.rows || [];

    if (!Array.isArray(rows)) return [] as ApprovalHistoryItem[];

    return rows.map((item) => ({
      id: String(item.id || ""),
      approval_level: Number(item.approval_level || 0),
      action: String(item.action || ""),
      note: (item.note as string | null) || null,
      created_at: String(item.created_at || ""),
    }));
  }, [historyQuery.data]);

  const openResultDialog = (post: ApprovalPost, status: "PUBLISHED" | "REJECTED") => {
    if (!canApprovePost) {
      toast.error({
        title: "Không có quyền",
        content: "Bạn không có quyền duyệt hoặc từ chối bài viết",
      });
      return;
    }

    setActivePost(post);
    setSubmitStatus(status);
    setNote("");
    setResultDialogOpen(true);
  };

  const handleOpenHistoryDialog = () => {
    if (!canViewHistory) {
      toast.error({
        title: "Không có quyền",
        content: "Bạn không có quyền xem lịch sử duyệt",
      });
      return;
    }

    setHistoryDialogOpen(true);
  };

  React.useEffect(() => {
    setActivePost(null);
  }, [activeTab, searchQ]);

  const handleSubmitResult = async () => {
    if (!activePost || !submitStatus) return;
    if (!canApprovePost) {
      toast.error({
        title: "Không có quyền",
        content: "Bạn không có quyền duyệt hoặc từ chối bài viết",
      });
      return;
    }

    try {
      await resultMutation.mutateAsync({
        id: activePost.id,
        data: {
          status: submitStatus,
          note: note.trim() || null,
        },
      });

      toast.success({
        title: "Thành công",
        content:
          submitStatus === PostApprovalResultStatus.REJECTED
            ? "Đã từ chối bài viết"
            : "Đã xuất bản bài viết",
      });

      setResultDialogOpen(false);
      await refetch();
    } catch (error) {
      toast.error({
        title: "Thao tác thất bại",
        content: extractErrorMessage(error),
      });
    }
  };

  return (
    <div>
      <Header title="Duyệt bài cấp 2" />

      <main className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Duyệt bài cấp 2</h2>
            <p className="text-muted-foreground">Management duyệt bài từ trạng thái chờ duyệt L2 lên xuất bản hoặc từ chối.</p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/news">
              <Button variant="outline">Quay lại danh sách tin tức</Button>
            </Link>
            <Button onClick={() => refetch()} variant="outline" disabled={isLoading}>
              Làm mới
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock3 className="h-5 w-5 text-blue-600" />
              Danh sách bài viết L2
            </CardTitle>
            <CardDescription>Có {totalCount} bài viết đang ở trạng thái chờ duyệt L2.</CardDescription>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabKey)} className="mt-2">
              <TabsList>
                <TabsTrigger value="pending">Chờ duyệt</TabsTrigger>
                <TabsTrigger value="approved">Đã xác nhận</TabsTrigger>
                <TabsTrigger value="rejected">Từ chối</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={searchQ}
                onChange={(event) => setSearchQ(event.target.value)}
                placeholder="Tìm theo tiêu đề hoặc mã bài viết..."
                className="pl-10"
              />
            </div>
          </CardHeader>

          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="text-left p-3 font-semibold">Mã</th>
                    <th className="text-left p-3 font-semibold">Tiêu đề</th>
                    <th className="text-left p-3 font-semibold">Trạng thái</th>
                    <th className="text-left p-3 font-semibold">Ngày tạo</th>
                    <th className="text-right p-3 font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">Đang tải dữ liệu...</td>
                    </tr>
                  ) : posts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">Không có bài viết phù hợp</td>
                    </tr>
                  ) : (
                    posts.map((post) => (
                      <tr
                        key={post.id}
                        className={`border-t ${activePost?.id === post.id ? "bg-blue-50" : ""}`}
                      >
                        <td className="p-3 font-medium">{post.code || "-"}</td>
                        <td className="p-3 min-w-[280px]"><p className="font-medium text-slate-900">{post.title || "Không có tiêu đề"}</p></td>
                        <td className="p-3">{getStatusBadge(post.status)}</td>
                        <td className="p-3">{formatDateTime(post.created_at)}</td>
                        <td className="p-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Mở menu thao tác</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {canViewPost && (
                                <Link href={`/news/${encodeURIComponent(post.id)}`}>
                                  <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Xem
                                  </DropdownMenuItem>
                                </Link>
                              )}
                              {canViewHistory && (
                                <DropdownMenuItem onClick={() => {
                                  setActivePost(post);
                                  handleOpenHistoryDialog();
                                }}>
                                  <History className="mr-2 h-4 w-4" />
                                  Lịch sử
                                </DropdownMenuItem>
                              )}
                              {activeTab === "pending" && canApprovePost && (
                                <>
                                  <DropdownMenuItem onClick={() => openResultDialog(post, PostApprovalResultStatus.PUBLISHED)} className="text-emerald-600 focus:text-emerald-600">
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Xuất bản
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => openResultDialog(post, PostApprovalResultStatus.REJECTED)} className="text-red-600 focus:text-red-600">
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Từ chối
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-center">
              {hasNextPage ? (
                <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                  {isFetchingNextPage ? "Đang tải thêm..." : "Tải thêm"}
                </Button>
              ) : (
                <p className="text-sm text-gray-500">Đã tải hết dữ liệu</p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog open={resultDialogOpen} onOpenChange={setResultDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{submitStatus === PostApprovalResultStatus.REJECTED ? "Từ chối bài viết" : "Xuất bản bài viết"}</DialogTitle>
            <DialogDescription>{activePost?.title || "Bài viết"}</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label className="text-sm font-medium">Ghi chú</label>
            <Textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Nhập ghi chú (không bắt buộc)"
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setResultDialogOpen(false)}>Hủy</Button>
            <Button
              onClick={handleSubmitResult}
              disabled={resultMutation.isPending}
              className={submitStatus === PostApprovalResultStatus.REJECTED ? "bg-red-600 hover:bg-red-700 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"}
            >
              {resultMutation.isPending ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Lịch sử phê duyệt</DialogTitle>
            <DialogDescription>{activePost?.title || "Vui lòng chọn bài viết"}</DialogDescription>
          </DialogHeader>

          <div className="max-h-[420px] overflow-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-3 text-left font-semibold">Cấp duyệt</th>
                  <th className="p-3 text-left font-semibold">Hành động</th>
                  <th className="p-3 text-left font-semibold">Ghi chú</th>
                  <th className="p-3 text-left font-semibold">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {historyQuery.isLoading ? (
                  <tr><td colSpan={4} className="p-6 text-center text-gray-500">Đang tải lịch sử...</td></tr>
                ) : approvalHistories.length === 0 ? (
                  <tr><td colSpan={4} className="p-6 text-center text-gray-500">Chưa có lịch sử duyệt</td></tr>
                ) : (
                  approvalHistories.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="p-3">Level {item.approval_level || "-"}</td>
                      <td className="p-3">{item.action === "APPROVED" ? <Badge className="bg-emerald-100 text-emerald-800">APPROVED</Badge> : <Badge className="bg-red-100 text-red-800">REJECTED</Badge>}</td>
                      <td className="p-3">{item.note || "-"}</td>
                      <td className="p-3">{formatDateTime(item.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setHistoryDialogOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
