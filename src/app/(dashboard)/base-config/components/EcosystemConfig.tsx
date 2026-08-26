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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Save,
  Loader2,
  Image as ImageIcon,
  Plus,
  Trash2,
  Building2,
  X,
  AlertCircle,
} from "lucide-react";
import {
  useGetApiV10PageConfig,
  usePutApiV10PageConfigId,
  usePostApiV10PageConfig,
} from "@/api/endpoints/page-config";
import { ImagePicker, ImagePickerFile } from "@/components/shared/image-picker";
import { PageConfigMutate } from "@/api/models/pageConfigMutate";
import { toast } from "sonner";

const resolveImageUrl = (path: string): string => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/api/storage/")) return `http://localhost:4100${path}`;
  return path;
};

const ECOSYSTEM_CONFIG_KEY = "ECOSYSTEM_MEMBERS";

interface EcosystemMember {
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  image: string;
  logo: string;
  tags: string[];
  link: string;
  overview?: string;
  industries?: string[];
  products?: string[];
  clients?: string;
}

const defaultMembers: EcosystemMember[] = [
  {
    slug: "kepler-property",
    name: "Kepler Property – KPC Group",
    eyebrow: "Đầu tư & Phát triển",
    description: "Tư vấn đầu tư, môi giới, leasing và phát triển dự án.",
    image: "/images/category-banner-investment.png",
    logo: "",
    tags: ["Tư vấn đầu tư", "Môi giới", "Leasing", "Phát triển dự án"],
    link: "/he-sinh-thai/kepler-property",
    overview: "Kepler Property (KPC Group) là đầu mối chính điều phối hệ sinh thái Kepler, chuyên tư vấn đầu tư, môi giới, phát triển dự án và kinh doanh bất động sản.",
    industries: ["Tư vấn đầu tư BĐS", "Môi giới BĐS", "Phát triển dự án", "Kinh doanh BĐS"],
    products: ["Tư vấn phát triển dự án", "Môi giới mua bán", "Leasing cho thuê", "Phân phối dự án"],
    clients: "Khách hàng cá nhân cao cấp, chủ đầu tư dự án BĐS, quỹ đầu tư, ngân hàng và tổ chức tài chính.",
  },
  {
    slug: "kpc-appraisal",
    name: "Kepler Appraisal - KAC",
    eyebrow: "Thẩm định giá",
    description:
      "Thẩm định bất động sản, máy móc - thiết bị, giá trị doanh nghiệp và dự án.",
    image: "/images/banner-2.jpg",
    logo: "",
    tags: ["Bất động sản", "Máy móc - thiết bị", "Giá trị doanh nghiệp", "Dự án"],
    link: "/he-sinh-thai/kpc-appraisal",
    overview: "Kepler Appraisal (KAC) chuyên thẩm định giá bất động sản, máy móc thiết bị, giá trị doanh nghiệp và tài sản vô hình.",
    industries: ["Thẩm định giá BĐS", "Thẩm định máy móc thiết bị", "Định giá doanh nghiệp", "Định giá tài sản vô hình"],
    products: ["Thẩm định BĐS", "Thẩm định máy móc", "Định giá doanh nghiệp", "Tư vấn giá trị tài sản"],
    clients: "Ngân hàng, quỹ đầu tư, doanh nghiệp M&A, cơ quan nhà nước, khách hàng cá nhân.",
  },
  {
    slug: "kmc-management",
    name: "Kepler Management – KMC",
    eyebrow: "Quản lý & Vận hành",
    description: "Quản lý tòa nhà, tài sản, kỹ thuật, tài chính và vận hành.",
    image: "/images/bg-home.jpg",
    logo: "",
    tags: ["Quản lý tòa nhà", "Quản lý tài sản", "Quản lý kỹ thuật", "Quản lý tài chính"],
    link: "/he-sinh-thai/kmc-management",
    overview: "Kepler Management (KMC) chuyên quản lý, vận hành và khai thác bất động sản, tối ưu hóa giá trị tài sản cho chủ sở hữu.",
    industries: ["Quản lý tòa nhà", "Quản lý tài sản", "Vận hành kỹ thuật", "Quản lý tài chính BĐS"],
    products: ["Quản lý tòa nhà", "Quản lý tài sản", "Vận hành kỹ thuật", "Quản lý tài chính"],
    clients: "Chủ sở hữu tòa nhà, chủ đầu tư dự án, doanh nghiệp bất động sản.",
  },
  {
    slug: "kac-advisory",
    name: "Kepler M&A – KMAC",
    eyebrow: "Tài chính & M&A",
    description: "Tư vấn đầu tư, M&A, tái cấu trúc, tài chính và gọi vốn.",
    image: "/images/banner-3.jpg",
    logo: "",
    tags: ["Tư vấn đầu tư", "M&A", "Tái cấu trúc", "Tư vấn tài chính"],
    link: "/he-sinh-thai/kac-advisory",
    overview: "Kepler M&A (KMAC) chuyên tư vấn M&A, tái cấu trúc doanh nghiệp, tư vấn tài chính đầu tư và gọi vốn.",
    industries: ["Tư vấn M&A", "Tái cấu trúc", "Tư vấn tài chính", "Gọi vốn đầu tư"],
    products: ["Tư vấn M&A", "Tái cấu trúc", "Tư vấn tài chính", "Gọi vốn"],
    clients: "Doanh nghiệp M&A, quỹ đầu tư, chủ đầu tư BĐS, ngân hàng.",
  },
  {
    slug: "k-homes",
    name: "Kepler Construction – KCC",
    eyebrow: "Design & Build",
    description: "Thiết kế kiến trúc, nội thất, thi công và cải tạo công trình.",
    image: "/images/image-111.png",
    logo: "",
    tags: ["Thiết kế kiến trúc", "Thiết kế nội thất", "Thi công", "Cải tạo"],
    link: "/he-sinh-thai/k-homes",
    overview: "Kepler Construction (KCC) chuyên thiết kế kiến trúc, nội thất, thi công xây dựng và cải tạo công trình.",
    industries: ["Thiết kế kiến trúc", "Thiết kế nội thất", "Thi công xây dựng", "Cải tạo công trình"],
    products: ["Thiết kế kiến trúc", "Thiết kế nội thất", "Thi công xây dựng", "Cải tạo"],
    clients: "Chủ đầu tư dự án, khách hàng cá nhân, doanh nghiệp xây dựng.",
  },
  {
    slug: "kepler-land",
    name: "Kepler Land – Sàn giao dịch BĐS",
    eyebrow: "Sàn giao dịch BĐS",
    description:
      "Sàn giao dịch bất động sản Kepler Land — kết nối mua bán, cho thuê và đầu tư BĐS minh bạch, hiệu quả.",
    image: "/images/bg-home.jpg",
    logo: "",
    tags: ["Mua bán BĐS", "Cho thuê BĐS", "Đầu tư BĐS", "Tư vấn giao dịch"],
    link: "/he-sinh-thai/kepler-land",
    overview: "Kepler Land là sàn giao dịch bất động sản, kết nối mua bán, cho thuê và đầu tư BĐS minh bạch, hiệu quả.",
    industries: ["Môi giới BĐS", "Phân phối dự án", "Sàn giao dịch BĐS", "Tư vấn giao dịch"],
    products: ["Mua bán nhà lẻ", "Cho thuê BĐS", "Phân phối dự án", "Kêu gọi đầu tư"],
    clients: "Khách hàng cá nhân, chủ đầu tư, nhà đầu tư BĐS.",
  },
];

interface EcosystemConfigData {
  members: EcosystemMember[];
}

const defaultConfig: EcosystemConfigData = {
  members: defaultMembers,
};

interface EcosystemConfigProps {
  canCreate?: boolean;
  canUpdate?: boolean;
}

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export function EcosystemConfig({ canCreate, canUpdate }: EcosystemConfigProps) {
  const { data, isLoading, refetch } = useGetApiV10PageConfig({
    filters: `key==${ECOSYSTEM_CONFIG_KEY}`,
  });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [configId, setConfigId] = useState<string | null>(null);
  const [formData, setFormData] = useState<EcosystemConfigData>(defaultConfig);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [imagePickerTarget, setImagePickerTarget] = useState<{
    memberIndex: number;
    field: "image" | "logo";
  } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const canEdit = canCreate || canUpdate;

  useEffect(() => {
    const rows = data?.responseData?.rows;
    if (rows && rows.length > 0) {
      const viRow = rows.find(
        (r: { language?: string }) => r.language === "vi",
      ) as { id: string; key: string; value: string | null } | undefined;
      const row = viRow || (rows[0] as { id: string; key: string; value: string | null });
      setConfigId(row.id);
      if (row.value) {
        try {
          const parsed = JSON.parse(row.value);
          setFormData({ ...defaultConfig, ...parsed });
        } catch {
          setFormData(defaultConfig);
        }
      }
    } else {
      setConfigId(null);
      setFormData(defaultConfig);
    }
  }, [data]);

  const putMutation = usePutApiV10PageConfigId();
  const postMutation = usePostApiV10PageConfig();

  const validate = (): string | null => {
    for (let i = 0; i < formData.members.length; i++) {
      const m = formData.members[i];
      if (!m.name.trim()) return `Thành viên ${i + 1}: Tên công ty không được để trống`;
      if (!m.slug.trim()) return `Thành viên ${i + 1}: Slug không được để trống`;
    }
    return null;
  };

  const handleSave = async () => {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }
    setSaving(true);
    try {
      const value = JSON.stringify(formData);
      if (configId) {
        await putMutation.mutateAsync({
          id: configId,
          data: {
            key: ECOSYSTEM_CONFIG_KEY,
            value,
            is_active: true,
          } as PageConfigMutate,
        });
      } else {
        await postMutation.mutateAsync({
          data: {
            key: ECOSYSTEM_CONFIG_KEY,
            value,
            is_active: true,
            language: "vi",
          } as PageConfigMutate,
        });
      }
      toast.success("Đã lưu cấu hình Thành viên hệ sinh thái");
      setEditing(false);
      refetch();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Unknown";
      toast.error("Lỗi khi lưu cấu hình: " + msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    const rows = data?.responseData?.rows;
    if (rows && rows.length > 0) {
      const row = rows[0] as { value: string | null };
      if (row.value) {
        try {
          setFormData({ ...defaultConfig, ...JSON.parse(row.value) });
        } catch {
          setFormData(defaultConfig);
        }
      }
    } else {
      setFormData(defaultConfig);
    }
  };

  const handleImageSelect = (file: ImagePickerFile) => {
    if (imagePickerTarget) {
      const { memberIndex, field } = imagePickerTarget;
      setFormData((prev) => {
        const members = [...prev.members];
        members[memberIndex] = {
          ...members[memberIndex],
          [field]: file.path || members[memberIndex][field],
        };
        return { ...prev, members };
      });
    }
    setImagePickerOpen(false);
    setImagePickerTarget(null);
  };

  const addMember = () => {
    setFormData((prev) => ({
      ...prev,
      members: [
        ...prev.members,
        {
          slug: "",
          name: "",
          eyebrow: "",
          description: "",
          image: "",
          logo: "",
          tags: [],
          link: "",
          overview: "",
          industries: [],
          products: [],
          clients: "",
        },
      ],
    }));
  };

  const removeMember = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index),
    }));
    setConfirmDelete(null);
  };

  const updateMember = (index: number, field: keyof EcosystemMember, value: unknown) => {
    setFormData((prev) => {
      const members = [...prev.members];
      members[index] = { ...members[index], [field]: value };
      if (field === "name") {
        const newSlug = slugify(value as string);
        if (!members[index].slug || members[index].slug === slugify(members[index].name)) {
          members[index].slug = newSlug;
          members[index].link = `/he-sinh-thai/${newSlug}`;
        }
      }
      return { ...prev, members };
    });
  };

  const addTag = (memberIndex: number, tag: string) => {
    if (!tag.trim()) return;
    setFormData((prev) => {
      const members = [...prev.members];
      members[memberIndex] = {
        ...members[memberIndex],
        tags: [...members[memberIndex].tags, tag.trim()],
      };
      return { ...prev, members };
    });
  };

  const removeTag = (memberIndex: number, tagIndex: number) => {
    setFormData((prev) => {
      const members = [...prev.members];
      members[memberIndex] = {
        ...members[memberIndex],
        tags: members[memberIndex].tags.filter((_, i) => i !== tagIndex),
      };
      return { ...prev, members };
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <CardTitle>Thành viên hệ sinh thái</CardTitle>
              <CardDescription>
                Cấu hình danh sách công ty thành viên hiển thị trên trang chủ và trang hệ sinh thái
              </CardDescription>
            </div>
          </div>
          {canEdit && !editing && (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              Chỉnh sửa
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {editing ? (
          <>
            {formData.members.map((member, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 p-4 space-y-4 bg-gray-50/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    {member.name || `Thành viên ${index + 1}`}
                  </div>
                  {confirmDelete === index ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-red-600">Xóa?</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMember(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 px-2"
                      >
                        <span className="text-xs">Có</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmDelete(null)}
                        className="h-7 px-2"
                      >
                        <span className="text-xs">Không</span>
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfirmDelete(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Tên công ty <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={member.name}
                      onChange={(e) => updateMember(index, "name", e.target.value)}
                      placeholder="Kepler Property – KPC Group"
                      className={!member.name.trim() ? "border-red-300" : ""}
                    />
                    {!member.name.trim() && (
                      <p className="text-[10px] text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Bắt buộc
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Slug (URL) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={member.slug}
                      onChange={(e) => updateMember(index, "slug", e.target.value)}
                      placeholder="kepler-property"
                      className={!member.slug.trim() ? "border-red-300" : ""}
                    />
                    {!member.slug.trim() && (
                      <p className="text-[10px] text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Bắt buộc
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Eyebrow (nhãn nhỏ)</Label>
                    <Input
                      value={member.eyebrow}
                      onChange={(e) => updateMember(index, "eyebrow", e.target.value)}
                      placeholder="Đầu tư & Phát triển"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Link</Label>
                    <Input
                      value={member.link}
                      onChange={(e) => updateMember(index, "link", e.target.value)}
                      placeholder="/he-sinh-thai/kepler-property"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Mô tả</Label>
                  <Textarea
                    value={member.description}
                    onChange={(e) => updateMember(index, "description", e.target.value)}
                    placeholder="Tư vấn đầu tư, môi giới, leasing..."
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Ảnh đại diện</Label>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-20 rounded-lg border border-gray-200 overflow-hidden bg-white flex items-center justify-center flex-shrink-0 relative">
                        {member.image ? (
                          <img
                            src={resolveImageUrl(member.image)}
                            alt="Preview"
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-gray-300" />
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Input
                          value={member.image}
                          onChange={(e) => updateMember(index, "image", e.target.value)}
                          placeholder="/images/..."
                          className="w-60"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setImagePickerTarget({ memberIndex: index, field: "image" });
                            setImagePickerOpen(true);
                          }}
                        >
                          <ImageIcon className="w-4 h-4 mr-1" /> Chọn ảnh
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Logo</Label>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-20 rounded-lg border border-gray-200 overflow-hidden bg-white flex items-center justify-center flex-shrink-0 relative">
                        {member.logo ? (
                          <img
                            src={resolveImageUrl(member.logo)}
                            alt="Logo preview"
                            className="object-contain w-full h-full"
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-gray-300" />
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Input
                          value={member.logo}
                          onChange={(e) => updateMember(index, "logo", e.target.value)}
                          placeholder="/images/..."
                          className="w-60"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setImagePickerTarget({ memberIndex: index, field: "logo" });
                            setImagePickerOpen(true);
                          }}
                        >
                          <ImageIcon className="w-4 h-4 mr-1" /> Chọn ảnh
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Tags (dịch vụ nổi bật)</Label>
                  <div className="flex flex-wrap gap-2">
                    {member.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="inline-flex items-center gap-1 rounded-full bg-indigo-100 text-indigo-700 px-3 py-1 text-xs font-medium"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index, tagIndex)}
                          className="hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <Input
                    placeholder="Nhập tag rồi nhấn Enter"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const value = (e.target as HTMLInputElement).value;
                        addTag(index, value);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }}
                  />
                </div>

                <div className="space-y-1 border-t pt-4">
                  <Label className="text-xs text-muted-foreground">Sơ lược (Overview)</Label>
                  <Textarea
                    value={member.overview || ""}
                    onChange={(e) => updateMember(index, "overview", e.target.value)}
                    placeholder="Giới thiệu tổng quan về công ty..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Ngành nghề chính (Industries)</Label>
                  <div className="flex flex-wrap gap-2">
                    {(member.industries || []).map((item, itemIndex) => (
                      <span
                        key={itemIndex}
                        className="inline-flex items-center gap-1 rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-xs font-medium"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => {
                              const members = [...prev.members];
                              members[index] = {
                                ...members[index],
                                industries: (members[index].industries || []).filter((_, i) => i !== itemIndex),
                              };
                              return { ...prev, members };
                            });
                          }}
                          className="hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <Input
                    placeholder="Nhập ngành nghề rồi nhấn Enter"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const value = (e.target as HTMLInputElement).value;
                        if (!value.trim()) return;
                        setFormData((prev) => {
                          const members = [...prev.members];
                          members[index] = {
                            ...members[index],
                            industries: [...(members[index].industries || []), value.trim()],
                          };
                          return { ...prev, members };
                        });
                        (e.target as HTMLInputElement).value = "";
                      }
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Sản phẩm tiêu biểu (Products)</Label>
                  <div className="flex flex-wrap gap-2">
                    {(member.products || []).map((item, itemIndex) => (
                      <span
                        key={itemIndex}
                        className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-medium"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => {
                              const members = [...prev.members];
                              members[index] = {
                                ...members[index],
                                products: (members[index].products || []).filter((_, i) => i !== itemIndex),
                              };
                              return { ...prev, members };
                            });
                          }}
                          className="hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <Input
                    placeholder="Nhập sản phẩm rồi nhấn Enter"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const value = (e.target as HTMLInputElement).value;
                        if (!value.trim()) return;
                        setFormData((prev) => {
                          const members = [...prev.members];
                          members[index] = {
                            ...members[index],
                            products: [...(members[index].products || []), value.trim()],
                          };
                          return { ...prev, members };
                        });
                        (e.target as HTMLInputElement).value = "";
                      }
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Đối tác & Khách hàng (Clients)</Label>
                  <Textarea
                    value={member.clients || ""}
                    onChange={(e) => updateMember(index, "clients", e.target.value)}
                    placeholder="Mô tả đối tác và khách hàng tiêu biểu..."
                    rows={2}
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addMember}
              className="w-full border-dashed"
            >
              <Plus className="w-4 h-4 mr-2" /> Thêm thành viên
            </Button>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button variant="outline" onClick={handleCancel} disabled={saving}>
                Hủy
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" /> Lưu
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formData.members.map((member, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-lg border border-gray-100 p-3"
                >
                  <div className="w-16 h-16 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center flex-shrink-0 relative">
                    {member.image ? (
                      <img
                        src={resolveImageUrl(member.image)}
                        alt={member.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.eyebrow}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {member.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {member.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                      {member.tags.length > 3 && (
                        <span className="text-[10px] text-gray-400">
                          +{member.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {imagePickerOpen && (
        <ImagePicker
          isOpen={imagePickerOpen}
          onClose={() => {
            setImagePickerOpen(false);
            setImagePickerTarget(null);
          }}
          onSelect={handleImageSelect}
        />
      )}
    </Card>
  );
}
