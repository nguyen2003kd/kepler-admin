"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Header } from "@/components/layout/header";
import { useGetApiV10PostId, usePutApiV10PostId } from "@/api/endpoints/post";
import { useGetApiV10Category } from "@/api/endpoints/category";
import { useGetApiV10FileId } from "@/api/endpoints/file";
import { PostMutateStatus, type PostMutate } from "@/api/models";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import { toast } from "@/components/ui/toaster";
import { extractErrorMessage } from "@/utils/error";
import { useAbility } from "@/hooks/use-ability";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import {
  ImagePicker,
  type ImagePickerFile,
} from "@/components/shared/image-picker";
import {
  PostContentEditor,
  type PostContentSection,
} from "@/components/features/news/PostContentEditor";
// import { HierarchicalCategorySelector } from "@/components/shared/hierarchical-category-selector";
import { RichTextEditor } from "@/components/shared/rich-text-editor";
import baseConfig from "@configs/base";
export default function EditNewsPage() {
  const ability = useAbility();
  const params = useParams();
  const router = useRouter();
  const newsId = decodeURIComponent(params.id as string);
  const queryClient = useQueryClient();
  const canApproveL2 = ability.can("approve_post", "post-approval-2");
  const canApproveL1 = ability.can("approve_post", "post-approval-1");

  const { data: response, isLoading, error } = useGetApiV10PostId(newsId);
  const news = response?.responseData;
  const updatePostMutation = usePutApiV10PostId();
  const { data: categoriesData } = useGetApiV10Category({
    query: {
      enabled: !!news,
    },
  });
  const { data: thumbnailData } = useGetApiV10FileId(
    (news?.thumbnail_file_id || "").toString(),
    { query: { enabled: !!news?.thumbnail_file_id } }
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const categories = categoriesData?.responseData || [];

  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [summary, setSummary] = useState("");
  const [postSections, setPostSections] = useState<PostContentSection[]>([]);
  const [position, setPosition] = useState(1);
  const [isHidden, setIsHidden] = useState(false);
  const [isService, setIsService] = useState(false);
  const [expiredAt, setExpiredAt] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [selectedThumbnail, setSelectedThumbnail] =
    useState<ImagePickerFile | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showImagePicker, setShowImagePicker] = useState(false);

  const handleImageSelect = (file: ImagePickerFile) => {
    setSelectedThumbnail(file);
    setShowImagePicker(false);
  };

  useEffect(() => {
    if (news) {
      setTitle(news.title || "");
      setCode(news.code || "");
      setSummary(news.summary || "");
      setPosition(news.position || 1);
      setIsHidden(news.is_hidden || false);
      setIsService(news.is_service || false);
      setSelectedCategories((news.category_ids as string[]) || []);

      if (news.expired_at) {
        const date = new Date(news.expired_at);
        const localDate = new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        );
        setExpiredAt(localDate.toISOString().slice(0, 16));
      }
      if (news.published_at) {
        const date = new Date(news.published_at as string);
        const localDate = new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        );
        setPublishedAt(localDate.toISOString().slice(0, 16));
      }
      if (
        news.post_content &&
        Array.isArray(news.post_content) &&
        news.post_content.length > 0
      ) {
        const sections: PostContentSection[] = (
          news.post_content as Array<{
            position?: number;
            content?: string;
            image_columns?: number;
            image_rows?: number;
            post_content_images?: Array<{ position: number; file_id: string }>;
          }>
        ).map((content, index: number) => {
          const hasImages =
            content.post_content_images &&
            content.post_content_images.length > 0;

          return {
            id: `section-${content.position || index}`,
            type: hasImages ? "image" : "text",
            position: content.position || index + 1,
            content: content.content || "",
            caption: hasImages ? content.content : undefined,
            image_columns: content.image_columns || 2,
            image_rows: content.image_rows || 2,
            post_content_images: hasImages ? content.post_content_images : [],
          };
        });
        setPostSections(sections);
      }
    }
  }, [news]);

  useEffect(() => {
    if (thumbnailData?.responseData) {
      const fileData = thumbnailData.responseData as {
        id: string;
        path: string;
        name: string;
        full_path?: string;
        mime?: string;
        size?: number;
        title?: string;
        description?: string;
        compress_info?: {
          mobile?: string;
          tablet?: string;
          desktop?: string;
          preload?: string;
        };
      };
      setSelectedThumbnail({
        id: fileData.id,
        path: fileData.path || fileData.full_path || "",
        name: fileData.name,
        mime: fileData.mime || "image/*",
        size: String(fileData.size || 0),
        compress_info: fileData.compress_info
          ? {
              mobile: fileData.compress_info.mobile || "",
              tablet: fileData.compress_info.tablet || "",
              desktop: fileData.compress_info.desktop || "",
              preload: fileData.compress_info.preload || "",
            }
          : undefined,
        title: fileData.title,
        description: fileData.description,
      });
    }
  }, [thumbnailData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.warning({
        title: "Thiếu trường",
        content: "Vui lòng nhập tiêu đề",
      });
      return;
    }

    // if (selectedCategories.length === 0) {
    //   toast.warning({ title: 'Thiếu trường', content: 'Vui lòng chọn ít nhất một danh mục' })
    //   return;
    // }

    try {
      const postData: PostMutate = {
        title: title.trim(),
        code: code.trim() || news?.code || "",
        slug:
          news?.slug ||
          title
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, ""),
        summary: summary.trim() || undefined,
        position,
        is_hidden: isHidden,
        is_service: isService,
        status: canApproveL2
          ? PostMutateStatus.PUBLISHED
          : canApproveL1
            ? PostMutateStatus.PENDING_L2
            : undefined,
        expired_at: expiredAt ? new Date(expiredAt).toISOString() : undefined,
        published_at: publishedAt
          ? new Date(publishedAt).toISOString()
          : undefined,
        category_ids: selectedCategories,
        thumbnail_file_id: selectedThumbnail?.id || undefined,
        post_content: postSections.map((section) => {
          const baseContent = {
            content:
              section.type === "image"
                ? section.caption || ""
                : section.content || "",
            position: section.position,
          };

          if (
            section.type === "image" &&
            section.post_content_images &&
            section.post_content_images.length > 0
          ) {
            return {
              ...baseContent,
              image_columns: section.image_columns,
              image_rows: section.image_rows,
              post_content_images: section.post_content_images.map((img) => ({
                position: img.position,
                file_id: img.file_id,
              })),
            };
          }

          return baseContent;
        }),
      };

      const result = await updatePostMutation.mutateAsync({
        id: newsId,
        data: postData,
      });

      if (result.status === "success") {
        await queryClient.invalidateQueries({ queryKey: ["posts"] });
        toast.success({
          title: "Thành công",
          content: "Cập nhật bài viết thành công!",
        });
        router.push(`/news/${encodeURIComponent(newsId)}`);
      } else {
        throw new Error(result.message || "Có lỗi xảy ra");
      }
    } catch (error: unknown) {
      console.error("Error updating post:", error);
      const msg = extractErrorMessage(error);
      toast.error({ title: "Cập nhật thất bại", content: msg });
    }
  };

  if (isLoading) {
    return (
      <div>
        <Header title="Chỉnh sửa tin tức" />
        <main className="container mx-auto p-4 md:p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <p className="text-center text-gray-600">
              Đang tải dữ liệu bài viết...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div>
        <Header title="Không tìm thấy" />
        <main className="container mx-auto p-4 md:p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">
              Không tìm thấy tin tức
            </h2>
            <p className="text-gray-600 mb-4">
              {error
                ? "Có lỗi xảy ra khi tải dữ liệu."
                : "Tin tức bạn muốn chỉnh sửa không tồn tại."}
            </p>
            <Link href="/news">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header title={`Chỉnh sửa: ${news.title}`} />
      <main className="container mx-auto p-4 md:p-6">
        <div className="max-w-full mx-auto">
          <div className="mb-6">
            <Link href={`/news/${encodeURIComponent(newsId)}`}>
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Chỉnh sửa bài viết</CardTitle>
              <div className="text-sm text-gray-500">
                Mã bài viết: {news.code}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Tiêu đề *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nhập tiêu đề bài viết"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Mã bài viết</Label>
                  <Input
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="POST-001"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Hình ảnh đại diện</Label>
                  <div className="space-y-3">
                    {selectedThumbnail || news.thumbnail_path ? (
                      <div className="relative inline-block">
                        <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200 relative">
                          <Image
                            src={`${baseConfig.imgEndpointDomain}${
                              selectedThumbnail?.path ||
                              selectedThumbnail?.compress_info?.desktop ||
                              news.thumbnail_path ||
                              ""
                            }`}
                            alt={
                              selectedThumbnail?.title ||
                              selectedThumbnail?.name ||
                              news.title ||
                              "Thumbnail"
                            }
                            fill
                            className="object-cover"
                            sizes="128px"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedThumbnail(null)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">
                          Chưa chọn ảnh
                        </span>
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowImagePicker(true)}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {selectedThumbnail
                        ? "Đổi ảnh đại diện"
                        : "Chọn ảnh đại diện"}
                    </Button>
                  </div>
                </div>



                <div className="space-y-2">
                  <Label htmlFor="summary">Tóm tắt</Label>
                  <RichTextEditor
                    value={summary}
                    onChange={(value) => setSummary(value)}
                    placeholder="Nhập tóm tắt bài viết"
                    className="min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Nội dung</Label>
                  <PostContentEditor
                    sections={postSections}
                    onSectionsChange={setPostSections}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position">Vị trí</Label>
                    <Input
                      id="position"
                      type="number"
                      min="1"
                      value={position}
                      onChange={(e) =>
                        setPosition(parseInt(e.target.value) || 1)
                      }
                      placeholder="1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiredAt">Ngày hết hạn</Label>
                    <Input
                      id="expiredAt"
                      type="datetime-local"
                      value={expiredAt}
                      onChange={(e) => setExpiredAt(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="publishedAt">Ngày xuất bản</Label>
                    <Input
                      id="publishedAt"
                      type="datetime-local"
                      value={publishedAt}
                      onChange={(e) => setPublishedAt(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isHidden"
                      checked={isHidden}
                      onCheckedChange={setIsHidden}
                    />
                    <Label htmlFor="isHidden">Ẩn bài viết</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isService"
                      checked={isService}
                      onCheckedChange={setIsService}
                    />
                    <Label htmlFor="isService">Là dịch vụ</Label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={updatePostMutation.isPending}
                    className="flex-1"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updatePostMutation.isPending
                      ? "Đang cập nhật..."
                      : "Cập nhật bài viết"}
                  </Button>

                  <Link href={`/news/${encodeURIComponent(newsId)}`}>
                    <Button type="button" variant="outline">
                      Hủy
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <ImagePicker
          isOpen={showImagePicker}
          onClose={() => setShowImagePicker(false)}
          onSelect={handleImageSelect}
          selectedFileId={selectedThumbnail?.id}
          type="image"
        />
      </main>
    </div>
  );
}
