"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Save,
  ImageIcon,
  Users,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import {
  useGetApiV10PageConfig,
  usePutApiV10PageConfigId,
} from "@/api/endpoints/page-config";
import { ImagePicker, type ImagePickerFile } from "@/components/shared/image-picker";
import baseConfig from "@/configs/base";
import { toast } from "sonner";

const CUSTOMERS_PARTNERS_CONFIG_KEY = "Customers_partners_config";

interface Partner {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  is_active: boolean;
}

interface PageConfigRow {
  id: string;
  key: string;
  value: string;
}

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

export function CustomersPartnersConfig({ canUpdate = true }: { canUpdate?: boolean }) {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [configId, setConfigId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    website: "",
    is_active: true,
  });
  const [, setSelectedImageFile] = useState<ImagePickerFile | null>(null);

  const { data, refetch } = useGetApiV10PageConfig({
    filters: `key==${CUSTOMERS_PARTNERS_CONFIG_KEY}`,
    pageSize: 1,
  });
  const updateMutation = usePutApiV10PageConfigId();

  useEffect(() => {
    if (data?.responseData?.rows && data.responseData.rows.length > 0) {
      const row = data.responseData.rows[0] as unknown as PageConfigRow;
      setConfigId(row.id);
      try {
        const parsed = JSON.parse(row.value || "[]");
        if (Array.isArray(parsed)) {
          setPartners(parsed as Partner[]);
        }
      } catch {
        setPartners([]);
      }
    }
    setIsLoading(false);
  }, [data]);

  const filteredPartners = partners;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % filteredPartners.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + filteredPartners.length) % filteredPartners.length
    );
  };

  const handleImageSelect = (file: ImagePickerFile) => {
    const bestPath =
      file.compress_info?.desktop ||
      file.compress_info?.tablet ||
      file.compress_info?.mobile ||
      file.path;
    setFormData((prev) => ({ ...prev, logo: bestPath }));
    setSelectedImageFile(file);
    setImagePickerOpen(false);
  };

  const getImageUrl = (logo: string | undefined) => {
    if (!logo) return "";
    return logo.startsWith("http")
      ? logo
      : `${baseConfig.imgEndpointDomain}${logo}`;
  };

  const getSelectedImageUrl = () => {
    return getImageUrl(formData.logo);
  };

  const resetForm = () => {
    setFormData({ name: "", logo: "", website: "", is_active: true });
    setSelectedImageFile(null);
    setEditingPartner(null);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên đối tác");
      return;
    }

    const partnerData: Partner = {
      id: editingPartner?.id || generateId(),
      name: formData.name.trim(),
      logo: formData.logo,
      website: formData.website?.trim(),
      is_active: formData.is_active,
    };

    let updatedPartners: Partner[];
    if (editingPartner) {
      updatedPartners = partners.map((p) =>
        p.id === editingPartner.id ? partnerData : p
      );
    } else {
      updatedPartners = [...partners, partnerData];
    }

    setPartners(updatedPartners);
    setHasChanges(true);
    setFormOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (!canUpdate) {
      toast.error("Bạn không có quyền xóa đối tác");
      return;
    }
    if (!confirm("Bạn có chắc chắn muốn xóa đối tác này?")) return;
    setPartners((p) => p.filter((partner) => partner.id !== id));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!configId) {
      toast.error("Không tìm thấy cấu hình Customers Partners");
      return;
    }

    setIsSaving(true);
    try {
      await updateMutation.mutateAsync({
        id: configId,
        data: {
          key: CUSTOMERS_PARTNERS_CONFIG_KEY,
          value: JSON.stringify(partners),
          is_active: true,
        },
      });
      setHasChanges(false);
      toast.success("Đã lưu cấu hình Customers/Partners");
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
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Quản lý Customers / Partners
            </CardTitle>
            <CardDescription className="text-base">
              Quản lý hình ảnh và thông tin đối tác / khách hàng hiển thị trên website
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Customers / Partners</h3>
              <div className="flex items-center gap-4">
                {canUpdate && (
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      resetForm();
                      setFormOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm đối tác
                  </Button>
                )}
                {filteredPartners.length > 0 && (
                  <>
                    {canUpdate && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => {
                            const currentPartner = filteredPartners[currentSlide];
                            if (currentPartner) {
                              setEditingPartner(currentPartner);
                              setFormData({
                                name: currentPartner.name,
                                logo: currentPartner.logo || "",
                                website: currentPartner.website || "",
                                is_active: currentPartner.is_active,
                              });
                              setFormOpen(true);
                            }
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Sửa
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => {
                            const currentPartner = filteredPartners[currentSlide];
                            if (currentPartner) {
                              handleDelete(currentPartner.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Xóa
                        </Button>
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
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              {filteredPartners.length === 0 ? (
                <div className="w-48 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                  <div className="text-center text-sm">
                    <Users className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <p>Chưa có đối tác</p>
                  </div>
                </div>
              ) : (
                filteredPartners.map(
                  (partner: Partner, index: number) => (
                    <div
                      key={partner.id}
                      className={`w-48 h-32 border-2 rounded-lg overflow-hidden cursor-pointer flex items-center justify-center transition-all ${
                        index === currentSlide
                          ? "border-green-400"
                          : "border-gray-200"
                      } ${
                        partner.is_active ? "" : "opacity-50"
                      }`}
                      onClick={() => setCurrentSlide(index)}
                    >
                      {partner.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={getImageUrl(partner.logo)}
                          alt={partner.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-center text-gray-400">
                          <Users className="mx-auto h-8 w-8 mb-1 opacity-50" />
                          <p className="text-xs truncate max-w-[170px]">
                            {partner.name}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                )
              )}
            </div>

            {/* Partner Info Preview */}
            {filteredPartners.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {filteredPartners[currentSlide]?.name}
                    </p>
                    {filteredPartners[currentSlide]?.website && (
                      <a
                        href={filteredPartners[currentSlide].website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                      >
                        {filteredPartners[currentSlide].website}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        filteredPartners[currentSlide]?.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {filteredPartners[currentSlide]?.is_active
                        ? "Hiển thị"
                        : "Ẩn"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {currentSlide + 1} / {filteredPartners.length}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          {hasChanges && (
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Lưu thay đổi
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Partner Form Popup */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="border-b pb-4 mb-4">
                <h2 className="text-lg font-semibold">
                  {editingPartner ? "Chỉnh sửa đối tác" : "Thêm đối tác mới"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Điền thông tin đối tác / khách hàng
                </p>
              </div>

              <div className="space-y-4">
                {/* Name field */}
                <div>
                  <Label>
                    Tên đối tác <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="Nhập tên đối tác"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="mt-1"
                  />
                </div>

                {/* Website field */}
                <div>
                  <Label>Website</Label>
                  <Input
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        website: e.target.value,
                      }))
                    }
                    className="mt-1"
                  />
                </div>

                {/* Logo selection */}
                <div>
                  <Label>Logo</Label>
                  {formData.logo ? (
                    <div className="mt-2 space-y-2">
                      <div className="relative w-full h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getSelectedImageUrl()}
                          alt="Selected logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setImagePickerOpen(true)}
                          className="flex-1"
                        >
                          Thay đổi logo
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, logo: "" }));
                            setSelectedImageFile(null);
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setImagePickerOpen(true)}
                      className="w-full mt-1"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Chọn logo
                    </Button>
                  )}
                </div>

                {/* Active toggle */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="partnerActive"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        is_active: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="partnerActive">Hiển thị</Label>
                </div>

                {/* Form actions */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFormOpen(false);
                      resetForm();
                    }}
                  >
                    Hủy
                  </Button>
                  <Button type="button" onClick={handleSubmit}>
                    {editingPartner ? "Cập nhật" : "Tạo"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Picker */}
      <ImagePicker
        isOpen={imagePickerOpen}
        onClose={() => setImagePickerOpen(false)}
        onSelect={handleImageSelect}
        type="image"
      />
    </>
  );
}
