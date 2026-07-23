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
import { Edit, Save, X, MapPin, Phone, Mail, Plus, Trash2 } from "lucide-react";
import {
  useGetApiV10PageConfig,
  usePutApiV10PageConfigId,
} from "@/api/endpoints/page-config";
import { toast } from "sonner";

interface LocationData {
  id: string;
  name: string;
  address: string;
  phone: string;
  hotline: string;
  email: string;
}

interface PageContactConfig {
  locations: LocationData[];
}

interface ContactConfigProps {
  canCreate?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
}

const defaultLocation: LocationData = {
  id: "",
  name: "",
  address: "",
  phone: "",
  hotline: "",
  email: "",
};

const initialPageContactConfig: PageContactConfig = {
  locations: [],
};

// Simple UUID generator
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export function ContactConfig({
  canCreate = true,
  canUpdate = true,
  canDelete = true,
}: ContactConfigProps) {
  const canManage = canCreate || canUpdate || canDelete;
  const [isEditing, setIsEditing] = useState(false);
  const [newLocationIds, setNewLocationIds] = useState<Set<string>>(new Set());
  const [pageContactConfig, setPageContactConfig] = useState<PageContactConfig>(
    initialPageContactConfig,
  );
  const [editPageContactConfig, setEditPageContactConfig] =
    useState<PageContactConfig>(initialPageContactConfig);
  const [configId, setConfigId] = useState<string>("");

  // Fetch pageConfig with CONTACT key filter
  const {
    data: pageConfigData,
    isLoading,
    refetch,
  } = useGetApiV10PageConfig({
    filters: "key@=CONTACT",
  });

  const updateMutation = usePutApiV10PageConfigId();

  // Parse and set contact data when API data is loaded
  useEffect(() => {
    if (
      pageConfigData?.responseData?.rows &&
      pageConfigData.responseData.rows.length > 0
    ) {
      const contactConfig = pageConfigData.responseData.rows[0] as {
        id?: string;
        value?: string | null;
      };

      if (contactConfig.id) {
        setConfigId(contactConfig.id);
      }

      if (contactConfig.value) {
        try {
          const parsedData = JSON.parse(contactConfig.value);

          // Check if it's the new format (has locations array)
          if (parsedData.locations && Array.isArray(parsedData.locations)) {
            setPageContactConfig(parsedData as PageContactConfig);
            setEditPageContactConfig(parsedData as PageContactConfig);
          } else {
            // Old format - convert to new format
            const convertedData: PageContactConfig = {
              locations: [
                {
                  id: generateId(),
                  name: parsedData.title || "Trụ sở chính",
                  address: parsedData.address || "",
                  phone: parsedData.phone || "",
                  hotline: parsedData.hotline || "",
                  email: parsedData.email || "",
                },
              ],
            };
            setPageContactConfig(convertedData);
            setEditPageContactConfig(convertedData);
          }
        } catch (error) {
          console.error("Error parsing contact data:", error);
          toast.error("Lỗi khi tải dữ liệu liên hệ");
          // Initialize with default structure on error
          setPageContactConfig(initialPageContactConfig);
          setEditPageContactConfig(initialPageContactConfig);
        }
      } else {
        // If value is null or empty, initialize with default structure
        setPageContactConfig(initialPageContactConfig);
        setEditPageContactConfig(initialPageContactConfig);
      }
    } else {
      // If no config found, initialize with default structure
      setPageContactConfig(initialPageContactConfig);
      setEditPageContactConfig(initialPageContactConfig);
    }
  }, [pageConfigData]);

  const handleEdit = () => {
    if (!canManage) {
      toast.error("Bạn không có quyền chỉnh sửa thông tin liên hệ");
      return;
    }

    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditPageContactConfig(pageContactConfig);
    setNewLocationIds(new Set());
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!canManage) {
      toast.error("Bạn không có quyền lưu thay đổi");
      return;
    }

    if (!configId) {
      toast.error("Không tìm thấy cấu hình liên hệ");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: configId,
        data: {
          key: "CONTACT",
          value: JSON.stringify(editPageContactConfig),
          is_active: true,
        },
      });

        setPageContactConfig(editPageContactConfig);
        setNewLocationIds(new Set());
      setIsEditing(false);
      toast.success("Cập nhật thông tin liên hệ thành công");
      refetch();
    } catch (error) {
      console.error("Error updating contact data:", error);
      toast.error("Có lỗi xảy ra khi cập nhật thông tin liên hệ");
    }
  };

  const handleLocationInputChange = (
    locationId: string,
    field: keyof LocationData,
    value: string,
  ) => {
    const canEditField = canUpdate || newLocationIds.has(locationId);
    if (!canEditField) return;

    setEditPageContactConfig((prev) => ({
      ...prev,
      locations: prev.locations.map((loc) =>
        loc.id === locationId ? { ...loc, [field]: value } : loc,
      ),
    }));
  };

  const handleAddLocation = () => {
    if (!canCreate) {
      toast.error("Bạn không có quyền thêm địa điểm");
      return;
    }

    const newLocationId = generateId();

    setEditPageContactConfig((prev) => ({
      ...prev,
      locations: [
        ...prev.locations,
        {
          ...defaultLocation,
          id: newLocationId,
          name: `Địa điểm mới ${prev.locations.length + 1}`,
        },
      ],
    }));

    setNewLocationIds((prev) => {
      const next = new Set(prev);
      next.add(newLocationId);
      return next;
    });
  };

  const handleRemoveLocation = (locationId: string) => {
    if (!canDelete) {
      toast.error("Bạn không có quyền xóa địa điểm");
      return;
    }

    setEditPageContactConfig((prev) => ({
      ...prev,
      locations: prev.locations.filter((loc) => loc.id !== locationId),
    }));

    setNewLocationIds((prev) => {
      if (!prev.has(locationId)) return prev;
      const next = new Set(prev);
      next.delete(locationId);
      return next;
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Thông tin Liên hệ
            </CardTitle>
            <CardDescription className="text-base">
              Quản lý thông tin địa chỉ và liên hệ của công ty
            </CardDescription>
          </div>
          {!isEditing ? (
            canManage && (
              <Button onClick={handleEdit} className="gap-2">
                <Edit className="h-4 w-4" />
                Chỉnh sửa
              </Button>
            )
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Hủy
              </Button>
              <Button
                onClick={handleSave}
                className="gap-2"
                disabled={updateMutation.isPending || !canManage}
              >
                <Save className="h-4 w-4" />
                {updateMutation.isPending ? "Đang lưu..." : "Lưu"}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {editPageContactConfig.locations.length === 0 ? (
              <Card className="border-dashed border-2">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MapPin className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Chưa có địa điểm liên hệ
                  </h3>
                  <p className="text-muted-foreground text-center mb-6 max-w-sm">
                    {isEditing
                      ? "Thêm địa điểm để khách hàng có thể tìm thấy bạn dễ dàng hơn."
                      : "Thông tin liên hệ chưa được cập nhật."}
                  </p>
                  {isEditing && canCreate && (
                    <Button onClick={handleAddLocation} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Thêm địa điểm đầu tiên
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {editPageContactConfig.locations.map((location, index) => (
                  <Card
                    key={location.id}
                    className="flex flex-col h-full hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div className="flex-1 mr-2">
                        {isEditing ? (
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                              Tên địa điểm
                            </label>
                            <Input
                              value={location.name}
                              disabled={!canUpdate && !newLocationIds.has(location.id)}
                              onChange={(e) =>
                                handleLocationInputChange(
                                  location.id,
                                  "name",
                                  e.target.value,
                                )
                              }
                              placeholder="VD: Trụ sở chính"
                              className="font-semibold h-9"
                            />
                          </div>
                        ) : (
                          <CardTitle
                            className="text-lg font-bold text-primary truncate"
                            title={location.name}
                          >
                            {location.name || `Địa điểm ${index + 1}`}
                          </CardTitle>
                        )}
                      </div>
                      {isEditing && canDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveLocation(location.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 -mr-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4 pt-2">
                      {/* Address */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          Địa chỉ
                        </div>
                        {isEditing ? (
                          <Input
                            value={location.address}
                            disabled={!canUpdate && !newLocationIds.has(location.id)}
                            onChange={(e) =>
                              handleLocationInputChange(
                                location.id,
                                "address",
                                e.target.value,
                              )
                            }
                            placeholder="Nhập địa chỉ"
                            className="h-9"
                          />
                        ) : (
                          <p className="text-sm pl-6 line-clamp-3">
                            {location.address || "Chưa có thông tin"}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          Số điện thoại
                        </div>
                        {isEditing ? (
                          <Input
                            value={location.phone}
                            disabled={!canUpdate && !newLocationIds.has(location.id)}
                            onChange={(e) =>
                              handleLocationInputChange(
                                location.id,
                                "phone",
                                e.target.value,
                              )
                            }
                            placeholder="Nhập số điện thoại"
                            className="h-9"
                          />
                        ) : (
                          <p className="text-sm pl-6 font-medium">
                            {location.phone || "Chưa có thông tin"}
                          </p>
                        )}
                      </div>

                      {/* Hotline */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <Phone className="h-4 w-4 text-destructive" />
                          Hotline
                        </div>
                        {isEditing ? (
                          <Input
                            value={location.hotline}
                            disabled={!canUpdate && !newLocationIds.has(location.id)}
                            onChange={(e) =>
                              handleLocationInputChange(
                                location.id,
                                "hotline",
                                e.target.value,
                              )
                            }
                            placeholder="Nhập hotline"
                            className="h-9"
                          />
                        ) : (
                          <p className="text-sm pl-6 font-bold text-destructive">
                            {location.hotline || "Chưa có thông tin"}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          Email
                        </div>
                        {isEditing ? (
                          <Input
                            type="email"
                            value={location.email}
                            disabled={!canUpdate && !newLocationIds.has(location.id)}
                            onChange={(e) =>
                              handleLocationInputChange(
                                location.id,
                                "email",
                                e.target.value,
                              )
                            }
                            placeholder="Nhập email"
                            className="h-9"
                          />
                        ) : (
                          <p className="text-sm pl-6 text-blue-600 hover:underline cursor-pointer truncate">
                            {location.email || "Chưa có thông tin"}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {isEditing && canCreate && (
                  <Button
                    onClick={handleAddLocation}
                    variant="outline"
                    className="h-full min-h-[300px] border-dashed border-2 flex flex-col gap-4 hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <span className="font-semibold text-lg">Thêm địa điểm</span>
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
