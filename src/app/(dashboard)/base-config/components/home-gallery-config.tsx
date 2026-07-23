"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ImagePicker, ImagePickerFile } from "@/components/shared/image-picker";
import { ImageCropModal } from "@/components/shared/image-crop-modal";
import { usePostApiV10File } from "@/api/endpoints/file";
import { useGetApiV10PageConfig, usePutApiV10PageConfigId } from "@/api/endpoints/page-config";
import type { PageConfig } from "@/api/models";
import { Edit, Save, Loader2 } from "lucide-react";
import baseConfig from "@/configs/base";
import { toast } from "@/components/ui/toaster";

interface BannerSlide {
  id: string;
  image: string;
  alt: string;
  configId?: string;
  key: string;
}

interface ContentData {
  title: string;
  description: string;
  titleId?: string;
  descriptionId?: string;
}

export function HomeGalleryConfig() {
  const [bannerSlides, setBannerSlides] = useState<BannerSlide[]>([
    { id: "1", image: "", alt: "Banner 1", key: "image_title_1" },
    { id: "2", image: "", alt: "Banner 2", key: "image_title_2" },
    { id: "3", image: "", alt: "Banner 3", key: "image_title_3" },
    { id: "4", image: "", alt: "Banner 4", key: "image_title_4" },
  ]);

  const [contentData, setContentData] = useState<ContentData>({
    title: "",
    description: "",
  });
  const [originalContentData, setOriginalContentData] = useState<ContentData>({
    title: "",
    description: "",
  });

  const [isEditingContent, setIsEditingContent] = useState(false);
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedImageForCrop, setSelectedImageForCrop] = useState<string>("");
  const [tempContentData, setTempContentData] = useState<ContentData>(contentData);
  const [hasChanges, setHasChanges] = useState(false);
  const [croppedBlobs, setCroppedBlobs] = useState<Map<number, Blob>>(new Map());
  const [isSaving, setIsSaving] = useState(false);

  const uploadFileMutation = usePostApiV10File();
  const updateConfigMutation = usePutApiV10PageConfigId();

  // Fetch page config data
  const { data: pageConfigData, isLoading } = useGetApiV10PageConfig({
    pageSize: 100,
  });

  // Load data from API
  useEffect(() => {
    if (pageConfigData?.responseData?.rows) {
      const configs = pageConfigData.responseData.rows as PageConfig[];

      // Update banner slides
      const updatedSlides = bannerSlides.map((slide) => {
        const config = configs.find((c) => c.key === slide.key);
        if (config && config.id && config.value) {
          return {
            ...slide,
            image: config.value,
            configId: config.id,
          };
        }
        return slide;
      });
      setBannerSlides(updatedSlides);

      // Update content data
      const titleConfig = configs.find((c) => c.key === "title");
      const subTitleConfig = configs.find((c) => c.key === "sub_title");

      const loadedData = {
        title: titleConfig?.value?.replace(/<br>/g, "\n") || "",
        description: subTitleConfig?.value || "",
        titleId: titleConfig?.id,
        descriptionId: subTitleConfig?.id,
      };

      setContentData(loadedData);
      setTempContentData(loadedData);
      setOriginalContentData(loadedData);
    }
  }, [pageConfigData]);

  const getImageUrl = (file: ImagePickerFile | undefined) => {
    if (!file) return "";
    
    let imagePath = "";
    if (file.compress_info) {
      imagePath = file.compress_info.desktop || file.compress_info.tablet || file.path || "";
    } else {
      imagePath = file.path || "";
    }

    return imagePath.startsWith("http")
      ? imagePath
      : `${baseConfig.imgEndpointDomain}${imagePath}`;
  };

  const handleImageSelect = (file: ImagePickerFile) => {
    const imageUrl = getImageUrl(file);
    
    if (!imageUrl) {
      toast.error({ title: "Lỗi", content: "Không thể lấy URL ảnh!" });
      return;
    }
    
    setSelectedImageForCrop(imageUrl);
    setImagePickerOpen(false);
    setCropModalOpen(true);
  };

  const handleCropComplete = (croppedImageUrl: string, croppedBlob: Blob) => {
    if (editingSlideIndex !== null) {
      const updatedSlides = [...bannerSlides];
      updatedSlides[editingSlideIndex] = {
        ...updatedSlides[editingSlideIndex],
        image: croppedImageUrl,
      };
      setBannerSlides(updatedSlides);
      
      const newBlobs = new Map(croppedBlobs);
      newBlobs.set(editingSlideIndex, croppedBlob);
      setCroppedBlobs(newBlobs);
      
      setEditingSlideIndex(null);
      setHasChanges(true);
    }
  };

  const handleEditImage = (index: number) => {
    setEditingSlideIndex(index);
    setImagePickerOpen(true);
  };

  const handleSaveContent = () => {
    setContentData(tempContentData);
    setIsEditingContent(false);
    setHasChanges(true);
  };

  const handleCancelContent = () => {
    setTempContentData(contentData);
    setIsEditingContent(false);
  };

  const handleSaveAllChanges = async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);

      if (croppedBlobs.size > 0) {
        toast.warning({ title: "Đang xử lý", content: "Đang upload ảnh vào kho..." });

        const uploadPromises = Array.from(croppedBlobs.entries()).map(
          async ([index, blob]) => {
            try {
              const result = await uploadFileMutation.mutateAsync({
                data: {
                  file: blob,
                  title: `Gallery Image ${index + 1}`,
                  is_in_library: true,
                },
              });

              if (result.responseData?.path) {
                return { index, uploadedUrl: result.responseData.path };
              }
              return null;
            } catch (err) {
              console.error(`Error uploading image ${index}:`, err);
              throw err;
            }
          }
        );

        const uploadResults = await Promise.all(uploadPromises);

        for (const result of uploadResults) {
          if (result && bannerSlides[result.index].configId) {
            const slide = bannerSlides[result.index];
            await updateConfigMutation.mutateAsync({
              id: slide.configId!,
              data: {
                key: slide.key,
                value: result.uploadedUrl,
              },
            });
          }
        }
      }

      // So sánh với originalContentData thay vì contentData
      if (originalContentData.title !== tempContentData.title && contentData.titleId) {
        await updateConfigMutation.mutateAsync({
          id: contentData.titleId,
          data: {
            key: "title",
            value: tempContentData.title.replace(/\n/g, "<br>"),
          },
        });
      }

      if (originalContentData.description !== tempContentData.description && contentData.descriptionId) {
        await updateConfigMutation.mutateAsync({
          id: contentData.descriptionId,
          data: {
            key: "sub_title",
            value: tempContentData.description,
          },
        });
      }

      toast.success({ title: "Thành công", content: "Đã lưu cấu hình thành công!" });
      setHasChanges(false);
      setCroppedBlobs(new Map());
      setContentData(tempContentData);
      setOriginalContentData(tempContentData); // Cập nhật giá trị gốc sau khi lưu thành công
    } catch (error) {
      console.error("Error saving:", error);
      const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi lưu!";
      toast.error({ title: "Lỗi", content: errorMessage });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {hasChanges && (
          <div className="flex justify-end">
            <Button
              onClick={handleSaveAllChanges}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </div>
        )}

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Gallery trang chủ</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (isEditingContent) {
                    handleCancelContent();
                  } else {
                    setIsEditingContent(true);
                  }
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditingContent ? "Hủy" : "Chỉnh sửa"}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="space-y-4">
                {bannerSlides[0] && (
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden group">
                    <div className="relative h-[150px]">
                      {bannerSlides[0].image ? (
                        <Image
                          src={bannerSlides[0].image}
                          alt={bannerSlides[0].alt}
                          fill
                          className="object-cover"
                          priority
                          unoptimized
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-gray-400">Chưa có ảnh</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          size="sm"
                          onClick={() => handleEditImage(0)}
                          disabled={!isEditingContent}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Thay ảnh
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                {bannerSlides[1] && (
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden group">
                    <div className="relative h-[350px]">
                      {bannerSlides[1].image ? (
                        <Image
                          src={bannerSlides[1].image}
                          alt={bannerSlides[1].alt}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-gray-400">Chưa có ảnh</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          size="sm"
                          onClick={() => handleEditImage(1)}
                          disabled={!isEditingContent}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Thay ảnh
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-[35%_65%] gap-4">
                {bannerSlides[2] && (
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden group">
                    <div className="relative h-[350px]">
                      {bannerSlides[2].image ? (
                        <Image
                          src={bannerSlides[2].image}
                          alt={bannerSlides[2].alt}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-gray-400">Chưa có ảnh</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          size="sm"
                          onClick={() => handleEditImage(2)}
                          disabled={!isEditingContent}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Thay ảnh
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col justify-start space-y-4 text-gray-900 p-6 bg-gray-50 rounded-lg">
                  {isEditingContent ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Tiêu đề
                        </label>
                        <Textarea
                          value={tempContentData.title}
                          onChange={(e) =>
                            setTempContentData({
                              ...tempContentData,
                              title: e.target.value,
                            })
                          }
                          rows={4}
                          className="font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Mô tả
                        </label>
                        <Textarea
                          value={tempContentData.description}
                          onChange={(e) =>
                            setTempContentData({
                              ...tempContentData,
                              description: e.target.value,
                            })
                          }
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSaveContent} size="sm">
                          <Save className="h-4 w-4 mr-2" />
                          Lưu
                        </Button>
                        <Button
                          onClick={handleCancelContent}
                          size="sm"
                          variant="outline"
                        >
                          Hủy
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-4xl lg:text-5xl font-semibold leading-relaxed tracking-wider whitespace-pre-line" style={{ lineHeight: "1.2" }}>
                        {contentData.title}
                      </h2>
                      <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                        {contentData.description}
                      </p>
                    </>
                  )}
                </div>

                {bannerSlides[3] && (
                  <div className="lg:col-span-2 relative bg-gray-100 rounded-lg overflow-hidden group">
                    <div className="relative h-[150px]">
                      {bannerSlides[3].image ? (
                        <Image
                          src={bannerSlides[3].image}
                          alt={bannerSlides[3].alt}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-gray-400">Chưa có ảnh</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          size="sm"
                          onClick={() => handleEditImage(3)}
                          disabled={!isEditingContent}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Thay ảnh
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ImagePicker
        isOpen={imagePickerOpen}
        onClose={() => {
          setImagePickerOpen(false);
          setEditingSlideIndex(null);
        }}
        onSelect={handleImageSelect}
        type="image"
      />

      <ImageCropModal
        isOpen={cropModalOpen}
        imageUrl={selectedImageForCrop}
        aspectRatio={
          editingSlideIndex === 0 || editingSlideIndex === 3
            ? 16 / 9
            : editingSlideIndex === 1
            ? 3 / 7
            : 7 / 10
        }
        onClose={() => {
          setCropModalOpen(false);
          setSelectedImageForCrop("");
        }}
        onCropComplete={handleCropComplete}
      />
    </>
  );
}
