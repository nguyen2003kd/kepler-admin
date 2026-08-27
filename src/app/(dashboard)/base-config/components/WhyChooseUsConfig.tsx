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
  Award,
  AlertCircle,
} from "lucide-react";
import {
  useGetApiV10PageConfig,
  usePutApiV10PageConfigId,
  usePostApiV10PageConfig,
} from "@/api/endpoints/page-config";
import { PageConfigMutate } from "@/api/models/pageConfigMutate";
import { toast } from "sonner";

const WHY_CHOOSE_US_KEY_VI = "WHY_CHOOSE_US";
const WHY_CHOOSE_US_KEY_EN = "WHY_CHOOSE_US_EN";

interface WhyChooseUsData {
  eyebrow: string;
  title: string;
  image: string;
  advantages: string[];
}

const defaultVi: WhyChooseUsData = {
  eyebrow: "Lợi thế cạnh tranh",
  title: "Tại sao chọn Kepler",
  image: "/logo.png",
  advantages: [
    "Đội ngũ chuyên gia đa ngành",
    "Kinh nghiệm thực tiễn trong nhiều lĩnh vực bất động sản",
    "Giải pháp xuyên suốt từ tư vấn đến triển khai",
    "Phương pháp làm việc dựa trên dữ liệu",
    "Mạng lưới đối tác rộng",
    "Cam kết minh bạch và bảo mật",
    "Đồng hành dài hạn cùng khách hàng",
  ],
};

const defaultEn: WhyChooseUsData = {
  eyebrow: "Competitive Advantage",
  title: "Why Choose Kepler",
  image: "/logo.png",
  advantages: [
    "Multi-disciplinary expert team",
    "Practical experience across real estate sectors",
    "End-to-end solutions from advisory to execution",
    "Data-driven approach",
    "Extensive partner network",
    "Commitment to transparency and confidentiality",
    "Long-term partnership with clients",
  ],
};

interface WhyChooseUsConfigProps {
  canCreate?: boolean;
  canUpdate?: boolean;
}

export function WhyChooseUsConfig({ canCreate, canUpdate }: WhyChooseUsConfigProps) {
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const [viData, setViData] = useState<WhyChooseUsData>(defaultVi);
  const [viEdit, setViEdit] = useState<WhyChooseUsData>(defaultVi);
  const [viConfigId, setViConfigId] = useState<string>("");

  const [enData, setEnData] = useState<WhyChooseUsData>(defaultEn);
  const [enEdit, setEnEdit] = useState<WhyChooseUsData>(defaultEn);
  const [enConfigId, setEnConfigId] = useState<string>("");

  const { data: viResp, isLoading: viLoading, refetch: refetchVi } = useGetApiV10PageConfig({
    filters: `key==${WHY_CHOOSE_US_KEY_VI}`,
  });
  const { data: enResp, isLoading: enLoading, refetch: refetchEn } = useGetApiV10PageConfig({
    filters: `key==${WHY_CHOOSE_US_KEY_EN}`,
  });

  const putMutation = usePutApiV10PageConfigId();
  const postMutation = usePostApiV10PageConfig();

  const isLoading = viLoading || enLoading;
  const canEdit = canCreate || canUpdate;

  const configKey = lang === "vi" ? WHY_CHOOSE_US_KEY_VI : WHY_CHOOSE_US_KEY_EN;
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
          setViData({ ...defaultVi, ...parsed });
          setViEdit({ ...defaultVi, ...parsed });
        } catch {
          setViData(defaultVi);
          setViEdit(defaultVi);
        }
      }
    } else {
      setViConfigId("");
      setViData(defaultVi);
      setViEdit(defaultVi);
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
          setEnData({ ...defaultEn, ...parsed });
          setEnEdit({ ...defaultEn, ...parsed });
        } catch {
          setEnData(defaultEn);
          setEnEdit(defaultEn);
        }
      }
    } else {
      setEnConfigId("");
      setEnData(defaultEn);
      setEnEdit(defaultEn);
    }
  }, [enResp]);

  const validate = (): string | null => {
    if (!formData.eyebrow.trim()) return "Tiêu đề nhỏ không được để trống";
    if (!formData.title.trim()) return "Tiêu đề không được để trống";
    for (let i = 0; i < formData.advantages.length; i++) {
      if (!formData.advantages[i].trim()) return `Lợi thế ${i + 1}: không được để trống`;
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
      toast.success("Đã lưu cấu hình");
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

  const addAdvantage = () => {
    setFormData({
      ...formData,
      advantages: [...formData.advantages, ""],
    });
  };

  const removeAdvantage = (index: number) => {
    setFormData({
      ...formData,
      advantages: formData.advantages.filter((_, i) => i !== index),
    });
    setConfirmDelete(null);
  };

  const updateAdvantage = (index: number, val: string) => {
    const updated = [...formData.advantages];
    updated[index] = val;
    setFormData({ ...formData, advantages: updated });
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
            <Award className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">
              Tại sao chọn Kepler
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Cấu hình section lợi thế cạnh tranh trên trang chủ
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
                Tiêu đề nhỏ (eyebrow) hiển thị phía trên tiêu đề chính. Ảnh nên là URL tương đối hoặc tuyệt đối.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Tiêu đề nhỏ (eyebrow) *</Label>
                <Input
                  value={formData.eyebrow}
                  onChange={(e) => setFormData({ ...formData, eyebrow: e.target.value })}
                  placeholder="VD: Lợi thế cạnh tranh"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Tiêu đề chính *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="VD: Tại sao chọn Kepler"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">URL hình ảnh</Label>
              <Input
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="/logo.png hoặc https://..."
                className="mt-1"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Danh sách lợi thế</Label>
              {formData.advantages.map((adv, index) => (
                <div key={index} className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 text-xs font-bold shrink-0">
                    {index + 1}
                  </div>
                  <Input
                    value={adv}
                    onChange={(e) => updateAdvantage(index, e.target.value)}
                    placeholder={`Lợi thế ${index + 1}`}
                    className="flex-1"
                  />
                  {confirmDelete === index ? (
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="destructive" onClick={() => removeAdvantage(index)}>
                        Xóa
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(null)}>
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
              onClick={addAdvantage}
              className="w-full border-dashed"
            >
              <Plus className="h-4 w-4 mr-1" />
              Thêm lợi thế
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
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Tiêu đề nhỏ:</span>
              <span className="font-medium">{formData.eyebrow}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Tiêu đề:</span>
              <span className="font-semibold text-base">{formData.title}</span>
            </div>
            <ul className="space-y-2">
              {formData.advantages.map((adv, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 text-xs font-bold shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{adv}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
