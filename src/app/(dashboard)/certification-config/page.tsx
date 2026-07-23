"use client";

import { useState, useEffect, useCallback, useRef, forwardRef } from "react";
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
// import { Textarea } from "@/components/ui/textarea";
import {
  Award,
  Plus,
  Trash2,
  Save,
  Loader2,
  ChevronUp,
  ChevronDown,
  Image as ImageIcon,
  Eye,
  EyeOff,
  GripVertical,
  ChevronRight,
} from "lucide-react";
import {
  useGetApiV10PageConfig,
  usePutApiV10PageConfigId,
} from "@/api/endpoints/page-config";
import { ImagePicker, type ImagePickerFile } from "@/components/shared/image-picker";
import baseConfig from "@/configs/base";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/shared/rich-text-editor";

// ─── Types ────────────────────────────────────────────────────────────────────
const PAGE_CONFIG_KEY = "certification-config";

interface CertificationDataItem {
  id: string;
  img: string;
  "describe-img": string;
  content: string;
}

interface CertificationConfig {
  title: string;
  describe: string;
  data: CertificationDataItem[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substring(2);

const defaultItem = (): CertificationDataItem => ({
  id: generateId(),
  img: "",
  "describe-img": "",
  content: "",
});

// ─── Single Item Card Component ────────────────────────────────────────────────
const CertificationItemCard = forwardRef<
  HTMLDivElement,
  {
    item: CertificationDataItem;
    index: number;
    onUpdate: (field: keyof CertificationDataItem, value: string) => void;
    onRemove: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onOpenPicker: () => void;
    canMoveUp: boolean;
    canMoveDown: boolean;
  }
>(function CertificationItemCard(
  { item, index, onUpdate, onRemove, onMoveUp, onMoveDown, onOpenPicker, canMoveUp, canMoveDown },
  ref
) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getImageUrl = (path: string) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${baseConfig.imgEndpointDomain}${path}`;
  };

  return (
    <div ref={ref} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Card Header */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 border-b border-gray-100">
        <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-semibold">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">
            {item["describe-img"] || `Chứng nhận #${index + 1}`}
          </p>
          {item.img && (
            <p className="text-xs text-gray-500 truncate flex items-center gap-1">
              <ImageIcon className="w-3 h-3" />
              Đã chọn hình ảnh
            </p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="sm"
            variant={isExpanded ? "default" : "outline"}
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 px-2"
          >
            {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="h-8 w-8"
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="h-8 w-8"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={onRemove}
            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Collapsed Preview */}
      {!isExpanded && (
        <div className="p-4 flex gap-4">
          <div
            className="w-24 h-18 rounded-lg border border-gray-200 overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer hover:border-blue-400 transition-colors"
            onClick={onOpenPicker}
          >
            {item.img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getImageUrl(item.img)}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <p className="text-sm font-medium text-gray-700 line-clamp-2">
              {item["describe-img"] || "Chưa có mô tả"}
            </p>
            <p className="text-xs text-gray-500 line-clamp-2">
              {item.content ? "Có nội dung chi tiết" : "Chưa có nội dung"}
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(true)}
            className="h-8 text-blue-600"
          >
            Sửa <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Expanded Form */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Image Section */}
          <div className="flex gap-4">
            <div
              className="w-32 h-24 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden bg-gray-50 flex-shrink-0 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center gap-1"
              onClick={onOpenPicker}
            >
              {item.img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={getImageUrl(item.img)}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                  <span className="text-xs text-gray-500">Chọn ảnh</span>
                </>
              )}
            </div>
            {item.img && (
              <div className="flex-1 space-y-2">
                <Label className="text-xs text-gray-500">Mô tả ảnh</Label>
                <Input
                  placeholder="VD: Chứng nhận ISO 9001"
                  value={item["describe-img"]}
                  onChange={(e) => onUpdate("describe-img", e.target.value)}
                />
                <p className="text-xs text-gray-400">
                  Hiển thị bên dưới hình ảnh chứng nhận
                </p>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-500">Nội dung chi tiết</Label>
              <span className="text-xs text-gray-400">
                Hỗ trợ định dạng rich text
              </span>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <RichTextEditor
                value={item.content}
                onChange={(value) => onUpdate("content", value)}
                placeholder="Nhập nội dung chi tiết về chứng nhận..."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

// ─── Main Page Component ─────────────────────────────────────────────────────
export default function CertificationConfigPage() {
  const [configId, setConfigId] = useState("");
  const [configKey] = useState(PAGE_CONFIG_KEY);
  const [title, setTitle] = useState("");
  const [describe, setDescribe] = useState("");
  const [data, setData] = useState<CertificationDataItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerItemId, setPickerItemId] = useState<string | null>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const { data: fetchedData, isLoading, refetch } = useGetApiV10PageConfig({
    filters: `key==${PAGE_CONFIG_KEY}`,
    pageSize: 1,
  });
  const updateMutation = usePutApiV10PageConfigId();

  // Load from API
  useEffect(() => {
    if (fetchedData?.responseData?.rows && fetchedData.responseData.rows.length > 0) {
      const row = fetchedData.responseData.rows[0] as unknown as Record<string, unknown>;
      setConfigId(String(row.id || ""));
      try {
        const parsed = JSON.parse(String(row.value || "{}")) as CertificationConfig;
        setTitle(parsed.title ?? "");
        setDescribe(parsed.describe ?? "");
        setData(parsed.data ?? []);
      } catch {
        setTitle("");
        setDescribe("");
        setData([]);
      }
    }
  }, [fetchedData]);

  const markChanged = useCallback(() => setHasChanges(true), []);

  // ─── Data item operations ──────────────────────────────────────────────────
  const addItem = () => {
    const newItem = defaultItem();
    setData((prev) => [...prev, newItem]);
    markChanged();
    setTimeout(() => {
      const el = itemRefs.current[newItem.id];
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  };

  const removeItem = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    markChanged();
  };

  const updateItem = (id: string, field: keyof CertificationDataItem, value: string) => {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
    markChanged();
  };

  const moveItem = (idx: number, dir: -1 | 1) => {
    setData((prev) => {
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
    markChanged();
  };

  // ─── Image picker ───────────────────────────────────────────────────────────
  const openPicker = (itemId: string) => {
    setPickerItemId(itemId);
    setPickerOpen(true);
  };

  const handleImageSelect = (file: ImagePickerFile) => {
    // Ưu tiên: path gốc vì compress_info có thể không tồn tại
    const bestPath = file.path;

    if (pickerItemId) {
      updateItem(pickerItemId, "img", bestPath);
    }
    setPickerOpen(false);
    setPickerItemId(null);
  };

  // ─── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!configId) {
      toast.error("Không tìm thấy cấu hình certification-config");
      return;
    }
    setIsSaving(true);
    try {
      const payload: CertificationConfig = { title, describe, data };
      await updateMutation.mutateAsync({
        id: configId,
        data: {
          key: configKey,
          value: JSON.stringify(payload),
          is_active: true,
        },
      });
      setHasChanges(false);
      toast.success("Đã lưu cấu hình chứng nhận");
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi lưu cấu hình");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* ── Header Card ── */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-blue-600" />
                  <CardTitle className="text-xl font-bold">Cấu hình chứng nhận</CardTitle>
                </div>
                <CardDescription>
                  Quản lý tiêu đề, mô tả và danh sách chứng nhận hiển thị trên năng lực
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving || !hasChanges}
                  className="gap-1 bg-green-600 hover:bg-green-700"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Header fields */}
            {/* <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tiêu đề section</Label>
                <Input
                  placeholder="VD: Chứng nhận & Giải thưởng"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    markChanged();
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Mô tả ngắn</Label>
                <Textarea
                  placeholder="Mô tả ngắn về phần chứng nhận..."
                  value={describe}
                  onChange={(e) => {
                    setDescribe(e.target.value);
                    markChanged();
                  }}
                  className="resize-none"
                  rows={2}
                />
              </div>
            </div> */}
          </CardContent>
        </Card>

        {/* ── Items Card ── */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <span>Danh sách chứng nhận</span>
                  <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                    {data.length}
                  </span>
                </h3>
                <p className="text-sm text-gray-500">
                  Nhấn vào card để mở rộng và chỉnh sửa chi tiết
                </p>
              </div>
              <Button
                size="sm"
                onClick={addItem}
                className="gap-1 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Thêm chứng nhận
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {data.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center py-16 text-gray-400">
                <Award className="w-12 h-12 mb-3 opacity-50" />
                <p className="text-base font-medium mb-1">Chưa có chứng nhận nào</p>
                <p className="text-sm">Nhấn &quot;Thêm chứng nhận&quot; để bắt đầu</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.map((item, idx) => (
                  <CertificationItemCard
                    key={item.id}
                    ref={(el) => { itemRefs.current[item.id] = el; }}
                    item={item}
                    index={idx}
                    onUpdate={(field, value) => updateItem(item.id, field, value)}
                    onRemove={() => removeItem(item.id)}
                    onMoveUp={() => moveItem(idx, -1)}
                    onMoveDown={() => moveItem(idx, 1)}
                    onOpenPicker={() => openPicker(item.id)}
                    canMoveUp={idx > 0}
                    canMoveDown={idx < data.length - 1}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>


      {/* Image picker */}
      <ImagePicker
        isOpen={pickerOpen}
        onClose={() => {
          setPickerOpen(false);
          setPickerItemId(null);
        }}
        onSelect={handleImageSelect}
        type="image"
      />
    </>
  );
}
