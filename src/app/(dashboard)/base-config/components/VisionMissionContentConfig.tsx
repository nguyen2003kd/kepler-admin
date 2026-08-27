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
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import {
  useGetApiV10PageConfig,
  usePutApiV10PageConfigId,
  usePostApiV10PageConfig,
} from "@/api/endpoints/page-config";
import { PageConfigMutate } from "@/api/models/pageConfigMutate";
import { toast } from "sonner";

const CONFIG_KEY_VI = "about-vision-mission";
const CONFIG_KEY_EN = "about-vision-mission_en";

interface VisionPoint {
  text: string;
}

interface MissionSubItem {
  title: string;
  description: string;
}

interface VisionMissionData {
  vision: {
    eyebrow: string;
    title: string;
    cardTitle: string;
    points: VisionPoint[];
    sideCardTitle: string;
    sideCardDesc: string;
  };
  mission: {
    eyebrow: string;
    title: string;
    cardTitle: string;
    mainDesc: string;
    subItems: MissionSubItem[];
  };
}

const defaultDataVi: VisionMissionData = {
  vision: {
    eyebrow: "Định hướng tương lai",
    title: "Tầm nhìn",
    cardTitle: "Tầm nhìn của Kepler",
    points: [
      { text: "Xây dựng mô hình khép kín mang lại nhiều tiện ích và chất lượng cho khách hàng và đối tác với sản phẩm và dịch vụ chuyên nghiệp." },
      { text: "Trở thành Công ty có dịch vụ sản phẩm chuyên nghiệp trong ngành bất động sản tại Việt Nam." },
    ],
    sideCardTitle: "Khép kín · Chất lượng · Chuyên nghiệp",
    sideCardDesc: "Mọi hành trình của Kepler đều hướng đến một hệ sinh thái toàn diện, nơi chất lượng và sự chuyên nghiệp tạo nên giá trị bền vững.",
  },
  mission: {
    eyebrow: "Sứ mệnh",
    title: "Sứ mệnh",
    cardTitle: "Sứ mệnh",
    mainDesc: "Cung cấp sản phẩm và dịch vụ tốt nhất, chuyên nghiệp nhất cho thị trường và tạo ra một chuỗi giá trị cho người tiêu dùng trong lĩnh vực bất động sản.",
    subItems: [
      { title: "Tốt nhất cho thị trường", description: "Sản phẩm và dịch vụ chuyên nghiệp, dẫn đầu về chất lượng và trải nghiệm." },
      { title: "Chuỗi giá trị cho người tiêu dùng", description: "Kết nối lợi ích bền vững giữa doanh nghiệp và cộng đồng trong lĩnh vực bất động sản." },
    ],
  },
};

const defaultDataEn: VisionMissionData = {
  vision: {
    eyebrow: "Future Orientation",
    title: "Vision",
    cardTitle: "Kepler's Vision",
    points: [
      { text: "Build a closed-loop model that brings convenience and quality to customers and partners with professional products and services." },
      { text: "Become the company with the most professional products and services in the real estate industry in Vietnam." },
    ],
    sideCardTitle: "Closed-loop · Quality · Professional",
    sideCardDesc: "Every journey of Kepler aims toward a comprehensive ecosystem, where quality and professionalism create sustainable value.",
  },
  mission: {
    eyebrow: "Mission",
    title: "Mission",
    cardTitle: "Mission",
    mainDesc: "Provide the best and most professional products and services for the market and create a value chain for consumers in the real estate sector.",
    subItems: [
      { title: "Best for the market", description: "Professional products and services, leading in quality and experience." },
      { title: "Value chain for consumers", description: "Connecting sustainable benefits between businesses and communities in the real estate sector." },
    ],
  },
};

interface VisionMissionContentConfigProps {
  canCreate?: boolean;
  canUpdate?: boolean;
}

export function VisionMissionContentConfig({ canCreate, canUpdate }: VisionMissionContentConfigProps) {
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [viData, setViData] = useState<VisionMissionData>(defaultDataVi);
  const [viConfigId, setViConfigId] = useState<string>("");

  const [enData, setEnData] = useState<VisionMissionData>(defaultDataEn);
  const [enConfigId, setEnConfigId] = useState<string>("");

  const isEn = lang === "en";
  const configKey = isEn ? CONFIG_KEY_EN : CONFIG_KEY_VI;
  const configId = isEn ? enConfigId : viConfigId;
  const formData = isEn ? enData : viData;
  const setFormData = isEn ? setEnData : setViData;
  const defaultData = isEn ? defaultDataEn : defaultDataVi;

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
          if (parsed.vision && parsed.mission) {
            setViData({ ...defaultDataVi, ...parsed });
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
          const parsed = JSON.parse(row.value);
          if (parsed.vision && parsed.mission) {
            setEnData({ ...defaultDataEn, ...parsed });
          }
        } catch { /* keep defaults */ }
      }
    } else {
      setEnConfigId("");
    }
  }, [enResp]);

  // Vision handlers
  const updateVision = (field: keyof VisionMissionData["vision"], value: string) => {
    setFormData({ ...formData, vision: { ...formData.vision, [field]: value } });
    setHasChanges(true);
  };

  const addVisionPoint = () => {
    setFormData({
      ...formData,
      vision: { ...formData.vision, points: [...formData.vision.points, { text: "" }] },
    });
    setHasChanges(true);
  };

  const updateVisionPoint = (idx: number, text: string) => {
    setFormData({
      ...formData,
      vision: {
        ...formData.vision,
        points: formData.vision.points.map((p, i) => (i === idx ? { text } : p)),
      },
    });
    setHasChanges(true);
  };

  const removeVisionPoint = (idx: number) => {
    setFormData({
      ...formData,
      vision: {
        ...formData.vision,
        points: formData.vision.points.filter((_, i) => i !== idx),
      },
    });
    setHasChanges(true);
  };

  // Mission handlers
  const updateMission = (field: keyof VisionMissionData["mission"], value: string) => {
    setFormData({ ...formData, mission: { ...formData.mission, [field]: value } });
    setHasChanges(true);
  };

  const addMissionSubItem = () => {
    setFormData({
      ...formData,
      mission: { ...formData.mission, subItems: [...formData.mission.subItems, { title: "", description: "" }] },
    });
    setHasChanges(true);
  };

  const updateMissionSubItem = (idx: number, field: keyof MissionSubItem, value: string) => {
    setFormData({
      ...formData,
      mission: {
        ...formData.mission,
        subItems: formData.mission.subItems.map((item, i) =>
          i === idx ? { ...item, [field]: value } : item
        ),
      },
    });
    setHasChanges(true);
  };

  const removeMissionSubItem = (idx: number) => {
    setFormData({
      ...formData,
      mission: {
        ...formData.mission,
        subItems: formData.mission.subItems.filter((_, i) => i !== idx),
      },
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
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
      setHasChanges(false);
      setEditing(false);
      toast.success("Đã lưu cấu hình Tầm nhìn - Sứ mệnh");
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
    setHasChanges(false);
    const resp = isEn ? enResp : viResp;
    const rows = resp?.responseData?.rows;
    if (rows && rows.length > 0) {
      const row = rows[0] as { value: string | null };
      if (row.value) {
        try {
          const parsed = JSON.parse(row.value);
          if (parsed.vision && parsed.mission) {
            setFormData({ ...defaultData, ...parsed });
            return;
          }
        } catch { /* fall through */ }
      }
    }
    setFormData(defaultData);
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
              Tầm nhìn - Sứ mệnh
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Nội dung hiển thị trên trang Tầm nhìn - Sứ mệnh và trang Giới thiệu
            </CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => { if (editing && hasChanges) { toast.error("Vui lòng lưu hoặc hủy trước khi chuyển ngôn ngữ"); return; } setLang("vi"); }}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${lang === "vi" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
            >
              VI
            </button>
            <button
              onClick={() => { if (editing && hasChanges) { toast.error("Vui lòng lưu hoặc hủy trước khi chuyển ngôn ngữ"); return; } setLang("en"); }}
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
      <CardContent className="space-y-6">
        {/* === TẦM NHÌN === */}
        <div className="space-y-4">
          <div className="pb-2 border-b">
            <h4 className="font-semibold text-gray-900">Tầm nhìn</h4>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-gray-500">Eyebrow (nhãn nhỏ)</Label>
              <Input
                value={formData.vision.eyebrow}
                onChange={(e) => updateVision("eyebrow", e.target.value)}
                disabled={!editing}
                placeholder="Định hướng tương lai"
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-gray-500">Tiêu đề section</Label>
              <Input
                value={formData.vision.title}
                onChange={(e) => updateVision("title", e.target.value)}
                disabled={!editing}
                placeholder="Tầm nhìn"
                className="h-9"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Tiêu đề card (box đen)</Label>
            <Input
              value={formData.vision.cardTitle}
              onChange={(e) => updateVision("cardTitle", e.target.value)}
              disabled={!editing}
              placeholder="Tầm nhìn của Kepler"
              className="h-9"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-500">Các điểm Tầm nhìn</Label>
              {editing && (
                <Button type="button" size="sm" variant="outline" onClick={addVisionPoint} className="h-7 gap-1">
                  <Plus className="w-3 h-3" /> Thêm
                </Button>
              )}
            </div>
            {formData.vision.points.map((point, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold mt-1">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <Textarea
                  value={point.text}
                  onChange={(e) => updateVisionPoint(idx, e.target.value)}
                  disabled={!editing}
                  placeholder="Nội dung điểm tầm nhìn..."
                  className="resize-none flex-1"
                  rows={2}
                />
                {editing && (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-red-500 hover:bg-red-50 mt-1"
                    onClick={() => removeVisionPoint(idx)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-2 pl-4 border-l-2 border-red-100">
            <Label className="text-xs text-gray-500">Card phụ (box đỏ)</Label>
            <div className="space-y-1">
              <Input
                value={formData.vision.sideCardTitle}
                onChange={(e) => updateVision("sideCardTitle", e.target.value)}
                disabled={!editing}
                placeholder="Khép kín · Chất lượng · Chuyên nghiệp"
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Textarea
                value={formData.vision.sideCardDesc}
                onChange={(e) => updateVision("sideCardDesc", e.target.value)}
                disabled={!editing}
                placeholder="Mô tả card phụ..."
                className="resize-none"
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* === SỨ MỆNH === */}
        <div className="space-y-4">
          <div className="pb-2 border-b">
            <h4 className="font-semibold text-gray-900">Sứ mệnh</h4>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-gray-500">Eyebrow (nhãn nhỏ)</Label>
              <Input
                value={formData.mission.eyebrow}
                onChange={(e) => updateMission("eyebrow", e.target.value)}
                disabled={!editing}
                placeholder="Sứ mệnh"
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-gray-500">Tiêu đề section</Label>
              <Input
                value={formData.mission.title}
                onChange={(e) => updateMission("title", e.target.value)}
                disabled={!editing}
                placeholder="Sứ mệnh"
                className="h-9"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Tiêu đề card (box trắng)</Label>
            <Input
              value={formData.mission.cardTitle}
              onChange={(e) => updateMission("cardTitle", e.target.value)}
              disabled={!editing}
              placeholder="Sứ mệnh"
              className="h-9"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Mô tả chính</Label>
            <Textarea
              value={formData.mission.mainDesc}
              onChange={(e) => updateMission("mainDesc", e.target.value)}
              disabled={!editing}
              placeholder="Cung cấp sản phẩm và dịch vụ tốt nhất..."
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-500">Các mục phụ (box đen)</Label>
              {editing && (
                <Button type="button" size="sm" variant="outline" onClick={addMissionSubItem} className="h-7 gap-1">
                  <Plus className="w-3 h-3" /> Thêm
                </Button>
              )}
            </div>
            {formData.mission.subItems.map((item, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-400">Mục {idx + 1}</span>
                  {editing && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-red-500 hover:bg-red-50"
                      onClick={() => removeMissionSubItem(idx)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
                <Input
                  value={item.title}
                  onChange={(e) => updateMissionSubItem(idx, "title", e.target.value)}
                  disabled={!editing}
                  placeholder="Tiêu đề mục phụ..."
                  className="h-9"
                />
                <Textarea
                  value={item.description}
                  onChange={(e) => updateMissionSubItem(idx, "description", e.target.value)}
                  disabled={!editing}
                  placeholder="Mô tả mục phụ..."
                  className="resize-none"
                  rows={2}
                />
              </div>
            ))}
          </div>
        </div>

        {/* === ACTIONS === */}
        {editing && (
          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button variant="ghost" onClick={handleCancel}>
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={saving || !hasChanges}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" /> Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-1" /> Lưu
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
