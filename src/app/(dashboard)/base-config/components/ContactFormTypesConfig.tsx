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
import {
  Save,
  Loader2,
  Plus,
  Trash2,
  X,
  AlertCircle,
} from "lucide-react";
import {
  useGetApiV10PageConfig,
  usePutApiV10PageConfigId,
  usePostApiV10PageConfig,
} from "@/api/endpoints/page-config";
import { PageConfigMutate } from "@/api/models/pageConfigMutate";
import { toast } from "sonner";

const CONTACT_FORM_TYPES_KEY = "CONTACT_FORM_TYPES";

interface ContactFormType {
  slug: string;
  title: string;
  subtitle: string;
  showSubject: boolean;
  showPreferredDate: boolean;
  showPropertyInfo: boolean;
  showOrganization: boolean;
  contentLabel: string;
  contentPlaceholder: string;
}

const defaultFormTypes: ContactFormType[] = [
  {
    slug: "lien-he-kepler",
    title: "Liên hệ Kepler",
    subtitle: "Gửi tin nhắn cho chúng tôi, chúng tôi sẽ phản hồi trong thời gian sớm nhất.",
    showSubject: false,
    showPreferredDate: false,
    showPropertyInfo: false,
    showOrganization: false,
    contentLabel: "Nội dung",
    contentPlaceholder: "Nhập nội dung tin nhắn của bạn...",
  },
  {
    slug: "lien-he-hop-tac",
    title: "Liên hệ hợp tác",
    subtitle: "Hợp tác kinh doanh, phân phối, chiến lược cùng Kepler Group.",
    showSubject: false,
    showPreferredDate: false,
    showPropertyInfo: false,
    showOrganization: true,
    contentLabel: "Nội dung hợp tác",
    contentPlaceholder: "Mô tả ngắn gọn về cơ hội hợp tác...",
  },
  {
    slug: "yeu-cau-ban-cho-thue",
    title: "Yêu cầu bán/cho thuê BĐS",
    subtitle: "Để lại thông tin BĐS, chuyên viên Kepler sẽ liên hệ tư vấn.",
    showSubject: false,
    showPreferredDate: false,
    showPropertyInfo: true,
    showOrganization: false,
    contentLabel: "Thông tin BĐS",
    contentPlaceholder: "Địa chỉ, loại BĐS, diện tích, giá mong muốn...",
  },
  {
    slug: "yeu-cau-tham-dinh-gia",
    title: "Yêu cầu thẩm định giá",
    subtitle: "Yêu cầu dịch vụ thẩm định giá BĐS, máy móc, doanh nghiệp.",
    showSubject: false,
    showPreferredDate: false,
    showPropertyInfo: false,
    showOrganization: true,
    contentLabel: "Mô tả tài sản cần thẩm định",
    contentPlaceholder: "Loại tài sản, mục đích thẩm định, thời gian mong muốn...",
  },
  {
    slug: "yeu-cau-dich-vu",
    title: "Yêu cầu dịch vụ BĐS",
    subtitle: "Tư vấn mua, bán, cho thuê, đầu tư, khai thác BĐS.",
    showSubject: true,
    showPreferredDate: false,
    showPropertyInfo: false,
    showOrganization: false,
    contentLabel: "Chi tiết yêu cầu",
    contentPlaceholder: "Mô tả chi tiết dịch vụ bạn cần...",
  },
  {
    slug: "tu-van-thuong-vu-ma",
    title: "Tư vấn thương vụ M&A",
    subtitle: "Tư vấn M&A, tái cấu trúc, tìm đối tác đầu tư.",
    showSubject: false,
    showPreferredDate: false,
    showPropertyInfo: false,
    showOrganization: true,
    contentLabel: "Mô tả thương vụ",
    contentPlaceholder: "Loại giao dịch, quy mô, ngành nghề, thời gian...",
  },
  {
    slug: "dat-lich-hen-chuyen-gia",
    title: "Đặt lịch hẹn chuyên gia",
    subtitle: "Đặt lịch tư vấn trực tiếp với chuyên gia Kepler.",
    showSubject: false,
    showPreferredDate: true,
    showPropertyInfo: false,
    showOrganization: false,
    contentLabel: "Nội dung cần tư vấn",
    contentPlaceholder: "Chủ đề bạn muốn tư vấn...",
  },
];

interface ContactFormTypesConfigData {
  formTypes: ContactFormType[];
}

const defaultConfig: ContactFormTypesConfigData = {
  formTypes: defaultFormTypes,
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

interface ContactFormTypesConfigProps {
  canCreate?: boolean;
  canUpdate?: boolean;
}

export function ContactFormTypesConfig({
  canCreate = true,
  canUpdate = true,
}: ContactFormTypesConfigProps) {
  const canEdit = canCreate || canUpdate;
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<ContactFormTypesConfigData>(defaultConfig);
  const [configId, setConfigId] = useState<string>("");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const { data, isLoading, refetch } = useGetApiV10PageConfig({
    filters: `key==${CONTACT_FORM_TYPES_KEY}`,
  });

  const updateMutation = usePutApiV10PageConfigId();
  const createMutation = usePostApiV10PageConfig();

  useEffect(() => {
    const rows = data?.responseData?.rows;
    if (rows && rows.length > 0) {
      const row = rows[0] as { id?: string; value?: string | null };
      if (row.id) setConfigId(row.id);
      if (row.value) {
        try {
          const parsed = JSON.parse(row.value);
          if (parsed.formTypes && Array.isArray(parsed.formTypes)) {
            setFormData({ formTypes: parsed.formTypes });
          }
        } catch {
          setFormData(defaultConfig);
        }
      }
    }
  }, [data]);

  const handleSave = async () => {
    for (const ft of formData.formTypes) {
      if (!ft.slug.trim() || !ft.title.trim()) {
        toast.error("Slug và tiêu đề là bắt buộc");
        return;
      }
    }

    try {
      const value = JSON.stringify(formData);
      if (configId) {
        await updateMutation.mutateAsync({
          id: configId,
          data: {
            key: CONTACT_FORM_TYPES_KEY,
            value,
            is_active: true,
          } as PageConfigMutate,
        });
      } else {
        const created = await createMutation.mutateAsync({
          data: {
            key: CONTACT_FORM_TYPES_KEY,
            value,
            is_active: true,
          } as PageConfigMutate,
        });
        const newId = created?.responseData?.id;
        if (newId) setConfigId(newId);
      }
      setEditing(false);
      toast.success("Lưu cấu hình form liên hệ thành công");
      refetch();
    } catch (error) {
      console.error("Error saving contact form types:", error);
      toast.error("Có lỗi xảy ra khi lưu cấu hình");
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setConfirmDelete(null);
    refetch();
  };

  const addFormType = () => {
    setFormData((prev) => ({
      ...prev,
      formTypes: [
        ...prev.formTypes,
        {
          slug: "",
          title: "",
          subtitle: "",
          showSubject: false,
          showPreferredDate: false,
          showPropertyInfo: false,
          showOrganization: false,
          contentLabel: "Nội dung",
          contentPlaceholder: "",
        },
      ],
    }));
  };

  const removeFormType = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      formTypes: prev.formTypes.filter((_, i) => i !== index),
    }));
    setConfirmDelete(null);
  };

  const updateFormType = (
    index: number,
    field: keyof ContactFormType,
    value: string | boolean,
  ) => {
    setFormData((prev) => {
      const formTypes = [...prev.formTypes];
      formTypes[index] = { ...formTypes[index], [field]: value };
      if (field === "title") {
        const newSlug = slugify(value as string);
        if (!formTypes[index].slug || formTypes[index].slug === slugify(formTypes[index].title)) {
          formTypes[index].slug = newSlug;
        }
      }
      return { ...prev, formTypes };
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Loại form liên hệ</CardTitle>
            <CardDescription>
              Cấu hình các loại form liên hệ hiển thị trên trang Liên hệ
            </CardDescription>
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
            {formData.formTypes.map((ft, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 p-4 space-y-4 bg-gray-50/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    {ft.title || `Form ${index + 1}`}
                  </div>
                  {confirmDelete === index ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-red-600">Xóa?</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFormType(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 px-2"
                      >
                        <span className="text-xs">Có</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmDelete(null)}
                        className="h-7 px-2"
                      >
                        <span className="text-xs">Không</span>
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfirmDelete(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Tiêu đề <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={ft.title}
                      onChange={(e) => updateFormType(index, "title", e.target.value)}
                      placeholder="Liên hệ Kepler"
                      className={!ft.title.trim() ? "border-red-300" : ""}
                    />
                    {!ft.title.trim() && (
                      <p className="text-[10px] text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Bắt buộc
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Slug (URL) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={ft.slug}
                      onChange={(e) => updateFormType(index, "slug", e.target.value)}
                      placeholder="lien-he-kepler"
                      className={!ft.slug.trim() ? "border-red-300" : ""}
                    />
                    {!ft.slug.trim() && (
                      <p className="text-[10px] text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Bắt buộc
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Mô tả ngắn</Label>
                  <Input
                    value={ft.subtitle}
                    onChange={(e) => updateFormType(index, "subtitle", e.target.value)}
                    placeholder="Gửi tin nhắn cho chúng tôi..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Nhãn nội dung</Label>
                    <Input
                      value={ft.contentLabel}
                      onChange={(e) => updateFormType(index, "contentLabel", e.target.value)}
                      placeholder="Nội dung"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Placeholder nội dung</Label>
                    <Input
                      value={ft.contentPlaceholder}
                      onChange={(e) => updateFormType(index, "contentPlaceholder", e.target.value)}
                      placeholder="Nhập nội dung..."
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-1">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ft.showSubject}
                      onChange={(e) => updateFormType(index, "showSubject", e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    Field Chủ đề
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ft.showOrganization}
                      onChange={(e) => updateFormType(index, "showOrganization", e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    Field Tổ chức
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ft.showPropertyInfo}
                      onChange={(e) => updateFormType(index, "showPropertyInfo", e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    Field Thông tin BĐS
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ft.showPreferredDate}
                      onChange={(e) => updateFormType(index, "showPreferredDate", e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    Field Ngày hẹn
                  </label>
                </div>
              </div>
            ))}

            {canCreate && (
              <Button
                variant="outline"
                size="sm"
                onClick={addFormType}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Thêm loại form
              </Button>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" size="sm" onClick={handleCancel} className="gap-2">
                <X className="w-4 h-4" />
                Hủy
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={updateMutation.isPending || createMutation.isPending}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                {updateMutation.isPending || createMutation.isPending ? "Đang lưu..." : "Lưu"}
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            {formData.formTypes.map((ft, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50/50"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{ft.title}</p>
                    <p className="text-xs text-gray-500">
                      /contact/{ft.slug}
                      {ft.showSubject && " · Chủ đề"}
                      {ft.showOrganization && " · Tổ chức"}
                      {ft.showPropertyInfo && " · BĐS"}
                      {ft.showPreferredDate && " · Ngày hẹn"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
