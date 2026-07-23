'use client'

import React, { useEffect, useState } from 'react'
import { Loader2, Maximize, Network, Plus, ZoomIn, ZoomOut, Spline } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { OrgChartBoard } from './components/org-chart-board'
import { AddNodeDialog } from './components/add-node-dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import baseConfig from '@configs/base'
import { useOrgChart } from './hooks'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { extractErrorMessage } from '@/utils/error'
import { getApiV10PageConfig, usePutApiV10PageConfigId } from '@/api/endpoints/page-config'
import type { PageConfig } from '@/api/models/pageConfig'
import { Header } from "@/components/layout/header";
const BG_COLOR_CONFIG_KEY = 'color_bg'
const DEFAULT_BG_COLOR = '#f9fafb'

const resolveAvatarSrc = (value?: string | null): string | undefined => {
  if (!value) return undefined
  if (/^https?:\/\//i.test(value)) return value
  if (value.startsWith('/')) return `${baseConfig.imgEndpointDomain}${value}`
  return `${baseConfig.imgEndpointDomain}/${value}`
}

export default function OrganizationalChartPage() {
  const queryClient = useQueryClient()
  const [bgColor, setBgColor] = React.useState(DEFAULT_BG_COLOR)
  const [tempColor, setTempColor] = React.useState(DEFAULT_BG_COLOR)
  const [isSavingBg, setIsSavingBg] = React.useState(false)

  const [showGuides, setShowGuides] = useState(true)

  const {
    canViewDetail,
    canDeletePersonnel,
    canEditPersonnel,
    canDropPersonnel,
    canCreateRootNode,
    isDialogOpen, setIsDialogOpen,
    editingNode,
    deleteConfirmOpen, setDeleteConfirmOpen,
    viewingNode, setViewingNode,
    zoom, setZoom,
    nodes,
    departmentOptions,
    isLoading, isMutating, isUpdating,
    handleCreateRoot,
    handleEditNode,
    handleDeleteNode,
    handleDeleteNodeConfirm,
    handleFormSubmit,
    handleViewNode,
    handleDuplicateNode,
    handleSavePosition,
    handleSwapPositions,
    handleUpdateStyle,
  } = useOrgChart()

  // Background color config
  const { data: bgConfig } = useQuery({
    queryKey: ['page-config', 'color_bg'],
    queryFn: async () => {
      const res = await getApiV10PageConfig({
        filters: `key==${BG_COLOR_CONFIG_KEY}`,
        pageSize: 1,
      })
      return (res as { responseData?: { rows?: PageConfig[] } })?.responseData?.rows?.[0]
    },
    staleTime: 5 * 60_000,
  })

  const updateBgMutation = usePutApiV10PageConfigId()

  useEffect(() => {
    if (bgConfig?.value) {
      setBgColor(bgConfig.value)
      setTempColor(bgConfig.value)
    }
  }, [bgConfig?.value])

  const handleSaveBgColor = async (newColor: string) => {
    if (!bgConfig?.id) {
      toast.error('Chưa có cấu hình màu nền. Vui lòng tạo record color_bg trong pageConfig trước.')
      return
    }
    setIsSavingBg(true)
    try {
      await updateBgMutation.mutateAsync({
        id: bgConfig.id,
        data: { key: BG_COLOR_CONFIG_KEY, value: newColor },
      })
      setBgColor(newColor)
      await queryClient.invalidateQueries({ queryKey: ['page-config', 'color_bg'] })
      toast.success('Cập nhật màu nền thành công')
    } catch (error) {
      toast.error(extractErrorMessage(error))
    } finally {
      setIsSavingBg(false)
    }
  }

  return (
    <>
      <Header title="Sơ đồ Tổ chức" />
    <div className="flex h-full min-h-[calc(100vh-theme(spacing.16))] flex-col space-y-6 bg-gray-50/30 p-4 md:p-8 dark:bg-gray-950/30">

      {/* Page Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="flex items-center text-2xl md:text-3xl font-black tracking-tight text-gray-900 dark:text-gray-100">
            <Network className="mr-3 h-7 w-7 md:h-8 md:w-8 text-blue-600 dark:text-blue-500" />
            Sơ đồ Tổ chức
          </h1>
          <p className="mt-2 text-sm md:text-base text-gray-500 dark:text-gray-400">
            Quản lý sơ đồ tổ chức theo vị trí tọa độ. Kéo thả để di chuyển nhân sự.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canCreateRootNode && (
            <Button
              onClick={handleCreateRoot}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white shadow-md"
              disabled={isMutating}
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm nhân sự
            </Button>
          )}
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline" size="icon" className="h-8 w-8 rounded-full"
          title="Phóng to"
          onClick={() => setZoom((prev) => Math.min(2, Number((prev + 0.1).toFixed(2))))}
        >
          <ZoomIn className="h-4 w-4 text-gray-600" />
        </Button>
        <Button
          variant="outline" size="icon" className="h-8 w-8 rounded-full"
          title="Thu nhỏ"
          onClick={() => setZoom((prev) => Math.max(0.4, Number((prev - 0.1).toFixed(2))))}
        >
          <ZoomOut className="h-4 w-4 text-gray-600" />
        </Button>
        <Button
          variant="outline" size="icon" className="h-8 w-8 rounded-full"
          title="Vừa màn hình"
          onClick={() => setZoom(1)}
        >
          <Maximize className="h-4 w-4 text-gray-600" />
        </Button>
        <div className="ml-2 rounded-md border px-2 py-1 text-xs text-gray-600 bg-white">
          {Math.round(zoom * 100)}%
        </div>
        {canDropPersonnel && (
          <Button
            variant={showGuides ? 'default' : 'outline'}
            size="sm"
            className={`h-8 px-3 text-xs gap-1.5 ${showGuides ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}`}
            title={showGuides ? 'Tắt đường căn chỉnh' : 'Bật đường căn chỉnh'}
            onClick={() => setShowGuides((v) => !v)}
          >
            <Spline className="h-3.5 w-3.5" />
            Căn chỉnh
          </Button>
        )}
        {canDropPersonnel && (
          <div className="ml-2 text-sm text-gray-500">
            Giữ chuột trái để di chuyển canvas. Kéo nhân sự để thay đổi vị trí.
          </div>
        )}

        {/* Bg Color Picker */}
        <div className="ml-4 flex items-center gap-2 rounded-lg border bg-white px-3 py-1.5 dark:border-gray-700 dark:bg-gray-900">
          <input
            type="color"
            value={tempColor}
            onChange={(e) => setTempColor(e.target.value)}
            className="h-7 w-10 cursor-pointer rounded border border-gray-200 p-0.5 dark:border-gray-700"
            title="Màu nền sơ đồ"
          />
          <input
            type="text"
            value={tempColor}
            onChange={(e) => setTempColor(e.target.value)}
            placeholder="#f9fafb"
            className="w-20 rounded border border-gray-200 px-2 py-1 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          />
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-2 text-xs"
            onClick={() => handleSaveBgColor(tempColor)}
            disabled={isSavingBg || tempColor === bgColor}
          >
            {isSavingBg ? '...' : 'Lưu màu'}
          </Button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 w-full overflow-hidden">
        {isLoading ? (
          <div className="flex h-full min-h-[420px] items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400 mr-2" />
            <p className="text-gray-500">Đang tải sơ đồ tổ chức...</p>
          </div>
        ) : nodes.length > 0 ? (
          <OrgChartBoard
            data={nodes}
            onEditNode={handleEditNode}
            onDeleteNode={handleDeleteNode}
            onViewNode={handleViewNode}
            onDuplicateNode={handleDuplicateNode}
            onSavePosition={handleSavePosition}
            onSwapPositions={handleSwapPositions}
            onUpdateStyle={handleUpdateStyle}
            canViewDetail={canViewDetail}
            canDeletePersonnel={canDeletePersonnel}
            canEditPersonnel={canEditPersonnel}
            canDropPersonnel={canDropPersonnel}
            scale={zoom}
            bgColor={bgColor}
            isSavingPosition={isUpdating}
            showGuides={showGuides}
          />
        ) : (
          <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-gray-300 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
            <p className="text-gray-500">Chưa có dữ liệu sơ đồ tổ chức.</p>
            {canCreateRootNode && (
              <Button
                onClick={handleCreateRoot}
                disabled={isMutating}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Thêm nhân sự đầu tiên
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Node Dialog */}
      <AddNodeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleFormSubmit}
        initialData={editingNode}
        departments={departmentOptions}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-950">
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa nhân sự</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa nhân sự này khỏi sơ đồ? Hành động không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteNodeConfirm}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Xác nhận xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Node Detail Dialog */}
      <Dialog open={!!viewingNode} onOpenChange={(open) => !open && setViewingNode(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden">
          {viewingNode && (
            <img
              src={resolveAvatarSrc(viewingNode.avatar_url)}
              alt={viewingNode.full_name}
              className="h-full w-full object-contain"
              crossOrigin="anonymous"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Loading Overlay */}
      {isUpdating && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/25 backdrop-blur-[1px]">
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-lg">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            Đang cập nhật sơ đồ tổ chức...
          </div>
        </div>
      )}
    </div>
        </>
  )
}
