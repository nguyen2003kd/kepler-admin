"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2, MapPin, Phone, Save, Plus, Trash2, Loader2, Info,
  ChevronUp, ChevronDown, AlignLeft, LayoutGrid, Heading, Eye, EyeOff,
  GripVertical, Type, CreditCard, Tag, Minus,
} from "lucide-react";
import {
  useGetApiV10PageConfig,
  usePutApiV10PageConfigId,
  usePostApiV10PageConfig,
} from "@/api/endpoints/page-config";
import { RichTextEditor } from "@/components/shared/rich-text-editor";
import { LucideIconPicker, DynamicIcon } from "@/components/shared/lucide-icon-picker";
import { toast } from "sonner";

// ─── Block type union ─────────────────────────────────────────────────────────
type BlockType =
  | "org-header" | "branches"   // composite
  | "heading" | "text-input" | "rich-text"  // text
  | "info-row" | "card-item" | "badge"      // atomic
  | "divider";                              // layout

interface BaseBlock { id: string; type: BlockType; hidden?: boolean; }

// Composite
interface OrgHeaderBlock extends BaseBlock {
  type: "org-header";
  nameVi1: string; nameVi2: string; nameEn: string;
  abbreviation: string; headquarterAddress: string; taxCode: string;
  // English versions
  nameEn1?: string; nameEn2?: string; abbreviationEn?: string; headquarterAddressEn?: string;
}
interface BranchItem {
  id: string; name: string; address: string; phone: string;
  // English versions
  nameEn?: string; addressEn?: string;
}
interface BranchesBlock extends BaseBlock {
  type: "branches"; title: string; titleEn?: string; items: BranchItem[];
}

// Text
interface HeadingBlock extends BaseBlock {
  type: "heading"; text: string; textEn?: string; level: "h1" | "h2" | "h3";
}
interface TextInputBlock extends BaseBlock {
  type: "text-input"; label: string; value: string; labelEn?: string; valueEn?: string;
}
interface RichTextBlock extends BaseBlock { type: "rich-text"; content: string; contentEn?: string; }

// Atomic
interface InfoRowBlock extends BaseBlock {
  type: "info-row"; icon: string; label: string; value: string; labelEn?: string; valueEn?: string;
}
interface CardItemBlock extends BaseBlock {
  type: "card-item"; title: string; subtitle: string; body: string;
  titleEn?: string; subtitleEn?: string; bodyEn?: string;
}
interface BadgeBlock extends BaseBlock {
  type: "badge"; text: string; textEn?: string; color: "cyan" | "white" | "yellow" | "green";
}

// Media / layout
interface DividerBlock extends BaseBlock { type: "divider"; }

type PageBlock =
  | OrgHeaderBlock | BranchesBlock
  | HeadingBlock | TextInputBlock | RichTextBlock
  | InfoRowBlock | CardItemBlock | BadgeBlock
  | DividerBlock;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);
const PAGE_CONFIG_KEY_VI = "introduction-page";
const PAGE_CONFIG_KEY_EN = "introduction-page_en";
interface PageConfigRow { id: string; key: string; value: string; }

// ─── Block library definition ─────────────────────────────────────────────────
interface BlockTemplate {
  type: BlockType; label: string; description: string;
  icon: React.ReactNode; group: "composite" | "text" | "atomic" | "layout";
  create: () => PageBlock;
}

const BLOCK_LIBRARY: BlockTemplate[] = [
  // ── Composite ──
  {
    type: "org-header", group: "composite",
    label: "Thông tin tổ chức", description: "Tên, viết tắt, trụ sở, MST",
    icon: <Building2 className="w-4 h-4 text-blue-600" />,
    create: (): OrgHeaderBlock => ({
      id: generateId(), type: "org-header",
      nameVi1: "KEPLER GROUP",
      nameVi2: "Thẩm định giá, Môi giới & Quản lý Bất động sản",
      nameEn: "KEPLER GROUP — Valuation, Brokerage & Real Estate Management",
      abbreviation: "KEPLER",
      headquarterAddress: "TP. Hồ Chí Minh, Việt Nam",
      taxCode: "",
    }),
  },
  {
    type: "branches", group: "composite",
    label: "Chi nhánh / Văn phòng", description: "Lưới trụ sở, chi nhánh",
    icon: <LayoutGrid className="w-4 h-4 text-green-600" />,
    create: (): BranchesBlock => ({
      id: generateId(), type: "branches",
      title: "Trụ sở / chi nhánh / văn phòng đại diện",
      items: [
        { id: generateId(), name: "Trụ sở 1", address: "Số 263 Điện Biên Phủ, Phường Xuân Hòa, Thành phố Hồ Chí Minh", phone: "028 3930 2733" },
        { id: generateId(), name: "Trụ sở 3", address: "Số 26 Huỳnh Văn Nghệ, Phường Phú Lợi, Thành phố Hồ Chí Minh", phone: "0274 3897 574" },
        { id: generateId(), name: "Trụ sở 4", address: "Số 379 Hà Huy Tập, Phường Bà Rịa, Thành phố Hồ Chí Minh", phone: "0254 3717 636" },
        { id: generateId(), name: "Chi nhánh Cần Thơ", address: "Số F2.67-F2.68 Nguyễn Thị Sáu, Phường Hưng Phú, Thành phố Cần Thơ", phone: "0292. 3918 217" },
        { id: generateId(), name: "VP Miền Trung", address: "Số STH 27.18, Đường 8E, KĐT Lê Hồng Phong II, Nam Nha Trang, Khánh Hòa", phone: "0258. 2465 255" },
      ],
    }),
  },
  // ── Text ──
  {
    type: "heading", group: "text",
    label: "Tiêu đề (Heading)", description: "H1 / H2 / H3",
    icon: <Heading className="w-4 h-4 text-indigo-600" />,
    create: (): HeadingBlock => ({ id: generateId(), type: "heading", text: "Tiêu đề mới", level: "h2" }),
  },
  {
    type: "text-input", group: "text",
    label: "Văn bản ngắn", description: "Label + giá trị 1 dòng",
    icon: <Type className="w-4 h-4 text-sky-600" />,
    create: (): TextInputBlock => ({ id: generateId(), type: "text-input", label: "Nhan", value: "" }),
  },
  {
    type: "rich-text", group: "text",
    label: "Văn bản phong phú", description: "Đoạn văn rich text editor",
    icon: <AlignLeft className="w-4 h-4 text-purple-600" />,
    create: (): RichTextBlock => ({ id: generateId(), type: "rich-text", content: "" }),
  },
  // ── Atomic ──
  {
    type: "info-row", group: "atomic",
    label: "Hàng thông tin", description: "Icon + nhãn + giá trị",
    icon: <DynamicIcon name="Hash" className="w-4 h-4 text-teal-600" />,
    create: (): InfoRowBlock => ({ id: generateId(), type: "info-row", icon: "Building2", label: "Trụ sở chính", value: "" }),
  },
  {
    type: "card-item", group: "atomic",
    label: "Thẻ (Card)", description: "Card có tiêu đề và nội dung",
    icon: <CreditCard className="w-4 h-4 text-orange-600" />,
    create: (): CardItemBlock => ({ id: generateId(), type: "card-item", title: "Tiêu đề thẻ", subtitle: "", body: "" }),
  },
  {
    type: "badge", group: "atomic",
    label: "Nhãn (Badge)", description: "Text nổi bật có màu",
    icon: <Tag className="w-4 h-4 text-yellow-600" />,
    create: (): BadgeBlock => ({ id: generateId(), type: "badge", text: "KEPLER", color: "cyan" }),
  },
  // ── Layout ──
  {
    type: "divider", group: "layout",
    label: "Ngăn cách", description: "Đường kẻ phân chia",
    icon: <Minus className="w-4 h-4 text-gray-400" />,
    create: (): DividerBlock => ({ id: generateId(), type: "divider" }),
  },
];

const GROUPS: { key: BlockTemplate["group"]; label: string }[] = [
  { key: "composite", label: "Tổng hợp" },
  { key: "text",      label: "Văn bản" },
  { key: "atomic",    label: "Phần tử" },
  { key: "layout",    label: "Bố cục" },
];

// ─── ICON MAP for info-row ────────────────────────────────────────────────────
// Dùng DynamicIcon từ lucide-icon-picker thay vì hardcode
function getIcon(name: string, cls = "w-4 h-4") {
  return <DynamicIcon name={name} className={cls} />;
}

// ─── BADGE COLOR MAP ──────────────────────────────────────────────────────────
const BADGE_COLORS: Record<string, string> = {
  cyan:   "bg-cyan-300/20 text-cyan-300 border-cyan-400/30",
  white:  "bg-white/10 text-white border-white/20",
  yellow: "bg-yellow-300/20 text-yellow-300 border-yellow-400/30",
  green:  "bg-green-300/20 text-green-300 border-green-400/30",
};

// ─── BLOCK META (for canvas card header) ─────────────────────────────────────
const BLOCK_META: Record<BlockType, { label: string; color: string; icon: React.ReactNode }> = {
  "org-header": { label: "Thông tin tổ chức",    color: "bg-blue-50 border-blue-200",    icon: <Building2 className="w-4 h-4 text-blue-600" /> },
  branches:     { label: "Chi nhánh / Văn phòng", color: "bg-green-50 border-green-200",  icon: <LayoutGrid className="w-4 h-4 text-green-600" /> },
  heading:      { label: "Tiêu đề",              color: "bg-indigo-50 border-indigo-200", icon: <Heading className="w-4 h-4 text-indigo-600" /> },
  "text-input": { label: "Văn bản ngắn",         color: "bg-sky-50 border-sky-200",       icon: <Type className="w-4 h-4 text-sky-600" /> },
  "rich-text":  { label: "Văn bản phong phú",    color: "bg-purple-50 border-purple-200", icon: <AlignLeft className="w-4 h-4 text-purple-600" /> },
  "info-row":   { label: "Hàng thông tin",       color: "bg-teal-50 border-teal-200",     icon: <DynamicIcon name="Hash" className="w-4 h-4 text-teal-600" /> },
  "card-item":  { label: "Thẻ (Card)",           color: "bg-orange-50 border-orange-200", icon: <CreditCard className="w-4 h-4 text-orange-600" /> },
  badge:        { label: "Nhãn (Badge)",         color: "bg-yellow-50 border-yellow-200", icon: <Tag className="w-4 h-4 text-yellow-600" /> },
  divider:      { label: "Ngăn cách",            color: "bg-gray-50 border-gray-200",     icon: <Minus className="w-4 h-4 text-gray-400" /> },
};

// ─── PREVIEW ──────────────────────────────────────────────────────────────────
function BlockPreview({ block, lang = "vi" }: { block: PageBlock; lang?: "vi" | "en" }) {
  const isEn = lang === "en";
  if (block.hidden) return null;
  switch (block.type) {
    case "org-header": {
      const b = block as OrgHeaderBlock;
      return (
        <div className="text-white space-y-3">
          {isEn ? (
            <>
              <h1 className="text-2xl md:text-3xl font-bold">{b.nameEn1 || b.nameVi1}</h1>
              <h1 className="text-2xl md:text-3xl font-bold">{b.nameEn2 || b.nameVi2}</h1>
            </>
          ) : (
            <>
              <h1 className="text-2xl md:text-3xl font-bold">{b.nameVi1}</h1>
              <h1 className="text-2xl md:text-3xl font-bold">{b.nameVi2}</h1>
            </>
          )}
          <p className="text-sm text-white/90">Tên tiếng Anh đầy đủ: <span className="font-semibold">{b.nameEn}</span></p>
          <p className="text-sm text-white/90">Tên viết tắt: <span className="font-semibold text-cyan-300">{isEn ? (b.abbreviationEn || b.abbreviation) : b.abbreviation}</span></p>
          <div className="grid md:grid-cols-2 gap-3 pt-1">
            <div className="flex items-start gap-2">
              <Building2 className="w-4 h-4 text-cyan-300 mt-0.5 flex-shrink-0" />
              <div><p className="font-semibold text-cyan-300 text-sm">Trụ sở chính:</p><p className="text-white/90 text-sm">{isEn ? (b.headquarterAddressEn || b.headquarterAddress) : b.headquarterAddress}</p></div>
            </div>
            <div className="flex items-start gap-2">
              <Building2 className="w-4 h-4 text-cyan-300 mt-0.5 flex-shrink-0" />
              <div><p className="font-semibold text-cyan-300 text-sm">Mã số thuế:</p><p className="text-white/90 text-sm">{b.taxCode}</p></div>
            </div>
          </div>
        </div>
      );
    }
    case "branches": {
      const b = block as BranchesBlock;
      return (
        <div>
          <h2 className="text-xl font-bold text-white mb-3">{isEn ? (b.titleEn || b.title) : b.title}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {b.items.map((item) => (
              <div key={item.id} className="bg-white/10 border border-white/20 rounded-lg p-3 space-y-1">
                <div className="flex items-center gap-2 text-cyan-300"><MapPin className="w-3 h-3" /><span className="font-semibold text-sm">{isEn ? (item.nameEn || item.name) : item.name}</span></div>
                <p className="text-white/90 text-xs">{isEn ? (item.addressEn || item.address) : item.address}</p>
                <div className="flex items-center gap-2 text-white/80 text-xs"><Phone className="w-3 h-3" /><span>{item.phone}</span></div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    case "heading": {
      const b = block as HeadingBlock;
      const cls = b.level === "h1" ? "text-3xl font-bold text-white" : b.level === "h2" ? "text-2xl font-bold text-white" : "text-xl font-semibold text-white";
      return <p className={cls}>{isEn ? (b.textEn || b.text) : b.text}</p>;
    }
    case "text-input": {
      const b = block as TextInputBlock;
      return <p className="text-sm text-white/90"><span className="font-semibold text-cyan-300">{isEn ? (b.labelEn || b.label) : b.label}: </span>{isEn ? (b.valueEn || b.value) : b.value}</p>;
    }
    case "rich-text": {
      const b = block as RichTextBlock;
      const content = isEn ? (b.contentEn || b.content) : b.content;
      return (
        <div className="text-white/90 text-sm leading-relaxed prose prose-invert max-w-none prose-p:my-1" dangerouslySetInnerHTML={{ __html: content || "<em>Chưa có nội dung</em>" }} />
      );
    }
    case "info-row": {
      const b = block as InfoRowBlock;
      return (
        <div className="flex items-start gap-2">
          <span className="text-cyan-300 mt-0.5 flex-shrink-0">{getIcon(b.icon)}</span>
          <div>
            <p className="font-semibold text-cyan-300 text-sm">{isEn ? (b.labelEn || b.label) : b.label}: {isEn ? (b.valueEn || b.value) : b.value}</p>
          </div>
        </div>
      );
    }
    case "card-item": {
      const b = block as CardItemBlock;
      return (
        <div className="bg-white/10 border border-white/20 rounded-lg p-4 space-y-1">
          <p className="font-semibold text-white">{isEn ? (b.titleEn || b.title) : b.title}</p>
          {(isEn ? (b.subtitleEn || b.subtitle) : b.subtitle) && <p className="text-cyan-300 text-sm">{isEn ? (b.subtitleEn || b.subtitle) : b.subtitle}</p>}
          {(isEn ? (b.bodyEn || b.body) : b.body) && <p className="text-white/80 text-sm">{isEn ? (b.bodyEn || b.body) : b.body}</p>}
        </div>
      );
    }
    case "badge": {
      const b = block as BadgeBlock;
      return (
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${BADGE_COLORS[b.color] ?? BADGE_COLORS.cyan}`}>
          {isEn ? (b.textEn || b.text) : b.text}
        </span>
      );
    }
    case "divider":
      return <hr className="border-white/20" />;
    default:
      return null;
  }
}

// ─── BLOCK EDITORS ────────────────────────────────────────────────────────────

// ── VIETNAMESE EDITORS ──
function OrgHeaderEditorVI({ block, onChange }: { block: OrgHeaderBlock; onChange: (b: OrgHeaderBlock) => void }) {
  const set = (f: keyof OrgHeaderBlock, v: string) => onChange({ ...block, [f]: v });
  return (
    <div className="space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        <div className="space-y-1"><Label className="text-xs text-gray-500">Tên dòng 1</Label><Input value={block.nameVi1} onChange={(e) => set("nameVi1", e.target.value)} /></div>
        <div className="space-y-1"><Label className="text-xs text-gray-500">Tên dòng 2</Label><Input value={block.nameVi2} onChange={(e) => set("nameVi2", e.target.value)} /></div>
      </div>
      <div className="space-y-1"><Label className="text-xs text-gray-500">Tên tiếng Anh đầy đủ</Label><Input value={block.nameEn} onChange={(e) => set("nameEn", e.target.value)} /></div>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="space-y-1"><Label className="text-xs text-gray-500">Tên viết tắt</Label><Input value={block.abbreviation} onChange={(e) => set("abbreviation", e.target.value)} /></div>
        <div className="space-y-1"><Label className="text-xs text-gray-500">Mã số thuế</Label><Input value={block.taxCode} onChange={(e) => set("taxCode", e.target.value)} /></div>
      </div>
      <div className="space-y-1"><Label className="text-xs text-gray-500">Địa chỉ trụ sở chính</Label><Input value={block.headquarterAddress} onChange={(e) => set("headquarterAddress", e.target.value)} /></div>
    </div>
  );
}

function OrgHeaderEditorEN({ block, onChange }: { block: OrgHeaderBlock; onChange: (b: OrgHeaderBlock) => void }) {
  const set = (f: keyof OrgHeaderBlock, v: string) => onChange({ ...block, [f]: v });
  return (
    <div className="space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        <div className="space-y-1"><Label className="text-xs text-gray-500">Name line 1</Label><Input value={block.nameEn1 || ""} onChange={(e) => set("nameEn1", e.target.value)} placeholder="Enter English name" /></div>
        <div className="space-y-1"><Label className="text-xs text-gray-500">Name line 2</Label><Input value={block.nameEn2 || ""} onChange={(e) => set("nameEn2", e.target.value)} placeholder="Enter English name" /></div>
      </div>
      <div className="space-y-1"><Label className="text-xs text-gray-500">Abbreviation (EN)</Label><Input value={block.abbreviationEn || ""} onChange={(e) => set("abbreviationEn", e.target.value)} placeholder="Enter abbreviation" /></div>
      <div className="space-y-1"><Label className="text-xs text-gray-500">Headquarters Address (EN)</Label><Input value={block.headquarterAddressEn || ""} onChange={(e) => set("headquarterAddressEn", e.target.value)} placeholder="Enter English address" /></div>
    </div>
  );
}

function BranchesEditorVI({ block, onChange }: { block: BranchesBlock; onChange: (b: BranchesBlock) => void }) {
  const upd = (id: string, f: keyof BranchItem, v: string) =>
    onChange({ ...block, items: block.items.map((it) => it.id === id ? { ...it, [f]: v } : it) });
  const add = () => onChange({ ...block, items: [...block.items, { id: generateId(), name: "", address: "", phone: "", nameEn: "", addressEn: "" }] });
  const del = (id: string) => onChange({ ...block, items: block.items.filter((it) => it.id !== id) });
  return (
    <div className="space-y-3">
      <div className="space-y-1"><Label className="text-xs text-gray-500">Tiêu đề section</Label><Input value={block.title} onChange={(e) => onChange({ ...block, title: e.target.value })} /></div>
      {block.items.map((item, idx) => (
        <div key={item.id} className="border rounded-lg p-3 bg-gray-50 space-y-2">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs font-semibold text-gray-600">Địa điểm {idx + 1}</Label>
            <Button type="button" size="icon" variant="ghost" className="h-6 w-6 text-red-500 hover:bg-red-50" onClick={() => del(item.id)}><Trash2 className="w-3 h-3" /></Button>
          </div>
          <div className="space-y-1"><Label className="text-xs text-gray-500">Tên</Label><Input value={item.name} placeholder="Trụ sở 1" onChange={(e) => upd(item.id, "name", e.target.value)} className="h-8 text-sm" /></div>
          <div className="space-y-1"><Label className="text-xs text-gray-500">Địa chỉ</Label><Input value={item.address} onChange={(e) => upd(item.id, "address", e.target.value)} className="h-8 text-sm" /></div>
          <div className="space-y-1"><Label className="text-xs text-gray-500">SĐT</Label><Input value={item.phone} onChange={(e) => upd(item.id, "phone", e.target.value)} className="h-8 text-sm" /></div>
        </div>
      ))}
      <Button type="button" size="sm" variant="outline" onClick={add} className="w-full gap-1"><Plus className="w-4 h-4" />Thêm địa điểm</Button>
    </div>
  );
}

function BranchesEditorEN({ block, onChange }: { block: BranchesBlock; onChange: (b: BranchesBlock) => void }) {
  const set = (f: "titleEn", v: string) => onChange({ ...block, [f]: v });
  const upd = (id: string, f: keyof BranchItem, v: string) =>
    onChange({ ...block, items: block.items.map((it) => it.id === id ? { ...it, [f]: v } : it) });
  return (
    <div className="space-y-3">
      <div className="space-y-1"><Label className="text-xs text-gray-500">Section Title</Label><Input value={block.titleEn || ""} onChange={(e) => set("titleEn", e.target.value)} placeholder="Enter English title" /></div>
      {block.items.map((item, idx) => (
        <div key={item.id} className="border rounded-lg p-3 bg-gray-50 space-y-2">
          <Label className="text-xs font-semibold text-gray-600">Location {idx + 1}</Label>
          <div className="space-y-1"><Label className="text-xs text-gray-500">Name</Label><Input value={item.nameEn || ""} onChange={(e) => upd(item.id, "nameEn", e.target.value)} placeholder="Enter English name" className="h-8 text-sm" /></div>
          <div className="space-y-1"><Label className="text-xs text-gray-500">Address</Label><Input value={item.addressEn || ""} onChange={(e) => upd(item.id, "addressEn", e.target.value)} placeholder="Enter English address" className="h-8 text-sm" /></div>
        </div>
      ))}
    </div>
  );
}

function HeadingEditorVI({ block, onChange }: { block: HeadingBlock; onChange: (b: HeadingBlock) => void }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[auto_1fr] gap-3 items-end">
        <div className="space-y-1">
          <Label className="text-xs text-gray-500">Cấp độ</Label>
          <select value={block.level} onChange={(e) => onChange({ ...block, level: e.target.value as HeadingBlock["level"] })} className="h-9 border rounded px-2 text-sm bg-white">
            <option value="h1">H1 - Lớn nhất</option>
            <option value="h2">H2 - Trung bình</option>
            <option value="h3">H3 - Nhỏ</option>
          </select>
        </div>
        <div className="space-y-1"><Label className="text-xs text-gray-500">Nội dung</Label><Input value={block.text} onChange={(e) => onChange({ ...block, text: e.target.value })} /></div>
      </div>
    </div>
  );
}

function HeadingEditorEN({ block, onChange }: { block: HeadingBlock; onChange: (b: HeadingBlock) => void }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-gray-500">Content</Label>
      <Input value={block.textEn || ""} onChange={(e) => onChange({ ...block, textEn: e.target.value })} placeholder="Enter English content" />
    </div>
  );
}

function TextInputEditorVI({ block, onChange }: { block: TextInputBlock; onChange: (b: TextInputBlock) => void }) {
  return (
    <div className="grid md:grid-cols-2 gap-3">
      <div className="space-y-1"><Label className="text-xs text-gray-500">Nhãn</Label><Input value={block.label} onChange={(e) => onChange({ ...block, label: e.target.value })} /></div>
      <div className="space-y-1"><Label className="text-xs text-gray-500">Giá trị</Label><Input value={block.value} onChange={(e) => onChange({ ...block, value: e.target.value })} /></div>
    </div>
  );
}

function TextInputEditorEN({ block, onChange }: { block: TextInputBlock; onChange: (b: TextInputBlock) => void }) {
  return (
    <div className="grid md:grid-cols-2 gap-3">
      <div className="space-y-1"><Label className="text-xs text-gray-500">Label</Label><Input value={block.labelEn || ""} onChange={(e) => onChange({ ...block, labelEn: e.target.value })} placeholder="Enter English label" /></div>
      <div className="space-y-1"><Label className="text-xs text-gray-500">Value</Label><Input value={block.valueEn || ""} onChange={(e) => onChange({ ...block, valueEn: e.target.value })} placeholder="Enter English value" /></div>
    </div>
  );
}

function RichTextEditorVI({ block, onChange }: { block: RichTextBlock; onChange: (b: RichTextBlock) => void }) {
  return <RichTextEditor value={block.content} onChange={(v) => onChange({ ...block, content: v })} placeholder="Nhập nội dung..." />;
}

function RichTextEditorEN({ block, onChange }: { block: RichTextBlock; onChange: (b: RichTextBlock) => void }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-gray-500">Nội dung tiếng Anh</Label>
      <Textarea value={block.contentEn || ""} onChange={(e) => onChange({ ...block, contentEn: e.target.value })} placeholder="Enter English content..." rows={6} className="text-sm" />
    </div>
  );
}

function InfoRowEditorVI({ block, onChange }: { block: InfoRowBlock; onChange: (b: InfoRowBlock) => void }) {
  return (
    <div className="grid grid-cols-[auto_1fr_1fr] gap-3 items-end">
      <div className="space-y-1">
        <Label className="text-xs text-gray-500">Icon</Label>
        <LucideIconPicker value={block.icon} onChange={(name) => onChange({ ...block, icon: name })} />
      </div>
      <div className="space-y-1"><Label className="text-xs text-gray-500">Nhãn</Label><Input value={block.label} onChange={(e) => onChange({ ...block, label: e.target.value })} /></div>
      <div className="space-y-1"><Label className="text-xs text-gray-500">Giá trị</Label><Input value={block.value} onChange={(e) => onChange({ ...block, value: e.target.value })} /></div>
    </div>
  );
}

function InfoRowEditorEN({ block, onChange }: { block: InfoRowBlock; onChange: (b: InfoRowBlock) => void }) {
  return (
    <div className="grid md:grid-cols-2 gap-3">
      <div className="space-y-1"><Label className="text-xs text-gray-500">Label</Label><Input value={block.labelEn || ""} onChange={(e) => onChange({ ...block, labelEn: e.target.value })} placeholder="Enter English label" /></div>
      <div className="space-y-1"><Label className="text-xs text-gray-500">Value</Label><Input value={block.valueEn || ""} onChange={(e) => onChange({ ...block, valueEn: e.target.value })} placeholder="Enter English value" /></div>
    </div>
  );
}

function CardItemEditorVI({ block, onChange }: { block: CardItemBlock; onChange: (b: CardItemBlock) => void }) {
  return (
    <div className="space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        <div className="space-y-1"><Label className="text-xs text-gray-500">Tiêu đề</Label><Input value={block.title} onChange={(e) => onChange({ ...block, title: e.target.value })} /></div>
        <div className="space-y-1"><Label className="text-xs text-gray-500">Phụ đề</Label><Input value={block.subtitle} onChange={(e) => onChange({ ...block, subtitle: e.target.value })} /></div>
      </div>
      <div className="space-y-1"><Label className="text-xs text-gray-500">Nội dung thẻ</Label><Textarea value={block.body} rows={3} onChange={(e) => onChange({ ...block, body: e.target.value })} className="text-sm resize-none" /></div>
    </div>
  );
}

function CardItemEditorEN({ block, onChange }: { block: CardItemBlock; onChange: (b: CardItemBlock) => void }) {
  return (
    <div className="space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        <div className="space-y-1"><Label className="text-xs text-gray-500">Title</Label><Input value={block.titleEn || ""} onChange={(e) => onChange({ ...block, titleEn: e.target.value })} placeholder="Enter English title" /></div>
        <div className="space-y-1"><Label className="text-xs text-gray-500">Subtitle</Label><Input value={block.subtitleEn || ""} onChange={(e) => onChange({ ...block, subtitleEn: e.target.value })} placeholder="Enter English subtitle" /></div>
      </div>
      <div className="space-y-1"><Label className="text-xs text-gray-500">Body</Label><Textarea value={block.bodyEn || ""} rows={3} onChange={(e) => onChange({ ...block, bodyEn: e.target.value })} placeholder="Enter English content" className="text-sm resize-none" /></div>
    </div>
  );
}

function BadgeEditorVI({ block, onChange }: { block: BadgeBlock; onChange: (b: BadgeBlock) => void }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-gray-500">Nội dung</Label>
      <Input value={block.text} onChange={(e) => onChange({ ...block, text: e.target.value })} />
    </div>
  );
}

function BadgeEditorEN({ block, onChange }: { block: BadgeBlock; onChange: (b: BadgeBlock) => void }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-gray-500">Content</Label>
      <Input value={block.textEn || ""} onChange={(e) => onChange({ ...block, textEn: e.target.value })} placeholder="Enter English content" />
    </div>
  );
}

// ─── BLOCK CARD (canvas item) ─────────────────────────────────────────────────
interface BlockCardProps {
  block: PageBlock; index: number; total: number;
  onChange: (b: PageBlock) => void;
  onRemove: () => void; onMoveUp: () => void; onMoveDown: () => void;
  canHiddenSession?: boolean;
  canDeleteSession?: boolean;
  lang: "vi" | "en";
}

function BlockCard({ block, index, total, onChange, onRemove, onMoveUp, onMoveDown, canHiddenSession = true, canDeleteSession = true, lang }: BlockCardProps) {
  const [expanded, setExpanded] = useState(true);
  const meta = BLOCK_META[block.type];
  const hasEditor = block.type !== "divider";

  return (
    <div className={`border rounded-xl ${meta.color}`}>
      <div className="flex items-center gap-2 px-3 py-2 cursor-pointer select-none" onClick={() => hasEditor && setExpanded((p) => !p)}>
        <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
        {meta.icon}
        <span className="font-medium text-sm flex-1 truncate">{meta.label}</span>
        <Badge variant="outline" className="text-xs font-mono flex-shrink-0">#{index + 1}</Badge>
        {canHiddenSession && (
          <button type="button" onClick={(e) => { e.stopPropagation(); onChange({ ...block, hidden: !block.hidden }); }} className="p-1 rounded hover:bg-black/5" title={block.hidden ? "Hiện" : "Ẩn"}>
            {block.hidden ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-500" />}
          </button>
        )}
        <button type="button" onClick={(e) => { e.stopPropagation(); onMoveUp(); }} disabled={index === 0} className="p-1 rounded hover:bg-black/5 disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
        <button type="button" onClick={(e) => { e.stopPropagation(); onMoveDown(); }} disabled={index === total - 1} className="p-1 rounded hover:bg-black/5 disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
        {canDeleteSession && (
          <button type="button" onClick={(e) => { e.stopPropagation(); onRemove(); }} className="p-1 rounded hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
        )}
      </div>

      {expanded && hasEditor && (
        <div className="px-4 pb-4 pt-2 border-t border-inherit bg-white/60">
          {/* Vietnamese Fields */}
          {lang === "vi" && (
            <>
              {block.type === "org-header"  && <OrgHeaderEditorVI  block={block as OrgHeaderBlock}  onChange={onChange as (b: OrgHeaderBlock) => void} />}
              {block.type === "branches"    && <BranchesEditorVI   block={block as BranchesBlock}   onChange={onChange as (b: BranchesBlock) => void} />}
              {block.type === "heading"     && <HeadingEditorVI     block={block as HeadingBlock}     onChange={onChange as (b: HeadingBlock) => void} />}
              {block.type === "text-input"  && <TextInputEditorVI   block={block as TextInputBlock}   onChange={onChange as (b: TextInputBlock) => void} />}
              {block.type === "rich-text"   && <RichTextEditorVI   block={block as RichTextBlock}    onChange={onChange as (b: RichTextBlock) => void} />}
              {block.type === "info-row"    && <InfoRowEditorVI     block={block as InfoRowBlock}     onChange={onChange as (b: InfoRowBlock) => void} />}
              {block.type === "card-item"   && <CardItemEditorVI    block={block as CardItemBlock}    onChange={onChange as (b: CardItemBlock) => void} />}
              {block.type === "badge"       && <BadgeEditorVI       block={block as BadgeBlock}       onChange={onChange as (b: BadgeBlock) => void} />}
            </>
          )}

          {/* English Fields */}
          {lang === "en" && (
            <>
              {block.type === "org-header"  && <OrgHeaderEditorEN  block={block as OrgHeaderBlock}  onChange={onChange as (b: OrgHeaderBlock) => void} />}
              {block.type === "branches"    && <BranchesEditorEN   block={block as BranchesBlock}   onChange={onChange as (b: BranchesBlock) => void} />}
              {block.type === "heading"     && <HeadingEditorEN     block={block as HeadingBlock}     onChange={onChange as (b: HeadingBlock) => void} />}
              {block.type === "text-input"  && <TextInputEditorEN   block={block as TextInputBlock}   onChange={onChange as (b: TextInputBlock) => void} />}
              {block.type === "rich-text"   && <RichTextEditorEN   block={block as RichTextBlock}    onChange={onChange as (b: RichTextBlock) => void} />}
              {block.type === "info-row"    && <InfoRowEditorEN     block={block as InfoRowBlock}     onChange={onChange as (b: InfoRowBlock) => void} />}
              {block.type === "card-item"   && <CardItemEditorEN    block={block as CardItemBlock}    onChange={onChange as (b: CardItemBlock) => void} />}
              {block.type === "badge"       && <BadgeEditorEN       block={block as BadgeBlock}       onChange={onChange as (b: BadgeBlock) => void} />}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
interface IntroductionConfigProps {
  canUpdate?: boolean;
  canAddSession?: boolean;
  canHiddenSession?: boolean;
  canDeleteSession?: boolean;
}

export function IntroductionConfig({
  canUpdate = true,
  canAddSession = true,
  canHiddenSession = true,
  canDeleteSession = true,
}: IntroductionConfigProps) {
  const [viBlocks, setViBlocks] = useState<PageBlock[]>([]);
  const [enBlocks, setEnBlocks] = useState<PageBlock[]>([]);
  const [viConfigId, setViConfigId] = useState("");
  const [enConfigId, setEnConfigId] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [isSaving, setIsSaving] = useState(false);
  const [viHasChanges, setViHasChanges] = useState(false);
  const [enHasChanges, setEnHasChanges] = useState(false);
  const [newBlockId, setNewBlockId] = useState<string | null>(null);

  const { data: viData, isLoading: viLoading, refetch: refetchVi } = useGetApiV10PageConfig({ filters: `key==${PAGE_CONFIG_KEY_VI}`, pageSize: 1 });
  const { data: enData, isLoading: enLoading, refetch: refetchEn } = useGetApiV10PageConfig({ filters: `key==${PAGE_CONFIG_KEY_EN}`, pageSize: 1 });
  const updateMutation = usePutApiV10PageConfigId();
  const createMutation = usePostApiV10PageConfig();

  const isLoading = viLoading || enLoading;
  const blocks = lang === "vi" ? viBlocks : enBlocks;
  const setBlocks = lang === "vi" ? setViBlocks : setEnBlocks;
  const configId = lang === "vi" ? viConfigId : enConfigId;
  const configKey = lang === "vi" ? PAGE_CONFIG_KEY_VI : PAGE_CONFIG_KEY_EN;
  const hasChanges = lang === "vi" ? viHasChanges : enHasChanges;
  const setHasChanges = lang === "vi" ? setViHasChanges : setEnHasChanges;

  useEffect(() => {
    if (viData?.responseData?.rows && viData.responseData.rows.length > 0) {
      const row = viData.responseData.rows[0] as unknown as PageConfigRow;
      setViConfigId(row.id);
      try {
        const parsed = JSON.parse(row.value);
        if (Array.isArray(parsed)) { setViBlocks(parsed as PageBlock[]); return; }
      } catch { /* use empty */ }
      setViBlocks([]);
    }
  }, [viData]);

  useEffect(() => {
    if (enData?.responseData?.rows && enData.responseData.rows.length > 0) {
      const row = enData.responseData.rows[0] as unknown as PageConfigRow;
      setEnConfigId(row.id);
      try {
        const parsed = JSON.parse(row.value);
        if (Array.isArray(parsed)) { setEnBlocks(parsed as PageBlock[]); return; }
      } catch { /* use empty */ }
      setEnBlocks([]);
    }
  }, [enData]);

  const updateBlock = useCallback((id: string, b: PageBlock) => { setBlocks((p) => p.map((x) => x.id === id ? b : x)); setHasChanges(true); }, [setBlocks, setHasChanges]);
  const removeBlock = useCallback((id: string) => { setBlocks((p) => p.filter((x) => x.id !== id)); setHasChanges(true); }, [setBlocks, setHasChanges]);
  const moveBlock = useCallback((idx: number, dir: -1 | 1) => {
    setBlocks((p) => { const n = [...p]; const s = idx + dir; if (s < 0 || s >= n.length) return p; [n[idx], n[s]] = [n[s], n[idx]]; return n; });
    setHasChanges(true);
  }, [setBlocks, setHasChanges]);
  const addBlock = useCallback((tpl: BlockTemplate) => {
    const newBlock = tpl.create();
    setBlocks((p) => [...p, newBlock]);
    setNewBlockId(newBlock.id);
    setHasChanges(true);
  }, [setBlocks, setHasChanges]);

  // Auto-scroll to new block
  useEffect(() => {
    if (newBlockId) {
      const element = document.getElementById(`block-${newBlockId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        // Reset after scroll
        const timer = setTimeout(() => setNewBlockId(null), 500);
        return () => clearTimeout(timer);
      }
    }
  }, [newBlockId]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (configId) {
        await updateMutation.mutateAsync({ id: configId, data: { key: configKey, value: JSON.stringify(blocks), is_active: true } });
      } else {
        const created = await createMutation.mutateAsync({ data: { key: configKey, value: JSON.stringify(blocks), is_active: true } });
        const newId = created?.responseData?.id;
        if (newId) { if (lang === "vi") setViConfigId(newId); else setEnConfigId(newId); }
      }
      setHasChanges(false); toast.success("Đã lưu trang giới thiệu");
      if (lang === "vi") refetchVi(); else refetchEn();
    } catch (err) { console.error(err); toast.error("Lỗi khi lưu cấu hình"); }
    finally { setIsSaving(false); }
  };

  if (isLoading) return <Card><CardContent className="flex items-center justify-center h-40"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></CardContent></Card>;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-xl font-bold">Page Builder — Trang Giới Thiệu</CardTitle>
              {hasChanges && <span className="text-xs text-amber-500 font-medium animate-pulse">(Chưa lưu)</span>}
            </div>
            <CardDescription>Thêm block từ thư viện, sắp xếp thứ tự, chỉnh sửa nội dung rồi lưu.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowPreview((p) => !p)} className="gap-1">
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? "Ẩn preview" : "Xem preview"}
            </Button>
            {canUpdate && (
              <Button size="sm" onClick={handleSave} disabled={isSaving || !hasChanges} className="gap-1 bg-green-600 hover:bg-green-700">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Lưu thay đổi
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* ── Global Language Tabs ── */}
        <div className="flex items-center gap-2 mb-6 pb-4 border-b">
          <span className="text-sm font-medium text-gray-600 mr-2">Ngôn ngữ:</span>
          <div className="flex gap-1 border rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setLang("vi")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                lang === "vi" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              🇻🇳 Tiếng Việt
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                lang === "en" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              🇬🇧 English
            </button>
          </div>
        </div>

        <div className="flex gap-6 items-start">
          {/* ── Library sidebar ── */}
          <div className="w-52 flex-shrink-0 space-y-4 sticky top-4 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {GROUPS.map((g) => {
              const tpls = BLOCK_LIBRARY.filter((t) => t.group === g.key);
              return (
                <div key={g.key}>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-1 mb-1">{g.label}</p>
                  <div className="space-y-1">
                    {tpls.map((tpl) => (
                      <button key={tpl.type} type="button" disabled={!canUpdate || !canAddSession} onClick={() => addBlock(tpl)}
                        className="w-full flex items-start gap-2 border rounded-lg p-2 text-left hover:border-blue-400 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-white">
                        <span className="mt-0.5 flex-shrink-0">{tpl.icon}</span>
                        <span>
                          <span className="block text-xs font-medium leading-tight">{tpl.label}</span>
                          <span className="block text-[10px] text-gray-400 leading-tight mt-0.5">{tpl.description}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Canvas ── */}
          <div className="flex-1 min-w-0 space-y-3">
            {blocks.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center py-16 text-gray-400">
                <Plus className="w-8 h-8 mb-2" />
                <p className="text-sm">Chọn block từ thư viện bên trái để bắt đầu</p>
              </div>
            ) : blocks.map((block, idx) => (
              <div key={block.id} id={`block-${block.id}`}>
                <BlockCard block={block} index={idx} total={blocks.length}
                  onChange={(b) => updateBlock(block.id, b)}
                  onRemove={() => removeBlock(block.id)}
                  onMoveUp={() => moveBlock(idx, -1)}
                  onMoveDown={() => moveBlock(idx, 1)}
                  canHiddenSession={canHiddenSession}
                  canDeleteSession={canDeleteSession}
                  lang={lang}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Preview ── */}
        {showPreview && blocks.length > 0 && (
          <div className="mt-8">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Preview</p>
            <section className="bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] rounded-xl py-10 px-6 lg:px-10 space-y-6">
              {blocks.map((block) => <BlockPreview key={block.id} block={block} lang={lang} />)}
            </section>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
