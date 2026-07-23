'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { OrgNode } from '../types';
import { Eye, Pencil, Trash2, X, Palette, Copy } from 'lucide-react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import baseConfig from '@configs/base';

/* ─── TIER CONFIG ─────────────────────────────────────────────────────── */

const TIER_COLORS: Record<string, { border: string; badge: string; label: string }> = {
  'C-level':  { border: '#DC2626', badge: '#EF4444', label: 'C-level' },
  'L1':       { border: '#F59E0B', badge: '#FCD34D', label: 'L1' },
  'L2':       { border: '#3B82F6', badge: '#60A5FA', label: 'L2' },
  'L3':       { border: '#10B981', badge: '#34D399', label: 'L3' },
  default:    { border: '#6366F1', badge: '#818CF8', label: 'Staff' },
};

function getTierMeta(position = ''): { border: string; badge: string; label: string } {
  const p = position.toLowerCase();
  if (p.includes('ceo') || p.includes('cto') || p.includes('cfo') || p.includes('coo') || p.includes('cmo')) return TIER_COLORS['C-level'];
  if (p.includes('l1') || p.includes('director') || p.includes('trưởng')) return TIER_COLORS['L1'];
  if (p.includes('l2') || p.includes('manager') || p.includes('phó')) return TIER_COLORS['L2'];
  if (p.includes('l3') || p.includes('lead') || p.includes('senior')) return TIER_COLORS['L3'];
  return TIER_COLORS.default;
}

/* ─── Style Toolbar Portal ──────────────────────────────────────────── */

interface StyleToolbarRenderProps {
  localColor: string;
  localWidth: number;
  localHeight: number;
  setLocalColor: (v: string) => void;
  setLocalWidth: (v: number) => void;
  setLocalHeight: (v: number) => void;
  onSave: (color: string, width: number, height: number) => void;
  onClose: () => void;
  screenLeft: number;
  screenTop: number;
}

function StyleToolbarPortal({
  localColor, localWidth, localHeight,
  setLocalColor, setLocalWidth, setLocalHeight,
  onSave, onClose, screenLeft, screenTop,
}: StyleToolbarRenderProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return createPortal(
    <div
      data-style-toolbar=""
      style={{
        position: 'fixed', left: screenLeft, top: screenTop,
        transform: 'translate(-50%, calc(-100% - 10px))', zIndex: 300,
      }}
      className="w-56 rounded-2xl border border-white/10 bg-white/95 p-4 shadow-2xl backdrop-blur-xl dark:border-gray-800/50 dark:bg-gray-950/95"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">Tuỳ chỉnh node</span>
        <button
          type="button" onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all hover:rotate-90 hover:bg-red-100 hover:text-red-500 dark:bg-gray-800 dark:text-gray-400"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mb-3 space-y-1.5">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Màu viền</p>
        <div className="flex items-center gap-2">
          <input type="color" value={localColor || '#2563EB'}
            onChange={(e) => setLocalColor(e.target.value)}
            className="h-9 w-12 cursor-pointer rounded-xl border border-gray-200 bg-transparent p-0.5 dark:border-gray-700" />
          <input type="text" value={localColor} onChange={(e) => setLocalColor(e.target.value)}
            placeholder="#2563EB"
            className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-mono dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200" />
        </div>
      </div>

      <div className="mb-3 space-y-1.5">
        <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
          <span>Rộng</span><span className="tabular-nums font-mono">{localWidth}px</span>
        </div>
        <input type="range" min={140} max={400} step={5} value={localWidth}
          onChange={(e) => setLocalWidth(Number(e.target.value))}
          className="h-1.5 w-full cursor-pointer accent-indigo-600" />
      </div>

      <div className="mb-4 space-y-1.5">
        <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
          <span>Cao</span><span className="tabular-nums font-mono">{localHeight}px</span>
        </div>
        <input type="range" min={200} max={600} step={5} value={localHeight}
          onChange={(e) => setLocalHeight(Number(e.target.value))}
          className="h-1.5 w-full cursor-pointer accent-indigo-600" />
      </div>

      <div className="flex items-center justify-end gap-2">
        <button type="button" onClick={onClose}
          className="flex h-9 items-center gap-1 rounded-full border border-gray-200 px-4 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">
          Hủy
        </button>
        <button type="button" onClick={() => onSave(localColor, localWidth, localHeight)}
          className="flex h-9 items-center gap-1 rounded-full bg-indigo-600 px-4 text-xs font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/40 active:scale-95">
          Lưu
        </button>
      </div>
    </div>,
    document.body
  );
}

/* ─── Node Component ────────────────────────────────────────────────── */

interface OrgChartNodeProps {
  node: OrgNode;
  position: { x: number; y: number };
  isDragging: boolean;
  isPanning: boolean;
  scale: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onDragStart: (nodeId: string, offsetX: number, offsetY: number) => void;
  onEditNode: (node: OrgNode) => void;
  onDeleteNode: (id: string) => void;
  onViewNode: (node: OrgNode) => void;
  onDuplicateNode: (node: OrgNode) => void;
  onUpdateStyle: (nodeId: string, color: string | null, width: number, height: number) => Promise<void>;
  canViewDetail: boolean;
  canDeletePersonnel: boolean;
  canEditPersonnel: boolean;
}

export function OrgChartNode({
  node, position, isDragging, isPanning, scale, containerRef,
  onDragStart, onEditNode, onDeleteNode, onViewNode, onDuplicateNode, onUpdateStyle,
  canViewDetail, canDeletePersonnel, canEditPersonnel,
}: OrgChartNodeProps) {

  const isDraggingRef = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const [styleToolbarOpen, setStyleToolbarOpen] = useState(false);
  const [localColor, setLocalColor] = useState(node.color ?? '');
  const [localWidth, setLocalWidth] = useState(node.size?.width ?? 200);
  const [localHeight, setLocalHeight] = useState(node.size?.height ?? 260);
  const [hovered, setHovered] = useState(false);

  // 3D tilt mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-6, 6]);

  const getScreenPosition = useCallback((): { screenLeft: number; screenTop: number } => {
    if (!containerRef.current) return { screenLeft: 0, screenTop: 0 };
    const containerRect = containerRef.current.getBoundingClientRect();
    const sl = containerRect.left + position.x * scale - containerRef.current.scrollLeft;
    const st = containerRect.top + position.y * scale - containerRef.current.scrollTop;
    const centerLeft = sl + ((node.size?.width ?? 200) * scale) / 2;
    return { screenLeft: centerLeft, screenTop: st };
  }, [containerRef, position, scale, node.size]);

  const resolveAvatarSrc = (value?: string | null): string | undefined => {
    if (!value) return undefined;
    if (/^https?:\/\//i.test(value)) return value;
    if (value.startsWith('/')) return `${baseConfig.imgEndpointDomain}${value}`;
    return `${baseConfig.imgEndpointDomain}/${value}`;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isPanning || styleToolbarOpen) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPanning || styleToolbarOpen) return;
    if ((e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    e.stopPropagation();
    isDraggingRef.current = true;
    const rect = e.currentTarget.getBoundingClientRect();
    onDragStart(node.id, (e.clientX - rect.left) / scale, (e.clientY - rect.top) / scale);
  };

  const handleMouseEnter = () => {
    if (!isPanning && !styleToolbarOpen) setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSaveStyle = async (color: string, width: number, height: number) => {
    await onUpdateStyle(node.id, color || null, width, height);
    setStyleToolbarOpen(false);
  };

  const effectiveColor = styleToolbarOpen ? localColor : node.color;
  const effectiveWidth = styleToolbarOpen ? localWidth : (node.size?.width ?? 200);
  const effectiveHeight = styleToolbarOpen ? localHeight : (node.size?.height ?? 260);

  const tier = getTierMeta(node.position);
  const accentColor = effectiveColor || tier.border;
  const avatarSrc = resolveAvatarSrc(node.avatar_url);
  const canShowActions = canDeletePersonnel || canEditPersonnel;

  // Avatar dimensions — 80% of card width, square-ish
  const avatarSize = effectiveWidth * 0.80;

  return (
    <div
      data-node-wrapper
      className="absolute"
      style={{ left: position.x, top: position.y }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          rotateX: hovered && !isPanning && !styleToolbarOpen ? rotateX : 0,
          rotateY: hovered && !isPanning && !styleToolbarOpen ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        className="group relative -mb-6 pb-6"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* ─── Card Body ─── */}
        <div
          ref={cardRef}
          data-disable-board-pan="true"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onClick={() => {
            if (!isDraggingRef.current && !styleToolbarOpen && canViewDetail) onViewNode(node);
            setTimeout(() => { isDraggingRef.current = false; }, 0);
          }}
          style={{
            width: effectiveWidth,
            minHeight: effectiveHeight,
            borderColor: accentColor,
            perspective: 900,
          }}
          className={[
            'group relative flex flex-col items-center overflow-visible rounded-3xl border-4 bg-white pt-5',
            'transition-all duration-200',
            canViewDetail && !styleToolbarOpen ? 'cursor-pointer' : 'cursor-default',
            isDragging ? 'opacity-60' : 'hover:shadow-xl',
          ].join(' ')}
        >
          {/* Soft shadow via inner gradient */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-5 dark:opacity-10"
            style={{ background: `radial-gradient(ellipse at 50% 0%, ${accentColor}40 0%, transparent 60%)` }} />

          {/* ── Top-left tier badge ── */}
          {/* <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 22 }}
            className="absolute left-3 top-3 z-20 flex items-center gap-1 rounded-full px-2 py-1 backdrop-blur-md"
            style={{
              backgroundColor: `${accentColor}18`,
              border: `1px solid ${accentColor}40`,
            }}
          >
            <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-700 dark:text-white">
              {tier.label}
            </span>
          </motion.div> */}

          {/* ── Top-right corner buttons ── */}
          <div className="absolute right-2.5 top-2.5 z-20 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            {canViewDetail && !styleToolbarOpen && (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={(e) => { e.stopPropagation(); onViewNode(node); }}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-slate-500 shadow-md transition-all hover:scale-110 hover:bg-blue-600 hover:text-white active:scale-95 dark:bg-gray-800"
                title="Xem chi tiết"
              >
                <Eye className="h-3.5 w-3.5" />
              </motion.button>
            )}
            {canEditPersonnel && (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={(e) => { e.stopPropagation(); setStyleToolbarOpen((v) => !v); }}
                          className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-slate-500 shadow-md transition-all hover:scale-110 hover:bg-blue-600 hover:text-white active:scale-95 dark:bg-gray-800"
                title="Tuỳ chỉnh"
              >
                <Palette className="h-3.5 w-3.5 " />
              </motion.button>
            )}
          </div>

          {/* ── Avatar — rounded square, centered above text ── */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex justify-center"
          >
            {/* Outer frame — accent color border */}
            <div
              className="relative flex items-center justify-center rounded-2xl p-[3px]"
              style={{
                background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}88 100%)`,
                boxShadow: `0 0 0 2px white, 0 12px 32px -2px ${accentColor}80`,
              }}
            >
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={node.full_name}
                  crossOrigin="anonymous"
                  className="h-full w-full rounded-[10px] object-cover shadow-2xl "
                  style={{ width: avatarSize, height: avatarSize }}
                />
              ) : (
                <div
                  className="flex items-center justify-center rounded-[10px]"
                  style={{
                    width: avatarSize,
                    height: avatarSize,
                    background: `linear-gradient(135deg, ${accentColor}CC 0%, ${accentColor}66 100%)`,
                  }}
                >
                  <span className="text-3xl font-black text-white/60">
                    {node.full_name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
              )}

            </div>
          </motion.div>

          {/* ── Text Info Zone ── */}
          <div className="relative z-10 flex w-full flex-col items-center px-3 pb-4 pt-3 text-center">
            {/* Position — amber, small uppercase */}
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-amber-600"
            >
              {node.position}
            </motion.p>

            {/* Full name — dark bold uppercase */}
            <motion.h3
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-1 text-[13px] font-extrabold uppercase leading-tight tracking-wide text-slate-900 dark:text-white"
            >
              {node.full_name}
            </motion.h3>

            {/* Department — slate-600 */}
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 line-clamp-2 dark:text-slate-400"
            >
              {node.department_name}
            </motion.p>
          </div>
        </div>

        {/* ─── Hover glow underneath card ─── */}
        <motion.div
          className="pointer-events-none absolute inset-0 -z-10 rounded-3xl"
          animate={{
            opacity: hovered ? 1 : 0,
            y: hovered ? 14 : 0,
          }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: `radial-gradient(ellipse at 50% 100%, ${accentColor}25 0%, transparent 70%)`,
            filter: 'blur(24px)',
          }}
        />

        {/* ─── Floating Action Buttons ─── */}
        {canShowActions && !styleToolbarOpen && !isDragging && (
          <div
            className="pointer-events-none absolute -bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-2xl bg-white/95 px-2.5 py-2 opacity-0 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1 dark:bg-gray-900/95 dark:ring-white/10"
          >
              {canEditPersonnel && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDuplicateNode(node); }}
                  className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-all hover:scale-110 hover:bg-blue-600 hover:text-white active:scale-95 dark:bg-blue-900/30 dark:text-blue-400"
                  title="Sao chép"
                >
                  <Copy className="h-4 w-4" />
                </button>
              )}
              {canEditPersonnel && (
                <button
                  onClick={(e) => { e.stopPropagation(); onEditNode(node); }}
                  className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-all hover:scale-110 hover:bg-emerald-600 hover:text-white active:scale-95 dark:bg-emerald-900/30 dark:text-emerald-400"
                  title="Chỉnh sửa"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              )}
              {canDeletePersonnel && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteNode(node.id); }}
                  className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 transition-all hover:scale-110 hover:bg-red-600 hover:text-white active:scale-95 dark:bg-red-900/30 dark:text-red-400"
                  title="Xóa"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

        {/* ─── Style Toolbar ─── */}
        {styleToolbarOpen && (() => {
          const pos = getScreenPosition();
          return (
            <StyleToolbarPortal
              localColor={localColor}
              localWidth={localWidth}
              localHeight={localHeight}
              setLocalColor={setLocalColor}
              setLocalWidth={setLocalWidth}
              setLocalHeight={setLocalHeight}
              onSave={handleSaveStyle}
              onClose={() => setStyleToolbarOpen(false)}
              screenLeft={pos.screenLeft}
              screenTop={pos.screenTop}
            />
          );
        })()}
      </motion.div>
    </div>
  );
}
