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
import { Save, Loader2, Image as ImageIcon, Compass } from "lucide-react";
import {
  useGetApiV10PageConfig,
  usePutApiV10PageConfigId,
  usePostApiV10PageConfig,
} from "@/api/endpoints/page-config";
import { ImagePicker, ImagePickerFile } from "@/components/shared/image-picker";
import { PageConfigMutate } from "@/api/models/pageConfigMutate";
import { toast } from "sonner";

const CONFIG_KEY_VI = "about-vision-mission-hero";
const CONFIG_KEY_EN = "about-vision-mission-hero_en";

interface HeroConfigData {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
}

const defaultConfigVi: HeroConfigData = {
  eyebrow: "Định hướng phát triển",
  title: "Tầm nhìn - Sứ mệnh - Giá trị cốt lõi",
  description:
    "Những định hướng và niềm tin dẫn lối cho mọi hoạt động của Kepler Group trên hành trình kiến tạo giá trị bền vững.",
  image: "/seo.png",
};

const defaultConfigEn: HeroConfigData = {
  eyebrow: "Development Orientation",
  title: "Vision - Mission - Core Values",
  description:
    "The orientations and beliefs that guide all of Kepler Group's activities on the journey of creating sustainable value.",
  image: "/seo.png",
};

interface VisionMissionHeroConfigProps {
  canCreate?: boolean;
  canUpdate?: boolean;
}

export function VisionMissionHeroConfig({ canCreate, canUpdate }: VisionMissionHeroConfigProps) {
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);

  const [viData, setViData] = useState<HeroConfigData>(defaultConfigVi);
  const [viEdit, setViEdit] = useState<HeroConfigData>(defaultConfigVi);
  const [viConfigId, setViConfigId] = useState<string>("");

  const [enData, setEnData] = useState<HeroConfigData>(defaultConfigEn);
  const [enEdit, setEnEdit] = useState<HeroConfigData>(defaultConfigEn);
  const [enConfigId, setEnConfigId] = useState<string>("");

  const isEn = lang === "en";
  const configKey = isEn ? CONFIG_KEY_EN : CONFIG_KEY_VI;
  const configId = isEn ? enConfigId : viConfigId;
  const formData = isEn ? enEdit : viEdit;
  const setFormData = isEn ? setEnEdit : setViEdit;
  const displayData = isEn ? enData : viData;

  const { data: viResp, isLoading: viLoading, refetch: refetchVi } = useGetApiV10PageConfig({
    filters: `key==${CONFIG_KEY_VI}`,
    pageSize: 1,
  });
  const { data: enResp, isLoading: enLoading, refetch: refetchEn } = useGetApiV10PageConfig({
    filters: `key==${CONFIG_KEY_EN}`,
    pageSize: 1,
  });

  const putMutation = usePutApiV10PageConfigId();
  const postMutation = usePostApiV10PageConfig();

  const isLoading = viLoading || enLoading;
  const canEdit = canCreate || canUpdate;

  useEffect(() => {
    const rows = viResp?.responseData?.rows;
    if (rows && rows.length > 0) {
      const row = rows[0] as { id: string; value: string | null };
      setViConfigId(row.id);
      if (row.value) {
        try {
          const parsed = JSON.parse(row.value);
          setViData({ ...defaultConfigVi, ...parsed });
          setViEdit({ ...defaultConfigVi, ...parsed });
        } catch {
          setViData(defaultConfigVi);
          setViEdit(defaultConfigVi);
        }
      }
    } else {
      setViConfigId("");
      setViData(defaultConfigVi);
      setViEdit(defaultConfigVi);
    }
  }, [viResp]);

  useEffect(() => {
    const rows = enResp?.responseData?.rows;
    if (rows && rows.length > 0) {
      const row = rows[0] as { id: string; value: string | null };
      setEnConfigId(row.id);
      if (row.value) {
        try {
          const parsed = JSON.parse(row.value);
          setEnData({ ...defaultConfigEn, ...parsed });
          setEnEdit({ ...defaultConfigEn, ...parsed });
        } catch {
          setEnData(defaultConfigEn);
          setEnEdit(defaultConfigEn);
        }
      }
    } else {
      setEnConfigId("");
      setEnData(defaultConfigEn);
      setEnEdit(defaultConfigEn);
    }
  }, [enResp]);

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("Tiêu đề không được để trống");
      return;
    }
    setSaving(true);
    try {
      const value = JSON.stringify(formData);
      if (configId) {
        await putMutation.mutateAsync({
          id: configId,
          data: { key: configKey, value, is_active: true } as PageConfigMutate,
        });
      } else {
        await postMutation.mutateAsync({
          data: { key: configKey, value, is_active: true, language: lang } as PageConfigMutate,
        });
      }
      toast.success("Đã lưu cấu hình Hero");
      setEditing(false);
      if (isEn) refetchEn(); else refetchVi();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Unknown";
      toast.error("Lỗi khi lưu: " + msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    if (isEn) setEnEdit(enData);
    else setViEdit(viData);
  };

  const handleImageSelect = (file: ImagePickerFile) => {
    setFormData({ ...formData, image: file.path });
    setImagePickerOpen(false);
  };

  const resolveImageUrl = (path: string): string => {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    return path;
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50">
              <Compass className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">
                Hero - Tầm nhìn Sứ mệnh
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Cấu hình banner đầu trang Tầm nhìn - Sứ mệnh
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => { if (editing) { toast.error("Vui lòng lưu hoặc hủy trước khi chuyển ngôn ngữ"); return; } setLang("vi"); }}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${lang === "vi" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                VI
              </button>
              <button
                onClick={() => { if (editing) { toast.error("Vui lòng lưu hoặc hủy trước khi chuyển ngôn ngữ"); return; } setLang("en"); }}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${lang === "en" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                EN
              </button>
            </div>
            {canEdit && !editing && (
              <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                Chỉnh sửa
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {editing ? (
            <>
              <div className="space-y-2">
                <Label>Eyebrow (nhãn nhỏ)</Label>
                <Input
                  value={formData.eyebrow}
                  onChange={(e) => setFormData({ ...formData, eyebrow: e.target.value })}
                  placeholder="Định hướng phát triển"
                />
              </div>
              <div className="space-y-2">
                <Label>Tiêu đề *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Tầm nhìn - Sứ mệnh - Giá trị cốt lõi"
                />
              </div>
              <div className="space-y-2">
                <Label>Mô tả</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả ngắn..."
                  className="resize-none"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Hình ảnh nền</Label>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-16 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center flex-shrink-0">
                    {formData.image ? (
                      <img
                        src={resolveImageUrl(formData.image)}
                        alt=""
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-300" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Input
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="/seo.png"
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
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" onClick={handleCancel}>
                  Hủy
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-1" /> Lưu
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Eyebrow</p>
                <p className="text-sm font-medium">{displayData.eyebrow}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tiêu đề</p>
                <p className="text-sm font-semibold">{displayData.title}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Mô tả</p>
                <p className="text-sm text-muted-foreground">{displayData.description}</p>
              </div>
              {displayData.image && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Hình ảnh</p>
                  <div className="w-32 h-20 rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                    <img
                      src={resolveImageUrl(displayData.image)}
                      alt=""
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {imagePickerOpen && (
        <ImagePicker
          isOpen={imagePickerOpen}
          onClose={() => setImagePickerOpen(false)}
          onSelect={handleImageSelect}
        />
      )}
    </>
  );
}
