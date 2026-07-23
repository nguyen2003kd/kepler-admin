"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  //   Search,
  Edit,
  Trash2,
  ImageIcon,
  //   Settings,
  //   Eye,
  //   EyeOff,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// Custom popup styles removed Dialog dependency
import { toast } from "sonner";
import { ImagePicker, ImagePickerFile } from "@/components/shared/image-picker";
import baseConfig from "@/configs/base";
// import { HomeGalleryConfig } from "./components";

// API imports
import {
  useGetApiV10Banner,
  usePostApiV10Banner,
  usePutApiV10BannerId,
  useDeleteApiV10BannerId,
} from "@/api/endpoints/banner";
import {
  useGetApiV10Logo,
  usePostApiV10Logo,
  usePutApiV10LogoId,
  useDeleteApiV10LogoId,
} from "@/api/endpoints/logo";
import { BannerMutate } from "@/api/models/bannerMutate";
import { LogoMutate } from "@/api/models/logoMutate";
import { Header } from "@/components/layout/header";
import { ContactConfig } from "./components/ContactConfig";
import { VideoConfig } from "./components/VideoConfig";
import { CustomersPartnersConfig } from "./components/CustomersPartnersConfig";
import { useAbility } from "@/hooks/use-ability";

export default function BaseConfigPage() {
  const ability = useAbility();

  const canCreateLogo = ability.can("create_logo", "settings");
  const canUpdateLogo = ability.can("update_logo", "settings");
  const canDeleteLogo = ability.can("delete_logo", "settings");

  const canCreateBanner = ability.can("create_banner", "settings");
  const canUpdateBanner = ability.can("update_banner", "settings");
  const canDeleteBanner = ability.can("delete_banner", "settings");

  const canCreateContact = ability.can("create_contact", "settings");
  const canUpdateContact = ability.can("update_contact", "settings");
  const canDeleteContact = ability.can("delete_contact", "settings");
  const canViewContact =
    ability.can("infor_contact", "settings") ||
    canCreateContact ||
    canUpdateContact ||
    canDeleteContact;

  const [bannerFormOpen, setBannerFormOpen] = useState(false);
  const [logoFormOpen, setLogoFormOpen] = useState(false);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [imagePickerMode, setImagePickerMode] = useState<"banner" | "logo">(
    "banner",
  );
  const [editingBanner, setEditingBanner] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [editingLogo, setEditingLogo] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentLogoSlide, setCurrentLogoSlide] = useState(0);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] =
    useState<ImagePickerFile | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    img_url: "",
    is_active: true,
  });

  // Banner API hooks
  const {
    data: bannersData,
    isLoading: bannersLoading,
    refetch: refetchBanners,
  } = useGetApiV10Banner();
  const createBannerMutation = usePostApiV10Banner();
  const updateBannerMutation = usePutApiV10BannerId();
  const deleteBannerMutation = useDeleteApiV10BannerId();

  // Logo API hooks
  const {
    data: logosData,
    isLoading: logosLoading,
    refetch: refetchLogos,
  } = useGetApiV10Logo();
  const createLogoMutation = usePostApiV10Logo();
  const updateLogoMutation = usePutApiV10LogoId();
  const deleteLogoMutation = useDeleteApiV10LogoId();

  const banners = bannersData?.responseData?.rows || [];
  const logos = logosData?.responseData?.rows || [];
  const [globalDisplayTime, setGlobalDisplayTime] = useState("5");

  useEffect(() => {
    const rows = bannersData?.responseData?.rows as
      | Record<string, unknown>[]
      | undefined;
    if (rows && rows.length > 0 && rows[0].display_time) {
      setGlobalDisplayTime(String(Number(rows[0].display_time) / 1000));
    }
  }, [bannersData]);

  // Filter data based on search
  const filteredBanners = banners;

  const filteredLogos = logos;

  // Helper function to get image URL
  const getImageUrl = (
    file: ImagePickerFile | Record<string, unknown> | null | undefined,
  ) => {
    if (!file) return "";

    let imagePath = "";
    // Use compressed version if available, fallback to original path
    if (
      file &&
      typeof file === "object" &&
      "compress_info" in file &&
      file.compress_info
    ) {
      const compressInfo = file.compress_info as Record<string, unknown>;
      imagePath = String(
        compressInfo.desktop || compressInfo.tablet || file.path || "",
      );
    } else {
      imagePath = String(file?.path || "");
    }

    // Add domain if path doesn't start with http
    return imagePath.startsWith("http")
      ? imagePath
      : `${baseConfig.imgEndpointDomain}${imagePath}`;
  };

  // Get URL for selected image file
  const getSelectedImageUrl = () => {
    if (!selectedImageFile) return "";
    return getImageUrl(selectedImageFile);
  };

  // Banner slider navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % filteredBanners.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + filteredBanners.length) % filteredBanners.length,
    );
  };

  // Logo slider navigation
  const nextLogoSlide = () => {
    setCurrentLogoSlide((prev) => (prev + 1) % filteredLogos.length);
  };

  const prevLogoSlide = () => {
    setCurrentLogoSlide(
      (prev) => (prev - 1 + filteredLogos.length) % filteredLogos.length,
    );
  };

  // Image Picker handlers
  const handleImageSelect = (file: ImagePickerFile) => {
    setSelectedImageId(String(file.id || ""));
    setSelectedImageFile(file);
    setImagePickerOpen(false);
    // Keep the dialog open, don't close banner/logo form
  };

  // Form handlers
  const resetForm = () => {
    setFormData({
      name: "",
      img_url: "",
      is_active: true,
    });
    setSelectedImageId(null);
    setSelectedImageFile(null);
  };

  const handleSubmit = async () => {
    // Allow either img_url or selectedImageId
    if (!formData.img_url && !selectedImageId) {
      toast.error("Vui lòng nhập URL hình ảnh hoặc chọn từ thư viện");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên");
      return;
    }

    const submitData = {
      name: formData.name,
      file_id: selectedImageId || undefined,
      img_url: formData.img_url || undefined,
      display_time: String(Number(globalDisplayTime) * 1000),
      is_active: formData.is_active,
    };

    try {
      if (imagePickerMode === "banner") {
        if (editingBanner) {
          if (!canUpdateBanner) {
            toast.error("Bạn không có quyền sửa banner");
            return;
          }
          await handleUpdateBanner(String(editingBanner.id), submitData);
        } else {
          if (!canCreateBanner) {
            toast.error("Bạn không có quyền thêm banner");
            return;
          }
          await handleCreateBanner(submitData);
        }
      } else if (imagePickerMode === "logo") {
        if (editingLogo) {
          if (!canUpdateLogo) {
            toast.error("Bạn không có quyền sửa logo");
            return;
          }
          await handleUpdateLogo(String(editingLogo.id), submitData);
        } else {
          if (!canCreateLogo) {
            toast.error("Bạn không có quyền thêm logo");
            return;
          }
          await handleCreateLogo(submitData);
        }
      }

      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Banner CRUD operations
  const handleCreateBanner = async (data: BannerMutate) => {
    try {
      await createBannerMutation.mutateAsync({ data });
      toast.success("Banner đã được tạo thành công");
      setBannerFormOpen(false);
      refetchBanners();
    } catch (error: unknown) {
      console.error("Create banner error:", error);
      toast.error("Có lỗi xảy ra khi tạo banner");
    }
  };

  const handleUpdateBanner = async (id: string, data: BannerMutate) => {
    try {
      await updateBannerMutation.mutateAsync({ id, data });
      toast.success("Banner đã được cập nhật thành công");
      setBannerFormOpen(false);
      setEditingBanner(null);
      refetchBanners();
    } catch (error: unknown) {
      console.error("Update banner error:", error);
      toast.error("Có lỗi xảy ra khi cập nhật banner");
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!canDeleteBanner) {
      toast.error("Bạn không có quyền xóa banner");
      return;
    }

    if (!confirm("Bạn có chắc chắn muốn xóa banner này?")) return;

    try {
      await deleteBannerMutation.mutateAsync({ id });
      toast.success("Banner đã được xóa thành công");
      refetchBanners();
    } catch (error: unknown) {
      console.error("Delete banner error:", error);
      toast.error("Có lỗi xảy ra khi xóa banner");
    }
  };

  // Logo CRUD operations
  const handleCreateLogo = async (data: LogoMutate) => {
    try {
      await createLogoMutation.mutateAsync({ data });
      toast.success("Logo đã được tạo thành công");
      setLogoFormOpen(false);
      refetchLogos();
    } catch (error: unknown) {
      console.error("Create logo error:", error);
      toast.error("Có lỗi xảy ra khi tạo logo");
    }
  };

  const handleUpdateLogo = async (id: string, data: LogoMutate) => {
    try {
      await updateLogoMutation.mutateAsync({ id, data });
      toast.success("Logo đã được cập nhật thành công");
      setLogoFormOpen(false);
      setEditingLogo(null);
      refetchLogos();
    } catch (error: unknown) {
      console.error("Update logo error:", error);
      toast.error("Có lỗi xảy ra khi cập nhật logo");
    }
  };

  const handleDeleteLogo = async (id: string) => {
    if (!canDeleteLogo) {
      toast.error("Bạn không có quyền xóa logo");
      return;
    }

    if (!confirm("Bạn có chắc chắn muốn xóa logo này?")) return;

    try {
      await deleteLogoMutation.mutateAsync({ id });
      toast.success("Logo đã được xóa thành công");
      refetchLogos();
    } catch (error: unknown) {
      console.error("Delete logo error:", error);
      toast.error("Có lỗi xảy ra khi xóa logo");
    }
  };

  // Sync all banners with global display time
  const handleSyncAllBannersTime = async () => {
    if (!canUpdateBanner) {
      toast.error("Bạn không có quyền sửa banner");
      return;
    }

    if (
      !confirm(
        `Bạn có chắc chắn muốn đồng bộ thời gian hiển thị ${globalDisplayTime} giây cho tất cả ${banners.length} banner?`,
      )
    )
      return;

    try {
      const updatePromises = banners.map((banner: Record<string, unknown>) => {
        const updateData: BannerMutate = {
          name: String(banner.name || ""),
          description: String(banner.description || ""),
          file_id: String((banner.file as Record<string, unknown>)?.id || ""),
          sort_order: String(banner.sort_order || "1"),
          display_time: String(Number(globalDisplayTime) * 1000),
          is_active: Boolean(banner.is_active),
        };
        return updateBannerMutation.mutateAsync({
          id: String(banner.id),
          data: updateData,
        });
      });

      await Promise.all(updatePromises);
      toast.success(
        `Đã đồng bộ thời gian hiển thị cho ${banners.length} banner thành công`,
      );
      refetchBanners();
    } catch (error: unknown) {
      console.error("Sync banners time error:", error);
      toast.error("Có lỗi xảy ra khi đồng bộ thời gian hiển thị");
    }
  };

  return (
    <>
      <Header title="Quản lý cài đặt chung" />
      <div className="space-y-6">
        <div className="space-y-8">
          {/* Nhận diện thương hiệu Section */}
          <Card>
            <CardHeader>
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold">
                  Nhận diện thương hiệu
                </CardTitle>
                <CardDescription className="text-base">
                  Logo sẽ được hiển thị trên trang web
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Logo Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Logo</h3>
                  <div className="flex items-center gap-4">
                    {canCreateLogo && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => {
                          setLogoFormOpen(true);
                          setImagePickerMode("logo");
                          resetForm();
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm logo
                      </Button>
                    )}
                    {filteredLogos.length > 0 && (
                      <>
                        {canUpdateLogo && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => {
                              const currentLogo = filteredLogos[currentLogoSlide];
                              if (currentLogo) {
                                setEditingLogo(currentLogo);
                                setFormData({
                                  name: String(currentLogo.name || ""),
                                  img_url: String(currentLogo.img_url || ""),
                                  is_active: Boolean(currentLogo.is_active),
                                });
                                const logoFile = currentLogo.file as Record<
                                  string,
                                  unknown
                                >;
                                setSelectedImageId(String(logoFile?.id || ""));
                                // Convert to ImagePickerFile format
                                if (logoFile) {
                                  setSelectedImageFile({
                                    id: String(logoFile.id || ""),
                                    path: String(logoFile.path || ""),
                                    name: String(logoFile.name || ""),
                                    mime: String(logoFile.mime || ""),
                                    size: String(logoFile.size || ""),
                                    compress_info:
                                      logoFile.compress_info as ImagePickerFile["compress_info"],
                                  });
                                }
                                setImagePickerMode("logo");
                                setLogoFormOpen(true);
                              }
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Sửa
                          </Button>
                        )}
                        {canDeleteLogo && (
                          <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => {
                              const currentLogo = filteredLogos[currentLogoSlide];
                              if (currentLogo) {
                                handleDeleteLogo(String(currentLogo.id));
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                          </Button>
                        )}
                      </>
                    )}
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={prevLogoSlide}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={nextLogoSlide}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-green-400 rounded-lg bg-green-50/30 w-32 aspect-square flex items-center justify-center">
                  {logosLoading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  ) : filteredLogos.length === 0 ? (
                    <div className="text-center text-gray-400">
                      <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded mx-auto mb-2"></div>
                      <p className="text-sm">Chưa có logo</p>
                    </div>
                  ) : (
                    <img
                      src={getImageUrl(
                        filteredLogos[currentLogoSlide]?.file as Record<
                          string,
                          unknown
                        >,
                      )}
                      alt={String(
                        filteredLogos[currentLogoSlide]?.name || "Logo",
                      )}
                      className="h-full w-full object-contain"
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold">
                  Quản lý Banner Slider
                </CardTitle>
                <CardDescription className="text-base">
                  Quản lý các hình ảnh banner hiển thị trên trang chủ
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">
                  Thời gian hiển thị (giây):
                </label>
                <Input
                  type="number"
                  min="1"
                  max="60"
                  value={globalDisplayTime.toString()}
                  onChange={(e) => setGlobalDisplayTime(e.target.value)}
                  className="w-32"
                  placeholder="5"
                  disabled={!canUpdateBanner}
                />
                <span className="text-sm text-gray-600">giây</span>
                {banners.length > 0 && canUpdateBanner && (
                  <Button
                    onClick={handleSyncAllBannersTime}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    Xác nhận
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Banner</h3>
                  <div className="flex items-center gap-4">
                    {canCreateBanner && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => {
                          setBannerFormOpen(true);
                          setImagePickerMode("banner");
                          resetForm();
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm banner
                      </Button>
                    )}
                    {filteredBanners.length > 0 && (
                      <>
                        {canUpdateBanner && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => {
                              const currentBanner = filteredBanners[currentSlide];
                              if (currentBanner) {
                                setEditingBanner(currentBanner);
                                setFormData({
                                  name: String(currentBanner.name || ""),
                                  img_url: String(currentBanner.img_url || ""),
                                  is_active: Boolean(currentBanner.is_active),
                                });
                                const bannerFile = currentBanner.file as Record<
                                  string,
                                  unknown
                                >;
                                setSelectedImageId(String(bannerFile?.id || ""));
                                // Convert to ImagePickerFile format
                                if (bannerFile) {
                                  setSelectedImageFile({
                                    id: String(bannerFile.id || ""),
                                    path: String(bannerFile.path || ""),
                                    name: String(bannerFile.name || ""),
                                    mime: String(bannerFile.mime || ""),
                                    size: String(bannerFile.size || ""),
                                    compress_info:
                                      bannerFile.compress_info as ImagePickerFile["compress_info"],
                                  });
                                }
                                setImagePickerMode("banner");
                                setBannerFormOpen(true);
                              }
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Sửa
                          </Button>
                        )}
                        {canDeleteBanner && (
                          <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => {
                              const currentBanner = filteredBanners[currentSlide];
                              if (currentBanner) {
                                handleDeleteBanner(String(currentBanner.id));
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                          </Button>
                        )}
                      </>
                    )}
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={prevSlide}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={nextSlide}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  {bannersLoading ? (
                    <div className="flex justify-center py-8 w-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : filteredBanners.length === 0 ? (
                    <div className="w-48 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                      <div className="text-center text-sm">
                        <ImageIcon className="mx-auto h-8 w-8 mb-2 opacity-50" />
                        <p>Chưa có banner</p>
                      </div>
                    </div>
                  ) : (
                    filteredBanners.map(
                      (banner: Record<string, unknown>, index) => (
                        <div
                          key={String(banner.id)}
                          className={`w-48 h-32 border-2 rounded-lg overflow-hidden cursor-pointer ${
                            index === currentSlide
                              ? "border-green-400"
                              : "border-gray-200"
                          }`}
                          onClick={() => setCurrentSlide(index)}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getImageUrl(
                              banner.file as Record<string, unknown>,
                            )}
                            alt={String(banner.name || "Banner")}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ),
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customers/Partners Config */}
        <CustomersPartnersConfig canUpdate={ability.can("update_banner", "settings")} />
        {/* Banner Form Popup */}
        {bannerFormOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="border-b pb-4 mb-4">
                  <h2 className="text-lg font-semibold">
                    {editingBanner ? "Chỉnh sửa Banner" : "Thêm Banner mới"}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Điền thông tin banner
                  </p>
                </div>
                <div className="space-y-4">
                  {/* Name field */}
                  <div>
                    <label className="text-sm font-medium">Tên *</label>
                    <Input
                      placeholder="Nhập tên banner"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* Image URL field */}
                  <div>
                    <label className="text-sm font-medium">Link</label>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={formData.img_url}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          img_url: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* Display Time field - Read Only */}
                  <div>
                    <label className="text-sm font-medium">
                      Thời gian hiển thị (giây)
                    </label>
                    <Input
                      type="number"
                      value={globalDisplayTime.toString()}
                      readOnly
                      disabled
                      className="bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  {/* Image selection */}
                  <div>
                    <label className="text-sm font-medium">Hình ảnh *</label>
                    {selectedImageFile ? (
                      <div className="mt-2 space-y-2">
                        <div className="relative w-full h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getSelectedImageUrl()}
                            alt="Selected image"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setImagePickerMode("banner");
                            setImagePickerOpen(true);
                          }}
                          className="w-full"
                        >
                          Thay đổi hình ảnh
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setImagePickerMode("banner");
                          setImagePickerOpen(true);
                        }}
                        className="w-full mt-1"
                      >
                        Chọn hình ảnh
                      </Button>
                    )}
                  </div>

                  {/* Active toggle */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="bannerActive"
                      checked={formData.is_active}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          is_active: e.target.checked,
                        }))
                      }
                    />
                    <label
                      htmlFor="bannerActive"
                      className="text-sm font-medium"
                    >
                      Hiển thị
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setBannerFormOpen(false);
                        setEditingBanner(null);
                        resetForm();
                      }}
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={editingBanner ? !canUpdateBanner : !canCreateBanner}
                    >
                      {editingBanner ? "Cập nhật" : "Tạo"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Logo Form Popup */}
        {logoFormOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="border-b pb-4 mb-4">
                  <h2 className="text-lg font-semibold">
                    {editingLogo ? "Chỉnh sửa Logo" : "Thêm Logo mới"}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Điền thông tin logo
                  </p>
                </div>
                <div className="space-y-4">
                  {/* Name field */}
                  <div>
                    <label className="text-sm font-medium">Tên *</label>
                    <Input
                      placeholder="Nhập tên logo"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* Image URL field */}
                  <div>
                    <label className="text-sm font-medium">URL hình ảnh</label>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={formData.img_url}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          img_url: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* Display Time field - Read Only */}
                  <div>
                    <label className="text-sm font-medium">
                      Thời gian hiển thị (giây)
                    </label>
                    <Input
                      type="number"
                      value={globalDisplayTime.toString()}
                      readOnly
                      disabled
                      className="bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  {/* Image selection */}
                  <div>
                    <label className="text-sm font-medium">Hình ảnh *</label>
                    {selectedImageFile ? (
                      <div className="mt-2 space-y-2">
                        <div className="relative w-full h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getSelectedImageUrl()}
                            alt="Selected image"
                            className="w-full h-full object-contain bg-gray-50"
                          />
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setImagePickerMode("logo");
                            setImagePickerOpen(true);
                          }}
                          className="w-full"
                        >
                          Thay đổi hình ảnh
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setImagePickerMode("logo");
                          setImagePickerOpen(true);
                        }}
                        className="w-full mt-1"
                      >
                        Chọn hình ảnh
                      </Button>
                    )}
                  </div>

                  {/* Active toggle */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="logoActive"
                      checked={formData.is_active}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          is_active: e.target.checked,
                        }))
                      }
                    />
                    <label htmlFor="logoActive" className="text-sm font-medium">
                      Hiển thị
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setLogoFormOpen(false);
                        setEditingLogo(null);
                        resetForm();
                      }}
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={editingLogo ? !canUpdateLogo : !canCreateLogo}
                    >
                      {editingLogo ? "Cập nhật" : "Tạo"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ImagePicker */}
        <ImagePicker
          isOpen={imagePickerOpen}
          onClose={() => setImagePickerOpen(false)}
          onSelect={handleImageSelect}
          type="image"
        />

        {/* Home Gallery Config */}
        {/* <HomeGalleryConfig /> */}

        {/* Contact Config */}
        {canViewContact && (
          <ContactConfig
            canCreate={canCreateContact}
            canUpdate={canUpdateContact}
            canDelete={canDeleteContact}
          />
        )}

        {/* Video Config */}
        <VideoConfig />

      </div>
    </>
  );
}
