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
  BarChart3,
  AlertCircle,
} from "lucide-react";
import {
  useGetApiV10PageConfig,
  usePutApiV10PageConfigId,
  usePostApiV10PageConfig,
} from "@/api/endpoints/page-config";
import { PageConfigMutate } from "@/api/models/pageConfigMutate";
import { toast } from "sonner";

const STATS_CONFIG_KEY_VI = "STATS_NUMBERS";
const STATS_CONFIG_KEY_EN = "STATS_NUMBERS_EN";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

const defaultStatsVi: StatItem[] = [
  { value: 25, suffix: "+", label: "Năm kinh nghiệm" },
  { value: 500, suffix: "+", label: "Khách hàng doanh nghiệp" },
  { value: 2000, suffix: "+", label: "Tài sản đã tư vấn" },
  { value: 100, suffix: "+", label: "Dự án tham gia" },
  { value: 50, suffix: "+", label: "Chuyên gia và cộng tác viên" },
  { value: 100000, suffix: "+", label: "m² diện tích quản lý" },
];

const defaultStatsEn: StatItem[] = [
  { value: 25, suffix: "+", label: "Years of experience" },
  { value: 500, suffix: "+", label: "Corporate clients" },
  { value: 2000, suffix: "+", label: "Assets consulted" },
  { value: 100, suffix: "+", label: "Projects involved" },
  { value: 50, suffix: "+", label: "Experts & collaborators" },
  { value: 100000, suffix: "+", label: "m² managed area" },
];

interface StatsConfigData {
  stats: StatItem[];
}

const defaultConfigVi: StatsConfigData = { stats: defaultStatsVi };
const defaultConfigEn: StatsConfigData = { stats: defaultStatsEn };

interface StatsConfigProps {
  canCreate?: boolean;
  canUpdate?: boolean;
}

export function StatsConfig({ canCreate, canUpdate }: StatsConfigProps) {
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  // VI state
  const [viData, setViData] = useState<StatsConfigData>(defaultConfigVi);
  const [viEdit, setViEdit] = useState<StatsConfigData>(defaultConfigVi);
  const [viConfigId, setViConfigId] = useState<string>("");

  // EN state
  const [enData, setEnData] = useState<StatsConfigData>(defaultConfigEn);
  const [enEdit, setEnEdit] = useState<StatsConfigData>(defaultConfigEn);
  const [enConfigId, setEnConfigId] = useState<string>("");

  const { data: viResp, isLoading: viLoading, refetch: refetchVi } = useGetApiV10PageConfig({
    filters: `key==${STATS_CONFIG_KEY_VI}`,
  });
  const { data: enResp, isLoading: enLoading, refetch: refetchEn } = useGetApiV10PageConfig({
    filters: `key==${STATS_CONFIG_KEY_EN}`,
  });

  const putMutation = usePutApiV10PageConfigId();
  const postMutation = usePostApiV10PageConfig();

  const isLoading = viLoading || enLoading;
  const canEdit = canCreate || canUpdate;

  // Derive active language state
  const configKey = lang === "vi" ? STATS_CONFIG_KEY_VI : STATS_CONFIG_KEY_EN;
  const configId = lang === "vi" ? viConfigId : enConfigId;
  const formData = lang === "vi" ? viEdit : enEdit;
  const setFormData = lang === "vi" ? setViEdit : setEnEdit;

  // Parse VI data
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

  // Parse EN data
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

  const validate = (): string | null => {
    for (let i = 0; i < formData.stats.length; i++) {
      const s = formData.stats[i];
      if (!s.label.trim()) return `Mục ${i + 1}: Nhãn không được để trống`;
      if (s.value < 0) return `Mục ${i + 1}: Giá trị không được âm`;
    }
    return null;
  };

  const handleSave = async () => {
    const error = validate();
    if (error) {
      toast.error(error);
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
      toast.success("Đã lưu cấu hình số liệu thống kê");
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

  const addStat = () => {
    setFormData({
      ...formData,
      stats: [...formData.stats, { value: 0, suffix: "+", label: "" }],
    });
  };

  const removeStat = (index: number) => {
    setFormData({
      ...formData,
      stats: formData.stats.filter((_, i) => i !== index),
    });
    setConfirmDelete(null);
  };

  const updateStat = (index: number, field: keyof StatItem, val: string) => {
    const updated = [...formData.stats];
    if (field === "value") {
      updated[index] = { ...updated[index], value: Number(val) || 0 };
    } else {
      updated[index] = { ...updated[index], [field]: val };
    }
    setFormData({ ...formData, stats: updated });
  };

  const formatPreview = (val: number, suffix: string) => {
    if (val >= 1000) return `${Math.floor(val / 1000)}.000${suffix}`;
    return `${val}${suffix}`;
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
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
            <BarChart3 className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">
              Số liệu thống kê
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Cấu hình các con số hiển thị trên trang chủ
            </CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Language toggle */}
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
                Giá trị là số nguyên. Hậu tố thường là &quot;+&quot; hoặc &quot;%&quot;.
              </p>
            </div>
            <div className="space-y-3">
              {formData.stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-end gap-3 rounded-lg border p-3"
                >
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">
                      Nhãn hiển thị *
                    </Label>
                    <Input
                      value={stat.label}
                      onChange={(e) => updateStat(index, "label", e.target.value)}
                      placeholder="VD: Năm kinh nghiệm"
                      className="mt-1"
                    />
                  </div>
                  <div className="w-32">
                    <Label className="text-xs text-muted-foreground">
                      Giá trị (số) *
                    </Label>
                    <Input
                      type="number"
                      value={stat.value}
                      onChange={(e) => updateStat(index, "value", e.target.value)}
                      placeholder="25"
                      className="mt-1"
                    />
                  </div>
                  <div className="w-20">
                    <Label className="text-xs text-muted-foreground">
                      Hậu tố
                    </Label>
                    <Input
                      value={stat.suffix}
                      onChange={(e) => updateStat(index, "suffix", e.target.value)}
                      placeholder="+"
                      className="mt-1"
                    />
                  </div>
                  <div className="w-24 text-center pb-2">
                    <span className="text-2xl font-extrabold text-gray-900">
                      {formatPreview(stat.value, stat.suffix)}
                    </span>
                  </div>
                  {confirmDelete === index ? (
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeStat(index)}
                      >
                        Xóa
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setConfirmDelete(null)}
                      >
                        Hủy
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setConfirmDelete(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={addStat}
              className="w-full border-dashed"
            >
              <Plus className="h-4 w-4 mr-1" />
              Thêm mục số liệu
            </Button>
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden">
            {formData.stats.map((stat, index) => (
              <div
                key={index}
                className="bg-card p-6 text-center"
              >
                <div className="text-3xl font-extrabold text-gray-900">
                  {formatPreview(stat.value, stat.suffix)}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
