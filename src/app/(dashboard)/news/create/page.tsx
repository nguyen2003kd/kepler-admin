"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Textarea } from '@/components/ui/textarea';
import { Switch } from "@/components/ui/switch";
import { Header } from "@/components/layout/header";
import { usePostApiV10Post } from "@/api/endpoints/post";
import { useGetApiV10Category } from "@/api/endpoints/category";
import { PostMutateStatus, type PostMutate } from "@/api/models";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toaster";
import { extractErrorMessage } from "@/utils/error";
import { useAbility } from "@/hooks/use-ability";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
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
// import { HierarchicalCategorySelector } from '@/components/shared/hierarchical-category-selector';
import { RichTextEditor } from "@/components/shared/rich-text-editor";
import baseConfig from "@configs/base";
export default function CreateNewsPage() {
  const ability = useAbility();
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showImagePicker, setShowImagePicker] = useState(false);

  const router = useRouter();
  const createPostMutation = usePostApiV10Post();
  const { data: categoriesData } = useGetApiV10Category();
  const canApproveL2 = ability.can("approve_post", "post-approval-2");
  const canApproveL1 = ability.can("approve_post", "post-approval-1");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const categories = categoriesData?.responseData || [];

  const handleImageSelect = (file: ImagePickerFile) => {
    setSelectedThumbnail(file);
    setShowImagePicker(false);
  };

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
      // Convert PostContentSections to API format
      const apiPostContent = postSections.map((section) => ({
        content:
          section.type === "text"
            ? section.content || ""
            : section.caption || "",
        position: section.position,
        image_columns:
          section.type === "image" ? section.image_columns || 2 : undefined,
        image_rows:
          section.type === "image" ? section.image_rows || 2 : undefined,
        post_content_images:
          section.type === "image"
            ? (section.post_content_images || []).map((img) => ({
                position: img.position,
                file_id: img.file_id,
              }))
            : [],
      }));

      const postData: PostMutate = {
        title: title.trim(),
        code: code.trim() || `POST-${Date.now()}`,
        slug: title
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
        summary: summary.trim() || undefined,
        position,
        is_hidden: isHidden,
        is_service: false,
        status: canApproveL2
          ? PostMutateStatus.PUBLISHED
          : canApproveL1
            ? PostMutateStatus.PENDING_L2
            : undefined,
        expired_at: expiredAt ? new Date(expiredAt).toISOString() : undefined,
        published_at: publishedAt ? new Date(publishedAt).toISOString() : undefined,
        category_ids: selectedCategories,
        thumbnail_file_id: selectedThumbnail?.id,
        post_content:
          apiPostContent.length > 0
            ? apiPostContent
            : [
                {
                  content: "",
                  position: 1,
                  image_columns: 2,
                  image_rows: 2,
                  post_content_images: [],
                },
              ],
      };

      const result = await createPostMutation.mutateAsync({ data: postData });

      if (result.status === "success") {
        toast.success({
          title: "Thành công",
          content: "Tạo bài viết thành công!",
        });
        router.push("/news");
      } else {
        throw new Error(result.message || "Có lỗi xảy ra");
      }
    } catch (error: unknown) {
      console.error("Error creating post:", error);
      const msg = extractErrorMessage(error);
      toast.error({ title: "Tạo thất bại", content: msg });
    }
  };

  return (
    <div>
      <Header title="Tạo tin tức mới" />
      <main className="container mx-auto p-4 md:p-6">
        <div className="max-w-full mx-auto">
          <div className="mb-6">
            <Link href="/news">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin bài viết</CardTitle>
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
                    placeholder="POST-001 (sẽ tự động tạo nếu để trống)"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Hình ảnh đại diện</Label>
                  <div className="space-y-3">
                    {selectedThumbnail ? (
                      <div className="relative inline-block">
                        <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200 relative">
                          <Image
                            src={`${baseConfig.imgEndpointDomain}${
                              selectedThumbnail.path ||
                              selectedThumbnail.compress_info?.desktop ||
                              ""
                            }`}
                            alt={
                              selectedThumbnail.title ||
                              selectedThumbnail.name ||
                              "Ảnh đại diện"
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

                {/* Post Content Editor */}
                <PostContentEditor
                  sections={postSections}
                  onSectionsChange={setPostSections}
                />

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
                    disabled={createPostMutation.isPending}
                    className="flex-1"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {createPostMutation.isPending
                      ? "Đang tạo..."
                      : "Tạo bài viết"}
                  </Button>

                  <Link href="/news">
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
