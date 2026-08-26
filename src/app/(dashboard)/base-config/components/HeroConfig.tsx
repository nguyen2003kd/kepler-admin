"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Loader2, Image as ImageIcon, Type, Link2 } from "lucide-react";
import {
  useGetApiV10PageConfig,
  usePutApiV10PageConfigId,
  usePostApiV10PageConfig,
} from "@/api/endpoints/page-config";
import { ImagePicker, ImagePickerFile } from "@/components/shared/image-picker";
import { PageConfigMutate } from "@/api/models/pageConfigMutate";
import { toast } from "sonner";

const resolveImageUrl = (path: string): string => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return path;
};

const HERO_CONFIG_KEY = "HOME_HERO";

interface HeroConfigData {
  title: string;
  titleHighlight1: string;
  titleHighlight2: string;
  subtitle: string;
  cta1Text: string;
  cta1Link: string;
  cta2Text: string;
  cta2Link: string;
  logoImage: string;
}

const defaultConfig: HeroConfigData = {
  title: "Kiến tạo giá trị bền vững cho",
  titleHighlight1: "Bất động sản",
  titleHighlight2: "Doanh nghiệp",
  subtitle:
    "Kepler Group là hệ sinh thái tư vấn và dịch vụ bất động sản chuyên nghiệp, đồng hành cùng doanh nghiệp trong toàn bộ vòng đời tài sản — từ nghiên cứu đầu tư, thẩm định giá, phát triển dự án, quản lý vận hành đến tối ưu khai thác và gia tăng giá trị.",
  cta1Text: "Khám phá dịch vụ",
  cta1Link: "/dich-vu",
  cta2Text: "Liên hệ tư vấn",
  cta2Link: "/dat-lich-tu-van",
  logoImage: "/api/storage/uploads/images/file-1787394265327-698518208.png",
};

interface HeroConfigProps {
  canCreate?: boolean;
  canUpdate?: boolean;
}

export function HeroConfig({ canCreate, canUpdate }: HeroConfigProps) {
  const { data, isLoading, refetch } = useGetApiV10PageConfig({
    filters: `key==${HERO_CONFIG_KEY}`,
  });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [configId, setConfigId] = useState<string | null>(null);
  const [formData, setFormData] = useState<HeroConfigData>(defaultConfig);

  const canEdit = canCreate || canUpdate;

  useEffect(() => {
    const rows = data?.responseData?.rows;
    if (rows && rows.length > 0) {
      const row = rows[0] as { id: string; key: string; value: string | null };
      setConfigId(row.id);
      if (row.value) {
        try {
          const parsed = JSON.parse(row.value);
          setFormData({ ...defaultConfig, ...parsed });
        } catch {
          setFormData(defaultConfig);
        }
      }
    } else {
      setConfigId(null);
      setFormData(defaultConfig);
    }
  }, [data]);

  const putMutation = usePutApiV10PageConfigId();
  const postMutation = usePostApiV10PageConfig();

  const handleSave = async () => {
    setSaving(true);
    try {
      const value = JSON.stringify(formData);
      if (configId) {
        await putMutation.mutateAsync({
          id: configId,
          data: {
            key: HERO_CONFIG_KEY,
            value,
            is_active: true,
          } as PageConfigMutate,
        });
      } else {
        await postMutation.mutateAsync({
          data: {
            key: HERO_CONFIG_KEY,
            value,
            is_active: true,
          } as PageConfigMutate,
        });
      }
      toast.success("Đã lưu cấu hình Hero Banner");
      setEditing(false);
      refetch();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Unknown";
      toast.error("Lỗi khi lưu cấu hình: " + msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    const rows = data?.responseData?.rows;
    if (rows && rows.length > 0) {
      const row = rows[0] as { value: string | null };
      if (row.value) {
        try {
          setFormData({ ...defaultConfig, ...JSON.parse(row.value) });
        } catch {
          setFormData(defaultConfig);
        }
      }
    } else {
      setFormData(defaultConfig);
    }
  };

  const handleImageSelect = (file: ImagePickerFile) => {
    setFormData((prev) => ({
      ...prev,
      logoImage: file.path || prev.logoImage,
    }));
    setImagePickerOpen(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Type className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <CardTitle>Hero Banner Trang Chủ</CardTitle>
              <CardDescription>
                Cấu hình tiêu đề, mô tả, nút bấm và logo trên banner trang chủ
              </CardDescription>
            </div>
          </div>
          {canEdit && !editing && (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              Chỉnh sửa
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {editing ? (
          <>
            {/* Title */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Type className="w-4 h-4" /> Tiêu đề chính
              </Label>
              <div className="grid grid-cols-1 gap-3 pl-4 border-l-2 border-orange-100">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Phần thường</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Kiến tạo giá trị bền vững cho"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Highlight 1 (màu đỏ)</Label>
                    <Input
                      value={formData.titleHighlight1}
                      onChange={(e) => setFormData({ ...formData, titleHighlight1: e.target.value })}
                      placeholder="Bất động sản"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Highlight 2 (màu đỏ)</Label>
                    <Input
                      value={formData.titleHighlight2}
                      onChange={(e) => setFormData({ ...formData, titleHighlight2: e.target.value })}
                      placeholder="Doanh nghiệp"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Subtitle */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Mô tả phụ</Label>
              <Textarea
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Kepler Group là hệ sinh thái..."
                rows={4}
              />
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Link2 className="w-4 h-4" /> Nút bấm (CTA)
              </Label>
              <div className="grid grid-cols-2 gap-3 pl-4 border-l-2 border-orange-100">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Nút 1 - Text</Label>
                  <Input
                    value={formData.cta1Text}
                    onChange={(e) => setFormData({ ...formData, cta1Text: e.target.value })}
                    placeholder="Khám phá dịch vụ"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Nút 1 - Link</Label>
                  <Input
                    value={formData.cta1Link}
                    onChange={(e) => setFormData({ ...formData, cta1Link: e.target.value })}
                    placeholder="/dich-vu"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Nút 2 - Text</Label>
                  <Input
                    value={formData.cta2Text}
                    onChange={(e) => setFormData({ ...formData, cta2Text: e.target.value })}
                    placeholder="Liên hệ tư vấn"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Nút 2 - Link</Label>
                  <Input
                    value={formData.cta2Link}
                    onChange={(e) => setFormData({ ...formData, cta2Link: e.target.value })}
                    placeholder="/dat-lich-tu-van"
                  />
                </div>
              </div>
            </div>

            {/* Logo */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Logo (bên phải)
              </Label>
              <div className="flex items-center gap-3 pl-4 border-l-2 border-orange-100">
                <div className="w-24 h-24 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center flex-shrink-0 relative">
                  {formData.logoImage ? (
                    <img
                      src={resolveImageUrl(formData.logoImage)}
                      alt="Logo preview"
                      className="object-contain w-full h-full"
                      onError={() => { console.error('Logo load error:', resolveImageUrl(formData.logoImage)); }}
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-300" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Input
                    value={formData.logoImage}
                    onChange={(e) => setFormData({ ...formData, logoImage: e.target.value })}
                    placeholder="/images/kepler-white-logo.png"
                    className="w-80"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setImagePickerOpen(true)}
                  >
                    <ImageIcon className="w-4 h-4 mr-1" /> Chọn ảnh
                  </Button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button variant="outline" onClick={handleCancel} disabled={saving}>
                Hủy
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" /> Lưu
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Tiêu đề</Label>
                <p className="text-sm font-medium">
                  {formData.title}{" "}
                  <span className="text-red-600">{formData.titleHighlight1}</span>{" "}
                  <span className="text-red-600">{formData.titleHighlight2}</span>
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Mô tả</Label>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {formData.subtitle}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Nút 1</Label>
                <p className="text-sm">
                  {formData.cta1Text} → <code className="text-xs">{formData.cta1Link}</code>
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Nút 2</Label>
                <p className="text-sm">
                  {formData.cta2Text} → <code className="text-xs">{formData.cta2Link}</code>
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Logo</Label>
              <div className="w-32 h-20 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center relative">
                {formData.logoImage ? (
                  <img
                    src={resolveImageUrl(formData.logoImage)}
                    alt="Logo"
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-300" />
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {imagePickerOpen && (
        <ImagePicker
          isOpen={imagePickerOpen}
          onClose={() => setImagePickerOpen(false)}
          onSelect={handleImageSelect}
        />
      )}
    </Card>
  );
}
