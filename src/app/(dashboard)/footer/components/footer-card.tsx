import type { Footer } from "@/api/models/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Edit,
  Eye,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import Can from "@/acl/Can";

interface FooterCardProps {
  footer: Footer;
  index: number;
  canEdit?: boolean;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
  deletingId?: string | null;
}

export function FooterCard({
  footer,
  index,
  canEdit = false,
  onDelete,
  isDeleting = false,
  deletingId,
}: FooterCardProps) {
  const isThisDeleting = deletingId === footer.id;

  return (
    <Card className="border-2 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-600">
                    {index}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {footer.description}
                  </h3>
                  {footer.sub_description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {footer.sub_description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <Phone className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Điện thoại</p>
                <p className="text-sm font-semibold">{footer.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <Mail className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-semibold">{footer.email}</p>
              </div>
            </div>
          </div>

          {/* Addresses */}
          {footer.address && footer.address.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">
                Địa chỉ
              </h4>
              <div className="space-y-2">
                {footer.address.map((addr, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border"
                  >
                    <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{addr.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {addr.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats & Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Lượt truy cập</p>
                  <p className="text-sm font-semibold">{footer.total_views}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Đang online</p>
                  <p className="text-sm font-semibold">
                    {footer.online_visitors}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Can I="view_detail" a="footer">
                <Link href={`/footer/${footer.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Xem
                  </Button>
                </Link>
              </Can>
              {canEdit && (
                <Link href={`/footer/edit/${footer.id}`}>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Edit className="h-4 w-4 mr-2" />
                    Sửa
                  </Button>
                </Link>
              )}
              <Can I="delete" a="footer">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => footer.id && onDelete(footer.id)}
                  disabled={isDeleting || isThisDeleting}
                >
                  {isThisDeleting ? (
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
      </CardContent>
    </Card>
  );
}
