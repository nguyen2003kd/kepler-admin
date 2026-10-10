"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetApiV10Property,
  usePostApiV10Property,
  usePutApiV10PropertyId,
} from "@/api/endpoints/property";
import type { Property } from "@/api/models/property";
import type { PropertyMutate } from "@/api/models/propertyMutate";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ImagePicker,
  type ImagePickerFile,
} from "@/components/shared/image-picker";
import { useAbility } from "@/hooks/use-ability";
import { extractErrorMessage } from "@/utils/error";

const groups = [
  ["SALE", "Mua và bán"],
  ["RENT", "Thuê và cho thuê"],
  ["DISTRIBUTION", "Dự án phân phối"],
  ["INVESTMENT", "Dự án kêu gọi đầu tư"],
  ["MA", "Dự án cần M&A"],
] as const;
const units = [
  ["VND", "đồng"],
  ["VND_MONTH", "đồng/tháng"],
  ["VND_M2", "đồng/m²"],
  ["VND_M2_MONTH", "đồng/m²/tháng"],
  ["USD", "USD"],
  ["USD_MONTH", "USD/tháng"],
  ["USD_M2", "USD/m²"],
  ["USD_M2_MONTH", "USD/m²/tháng"],
] as const;
type Draft = PropertyMutate & { id?: string };
const blank: Draft = {
  title: "",
  transaction_group: "SALE",
  status: "DRAFT",
  price_unit: "VND",
  media_file_ids: [],
};
const clientDomain =
  process.env.NEXT_PUBLIC_CLIENT_DOMAIN ||
  (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");
const mutateFields = [
  "title",
  "transaction_group",
  "location",
  "architecture",
  "price_unit",
  "status",
  "media_file_ids",
  "description",
  "category",
  "direction",
  "floors",
  "toilets",
  "street_frontage",
  "living_rooms",
  "bedrooms",
  "legal",
  "file_id",
  "analysis",
  "price",
  "phone_sale",
] as const;
export default function PropertyPage() {
  const ability = useAbility();
  const canCreate =
    ability.can("create", "property") ||
    ability.can("create_post_info", "news");
  const canUpdate =
    ability.can("update", "property") || ability.can("update", "news");
  const [page, setPage] = useState(1);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [picker, setPicker] = useState<"cover" | "image" | "video" | null>(
    null,
  );
  const [media, setMedia] = useState<ImagePickerFile[]>([]);
  const cache = useQueryClient();
  const list = useGetApiV10Property({ scope: "ADMIN", page, pageSize: 12 });
  const create = usePostApiV10Property();
  const update = usePutApiV10PropertyId();
  const busy = create.isPending || update.isPending;
  const rows = list.data?.responseData?.rows || [];
  const count = list.data?.responseData?.count || 0;
  function open(property?: Property) {
    setDraft(
      property
        ? { ...property, media_file_ids: property.media_file_ids || [] }
        : { ...blank },
    );
    setMedia(
      (property?.media || []).map((f) => ({
        id: f.id!,
        path: f.path || "",
        name: f.name || "",
        mime: f.mime || "",
        size: String(f.size || 0),
      })),
    );
    setError("");
    setNotice("");
  }
  const change = (key: keyof PropertyMutate, value: unknown) =>
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;
    setError("");
    setNotice("");
    if (draft.status === "PUBLISHED" && !draft.title?.trim()) {
      setError("Điền tên sản phẩm trước khi hiển thị.");
      return;
    }
    const { id } = draft;
    const data = Object.fromEntries(
      mutateFields
        .filter((key) => draft[key] !== undefined)
        .map((key) => [key, draft[key]]),
    ) as PropertyMutate;
    try {
      if (id) await update.mutateAsync({ id, data });
      else await create.mutateAsync({ data });
      await cache.invalidateQueries({ queryKey: ["/api/v1.0/property"] });
      setDraft(null);
      setNotice("Đã lưu sản phẩm. Bản nháp chỉ hiển thị trong admin.");
    } catch (e) {
      setError(extractErrorMessage(e));
    }
  }
  function selectFile(file: ImagePickerFile) {
    if (!draft) return;
    if (
      picker !== "cover" &&
      !draft.media_file_ids?.includes(file.id) &&
      (draft.media_file_ids?.length || 0) >= 20
    ) {
      setError("Chỉ chọn tối đa 20 ảnh/video. Bỏ bớt một mục trước khi thêm.");
      setPicker(null);
      return;
    }
    if (picker === "cover") change("file_id", file.id);
    else
      change("media_file_ids", [
        ...new Set([...(draft.media_file_ids || []), file.id]),
      ]);
    setMedia((existing) => [
      ...existing.filter((item) => item.id !== file.id),
      file,
    ]);
    setPicker(null);
  }
  const fields = (
    items: Array<[keyof PropertyMutate, string, "text" | "number" | "tel"]>,
  ) =>
    items.map(([key, label, type]) => (
      <label key={key} className="block space-y-2 text-sm font-medium">
        {label}
        <Input
          name={key}
          type={type}
          min={type === "number" ? 0 : undefined}
          step={key === "price" ? "0.01" : "1"}
          maxLength={
            type !== "number"
              ? key === "location"
                ? 500
                : key === "legal"
                  ? 255
                  : key === "phone_sale"
                    ? 20
                    : 255
              : undefined
          }
          value={String(draft?.[key] ?? "")}
          onChange={(e) =>
            change(
              key,
              type === "number"
                ? e.target.value === ""
                  ? null
                  : Number(e.target.value)
                : e.target.value,
            )
          }
          className="min-h-11"
        />
      </label>
    ));
  return (
    <>
      <Header title="Sản phẩm Sàn giao dịch" />
      <main className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Sản phẩm Sàn giao dịch</h1>
            <p className="mt-2 text-gray-600">
              Nhập sản phẩm vào đúng nhóm. Lưu nháp khi thông tin chưa sẵn sàng.
            </p>
          </div>
          {canCreate && (
            <Button onClick={() => open()} className="min-h-11">
              Thêm sản phẩm
            </Button>
          )}
        </div>
        {notice && (
          <p
            role="status"
            className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800"
          >
            {notice}
          </p>
        )}
        {draft ? (
          <form
            onSubmit={save}
            className="space-y-6 rounded-xl border bg-white p-5 md:p-8"
          >
            <h2 className="text-xl font-bold">
              {draft.id ? "Sửa sản phẩm" : "Thêm sản phẩm"}
            </h2>
            {error && (
              <p
                role="alert"
                className="rounded border border-red-200 bg-red-50 p-4 text-red-800"
              >
                {error} Kiểm tra thông tin rồi lưu lại.
              </p>
            )}
            <fieldset className="grid gap-5 sm:grid-cols-2">
              <legend className="mb-4 text-lg font-semibold">
                Thông tin chung
              </legend>
              {fields([["title", "Tên sản phẩm", "text"]])}
              <label className="space-y-2 text-sm font-medium">
                Nhóm giao dịch
                <select
                  name="transaction_group"
                  className="block min-h-11 w-full rounded-md border px-3"
                  value={draft.transaction_group || "SALE"}
                  onChange={(e) => change("transaction_group", e.target.value)}
                >
                  {groups.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              {fields([
                ["category", "Loại bất động sản (nhà phố, căn hộ…)", "text"],
                ["location", "Vị trí", "text"],
              ])}
            </fieldset>
            <label className="block space-y-2 font-medium">
              Mô tả / Vị trí
              <Textarea
                name="description"
                maxLength={20000}
                rows={5}
                value={draft.description || ""}
                onChange={(e) => change("description", e.target.value)}
              />
            </label>
            <fieldset className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <legend className="mb-4 text-lg font-semibold">
                Kiến trúc và thông số
              </legend>
              {fields([
                ["direction", "Hướng nhà", "text"],
                ["street_frontage", "Mặt tiền đường", "text"],
                ["floors", "Số tầng", "number"],
                ["bedrooms", "Phòng ngủ", "number"],
                ["living_rooms", "Phòng khách", "number"],
                ["toilets", "Phòng vệ sinh", "number"],
              ])}
            </fieldset>
            <label className="block space-y-2 font-medium">
              Kiến trúc / Tiện ích
              <Textarea
                name="architecture"
                maxLength={20000}
                rows={4}
                value={draft.architecture || ""}
                onChange={(e) => change("architecture", e.target.value)}
              />
            </label>
            {fields([
              [
                "legal",
                "Pháp lý — chỉ nhập thông tin đã được cung cấp",
                "text",
              ],
            ])}
            <fieldset className="space-y-4">
              <legend className="mb-4 text-lg font-semibold">
                Hình ảnh / Video
              </legend>
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPicker("cover")}
                >
                  Chọn ảnh đại diện
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPicker("image")}
                >
                  Thêm ảnh
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPicker("video")}
                >
                  Thêm video
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                Chọn từ kho đang có; tối đa 20 ảnh/video. Không cần tải lại ảnh
                đã có.
              </p>
              {[draft.file_id, ...(draft.media_file_ids || [])]
                .filter((id, index, ids) => id && ids.indexOf(id) === index)
                .map((id) => (
                  <div
                    key={id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded border p-3"
                  >
                    <span className="min-w-0 break-all">
                      {media.find((f) => f.id === id)?.name || id}
                      {draft.file_id === id ? " — ảnh đại diện" : ""}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (draft.file_id === id) change("file_id", null);
                        change(
                          "media_file_ids",
                          (draft.media_file_ids || []).filter(
                            (value) => value !== id,
                          ),
                        );
                      }}
                    >
                      Bỏ chọn
                    </Button>
                  </div>
                ))}
            </fieldset>
            <label className="block space-y-2 font-medium">
              Phân tích / Xác thực
              <Textarea
                name="analysis"
                maxLength={20000}
                rows={4}
                value={draft.analysis || ""}
                onChange={(e) => change("analysis", e.target.value)}
              />
            </label>
            <fieldset className="grid gap-5 sm:grid-cols-2">
              <legend className="mb-4 text-lg font-semibold">
                Giá và người phụ trách
              </legend>
              {fields([["price", "Giá (để trống nếu chưa công bố)", "number"]])}
              <label className="space-y-2 text-sm font-medium">
                Đơn vị giá
                <select
                  name="price_unit"
                  className="block min-h-11 w-full rounded-md border px-3"
                  value={draft.price_unit || "VND"}
                  onChange={(e) => change("price_unit", e.target.value)}
                >
                  {units.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              {fields([["phone_sale", "Số điện thoại sale", "tel"]])}
              <label className="space-y-2 text-sm font-medium">
                Hiển thị
                <select
                  name="status"
                  className="block min-h-11 w-full rounded-md border px-3"
                  value={draft.status || "DRAFT"}
                  onChange={(e) => change("status", e.target.value)}
                >
                  <option value="DRAFT">Bản nháp — chỉ admin thấy</option>
                  <option value="PUBLISHED">Hiển thị trên website</option>
                </select>
              </label>
            </fieldset>
            <div className="flex gap-3">
              <Button
                disabled={busy || !(draft.id ? canUpdate : canCreate)}
                type="submit"
                className="min-h-11"
              >
                {busy ? "Đang lưu…" : "Lưu sản phẩm"}
              </Button>
              <Button
                disabled={busy}
                variant="outline"
                type="button"
                onClick={() => setDraft(null)}
              >
                Hủy
              </Button>
            </div>
          </form>
        ) : (
          <>
            {list.isLoading ? (
              <p role="status">Đang tải sản phẩm…</p>
            ) : list.isError ? (
              <div role="alert" className="rounded border p-4">
                Không tải được sản phẩm.{" "}
                <Button variant="outline" onClick={() => list.refetch()}>
                  Thử lại
                </Button>
              </div>
            ) : rows.length === 0 ? (
              <p className="rounded-lg border bg-white p-6">
                Chưa có sản phẩm. Bấm “Thêm sản phẩm” để nhập.
              </p>
            ) : (
              <div className="space-y-3">
                {rows.map((property) => (
                  <article
                    key={property.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-white p-5"
                  >
                    <div>
                  <h2 className="break-words font-bold">
                        {property.title || "Sản phẩm chưa đặt tên"}
                      </h2>
                      <p className="mt-2 text-sm text-gray-600">
                        {groups.find(
                          ([value]) => value === property.transaction_group,
                        )?.[1] || "Chưa chọn nhóm"}{" "}
                        ·{" "}
                        {property.status === "PUBLISHED"
                          ? "Đang hiển thị"
                          : "Bản nháp"}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      {property.status === "PUBLISHED" && clientDomain && (
                        <a
                          className="inline-flex min-h-11 items-center px-3 text-primary underline"
                          target="_blank"
                          rel="noreferrer"
                          href={`${clientDomain.replace(/\/$/, "")}/san-giao-dich/san-pham/${property.id}`}
                        >
                          Xem trên web
                        </a>
                      )}
                      {canUpdate && (
                        <Button
                          variant="outline"
                          onClick={() => open(property)}
                        >
                          Sửa
                        </Button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((value) => value - 1)}
              >
                Trước
              </Button>
              <span>
                Trang {page} · {count} sản phẩm
              </span>
              <Button
                variant="outline"
                disabled={page * 12 >= count}
                onClick={() => setPage((value) => value + 1)}
              >
                Tiếp
              </Button>
            </div>
          </>
        )}
        <ImagePicker
          isOpen={!!picker}
          onClose={() => setPicker(null)}
          onSelect={selectFile}
          type={picker === "video" ? "video" : "image"}
        />
      </main>
    </>
  );
}
