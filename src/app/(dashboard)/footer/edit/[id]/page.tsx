"use client";

import { useGetApiV10FooterId } from "@/api/endpoints/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FooterMutate } from "@/api/models/footerMutate";
import type { FooterMutateLinksItem } from "@/api/models/footerMutateLinksItem";
import { toast } from "@/components/ui/toaster";
import { extractErrorMessage } from "@/utils/error";
import {
  ArrowLeft,
  Building2,
  Globe,
  Link2,
  Loader2,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFooterForm, useFooterMutations } from "../../hooks";
import { useAbility } from "@/hooks/use-ability";

export default function EditFooterPage({ params }: { params: { id: string } }) {
  const ability = useAbility();
  const canUpdateSystem = ability.can("update_system", "footer");
  const canUpdateBasicInfo = ability.can("update_basic_info", "footer");
  const canUpdateAddress = ability.can("update_address", "footer");
  const canUpdateSocial = ability.can("update_social", "footer");
  const canUpdateLinks = ability.can("update_links", "footer");
  // update_system is treated as permission for the Basic Info block.
  const canEditBasicInfo = canUpdateSystem || canUpdateBasicInfo;
  const canEditAny = canEditBasicInfo || canUpdateAddress || canUpdateSocial || canUpdateLinks;

  const { id } = params;
  const router = useRouter();
  const { data: footerData, isLoading } = useGetApiV10FooterId(id);
  const { updateMutation, invalidateFooters } = useFooterMutations();

  const {
    formData,
    setFormData,
    addresses,
    setAddresses,
    socialLinks,
    setSocialLinks,
    links,
    setLinks,
    handleAddAddress,
    handleRemoveAddress,
    handleAddressChange,
    handleAddLink,
    handleRemoveLink,
    handleLinkChange,
    getSubmitData,
  } = useFooterForm();

  useEffect(() => {
    if (footerData?.responseData) {
      const footer = footerData.responseData;
      setFormData({
        description: footer.description || "",
        sub_description: footer.sub_description || "",
        phone: footer.phone || "",
        email: footer.email || "",
        online_visitors: footer.online_visitors || 0,
        total_views:
          typeof footer.total_views === "string"
            ? parseInt(footer.total_views) || 0
            : footer.total_views || 0,
        is_active: true,
      });

      if (footer.address && footer.address.length > 0) {
        setAddresses(
          footer.address.map((addr) => ({
            title: addr.title || "",
            location: addr.location || "",
          })),
        );
      }

      if (footer.social_links) {
        const linksData = footer.social_links as Record<string, string>;
        setSocialLinks({
          facebook: linksData.facebook || "",
          twitter: linksData.twitter || "",
          linkedin: linksData.linkedin || "",
          instagram: linksData.instagram || "",
        });
      }

      if (footer.links && footer.links.length > 0) {
        setLinks(
          footer.links.map((l) => ({
            link: (l as unknown as { link: string; title: string }).link || "",
            title: (l as unknown as { link: string; title: string }).title || "",
          })),
        );
      }
    }
  }, [footerData, setFormData, setAddresses, setSocialLinks, setLinks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canEditAny) {
      toast.error({
        title: "Không có quyền",
        content: "Bạn không có quyền cập nhật footer",
      });
      return;
    }

    const existingFooter = footerData?.responseData;
    if (!existingFooter) {
      toast.error({
        title: "Không tìm thấy dữ liệu",
        content: "Không thể cập nhật footer này",
      });
      return;
    }

    const submitData = getSubmitData();

    const payload: FooterMutate = {
      description: canEditBasicInfo
        ? submitData.description
        : existingFooter.description,
      sub_description: canEditBasicInfo
        ? submitData.sub_description
        : existingFooter.sub_description,
      phone: canEditBasicInfo ? submitData.phone : existingFooter.phone,
      email: canEditBasicInfo ? submitData.email : existingFooter.email,
      online_visitors: canEditBasicInfo
        ? submitData.online_visitors
        : existingFooter.online_visitors,
      total_views: canEditBasicInfo
        ? submitData.total_views
        : existingFooter.total_views,
      is_active: existingFooter.is_active,
      address: canUpdateAddress ? submitData.address : existingFooter.address,
      social_links: canUpdateSocial
        ? submitData.social_links
        : existingFooter.social_links,
      links: canUpdateLinks ? submitData.links as FooterMutateLinksItem[] : existingFooter.links as FooterMutateLinksItem[],
    };

    try {
      await updateMutation.mutateAsync({
        id,
        data: payload,
      });

      toast.success({
        title: "Thành công",
        content: "Đã cập nhật footer",
      });

      invalidateFooters();
      router.push("/footer");
    } catch (error) {
      const msg = extractErrorMessage(error);
      toast.error({ title: "Cập nhật thất bại", content: msg });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!footerData?.responseData) {
    return (
      <div className="p-6">
        <Card className="p-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">
              Không tìm thấy footer
            </h3>
            <p className="text-muted-foreground mb-4">
              Footer này không tồn tại hoặc đã bị xóa
            </p>
            <Link href="/footer">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại danh sách
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Header Card */}
      <Card>
        <div className="p-6 border-b">
          <div className="flex items-center justify-between px-2">
            <div>
              <h1 className="text-2xl font-bold">Chỉnh sửa Footer</h1>
              <p className="text-base text-muted-foreground mt-1">
                Cập nhật thông tin footer cho website
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="px-6 py-5">
        <form id="footer-form" onSubmit={handleSubmit} className="space-y-4">
          {/* Main Form Card */}
          <Card>
            <div className="p-5 space-y-8">
              {/* Basic Info Section */}
              {canEditBasicInfo && (
                <div>
                <div className="flex items-center gap-3 mb-6 pb-3 border-b">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Thông tin cơ bản</h3>
                    <p className="text-sm text-muted-foreground">
                      Nhập thông tin chung của footer
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Mô tả *</Label>
                    <Input
                      id="description"
                      required
                      value={formData.description || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Công ty TNHH..."
                      className="bg-gray-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sub_description">Mô tả phụ</Label>
                    <Textarea
                      id="sub_description"
                      value={formData.sub_description || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sub_description: e.target.value,
                        })
                      }
                      placeholder="Chuyên cung cấp..."
                      rows={3}
                      className="bg-gray-50"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại *</Label>
                      <Input
                        id="phone"
                        required
                        value={formData.phone || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+84 123 456 789"
                        className="bg-gray-50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="contact@example.com"
                        className="bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="online_visitors">Số người online</Label>
                      <Input
                        id="online_visitors"
                        type="number"
                        min="0"
                        value={formData.online_visitors ?? 0}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            online_visitors: parseInt(e.target.value) || 0,
                          })
                        }
                        className="bg-gray-50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="total_views">Tổng lượt xem</Label>
                      <Input
                        id="total_views"
                        type="number"
                        min="0"
                        value={
                          typeof formData.total_views === "number"
                            ? formData.total_views
                            : 0
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            total_views: parseInt(e.target.value) || 0,
                          })
                        }
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
                </div>
              )}

              {canUpdateAddress && (
                <div className="border-t pt-8">
                {/* Addresses Section */}
                <div>
                  <div className="flex items-center justify-between mb-6 pb-3 border-b">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Địa chỉ</h3>
                        <p className="text-sm text-muted-foreground">
                          Quản lý các địa chỉ của công ty
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddAddress}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm địa chỉ
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {addresses.map((address, index) => (
                      <div
                        key={index}
                        className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between pb-3 border-b">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-md bg-red-50 flex items-center justify-center">
                                <MapPin className="h-4 w-4 text-red-600" />
                              </div>
                              <h4 className="font-semibold text-sm">
                                Địa chỉ {index + 1}
                              </h4>
                            </div>
                            {addresses.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveAddress(index)}
                                className="h-8 w-8 p-0 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Tiêu đề
                              </Label>
                              <Input
                                value={address.title}
                                onChange={(e) =>
                                  handleAddressChange(
                                    index,
                                    "title",
                                    e.target.value,
                                  )
                                }
                                placeholder="Trụ sở chính"
                                className="bg-gray-50"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Địa chỉ
                              </Label>
                              <Input
                                value={address.location}
                                onChange={(e) =>
                                  handleAddressChange(
                                    index,
                                    "location",
                                    e.target.value,
                                  )
                                }
                                placeholder="123 Đường ABC..."
                                className="bg-gray-50"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                </div>
              )}

              {canUpdateSocial && (
                <div className="border-t pt-8">
                {/* Social Links Section */}
                <div>
                  <div className="flex items-center gap-3 mb-6 pb-3 border-b">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Mạng xã hội</h3>
                      <p className="text-sm text-muted-foreground">
                        Liên kết các trang mạng xã hội
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Facebook</Label>
                      <Input
                        value={socialLinks.facebook}
                        onChange={(e) =>
                          setSocialLinks({
                            ...socialLinks,
                            facebook: e.target.value,
                          })
                        }
                        placeholder="https://facebook.com/..."
                        className="bg-gray-50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Twitter</Label>
                      <Input
                        value={socialLinks.twitter}
                        onChange={(e) =>
                          setSocialLinks({
                            ...socialLinks,
                            twitter: e.target.value,
                          })
                        }
                        placeholder="https://twitter.com/..."
                        className="bg-gray-50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>LinkedIn</Label>
                      <Input
                        value={socialLinks.linkedin}
                        onChange={(e) =>
                          setSocialLinks({
                            ...socialLinks,
                            linkedin: e.target.value,
                          })
                        }
                        placeholder="https://linkedin.com/..."
                        className="bg-gray-50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Instagram</Label>
                      <Input
                        value={socialLinks.instagram}
                        onChange={(e) =>
                          setSocialLinks({
                            ...socialLinks,
                            instagram: e.target.value,
                          })
                        }
                        placeholder="https://instagram.com/..."
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
                </div>
              )}

              {canUpdateLinks && (
                <div className="border-t pt-8">
                {/* Links Section */}
                <div>
                  <div className="flex items-center justify-between mb-6 pb-3 border-b">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center">
                        <Link2 className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Liên kết</h3>
                        <p className="text-sm text-muted-foreground">
                          Các liên kết website bổ sung
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddLink}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm liên kết
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {links.map((link, index) => (
                      <div
                        key={index}
                        className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between pb-3 border-b">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-md bg-purple-50 flex items-center justify-center">
                                <Link2 className="h-4 w-4 text-purple-600" />
                              </div>
                              <h4 className="font-semibold text-sm">
                                Liên kết {index + 1}
                              </h4>
                            </div>
                            {links.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveLink(index)}
                                className="h-8 w-8 p-0 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Tiêu đề
                              </Label>
                              <Input
                                value={link.title}
                                onChange={(e) =>
                                  handleLinkChange(
                                    index,
                                    "title",
                                    e.target.value,
                                  )
                                }
                                placeholder="Sở Khoa học và Công nghệ"
                                className="bg-gray-50"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Đường dẫn (URL)
                              </Label>
                              <Input
                                value={link.link}
                                onChange={(e) =>
                                  handleLinkChange(
                                    index,
                                    "link",
                                    e.target.value,
                                  )
                                }
                                placeholder="https://example.com"
                                className="bg-gray-50"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                </div>
              )}
            </div>
          </Card>
        </form>
      </div>

      {/* Action Buttons */}
      <div className="sticky bottom-0 left-0 right-0 z-10 bg-background border-t shadow-lg">
        <div className="p-6">
          <div className="flex justify-end gap-3">
            <Link href="/footer">
              <Button type="button" variant="outline">
                Hủy
              </Button>
            </Link>
            <Button
              type="submit"
              form="footer-form"
              disabled={updateMutation.isPending || !canEditAny}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {updateMutation.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Cập nhật Footer
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
