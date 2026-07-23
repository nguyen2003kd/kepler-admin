"use client";

import {
  useDeleteApiV10FooterId,
  useGetApiV10FooterId,
} from "@/api/endpoints/footer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/toaster";
import { extractErrorMessage } from "@/utils/error";
import {
  ArrowLeft,
  Building2,
  Edit,
  Eye,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAbility } from "@/hooks/use-ability";
import Can from "@/acl/Can";

export default function FooterDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const ability = useAbility();
  const canEditFooter =
    ability.can("update_system", "footer") ||
    ability.can("update_basic_info", "footer") ||
    ability.can("update_address", "footer") ||
    ability.can("update_social", "footer");
  const { id } = params;
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { data: footerData, isLoading } = useGetApiV10FooterId(id);
  const deleteFooter = useDeleteApiV10FooterId();

  const footer = footerData?.responseData;

  const handleDelete = async () => {
    if (!ability.can("delete", "footer")) {
      toast.error({ title: "Không có quyền", content: "Bạn không có quyền xóa footer" });
      return;
    }

    try {
      await deleteFooter.mutateAsync({ id });
      toast.success({
        title: "Thành công",
        content: "Đã xóa footer",
      });
      router.push("/footer");
    } catch (error) {
      const msg = extractErrorMessage(error);
      toast.error({ title: "Xóa thất bại", content: msg });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!footer) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-12 max-w-md mx-auto">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">
              Không tìm thấy footer
            </h3>
            <p className="text-muted-foreground mb-4">
              Footer này không tồn tại hoặc đã bị xóa
            </p>
            <Link href="/footer">
              <Button>Quay lại danh sách</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Header Card */}
      <Card>
        <div className="p-6 border-b">
          <div className="flex items-center justify-between px-2">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">Chi tiết Footer</h1>
                <Badge
                  variant={footer.is_active ? "default" : "secondary"}
                  className={
                    footer.is_active
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : ""
                  }
                >
                  {footer.is_active ? "Đang hoạt động" : "Không hoạt động"}
                </Badge>
              </div>
              <p className="text-base text-muted-foreground">
                Xem thông tin chi tiết footer
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/footer">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Button>
              </Link>
              {canEditFooter && (
                <Link href={`/footer/edit/${id}`}>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                </Link>
              )}
              <Can I="delete" a="footer">
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={deleteFooter.isPending}
                >
                  {deleteFooter.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Xóa
                </Button>
              </Can>
            </div>
          </div>
        </div>
      </Card>

      <div className="px-6 py-5">
        <Card>
          <div className="p-5 space-y-8">
            {/* Basic Info Section */}
            <div>
              <div className="flex items-center gap-3 mb-6 pb-3 border-b">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Thông tin cơ bản</h3>
                  <p className="text-sm text-muted-foreground">
                    Thông tin chung của footer
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Mô tả
                  </h3>
                  <p className="text-base">{footer.description}</p>
                </div>

                {footer.sub_description && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Mô tả phụ
                    </h3>
                    <p className="text-base">{footer.sub_description}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <Phone className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Số điện thoại
                      </p>
                      <p className="font-medium">{footer.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                      <Mail className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Email
                      </p>
                      <p className="font-medium">{footer.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Đang online
                      </p>
                      <p className="font-medium">{footer.online_visitors}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                      <Eye className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Tổng lượt xem
                      </p>
                      <p className="font-medium">{footer.total_views}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Addresses Section */}
            {footer.address && footer.address.length > 0 && (
              <div className="border-t pt-8">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b">
                  <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Địa chỉ</h3>
                    <p className="text-sm text-muted-foreground">
                      Các địa chỉ của công ty
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {footer.address.map((addr, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b">
                          <div className="h-8 w-8 rounded-md bg-red-50 flex items-center justify-center">
                            <MapPin className="h-4 w-4 text-red-600" />
                          </div>
                          <h4 className="font-semibold text-sm">
                            {addr.title}
                          </h4>
                        </div>
                        <p className="text-muted-foreground">{addr.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links Section */}
            {footer.social_links &&
              Object.keys(footer.social_links).length > 0 && (
                <div className="border-t pt-8">
                  <div className="flex items-center gap-3 mb-6 pb-3 border-b">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Mạng xã hội</h3>
                      <p className="text-sm text-muted-foreground">
                        Liên kết các trang mạng xã hội
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(footer.social_links).map(
                      ([platform, url]) => (
                        <a
                          key={platform}
                          href={url as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border"
                        >
                          <Globe className="h-5 w-5 text-blue-600" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium capitalize">
                              {platform}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {url as string}
                            </p>
                          </div>
                        </a>
                      ),
                    )}
                  </div>
                </div>
              )}

            {/* Metadata Section */}
            {(footer.created_at || footer.updated_at) && (
              <div className="border-t pt-8">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg mb-4">
                    Thông tin hệ thống
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {footer.created_at && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">
                          Ngày tạo
                        </p>
                        <p className="font-medium">
                          {new Date(footer.created_at).toLocaleString("vi-VN")}
                        </p>
                      </div>
                    )}
                    {footer.updated_at && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">
                          Cập nhật lần cuối
                        </p>
                        <p className="font-medium">
                          {new Date(footer.updated_at).toLocaleString("vi-VN")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa footer này? Hành động này không thể hoàn
              tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
