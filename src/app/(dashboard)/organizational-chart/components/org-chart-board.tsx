'use client';

import React, { useRef, useState, useCallback } from 'react';
import type { OrgNode } from '@/types/organizational-chart';
import { OrgChartNode } from './org-chart-node';

interface PendingPosition {
  nodeId: string;
  x: number;
  y: number;
  originalX: number;
  originalY: number;
}

interface AlignmentGuide {
  type: 'horizontal' | 'vertical';
  position: number; // y for horizontal, x for vertical
  start: number;
  end: number;
}

interface DistanceLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  distance: number;
}

interface OrgChartBoardProps {
  data: OrgNode[];
  onEditNode: (node: OrgNode) => void;
  onDeleteNode: (id: string) => void;
  onViewNode: (node: OrgNode) => void;
  onDuplicateNode: (node: OrgNode) => void;
  onSavePosition: (nodeId: string, x: number, y: number) => Promise<void>;
  onSwapPositions: (nodeId1: string, nodeId2: string) => Promise<void>;
  onUpdateStyle: (nodeId: string, color: string | null, width: number, height: number) => Promise<void>;
  canViewDetail: boolean;
  canDeletePersonnel: boolean;
  canEditPersonnel: boolean;
  canDropPersonnel: boolean;
  scale: number;
  bgColor: string;
  isSavingPosition?: boolean;
  showGuides?: boolean;
}

const SNAP_THRESHOLD = 8; // pixels in canvas space

export function OrgChartBoard({
  data,
  onEditNode,
  onDeleteNode,
  onViewNode,
  onDuplicateNode,
  onSavePosition,
  onSwapPositions,
  onUpdateStyle,
  canViewDetail,
  canDeletePersonnel,
  canEditPersonnel,
  canDropPersonnel,
  scale,
  bgColor,
  isSavingPosition = false,
  showGuides = true,
}: OrgChartBoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Panning state ────────────────────────────────────────────────────────
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });
  const scrollOrigin = useRef({ left: 0, top: 0 });

  // ── Drag state ────────────────────────────────────────────────────────────
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const draggingIdRef = useRef<string | null>(null); // sync mirror of draggingId — avoids state batching lag
  const dragOffset = useRef({ x: 0, y: 0 });
  const [pending, setPending] = useState<PendingPosition | null>(null);

  // ── Alignment guide state ────────────────────────────────────────────────
  const [activeGuides, setActiveGuides] = useState<AlignmentGuide[]>([]);
  const [distanceLines, setDistanceLines] = useState<DistanceLine[]>([]);

  // ── Swap state ───────────────────────────────────────────────────────────
  const [swapTarget, setSwapTarget] = useState<{ nodeId: string; name: string } | null>(null);
  const SWAP_THRESHOLD = 50; // canvas px — node center must be within this distance to swap

  // ── Canvas bounds ─────────────────────────────────────────────────────────
  const canvasBounds = React.useMemo(() => {
    let maxX = 0;
    let maxY = 0;
    for (const node of data) {
      const x = (node.coordinates?.x ?? 0) + (node.size?.width ?? 180) + 120;
      const y = (node.coordinates?.y ?? 0) + (node.size?.height ?? 90) + 120;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
    return { width: Math.max(maxX, 1200), height: Math.max(maxY, 700) };
  }, [data]);

  // ── Alignment detection ───────────────────────────────────────────────────
  const detectAlignmentGuides = useCallback(
    (movingNodeId: string, movingX: number, movingY: number, movingWidth: number, movingHeight: number) => {
      const guides: AlignmentGuide[] = [];

      for (const node of data) {
        if (node.id === movingNodeId) continue;

        const nx = node.coordinates?.x ?? 0;
        const ny = node.coordinates?.y ?? 0;
        const nw = node.size?.width ?? 180;
        const nh = node.size?.height ?? 90;

        const otherCenterX = nx + nw / 2;
        const otherCenterY = ny + nh / 2;
        const movingCenterX = movingX + movingWidth / 2;
        const movingCenterY = movingY + movingHeight / 2;

        // Horizontal: center Y aligns
        if (Math.abs(movingCenterY - otherCenterY) < SNAP_THRESHOLD) {
          guides.push({
            type: 'horizontal',
            position: otherCenterY,
            start: Math.min(movingX, nx) - 20,
            end: Math.max(movingX + movingWidth, nx + nw) + 20,
          });
        }
        // Vertical: center X aligns
        if (Math.abs(movingCenterX - otherCenterX) < SNAP_THRESHOLD) {
          guides.push({
            type: 'vertical',
            position: otherCenterX,
            start: Math.min(movingY, ny) - 20,
            end: Math.max(movingY + movingHeight, ny + nh) + 20,
          });
        }
        // Left edge aligns
        if (Math.abs(movingX - nx) < SNAP_THRESHOLD) {
          guides.push({
            type: 'vertical',
            position: nx,
            start: Math.min(movingY, ny) - 20,
            end: Math.max(movingY + movingHeight, ny + nh) + 20,
          });
        }
        // Right edge aligns
        if (Math.abs(movingX + movingWidth - (nx + nw)) < SNAP_THRESHOLD) {
          guides.push({
            type: 'vertical',
            position: nx + nw,
            start: Math.min(movingY, ny) - 20,
            end: Math.max(movingY + movingHeight, ny + nh) + 20,
          });
        }
        // Top edge aligns
        if (Math.abs(movingY - ny) < SNAP_THRESHOLD) {
          guides.push({
            type: 'horizontal',
            position: ny,
            start: Math.min(movingX, nx) - 20,
            end: Math.max(movingX + movingWidth, nx + nw) + 20,
          });
        }
        // Bottom edge aligns
        if (Math.abs(movingY + movingHeight - (ny + nh)) < SNAP_THRESHOLD) {
          guides.push({
            type: 'horizontal',
            position: ny + nh,
            start: Math.min(movingX, nx) - 20,
            end: Math.max(movingX + movingWidth, nx + nw) + 20,
          });
        }
      }

      setActiveGuides(guides);
    },
    [data],
  );

  // ── Snap to guide ─────────────────────────────────────────────────────────
  const snapToGuide = useCallback(
    (movingNodeId: string, movingX: number, movingY: number, movingWidth: number, movingHeight: number) => {
      let snappedX = movingX;
      let snappedY = movingY;

      for (const node of data) {
        if (node.id === movingNodeId) continue;

        const nx = node.coordinates?.x ?? 0;
        const ny = node.coordinates?.y ?? 0;
        const nw = node.size?.width ?? 180;
        const nh = node.size?.height ?? 90;

        const otherCenterX = nx + nw / 2;
        const otherCenterY = ny + nh / 2;
        const movingCenterX = movingX + movingWidth / 2;
        const movingCenterY = movingY + movingHeight / 2;

        // Snap center Y
        if (Math.abs(movingCenterY - otherCenterY) < SNAP_THRESHOLD) {
          snappedY = otherCenterY - movingHeight / 2;
        }
        // Snap center X
        if (Math.abs(movingCenterX - otherCenterX) < SNAP_THRESHOLD) {
          snappedX = otherCenterX - movingWidth / 2;
        }
        // Snap left edge
        if (Math.abs(movingX - nx) < SNAP_THRESHOLD) {
          snappedX = nx;
        }
        // Snap right edge
        if (Math.abs(movingX + movingWidth - (nx + nw)) < SNAP_THRESHOLD) {
          snappedX = nx + nw - movingWidth;
        }
        // Snap top edge
        if (Math.abs(movingY - ny) < SNAP_THRESHOLD) {
          snappedY = ny;
        }
        // Snap bottom edge
        if (Math.abs(movingY + movingHeight - (ny + nh)) < SNAP_THRESHOLD) {
          snappedY = ny + nh - movingHeight;
        }
      }

      return { x: snappedX, y: snappedY };
    },
    [data],
  );

  // ── Distance lines between nearby nodes ──────────────────────────────────
  const DISTANCE_THRESHOLD = 300; // max distance to show line (canvas px)

  const calculateDistanceLines = useCallback(
    (movingX: number, movingY: number, movingWidth: number, movingHeight: number) => {
      const lines: DistanceLine[] = [];
      const movingCenterX = movingX + movingWidth / 2;
      const movingCenterY = movingY + movingHeight / 2;

      for (const node of data) {
        if (draggingId && node.id === draggingId) continue;

        const nx = node.coordinates?.x ?? 0;
        const ny = node.coordinates?.y ?? 0;
        const nw = node.size?.width ?? 180;
        const nh = node.size?.height ?? 90;

        const otherCenterX = nx + nw / 2;
        const otherCenterY = ny + nh / 2;

        const dist = Math.sqrt(
          (movingCenterX - otherCenterX) ** 2 + (movingCenterY - otherCenterY) ** 2,
        );

        if (dist < DISTANCE_THRESHOLD && dist > 0) {
          // Determine closest edges
          let x1 = movingCenterX;
          let y1 = movingCenterY;
          let x2 = otherCenterX;
          let y2 = otherCenterY;

          // Connect from moving node's closest edge to other node's closest edge
          const dx = otherCenterX - movingCenterX;
          const dy = otherCenterY - movingCenterY;

          if (Math.abs(dx) > Math.abs(dy)) {
            // Horizontal connection
            if (dx > 0) {
              x1 = movingX + movingWidth;
              x2 = nx;
            } else {
              x1 = movingX;
              x2 = nx + nw;
            }
            y1 = movingY + movingHeight / 2;
            y2 = ny + nh / 2;
          } else {
            // Vertical connection
            if (dy > 0) {
              y1 = movingY + movingHeight;
              y2 = ny;
            } else {
              y1 = movingY;
              y2 = ny + nh;
            }
            x1 = movingX + movingWidth / 2;
            x2 = nx + nw / 2;
          }

          lines.push({ x1, y1, x2, y2, distance: Math.round(dist) });
        }
      }

      setDistanceLines(lines);
    },
    [data, draggingId],
  );

  // ── Global mouse handlers ────────────────────────────────────────────────
  const handleContainerMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest('[data-node-wrapper]')) return;
      if (e.button !== 0) return;
      setIsPanning(true);
      panStart.current = { x: e.clientX, y: e.clientY };
      if (containerRef.current) {
        scrollOrigin.current = {
          left: containerRef.current.scrollLeft,
          top: containerRef.current.scrollTop,
        };
      }
    },
    [],
  );

  const handleContainerMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Ignore events from the style toolbar portal (rendered outside board DOM)
      if ((e.target as HTMLElement)?.closest?.('[data-style-toolbar]')) return;

      if (isPanning && containerRef.current) {
        const dx = e.clientX - panStart.current.x;
        const dy = e.clientY - panStart.current.y;
        containerRef.current.scrollLeft = scrollOrigin.current.left - dx;
        containerRef.current.scrollTop = scrollOrigin.current.top - dy;
        return;
      }

      if (!draggingIdRef.current || !containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();

      const mouseInCanvasScreenX = e.clientX - rect.left;
      const mouseInCanvasScreenY = e.clientY - rect.top;
      const mouseInCanvasX = mouseInCanvasScreenX / scale;
      const mouseInCanvasY = mouseInCanvasScreenY / scale;

      const rawX = mouseInCanvasX + container.scrollLeft - dragOffset.current.x;
      const rawY = mouseInCanvasY + container.scrollTop - dragOffset.current.y;

      const currentDraggingId = draggingIdRef.current;
      const movingNode = data.find((n) => n.id === currentDraggingId);
      const movingWidth = movingNode?.size?.width ?? 180;
      const movingHeight = movingNode?.size?.height ?? 90;

      // Detect guides
      detectAlignmentGuides(currentDraggingId, rawX, rawY, movingWidth, movingHeight);

      // Snap to guides
      const { x: snappedX, y: snappedY } = snapToGuide(currentDraggingId, rawX, rawY, movingWidth, movingHeight);

      // Calculate distance lines
      calculateDistanceLines(snappedX, snappedY, movingWidth, movingHeight);

      // ── Detect swap target ──────────────────────────────────────────────
      const movingCenterX = snappedX + movingWidth / 2;
      const movingCenterY = snappedY + movingHeight / 2;
      let nearest: { nodeId: string; name: string } | null = null;
      let nearestDist = Infinity;

      for (const node of data) {
        if (node.id === currentDraggingId) continue;
        const nx = node.coordinates?.x ?? 0;
        const ny = node.coordinates?.y ?? 0;
        const nw = node.size?.width ?? 180;
        const nh = node.size?.height ?? 90;
        const ncX = nx + nw / 2;
        const ncY = ny + nh / 2;
        const dist = Math.sqrt((movingCenterX - ncX) ** 2 + (movingCenterY - ncY) ** 2);
        if (dist < SWAP_THRESHOLD && dist < nearestDist) {
          nearestDist = dist;
          nearest = { nodeId: node.id, name: node.full_name };
        }
      }
      setSwapTarget(nearest);

      setPending((prev) => {
        if (!prev) return null;
        return { ...prev, x: Math.max(0, Math.round(snappedX)), y: Math.max(0, Math.round(snappedY)) };
      });
    },
    [isPanning, scale, data, detectAlignmentGuides, snapToGuide, calculateDistanceLines],
  );

  const handleContainerMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }

    // Auto-swap: if dragging over another node, swap positions
    if (draggingId && swapTarget) {
      const fromId = draggingId;
      const toId = swapTarget.nodeId;
      setDraggingId(null);
      draggingIdRef.current = null;
      setActiveGuides([]);
      setDistanceLines([]);
      setSwapTarget(null);
      setPending(null);
      onSwapPositions(fromId, toId);
      return;
    }

    setDraggingId(null);
    draggingIdRef.current = null;
    setActiveGuides([]);
    setDistanceLines([]);
    setSwapTarget(null);
  }, [isPanning, draggingId, swapTarget, onSwapPositions]);

  // ── Node drag start ────────────────────────────────────────────────────────
  const handleNodeDragStart = useCallback(
    (nodeId: string, offsetX: number, offsetY: number) => {
      if (!canDropPersonnel) return;
      dragOffset.current = { x: offsetX, y: offsetY };
      draggingIdRef.current = nodeId; // sync ref — avoids state batching lag in mousemove
      setDraggingId(nodeId);
      setActiveGuides([]);

      const node = data.find((n) => n.id === nodeId);
      if (node) {
        setPending({
          nodeId,
          x: node.coordinates?.x ?? 0,
          y: node.coordinates?.y ?? 0,
          originalX: node.coordinates?.x ?? 0,
          originalY: node.coordinates?.y ?? 0,
        });
      }
    },
    [canDropPersonnel, data],
  );

  // ── Position helpers ────────────────────────────────────────────────────────
  const getNodePosition = useCallback(
    (node: OrgNode) => {
      if (pending && pending.nodeId === node.id) {
        return { x: pending.x, y: pending.y };
      }
      return { x: node.coordinates?.x ?? 0, y: node.coordinates?.y ?? 0 };
    },
    [pending],
  );

  const handleConfirm = useCallback(async () => {
    if (!pending || isSavingPosition) return;
    const { nodeId, x, y } = pending;
    setPending(null);
    setActiveGuides([]);
    setDistanceLines([]);
    await onSavePosition(nodeId, x, y);
  }, [pending, isSavingPosition, onSavePosition]);

  const handleCancel = useCallback(() => {
    setPending(null);
    setActiveGuides([]);
    setDistanceLines([]);
    setSwapTarget(null);
  }, []);

  const pendingNode = pending ? data.find((n) => n.id === pending.nodeId) : null;

  return (
    <div
      ref={containerRef}
      className="relative h-[calc(100vh-240px)] min-h-[560px] w-full cursor-grab overflow-auto rounded-3xl border border-gray-200 shadow-inner active:cursor-grabbing dark:border-gray-800"
      style={{ backgroundColor: bgColor }}
      onMouseDown={handleContainerMouseDown}
      onMouseMove={handleContainerMouseMove}
      onMouseUp={handleContainerMouseUp}
      onMouseLeave={handleContainerMouseUp}
    >
      {/* Alignment guides — SVG overlay in canvas space */}
      {showGuides && activeGuides.length > 0 && (
        <svg
          className="pointer-events-none absolute left-0 top-0 overflow-visible"
          style={{
            width: canvasBounds.width,
            height: canvasBounds.height,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            willChange: 'transform',
          }}
        >
          {activeGuides.map((guide, i) =>
            guide.type === 'vertical' ? (
              <line
                key={`guide-v-${i}`}
                x1={guide.position}
                y1={guide.start}
                x2={guide.position}
                y2={guide.end}
                stroke="#3B82F6"
                strokeWidth={1}
                strokeDasharray="4 3"
              />
            ) : (
              <line
                key={`guide-h-${i}`}
                x1={guide.start}
                y1={guide.position}
                x2={guide.end}
                y2={guide.position}
                stroke="#3B82F6"
                strokeWidth={1}
                strokeDasharray="4 3"
              />
            ),
          )}

          {/* Distance lines */}
          {distanceLines.map((line, i) => {
            const midX = (line.x1 + line.x2) / 2;
            const midY = (line.y1 + line.y2) / 2;
            return (
              <g key={`dist-${i}`}>
                <line
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="#94A3B8"
                  strokeWidth={1}
                  strokeDasharray="3 2"
                  opacity={0.7}
                />
                <rect
                  x={midX - 16}
                  y={midY - 9}
                  width={32}
                  height={18}
                  rx={4}
                  fill="#F1F5F9"
                  stroke="#CBD5E1"
                  strokeWidth={1}
                  opacity={0.95}
                />
                <text
                  x={midX}
                  y={midY + 4}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#64748B"
                  fontWeight={500}
                >
                  {line.distance}px
                </text>
              </g>
            );
          })}
        </svg>
      )}

      {/* Swap target highlight ring */}
      {pending && swapTarget && (() => {
        const targetNode = data.find((n) => n.id === swapTarget.nodeId)
        if (!targetNode) return null
        const tx = targetNode.coordinates?.x ?? 0
        const ty = targetNode.coordinates?.y ?? 0
        const tw = targetNode.size?.width ?? 180
        const th = targetNode.size?.height ?? 90
        return (
          <div
            className="absolute pointer-events-none z-30 rounded-2xl border-2 border-dashed border-purple-500"
            style={{ left: tx - 4, top: ty - 4, width: tw + 8, height: th + 8 }}
          />
        )
      })()}

      {/* Confirmation bar */}
      {pending && !swapTarget && (
        <div className="fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-3 rounded-full border border-gray-200 bg-white px-5 py-2.5 shadow-xl dark:border-gray-700 dark:bg-gray-900">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {pendingNode?.full_name ?? 'Node'}
            <span className="ml-2 text-muted-foreground">
              ({pending.originalX}, {pending.originalY}) → ({pending.x}, {pending.y})
            </span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              disabled={isSavingPosition}
              className="flex h-8 items-center gap-1.5 rounded-full border border-gray-200 px-3 text-xs text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              ✕ Hủy
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSavingPosition}
              className="flex h-8 items-center gap-1.5 rounded-full bg-blue-600 px-3 text-xs text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {isSavingPosition ? '...' : '✓ '}
              Lưu vị trí
            </button>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div
        className="relative"
        style={{
          width: canvasBounds.width,
          height: canvasBounds.height,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {data.map((node) => (
          <OrgChartNode
            key={node.id}
            node={node}
            position={getNodePosition(node)}
            isDragging={draggingId === node.id}
            isPanning={isPanning}
            scale={scale}
            containerRef={containerRef}
            onDragStart={handleNodeDragStart}
            onEditNode={onEditNode}
            onDeleteNode={onDeleteNode}
            onViewNode={onViewNode}
            onDuplicateNode={onDuplicateNode}
            onUpdateStyle={onUpdateStyle}
            canViewDetail={canViewDetail}
            canDeletePersonnel={canDeletePersonnel}
            canEditPersonnel={canEditPersonnel}
          />
        ))}
      </div>
    </div>
  );
}
