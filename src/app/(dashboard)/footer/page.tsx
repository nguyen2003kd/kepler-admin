"use client";

import {
  useDeleteApiV10FooterId,
  useGetApiV10Footer,
} from "@/api/endpoints/footer";
import type { Footer } from "@/api/models/footer";
import { Header } from "@/components/layout/header";
import {
  ConfirmModal,
  useConfirmModal,
} from "@/components/shared/confirm-modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { extractErrorMessage } from "@/utils/error";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import Link from "next/link";
import Can from "@/acl/Can";
import { useAbility } from "@/hooks/use-ability";
import { EmptyState } from "./components/empty-state";
import { FooterCard } from "./components/footer-card";

export default function FooterPage() {
  const ability = useAbility();
  const canEditFooter =
    ability.can("update_system", "footer") ||
    ability.can("update_basic_info", "footer") ||
    ability.can("update_address", "footer") ||
    ability.can("update_social", "footer");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { data: footersData, isLoading } = useGetApiV10Footer();
  const deleteFooter = useDeleteApiV10FooterId();
  const { confirm } = useConfirmModal();

  // Sắp xếp footer: active lên trên
  const footers = useMemo(() => {
    const rows = footersData?.responseData?.rows || [];
    return [...rows].sort((a, b) => {
      if (a.is_active && !b.is_active) return -1;
      if (!a.is_active && b.is_active) return 1;
      return 0;
    });
  }, [footersData]);

  const handleDelete = async (id: string) => {
    if (!ability.can("delete", "footer")) {
      toast.error({ title: "Không có quyền", content: "Bạn không có quyền xóa footer" });
      return;
    }

    const confirmed = await confirm({
      title: "Xác nhận xóa",
      description:
        "Bạn có chắc chắn muốn xóa footer này? Hành động này không thể hoàn tác và sẽ xóa tất cả thông tin liên quan.",
      confirmText: "Xác nhận xóa",
      cancelText: "Hủy bỏ",
      variant: "destructive",
    });

    if (!confirmed) return;

    setDeletingId(id);
    try {
      await deleteFooter.mutateAsync({ id });
      toast.success({
        title: "Thành công",
        content: "Đã xóa footer thành công",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/v1.0/footer"] });
    } catch (error) {
      const msg = extractErrorMessage(error);
      toast.error({ title: "Xóa thất bại", content: msg });
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header title="Quản lý Footer" />
      <div className="space-y-6">
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between px-3">
              <div>
                <CardTitle className="text-2xl font-bold">
                  Quản lý Footer Website
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  Quản lý thông tin hiển thị ở cuối trang website
                </CardDescription>
              </div>
              <Can I="create" a="footer">
                <Link href="/footer/create">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo Footer
                  </Button>
                </Link>
              </Can>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {footers.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-6">
                {footers.map((footer: Footer, index: number) => (
                  <FooterCard
                    key={footer.id}
                    footer={footer}
                    index={index + 1}
                    canEdit={canEditFooter}
                    onDelete={handleDelete}
                    isDeleting={deleteFooter.isPending}
                    deletingId={deletingId}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ConfirmModal />
    </>
  );
}
