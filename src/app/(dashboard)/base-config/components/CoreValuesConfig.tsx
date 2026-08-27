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
  Plus,
  Trash2,
  Save,
  Loader2,
  ChevronUp,
  ChevronDown,
  GripVertical,
} from "lucide-react";
import {
  useGetApiV10PageConfig,
  usePutApiV10PageConfigId,
  usePostApiV10PageConfig,
} from "@/api/endpoints/page-config";
import { PageConfigMutate } from "@/api/models/pageConfigMutate";
import { toast } from "sonner";

const CONFIG_KEY_VI = "about-core-values";
const CONFIG_KEY_EN = "about-core-values_en";

interface CoreValueItem {
  num: string;
  title: string;
  description: string;
  variant: "red" | "white";
  span: string;
}

interface CoreValuesConfig {
  values: CoreValueItem[];
}

const defaultItem = (): CoreValueItem => ({
  num: String(Date.now()).slice(-2),
  title: "",
  description: "",
  variant: "white",
  span: "lg:col-span-6",
});

const defaultConfigVi: CoreValuesConfig = {
  values: [
    { num: "01", title: "Chất lượng", description: "Cam kết cung cấp sản phẩm và dịch vụ chất lượng cao, đáp ứng và vượt kỳ vọng của khách hàng.", variant: "red", span: "lg:col-span-7" },
    { num: "02", title: "Chính trực", description: "Thượng tôn pháp luật, minh bạch và trách nhiệm trong mọi hoạt động kinh doanh.", variant: "white", span: "lg:col-span-5" },
    { num: "03", title: "Đổi mới", description: "Không ngừng sáng tạo, ứng dụng công nghệ để mang lại giải pháp tối ưu cho khách hàng.", variant: "white", span: "lg:col-span-5" },
    { num: "04", title: "Đồng hành", description: "Luôn sát cánh cùng khách hàng và đối tác trong mọi giai đoạn phát triển.", variant: "red", span: "lg:col-span-7" },
  ],
};

const defaultConfigEn: CoreValuesConfig = {
  values: [
    { num: "01", title: "Quality", description: "Committed to providing high-quality products and services that meet and exceed customer expectations.", variant: "red", span: "lg:col-span-7" },
    { num: "02", title: "Integrity", description: "Upholding the law, transparency and responsibility in all business activities.", variant: "white", span: "lg:col-span-5" },
    { num: "03", title: "Innovation", description: "Continuously creating and applying technology to deliver optimal solutions for customers.", variant: "white", span: "lg:col-span-5" },
    { num: "04", title: "Partnership", description: "Always standing side by side with customers and partners in every stage of development.", variant: "red", span: "lg:col-span-7" },
  ],
};

const VARIANT_STYLES: Record<string, { label: string; bg: string }> = {
  red: { label: "Red", bg: "bg-red-600 text-white" },
  white: { label: "White", bg: "bg-white border border-gray-200" },
};

const SPAN_OPTIONS = [
  { value: "lg:col-span-5", label: "5/12" },
  { value: "lg:col-span-6", label: "6/12" },
  { value: "lg:col-span-7", label: "7/12" },
  { value: "lg:col-span-8", label: "8/12" },
  { value: "lg:col-span-12", label: "12/12" },
];

interface CoreValuesConfigProps {
  canCreate?: boolean;
  canUpdate?: boolean;
}

export function CoreValuesConfig({ canCreate, canUpdate }: CoreValuesConfigProps) {
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [viValues, setViValues] = useState<CoreValueItem[]>(defaultConfigVi.values);
  const [viConfigId, setViConfigId] = useState<string>("");

  const [enValues, setEnValues] = useState<CoreValueItem[]>(defaultConfigEn.values);
  const [enConfigId, setEnConfigId] = useState<string>("");

  const isEn = lang === "en";
  const configKey = isEn ? CONFIG_KEY_EN : CONFIG_KEY_VI;
  const configId = isEn ? enConfigId : viConfigId;
  const values = isEn ? enValues : viValues;
  const setValues = isEn ? setEnValues : setViValues;

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
          const parsed = JSON.parse(row.value) as CoreValuesConfig;
          if (parsed.values && Array.isArray(parsed.values)) {
            setViValues(parsed.values);
          }
        } catch { /* keep defaults */ }
      }
    } else {
      setViConfigId("");
    }
  }, [viResp]);

  useEffect(() => {
    const rows = enResp?.responseData?.rows;
    if (rows && rows.length > 0) {
      const row = rows[0] as { id: string; value: string | null };
      setEnConfigId(row.id);
      if (row.value) {
        try {
          const parsed = JSON.parse(row.value) as CoreValuesConfig;
          if (parsed.values && Array.isArray(parsed.values)) {
            setEnValues(parsed.values);
          }
        } catch { /* keep defaults */ }
      }
    } else {
      setEnConfigId("");
    }
  }, [enResp]);

  const addItem = () => {
    setValues([...values, defaultItem()]);
    setHasChanges(true);
  };

  const removeItem = (idx: number) => {
    setValues(values.filter((_, i) => i !== idx));
    setHasChanges(true);
  };

  const updateItem = (idx: number, field: keyof CoreValueItem, value: string) => {
    setValues(values.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));
    setHasChanges(true);
  };

  const moveItem = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= values.length) return;
    const next = [...values];
    [next[idx], next[target]] = [next[target], next[idx]];
    setValues(next);
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: CoreValuesConfig = { values };
      const value = JSON.stringify(payload);
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
      setHasChanges(false);
      toast.success("Đã lưu cấu hình Giá trị cốt lõi");
      if (isEn) refetchEn(); else refetchVi();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Unknown";
      toast.error("Lỗi khi lưu: " + msg);
    } finally {
      setSaving(false);
    }
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
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <div>
            <CardTitle className="text-base font-semibold">
              Giá trị cốt lõi
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Danh sách giá trị cốt lõi hiển thị trên trang Tầm nhìn - Sứ mệnh
            </CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => { if (hasChanges) { toast.error("Vui lòng lưu trước khi chuyển ngôn ngữ"); return; } setLang("vi"); }}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${lang === "vi" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
            >
              VI
            </button>
            <button
              onClick={() => { if (hasChanges) { toast.error("Vui lòng lưu trước khi chuyển ngôn ngữ"); return; } setLang("en"); }}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${lang === "en" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
            >
              EN
            </button>
          </div>
          {canEdit && (
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="gap-1 bg-green-600 hover:bg-green-700"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Lưu
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {values.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center py-12 text-gray-400">
            <p className="text-sm font-medium">Chưa có giá trị cốt lõi nào</p>
          </div>
        ) : (
          values.map((item, idx) => {
            const variantStyle = VARIANT_STYLES[item.variant] || VARIANT_STYLES.dark;
            return (
              <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="flex items-center gap-3 p-3 bg-gray-50 border-b border-gray-100">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-600 text-white text-sm font-semibold">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {item.title || `Giá trị #${idx + 1}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={() => moveItem(idx, -1)} disabled={idx === 0}>
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                    <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={() => moveItem(idx, 1)} disabled={idx === values.length - 1}>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                    <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => removeItem(idx)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-[auto_1fr] gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">Số thứ tự</Label>
                      <Input
                        value={item.num}
                        onChange={(e) => updateItem(idx, "num", e.target.value)}
                        placeholder="01"
                        className="h-9 w-20"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">Tiêu đề</Label>
                      <Input
                        value={item.title}
                        onChange={(e) => updateItem(idx, "title", e.target.value)}
                        placeholder="Chất lượng"
                        className="h-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Mô tả</Label>
                    <Textarea
                      value={item.description}
                      onChange={(e) => updateItem(idx, "description", e.target.value)}
                      placeholder="Mô tả giá trị cốt lõi..."
                      className="resize-none"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">Variant (màu nền)</Label>
                      <select
                        value={item.variant}
                        onChange={(e) => updateItem(idx, "variant", e.target.value)}
                        className="h-9 border rounded px-2 text-sm bg-white w-full"
                      >
                        <option value="red">Red (nền đỏ)</option>
                        <option value="white">White (nền trắng)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">Độ rộng (grid span)</Label>
                      <select
                        value={item.span}
                        onChange={(e) => updateItem(idx, "span", e.target.value)}
                        className="h-9 border rounded px-2 text-sm bg-white w-full"
                      >
                        {SPAN_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs text-gray-400">Preview:</span>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${variantStyle.bg}`}>
                      <span className="font-semibold">{item.title || "Tiêu đề"}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        {canEdit && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addItem}
            className="w-full gap-1"
          >
            <Plus className="w-4 h-4" />
            Thêm giá trị cốt lõi
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
