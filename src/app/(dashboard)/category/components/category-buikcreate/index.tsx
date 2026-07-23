"use client";

import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import { UploadCloud } from "lucide-react";
import {
  usePostApiV10CategoryBulk,
  getGetApiV10CategoryQueryKey,
} from "@/api/endpoints/category";
import { toast } from "@/components/ui/toaster";
import { extractErrorMessage } from "@/utils/error";
import { generateCategoryLink } from "@/utils/slug";
import type { CategoryBulkItem } from "@/api/models";
// import Can from '@/acl/Can';
export const CategoryBulkCreate: React.FC = () => {
  const queryClient = useQueryClient();
  const postBulk = usePostApiV10CategoryBulk();
  const [open, setOpen] = React.useState(false);
  // Draft UI state: array of top-level categories with optional nested children
  type Draft = Partial<CategoryBulkItem> & {
    is_service?: boolean | null;
    categories?: Draft[];
  };

  const [items, setItems] = React.useState<Draft[]>([
    {
      name: "",
      code: "",
      position: 0,
      note: "",
      description: "",
      link: "",
      is_service: false,
      categories: [],
    },
  ]);

  const addItem = () =>
    setItems((s) => [
      ...s,
      {
        name: "",
        code: "",
        position: 0,
        note: "",
        description: "",
        link: "",
        is_service: false,
        categories: [],
      },
    ]);
  const removeItem = (idx: number) =>
    setItems((s) => s.filter((_, i) => i !== idx));

  const updateField = (
    idx: number,
    field: keyof Draft,
    value: Draft[keyof Draft],
  ) => {
    setItems((s) =>
      s.map((it, i) => {
        if (i !== idx) return it;
        // Auto-generate link when name changes
        if (field === "name" && typeof value === "string") {
          return { ...it, name: value, link: generateCategoryLink(value) };
        }
        return { ...it, [field]: value };
      }),
    );
  };

  const addChild = (idx: number) => {
    setItems((s) =>
      s.map((it, i) =>
        i === idx
          ? {
              ...it,
              categories: [
                ...(it.categories || []),
                {
                  name: "",
                  code: "",
                  position: 0,
                  note: "",
                  description: "",
                  link: "",
                  is_service: false,
                  categories: [],
                },
              ],
            }
          : it,
      ),
    );
  };

  const updateChild = (
    idx: number,
    cidx: number,
    field: keyof Draft,
    value: Draft[keyof Draft],
  ) => {
    setItems((s) =>
      s.map((it, i) => {
        if (i !== idx) return it;
        const cats = (it.categories || []).map((c, j) => {
          if (j !== cidx) return c;
          // Auto-generate link when name changes
          if (field === "name" && typeof value === "string") {
            return { ...c, name: value, link: generateCategoryLink(value) };
          }
          return { ...c, [field]: value };
        });
        return { ...it, categories: cats };
      }),
    );
  };

  const removeChild = (idx: number, cidx: number) => {
    setItems((s) =>
      s.map((it, i) =>
        i === idx
          ? {
              ...it,
              categories: (it.categories || []).filter((_, j) => j !== cidx),
            }
          : it,
      ),
    );
  };

  const handleSave = async () => {
    // validate
    const payload = items.map((it) => normalizeDraft(it));
    try {
      await postBulk.mutateAsync({ data: payload });
      await queryClient.invalidateQueries({
        queryKey: getGetApiV10CategoryQueryKey(),
      });
      toast.success({
        title: "Tạo hàng loạt thành công",
        content: "Danh mục đã được tạo.",
      });
      setItems([
        {
          name: "",
          code: "",
          position: 0,
          note: "",
          description: "",
          link: "",
          is_service: false,
          categories: [],
        },
      ]);
      setOpen(false);
    } catch (err) {
      console.error(err);
      const msg = extractErrorMessage(err);
      toast.error({ title: "Tạo thất bại", content: msg });
    }
  };

  const normalizeDraft = (
    d: Draft,
  ): CategoryBulkItem & { is_service?: boolean | null } => {
    return {
      name: String(d.name || ""),
      code: String(d.code ?? ""),
      position:
        typeof d.position === "number" ? d.position : Number(d.position || 0),
      note: d.note ?? null,
      description: d.description ?? null,
      link: d.link ?? null,
      is_service: Boolean(d.is_service),
      categories: (d.categories || []).map(normalizeDraft),
    };
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
          {/* <Can I="create" a="category">
        <Button variant="outline" className="ml-2">
          <UploadCloud className="mr-2 h-4 w-4" /> Thêm nhiều
        </Button>
          </Can> */}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo nhiều danh mục</DialogTitle>
          <DialogDescription>
            Thêm nhiều danh mục cùng lúc. Điền tên và các trường cần thiết. Có
            thể thêm danh mục con cho mỗi mục.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {items.map((it, idx) => (
            <div key={idx} className="border p-3 rounded-md">
              <div className="flex justify-between items-center">
                <div className="font-medium">Danh mục cha</div>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => removeItem(idx)}>
                    Xóa
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                <div>
                  <label
                    htmlFor={`name-${idx}`}
                    className="block text-sm font-medium mb-1"
                  >
                    Tên
                  </label>
                  <input
                    id={`name-${idx}`}
                    className="border rounded p-2 w-full"
                    placeholder="Tên"
                    value={it.name ?? ""}
                    onChange={(e) => updateField(idx, "name", e.target.value)}
                  />
                </div>
                {/* <div>
                  <label htmlFor={`code-${idx}`} className="block text-sm font-medium mb-1">Mã (tùy chọn)</label>
                  <input id={`code-${idx}`} className="border rounded p-2 w-full" placeholder="Mã (tùy chọn)" value={it.code ?? ''} onChange={(e) => updateField(idx, 'code', e.target.value)} />
                </div> */}
                <div>
                  <label
                    htmlFor={`position-${idx}`}
                    className="block text-sm font-medium mb-1"
                  >
                    Vị trí
                  </label>
                  <input
                    id={`position-${idx}`}
                    type="number"
                    className="border rounded p-2 w-full"
                    placeholder="Vị trí"
                    value={String(it.position ?? "")}
                    onChange={(e) =>
                      updateField(idx, "position", Number(e.target.value))
                    }
                  />
                </div>
                <div className="flex justify-center items-center">
                  {/* <label htmlFor={`is-service-${idx}`} className="block text-sm font-medium mb-1">Là dịch vụ</label> */}
                  <div className="flex items-center gap-2 mt-2">
                    {/* <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        id={`is-service-${idx}`} 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={Boolean(it.is_service)} 
                        onChange={(e) => updateField(idx, 'is_service', e.target.checked)} 
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                    <span className="text-sm">Đánh dấu là dịch vụ</span> */}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 mt-2">
                <div>
                  <label
                    htmlFor={`link-${idx}`}
                    className="block text-sm font-medium mb-1"
                  >
                    Link
                  </label>
                  <input
                    id={`link-${idx}`}
                    className="border rounded p-2 w-full"
                    placeholder="Link"
                    value={it.link ?? ""}
                    onChange={(e) => updateField(idx, "link", e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor={`note-${idx}`}
                    className="block text-sm font-medium mb-1"
                  >
                    Ghi chú
                  </label>
                  <input
                    id={`note-${idx}`}
                    className="border rounded p-2 w-full"
                    placeholder="Ghi chú"
                    value={it.note ?? ""}
                    onChange={(e) => updateField(idx, "note", e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor={`desc-${idx}`}
                    className="block text-sm font-medium mb-1"
                  >
                    Mô tả
                  </label>
                  <textarea
                    id={`desc-${idx}`}
                    className="border rounded p-2 w-full"
                    placeholder="Mô tả"
                    value={it.description ?? ""}
                    onChange={(e) =>
                      updateField(idx, "description", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="mt-3">
                <div className="font-medium">Danh mục con</div>
                {(it.categories || []).map((c, cidx) => (
                  <div key={cidx} className="border p-2 rounded mt-2">
                    <div className="flex justify-between items-center">
                      <div>{cidx + 1}</div>
                      <Button
                        variant="ghost"
                        onClick={() => removeChild(idx, cidx)}
                      >
                        Xóa
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                      <div>
                        <label
                          htmlFor={`child-name-${idx}-${cidx}`}
                          className="block text-sm font-medium mb-1"
                        >
                          Tên
                        </label>
                        <input
                          id={`child-name-${idx}-${cidx}`}
                          className="border rounded p-2 w-full"
                          placeholder="Tên"
                          value={c.name ?? ""}
                          onChange={(e) =>
                            updateChild(idx, cidx, "name", e.target.value)
                          }
                        />
                      </div>
                      {/* <div>
                        <label htmlFor={`child-code-${idx}-${cidx}`} className="block text-sm font-medium mb-1">Mã (tùy chọn)</label>
                        <input id={`child-code-${idx}-${cidx}`} className="border rounded p-2 w-full" placeholder="Mã (tùy chọn)" value={c.code ?? ''} onChange={(e) => updateChild(idx, cidx, 'code', e.target.value)} />
                      </div> */}
                      <div>
                        <label
                          htmlFor={`child-pos-${idx}-${cidx}`}
                          className="block text-sm font-medium mb-1"
                        >
                          Vị trí
                        </label>
                        <input
                          id={`child-pos-${idx}-${cidx}`}
                          type="number"
                          className="border rounded p-2 w-full"
                          placeholder="Vị trí"
                          value={String(c.position ?? "")}
                          onChange={(e) =>
                            updateChild(
                              idx,
                              cidx,
                              "position",
                              Number(e.target.value),
                            )
                          }
                        />
                      </div>
                      <div className="flex justify-center items-center">
                        {/* <label htmlFor={`child-is-service-${idx}-${cidx}`} className="block text-sm font-medium mb-1">Dịch vụ</label> */}
                        <div className="flex items-center gap-2 mt-2">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              id={`child-is-service-${idx}-${cidx}`}
                              type="checkbox"
                              className="sr-only peer"
                              checked={Boolean((c as Draft).is_service)}
                              onChange={(e) =>
                                updateChild(
                                  idx,
                                  cidx,
                                  "is_service",
                                  e.target.checked,
                                )
                              }
                            />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                          <span className="text-sm">Đánh dấu là dịch vụ</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      <div>
                        <label
                          htmlFor={`child-link-${idx}-${cidx}`}
                          className="block text-sm font-medium mb-1"
                        >
                          Link
                        </label>
                        <input
                          id={`child-link-${idx}-${cidx}`}
                          className="border rounded p-2 w-full"
                          placeholder="Link"
                          value={c.link ?? ""}
                          onChange={(e) =>
                            updateChild(idx, cidx, "link", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`child-note-${idx}-${cidx}`}
                          className="block text-sm font-medium mb-1"
                        >
                          Ghi chú
                        </label>
                        <input
                          id={`child-note-${idx}-${cidx}`}
                          className="border rounded p-2 w-full"
                          placeholder="Ghi chú"
                          value={c.note ?? ""}
                          onChange={(e) =>
                            updateChild(idx, cidx, "note", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`child-desc-${idx}-${cidx}`}
                          className="block text-sm font-medium mb-1"
                        >
                          Mô tả
                        </label>
                        <textarea
                          id={`child-desc-${idx}-${cidx}`}
                          className="border rounded p-2 w-full"
                          placeholder="Mô tả"
                          value={c.description ?? ""}
                          onChange={(e) =>
                            updateChild(
                              idx,
                              cidx,
                              "description",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-2">
                  <Button variant="outline" onClick={() => addChild(idx)}>
                    Thêm con
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex gap-2">
            <Button variant="outline" onClick={addItem}>
              Thêm mục
            </Button>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="ghost"
              onClick={() => {
                setItems([
                  {
                    name: "",
                    code: "",
                    position: 0,
                    note: "",
                    description: "",
                    link: "",
                    is_service: false,
                    categories: [],
                  },
                ]);
                setOpen(false);
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={postBulk.isPending}>
              {postBulk.isPending ? "Đang gửi..." : "Gửi"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryBulkCreate;
