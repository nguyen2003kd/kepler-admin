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
import {
  Save,
  Loader2,
  FileText,
  Download,
  AlertCircle,
} from "lucide-react";
import {
  useGetApiV10PageConfig,
  usePutApiV10PageConfigId,
  usePostApiV10PageConfig,
} from "@/api/endpoints/page-config";
import { PageConfigMutate } from "@/api/models/pageConfigMutate";
import { ImagePicker, type ImagePickerFile } from "@/components/shared/image-picker";
import baseConfig from "@/configs/base";
import { toast } from "sonner";

const CONFIG_KEY_VI = "ABOUT_CAPABILITY_PROFILE";
const CONFIG_KEY_EN = "ABOUT_CAPABILITY_PROFILE_EN";

interface CapabilityConfig {
  title: string;
  description: string;
  fileUrl?: string;
  imageUrl?: string;
}

const defaultConfigVi: CapabilityConfig = {
  title: "Hồ sơ năng lực Kepler Group",
  description:
    "Bộ tài liệu giới thiệu năng lực, kinh nghiệm và các dự án tiêu biểu của Kepler Group. Tải xuống để xem chi tiết.",
};

const defaultConfigEn: CapabilityConfig = {
  title: "Kepler Group Capability Profile",
  description:
    "A document introducing Kepler Group's capabilities, experience, and notable projects. Download to view details.",
};

interface CapabilityProfileConfigProps {
  canCreate?: boolean;
  canUpdate?: boolean;
}

export function CapabilityProfileConfig({ canCreate, canUpdate }: CapabilityProfileConfigProps) {
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerType, setPickerType] = useState<"image" | "file">("image");

  // VI state
  const [viData, setViData] = useState<CapabilityConfig>(defaultConfigVi);
  const [viEdit, setViEdit] = useState<CapabilityConfig>(defaultConfigVi);
  const [viConfigId, setViConfigId] = useState<string>("");

  // EN state
  const [enData, setEnData] = useState<CapabilityConfig>(defaultConfigEn);
  const [enEdit, setEnEdit] = useState<CapabilityConfig>(defaultConfigEn);
  const [enConfigId, setEnConfigId] = useState<string>("");

  const { data: viResp, isLoading: viLoading, refetch: refetchVi } = useGetApiV10PageConfig({
    filters: `key==${CONFIG_KEY_VI}`,
  });
  const { data: enResp, isLoading: enLoading, refetch: refetchEn } = useGetApiV10PageConfig({
    filters: `key==${CONFIG_KEY_EN}`,
  });

  const putMutation = usePutApiV10PageConfigId();
  const postMutation = usePostApiV10PageConfig();

  const isLoading = viLoading || enLoading;
  const canEdit = canCreate || canUpdate;

  const configKey = lang === "vi" ? CONFIG_KEY_VI : CONFIG_KEY_EN;
  const configId = lang === "vi" ? viConfigId : enConfigId;
  const formData = lang === "vi" ? viEdit : enEdit;
  const setFormData = lang === "vi" ? setViEdit : setEnEdit;

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
          data: {
            key: configKey,
            value,
            is_active: true,
          } as PageConfigMutate,
        });
      } else {
        await postMutation.mutateAsync({
          data: {
            key: configKey,
            value,
            is_active: true,
            language: lang,
          } as PageConfigMutate,
        });
      }
      toast.success("Đã lưu cấu hình hồ sơ năng lực");
      setEditing(false);
      if (lang === "vi") refetchVi(); else refetchEn();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Unknown";
      toast.error("Lỗi khi lưu cấu hình: " + msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    if (lang === "vi") setViEdit(viData);
    else setEnEdit(enData);
  };

  const openPicker = (type: "image" | "file") => {
    setPickerType(type);
    setPickerOpen(true);
  };

  const handleFileSelect = (file: ImagePickerFile) => {
    const bestPath = file.path;
    if (pickerType === "image") {
      setFormData({ ...formData, imageUrl: bestPath });
    } else {
      setFormData({ ...formData, fileUrl: bestPath });
    }
    setPickerOpen(false);
  };

  const getImageUrl = (path: string) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${baseConfig.imgEndpointDomain}${path}`;
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
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
              <FileText className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">
                Hồ sơ năng lực
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Cấu hình hồ sơ năng lực hiển thị trên trang giới thiệu
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
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-800">
                  Tải lên file PDF hoặc tài liệu để khách hàng có thể tải xuống hồ sơ năng lực.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Tiêu đề *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="VD: Hồ sơ năng lực Kepler Group"
                />
              </div>

              <div className="space-y-2">
                <Label>Mô tả</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả ngắn về hồ sơ năng lực..."
                  className="resize-none"
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* File upload */}
                <div className="space-y-2">
                  <Label>File tải xuống (PDF, DOC...)</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openPicker("file")}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Chọn file
                    </Button>
                    {formData.fileUrl && (
                      <span className="text-xs text-green-600 font-medium truncate">
                        ✓ Đã chọn file
                      </span>
                    )}
                  </div>
                  {formData.fileUrl && (
                    <a
                      href={getImageUrl(formData.fileUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline block truncate"
                    >
                      {formData.fileUrl}
                    </a>
                  )}
                </div>

                {/* Image upload */}
                <div className="space-y-2">
                  <Label>Hình ảnh đại diện</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openPicker("image")}
                    >
                      Chọn ảnh
                    </Button>
                    {formData.imageUrl && (
                      <img
                        src={getImageUrl(formData.imageUrl)}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                      />
                    )}
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
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-1" />
                      Lưu
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{formData.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{formData.description}</p>
              </div>
              <div className="flex items-center gap-4">
                {formData.fileUrl && (
                  <a
                    href={getImageUrl(formData.fileUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                  >
                    <Download className="w-4 h-4" />
                    File tải xuống
                  </a>
                )}
                {formData.imageUrl && (
                  <img
                    src={getImageUrl(formData.imageUrl)}
                    alt=""
                    className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                  />
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ImagePicker
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleFileSelect}
        type={pickerType === "image" ? "image" : "file"}
      />
    </>
  );
}
