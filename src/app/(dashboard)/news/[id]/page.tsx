"use client";

import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Edit } from "lucide-react";
import { Header } from "@/components/layout/header";
import { useGetApiV10PostId } from "@/api/endpoints/post";
import Link from "next/link";
import Image from "next/image";
import baseConfig from "@configs/base";
import parse from 'html-react-parser'
import { useEffect } from "react";
function ImageDisplay({
  fileData,
  className = "",
}: {
  fileData: {
    file_id: string;
    file?: {
      compress_info?: {
        mobile?: string;
        tablet?: string;
        desktop?: string;
        preload?: string;
      };
    };
  };
  className?: string;
}) {
  // Get the best quality image path from compress_info
  const getImageUrl = () => {
    const compressInfo = fileData.file?.compress_info;
    if (compressInfo) {
      // Use desktop quality first, fallback to tablet, then mobile
      const imagePath = compressInfo.desktop || compressInfo.tablet || compressInfo.mobile;
      if (imagePath) {
        return `${baseConfig.imgEndpointDomain}${imagePath}`;
      }
    }
    // Fallback to original file endpoint
    return `${baseConfig.imgEndpointDomain}/files/${fileData.file_id}`;
  };

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <Image
        src={getImageUrl()}
        alt={`Hình ảnh ${fileData.file_id}`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}

// Content Section Component
function ContentSection({
  content,
}: {
  content: {
    content?: string;
    post_content_images?: Array<{
      position: number;
      file_id: string;
      file?: {
        compress_info?: {
          mobile?: string;
          tablet?: string;
          desktop?: string;
          preload?: string;
        };
      };
    }>;
    image_columns?: number;
    image_rows?: number;
  };
}) {
  const hasImages =
    content.post_content_images && content.post_content_images.length > 0;

  if (!hasImages) {
    // Text section
    return (
      <div className="prose prose-lg max-w-none">
        <div className='tiptap prose max-w-none text-justify'>
           {content.content ? parse(content.content) : null}
        </div>
      </div>
    );
  }

  // Image section
  const columns = content.image_columns || 2;
  const rows = content.image_rows || 2;
  const totalSlots = columns * rows;

  return (
    <div className="space-y-4">
      {/* Image Grid */}
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 200px)`,
        }}
      >
        {Array.from({ length: totalSlots }, (_, index) => {
          const imageAtPosition = content.post_content_images?.find(
            (img) => img.position === index + 1
          );

          return (
            <div key={index} className="relative">
              {imageAtPosition ? (
                <ImageDisplay
                  fileData={imageAtPosition}
                  className="w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Trống</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Caption */}
      {content.content && (
        <div className="text-center text-gray-600 italic text-sm mt-2">
          {content.content}
        </div>
      )}
    </div>
  );
}

export default function NewsDetailPage() {
  const params = useParams();
  const newsId = decodeURIComponent(params.id as string);

  const {
    data: response,
    isLoading,
    error,

    refetch,
  } = useGetApiV10PostId(newsId, {
    query: {
      refetchOnMount: "always",
      staleTime: 0,
    },
  });
  const news = response?.responseData;

  // const { data: categoriesData } = useGetApiV10Category();
  // const allCategories = categoriesData?.responseData || [];

  useEffect(() => {
    refetch();
  }, [newsId, refetch]);

  if (isLoading) {
    return (
      <div>
        <Header title="Chi tiết tin tức" />
        <main className="container mx-auto p-4 md:p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
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
              Tin tức bạn tìm kiếm không tồn tại hoặc ID không hợp lệ: {newsId}
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
      <Header title={news.title} />
      <main className="container mx-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header Actions */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/news">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại danh sách
              </Button>
            </Link>

            <div className="flex gap-2">
              <Link href={`/news/${encodeURIComponent(newsId)}/edit`}>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </Button>
              </Link>
            </div>
          </div>

          <Card>
            <CardContent className="p-8">
              {/* Post Header */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline">{news.code}</Badge>
                  <Badge
                    className={
                      news.is_hidden
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }
                  >
                    {news.is_hidden ? "Ẩn" : "Công khai"}
                  </Badge>
                  {news.is_service && (
                    <Badge variant="secondary">Dịch vụ</Badge>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {news.title}
                </h1>

                {news.summary && (
                        <div className='tiptap prose max-w-none text-justify'>
                {news?.summary ? parse(news.summary) : <p>Không có nội dung</p>}
              </div> 
                )}

                {/* {news.category_ids && Array.isArray(news.category_ids) && news.category_ids.length > 0 ? (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      Danh mục ({(news.category_ids as string[]).length})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {(news.category_ids as string[]).map((categoryId: string) => {
                        const category = allCategories.find((c) => c.id === categoryId);
                        return (
                          <div 
                            key={categoryId} 
                            className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
                          >
                            <div className="flex items-center gap-2">
                              {category?.parent_category_id ? (
                                <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                </svg>
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-gray-900 truncate">
                                  {category?.name || 'Không rõ'}
                                </p>
                                {category?.code && (
                                  <p className="text-xs text-gray-500 font-mono">
                                    {category.code}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null} */}

                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Tạo:{" "}
                      {news.created_at
                        ? new Date(news.created_at).toLocaleDateString("vi-VN")
                        : "Không rõ"}
                    </span>
                  </div>

                  {news.updated_at && news.updated_at !== news.created_at && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Cập nhật:{" "}
                        {new Date(news.updated_at).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  )}

                  <div>Vị trí: {news.position}</div>

                  {news.expired_at && (
                    <div className="text-orange-600">
                      Hết hạn:{" "}
                      {new Date(news.expired_at).toLocaleDateString("vi-VN")}
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail Display */}
              {(news.thumbnail_compress_info as { desktop?: string; tablet?: string; mobile?: string } | null)?.desktop ||
               (news.thumbnail_compress_info as { desktop?: string; tablet?: string; mobile?: string } | null)?.tablet ||
               (news.thumbnail_compress_info as { desktop?: string; tablet?: string; mobile?: string } | null)?.mobile ||
               news.thumbnail_path ? (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Ảnh đại diện</h3>
                  <div className="relative w-48 h-48 rounded-lg overflow-hidden border">
                    <Image
                      src={`${baseConfig.imgEndpointDomain}${
                        (news.thumbnail_compress_info as { desktop?: string; tablet?: string; mobile?: string } | null)?.desktop ||
                        (news.thumbnail_compress_info as { desktop?: string; tablet?: string; mobile?: string } | null)?.tablet ||
                        (news.thumbnail_compress_info as { desktop?: string; tablet?: string; mobile?: string } | null)?.mobile ||
                        news.thumbnail_path
                      }`}
                      alt={news.title || "Hình ảnh đại diện"}
                      fill
                      className="object-cover"
                      sizes="192px"
                    />
                  </div>
                </div>
              ) : null}

              {/* Post Content */}
              <div className="space-y-6">
                {news.post_content &&
                Array.isArray(news.post_content) &&
                news.post_content.length > 0 ? (
                  (
                    news.post_content as Array<{
                      position: number;
                      content?: string;
                      post_content_images?: Array<{
                        position: number;
                        file_id: string;
                        file?: {
                          compress_info?: {
                            mobile?: string;
                            tablet?: string;
                            desktop?: string;
                            preload?: string;
                          };
                        };
                      }>;
                      image_columns?: number;
                      image_rows?: number;
                    }>
                  )
                    .sort((a, b) => a.position - b.position)
                    .map((content, index: number) => (
                      <ContentSection key={index} content={content} />
                    ))
                ) : (
                  <p className="text-gray-500 italic">Không có nội dung</p>
                )}
              </div>

              {/* Thumbnail info */}
              {news.thumbnail_path && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  {/* <h3 className="text-lg font-semibold mb-3">Ảnh đại diện</h3>
                  <p className="text-sm text-gray-600 mb-2">Đường dẫn: {news.thumbnail_path}</p> */}

                  {(news.thumbnail_compress_info as {
                    mobile?: string;
                    tablet?: string;
                    desktop?: string;
                    preload?: string;
                  } | null) && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="font-medium">Mobile:</span>
                        <br />
                        {
                          (news.thumbnail_compress_info as { mobile?: string })
                            .mobile
                        }
                      </div>
                      <div>
                        <span className="font-medium">Tablet:</span>
                        <br />
                        {
                          (news.thumbnail_compress_info as { tablet?: string })
                            .tablet
                        }
                      </div>
                      <div>
                        <span className="font-medium">Desktop:</span>
                        <br />
                        {
                          (news.thumbnail_compress_info as { desktop?: string })
                            .desktop
                        }
                      </div>
                      <div>
                        <span className="font-medium">Preload:</span>
                        <br />
                        {
                          (news.thumbnail_compress_info as { preload?: string })
                            .preload
                        }
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
