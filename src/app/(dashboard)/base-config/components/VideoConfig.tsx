"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePicker, type ImagePickerFile } from "@/components/shared/image-picker";
import {
  useGetApiV10PageConfig,
  usePutApiV10PageConfigId,
} from "@/api/endpoints/page-config";
import { Video, Trash2, Edit2, Plus, Loader2, Lock } from "lucide-react";
import { toast } from "@/components/ui/toaster";
import { useAbility } from "@/hooks/use-ability";
import { extractVideoThumbnail } from "@/utils/video-thumbnail";

interface VideoItem {
  id?: string;
  title: string;
  url: string;
  thumbnail?: string;
  description?: string;
}

interface VideoConfigData {
  id: string;
  key: string;
  value: string;
  description?: string;
}

const EMPTY_VIDEO: VideoItem = { title: "", url: "", thumbnail: "", description: "" };
const MAX_VIDEOS = 4;

function parseVideos(value: string): VideoItem[] {
  if (!value) return Array(MAX_VIDEOS).fill(null).map(() => ({ ...EMPTY_VIDEO }));
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      const result: VideoItem[] = [];
      for (let i = 0; i < MAX_VIDEOS; i++) {
        result.push(parsed[i] ? { ...EMPTY_VIDEO, ...parsed[i] } : { ...EMPTY_VIDEO });
      }
      return result;
    }
  } catch {
    // ignore parse error
  }
  return Array(MAX_VIDEOS).fill(null).map(() => ({ ...EMPTY_VIDEO }));
}

export function VideoConfig() {
  const ability = useAbility();
  const canUpdate = ability.can("update_banner", "settings");

  const [videos, setVideos] = useState<VideoItem[]>([]);
  // Local thumbnail overrides — generated on-the-fly from video frames
  const [localThumbs, setLocalThumbs] = useState<Record<number, string>>({});
  const [thumbLoading, setThumbLoading] = useState<Record<number, boolean>>({});
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerIndex, setPickerIndex] = useState<number>(0);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [configId, setConfigId] = useState<string | null>(null);
  const [configKey, setConfigKey] = useState<string>("");

  const { data, isLoading, refetch } = useGetApiV10PageConfig({
    filters: `key==list_video`,
    pageSize: 1,
  });

  const updateMutation = usePutApiV10PageConfigId();

  // Generate thumbnails for videos loaded from config (page mount)
  useEffect(() => {
    if (videos.length === 0) return;

    videos.forEach(async (video, index) => {
      if (!video.url) return;
      if (localThumbs[index] || thumbLoading[index]) return;

      setThumbLoading((prev) => ({ ...prev, [index]: true }));
      try {
        const thumb = await extractVideoThumbnail(video.url, 0.8, 0.8);
        if (thumb) {
          setLocalThumbs((prev) => ({ ...prev, [index]: thumb }));
        }
      } catch {
        // ignore
      } finally {
        setThumbLoading((prev) => ({ ...prev, [index]: false }));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videos.length]); // run once after initial load

  // Load config data
  useEffect(() => {
    if (data?.responseData?.rows && data.responseData.rows.length > 0) {
      const row = data.responseData.rows[0] as unknown as VideoConfigData;
      setConfigId(row.id);
      setConfigKey(row.key);
      setVideos(parseVideos(row.value));
    }
  }, [data]);

  const handleVideoChange = useCallback(
    (index: number, field: keyof VideoItem, val: string) => {
      setVideos((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: val };
        return updated;
      });
      setHasChanges(true);
    },
    []
  );

  const handleOpenPicker = (index: number) => {
    console.log("[VideoConfig] Open picker at index:", index, "canUpdate:", canUpdate);
    setPickerIndex(index);
    setPickerOpen(true);
  };

  const handleVideoSelect = async (file: ImagePickerFile) => {
    const newUrl = file.path;
    const newTitle = file.title || file.name || "";

    // Set URL & title immediately
    setVideos((prev) => {
      const updated = [...prev];
      updated[pickerIndex] = {
        ...updated[pickerIndex],
        url: newUrl,
        thumbnail: undefined, // will be generated
        title: newTitle,
      };
      return updated;
    });
    setHasChanges(true);
    setPickerOpen(false);

    // Generate thumbnail from video frames (0.8s)
    setThumbLoading((prev) => ({ ...prev, [pickerIndex]: true }));
    try {
      const thumb = await extractVideoThumbnail(newUrl, 0.8, 0.8);
      if (thumb) {
        setLocalThumbs((prev) => ({ ...prev, [pickerIndex]: thumb }));
      }
    } catch {
      // ignore — thumbnail remains empty
    } finally {
      setThumbLoading((prev) => ({ ...prev, [pickerIndex]: false }));
    }
  };

  const handleRemoveVideo = (index: number) => {
    setVideos((prev) => {
      const updated = [...prev];
      updated[index] = { ...EMPTY_VIDEO };
      return updated;
    });
    setLocalThumbs((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!configId) {
      toast.error({ title: "Lỗi", content: "Không tìm thấy cấu hình video." });
      return;
    }

    setIsSaving(true);
    try {
      const value = JSON.stringify(videos);
      await updateMutation.mutateAsync({
        id: configId,
        data: {
          key: configKey,
          value,
          description: "Quản lý video",
          is_active: true,
        },
      });
      toast.success({ title: "Thành công", content: "Đã lưu cấu hình video!" });
      setHasChanges(false);
      refetch();
    } catch (error) {
      console.error("Save video config error:", error);
      toast.error({ title: "Lỗi", content: "Không thể lưu cấu hình video." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg font-bold">Quản lý Video</CardTitle>
              {hasChanges && (
                <span className="text-xs text-amber-500 font-medium animate-pulse">
                  (Có thay đổi chưa lưu)
                </span>
              )}
            </div>
            <Button
              onClick={handleSave}
              disabled={isSaving || !canUpdate}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý tối đa {MAX_VIDEOS} video hiển thị trên trang chủ.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((video, index) => (
              <div
                key={index}
                className="border rounded-xl overflow-hidden bg-gray-50 hover:shadow-md transition-shadow"
              >
                {/* Video thumbnail / placeholder */}
                <div className="relative h-44 bg-gray-200 flex items-center justify-center">
                  {video.url ? (
                    <>
                      {/* Show generated thumbnail, fallback to existing thumbnail or URL */}
                      {thumbLoading[index] ? (
                        <div className="flex flex-col items-center justify-center gap-2 text-blue-500">
                          <Loader2 className="h-8 w-8 animate-spin" />
                          <span className="text-xs">Đang tạo thumbnail...</span>
                        </div>
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={`${localThumbs[index] || video.thumbnail || video.url}`}
                          alt={video.title || `Video ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleOpenPicker(index)}
                            disabled={!canUpdate}
                          >
                            <Edit2 className="h-4 w-4 mr-1" />
                            Đổi
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRemoveVideo(index)}
                            disabled={!canUpdate}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Xóa
                          </Button>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p className="text-white text-xs font-medium truncate">
                          {video.title || `Video ${index + 1}`}
                        </p>
                      </div>
                    </>
                  ) : (
                    <button
                      className="flex flex-col items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors"
                      onClick={() => handleOpenPicker(index)}
                      type="button"
                    >
                      <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow">
                        {canUpdate ? (
                          <Plus className="h-6 w-6" />
                        ) : (
                          <Lock className="h-6 w-6" />
                        )}
                      </div>
                      <span className="text-sm font-medium">
                        {canUpdate ? `Thêm Video ${index + 1}` : `Video ${index + 1}`}
                      </span>
                    </button>
                  )}
                </div>

                {/* Video info form */}
                <div className="p-3 space-y-2">
                  <div>
                    <Label className="text-xs text-gray-500">Tiêu đề</Label>
                    <Input
                      placeholder={`Video ${index + 1}`}
                      value={video.title}
                      onChange={(e) =>
                        handleVideoChange(index, "title", e.target.value)
                      }
                      disabled={!canUpdate}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">URL / Path</Label>
                    <Input
                      placeholder="/uploads/video.mp4"
                      value={video.url}
                      onChange={(e) =>
                        handleVideoChange(index, "url", e.target.value)
                      }
                      disabled={!canUpdate}
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Mô tả</Label>
                    <Input
                      placeholder="Mô tả ngắn..."
                      value={video.description || ""}
                      onChange={(e) =>
                        handleVideoChange(index, "description", e.target.value)
                      }
                      disabled={!canUpdate}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ImagePicker — type="video" */}
      <ImagePicker
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleVideoSelect}
        type="video"
      />
    </>
  );
}
