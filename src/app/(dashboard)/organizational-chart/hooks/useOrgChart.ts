'use client'

import React, { useMemo, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { extractErrorMessage } from '@/utils/error'
import { useAbility } from '@/hooks/use-ability'
import {
  getGetApiV10OrganizationChartQueryKey,
  useDeleteApiV10OrganizationChartId,
  useGetApiV10OrganizationChart,
  usePostApiV10OrganizationChart,
  usePutApiV10OrganizationChartId,
} from '@/api/endpoints/organization-chart'
import { getApiV10Department } from '@/api/endpoints/department'
import {
  type OrgNode,
  type AddNodeData,
  type DepartmentOption,
  mapApiNodeToOrgNode,
} from '@/types/organizational-chart'

export interface UseOrgChartReturn {
  // Permissions
  canViewDetail: boolean
  canDeletePersonnel: boolean
  canEditPersonnel: boolean
  canDropPersonnel: boolean
  canCreateRootNode: boolean

  // State
  isDialogOpen: boolean
  setIsDialogOpen: (open: boolean) => void
  editingNode: OrgNode | null
  setEditingNode: (node: OrgNode | null) => void

  deleteConfirmOpen: boolean
  setDeleteConfirmOpen: (open: boolean) => void
  pendingDeleteIdRef: React.MutableRefObject<string | null>

  viewingNode: OrgNode | null
  setViewingNode: (node: OrgNode | null) => void

  zoom: number
  setZoom: React.Dispatch<React.SetStateAction<number>>

  // Data
  nodes: OrgNode[]
  departmentOptions: DepartmentOption[]
  isLoading: boolean
  isFetching: boolean
  isMutating: boolean
  isUpdating: boolean

  // Actions
  handleCreateRoot: () => void
  handleEditNode: (node: OrgNode) => void
  handleDeleteNode: (id: string) => void
  handleDeleteNodeConfirm: () => Promise<void>
  handleFormSubmit: (data: AddNodeData) => Promise<void>
  handleViewNode: (node: OrgNode) => void
  handleDuplicateNode: (node: OrgNode) => void
  handleSavePosition: (nodeId: string, x: number, y: number) => Promise<void>
  handleSwapPositions: (nodeId1: string, nodeId2: string) => Promise<void>
  handleUpdateStyle: (nodeId: string, color: string | null, width: number, height: number) => Promise<void>
}

export function useOrgChart(): UseOrgChartReturn {
  const ability = useAbility()
  const queryClient = useQueryClient()

  // Permissions
  const canViewDetail = ability.can('view_detail', 'diagram')
  const canDeletePersonnel = ability.can('delete_personnel', 'diagram')
  const canEditPersonnel = ability.can('edit_personnel', 'diagram')
  const canDropPersonnel = true
  const canCreateRootNode =ability.can('create_root_nodel', 'diagram')

  // State
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingNode, setEditingNode] = React.useState<OrgNode | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)
  const pendingDeleteIdRef = React.useRef<string | null>(null)
  const [viewingNode, setViewingNode] = React.useState<OrgNode | null>(null)
  const [zoom, setZoom] = React.useState(1)

  // Queries
  const orgQuery = useGetApiV10OrganizationChart({
    query: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  })

  const departmentQuery = useQuery({
    queryKey: ['department-options-for-org-chart'],
    queryFn: async () => {
      const response = await getApiV10Department({ page: 1, pageSize: 500 })
      if ((response as { status?: string }).status !== 'success') {
        throw new Error((response as { message?: string }).message || 'Không lấy được phòng ban')
      }
      const rows =
        (response as { responseData?: { rows?: Array<{ id?: string; name?: string }> } })
          .responseData?.rows || []
      return rows
    },
    staleTime: 5 * 60_000,
  })

  // Mutations
  const postMutation = usePostApiV10OrganizationChart()
  const putMutation = usePutApiV10OrganizationChartId()
  const deleteMutation = useDeleteApiV10OrganizationChartId()

  // Flat array data (no tree structure)
  const nodes: OrgNode[] = useMemo(() => {
    const data =
      (orgQuery.data as { responseData?: unknown[] } | undefined)?.responseData || []
    if (!Array.isArray(data)) return []
    return (data as unknown[]).map((node) =>
      mapApiNodeToOrgNode(node as Parameters<typeof mapApiNodeToOrgNode>[0])
    )
  }, [orgQuery.data])

  const departmentOptions: DepartmentOption[] = useMemo(() => {
    const rows = departmentQuery.data || []
    return rows
      .filter((item): item is { id: string; name: string } => !!item?.id && !!item?.name)
      .map((item) => ({ id: item.id, name: item.name }))
  }, [departmentQuery.data])

  const isMutating = postMutation.isPending || putMutation.isPending || deleteMutation.isPending
  const isUpdating = putMutation.isPending

  // Actions
  const handleCreateRoot = useCallback(() => {
    if (!canCreateRootNode) return
    setEditingNode(null)
    setIsDialogOpen(true)
  }, [canCreateRootNode])

  const handleEditNode = useCallback((node: OrgNode) => {
    setEditingNode(node)
    setIsDialogOpen(true)
  }, [])

  const handleDeleteNode = useCallback((id: string) => {
    if (!canDeletePersonnel) return
    pendingDeleteIdRef.current = id
    setDeleteConfirmOpen(true)
  }, [canDeletePersonnel])

  const handleDeleteNodeConfirm = useCallback(
    async () => {
      const nodeId = pendingDeleteIdRef.current
      if (!nodeId) return
      try {
        await deleteMutation.mutateAsync({ id: nodeId })
        await queryClient.invalidateQueries({ queryKey: getGetApiV10OrganizationChartQueryKey() })
        toast.success('Xóa node thành công')
        setDeleteConfirmOpen(false)
      } catch (error) {
        toast.error(extractErrorMessage(error))
      }
    },
    [deleteMutation, queryClient],
  )

  const handleFormSubmit = useCallback(
    async (data: AddNodeData) => {
      try {
        if (editingNode?.id) {
          // Edit existing node
          await putMutation.mutateAsync({
            id: editingNode.id,
            data: {
              full_name: data.full_name,
              position: data.position,
              department_id: data.department_id,
              description: data.description || null,
              avatar_url: data.avatar_url || null,
              color: data.color || null,
              size: (data.size || null) as { [key: string]: unknown } | null,
              coordinates: (data.coordinates || null) as { [key: string]: unknown } | null,
            },
          })
          toast.success('Cập nhật node thành công')
        } else {
          // Create new node
          await postMutation.mutateAsync({
            data: {
              full_name: data.full_name,
              position: data.position,
              department_id: data.department_id,
              description: data.description || null,
              avatar_url: data.avatar_url || null,
              color: data.color || null,
              size: (data.size || null) as { [key: string]: unknown } | null,
              coordinates: (data.coordinates || null) as { [key: string]: unknown } | null,
            },
          })
          toast.success('Thêm node thành công')
        }

        setIsDialogOpen(false)
        setEditingNode(null)
        await queryClient.invalidateQueries({ queryKey: getGetApiV10OrganizationChartQueryKey() })
      } catch (error) {
        toast.error(extractErrorMessage(error))
      }
    },
    [editingNode, putMutation, postMutation, queryClient],
  )

  const handleViewNode = useCallback(
    (node: OrgNode) => {
      if (!canViewDetail) return
      setViewingNode(node)
    },
    [canViewDetail],
  )

  const handleDuplicateNode = useCallback(
    (node: OrgNode) => {
      if (!canEditPersonnel) return
      // Pre-fill the add dialog with copied data, offset slightly so it doesn't overlap
      setEditingNode({
        ...node,
        id: '', // empty → create mode
        coordinates: {
          x: (node.coordinates?.x ?? 0) + 40,
          y: (node.coordinates?.y ?? 0) + 40,
        },
      })
      setIsDialogOpen(true)
    },
    [canEditPersonnel],
  )

  // Save a single node's position
  const handleSavePosition = useCallback(
    async (nodeId: string, x: number, y: number) => {
      if (!canEditPersonnel) return
      const node = nodes.find((n) => n.id === nodeId)
      if (!node) return
      try {
        await putMutation.mutateAsync({
          id: nodeId,
          data: {
            full_name: node.full_name,
            position: node.position,
            department_id: node.department_id,
            description: node.description || null,
            avatar_url: node.avatar_url || null,
            color: node.color || null,
            size: (node.size || null) as { [key: string]: unknown } | null,
            coordinates: { x, y } as { [key: string]: unknown },
          },
        })
        await queryClient.invalidateQueries({ queryKey: getGetApiV10OrganizationChartQueryKey() })
        toast.success('Đã lưu vị trí')
      } catch (error) {
        toast.error(extractErrorMessage(error))
      }
    },
    [canEditPersonnel, nodes, putMutation, queryClient],
  )

  // Swap positions between two nodes
  const handleSwapPositions = useCallback(
    async (nodeId1: string, nodeId2: string) => {
      if (!canEditPersonnel) return
      const node1 = nodes.find((n) => n.id === nodeId1)
      const node2 = nodes.find((n) => n.id === nodeId2)
      if (!node1 || !node2) return
      try {
        const x1 = node1.coordinates?.x ?? 0
        const y1 = node1.coordinates?.y ?? 0
        const x2 = node2.coordinates?.x ?? 0
        const y2 = node2.coordinates?.y ?? 0

        // Swap: node1 goes to node2's position, node2 goes to node1's position
        await Promise.all([
          putMutation.mutateAsync({
            id: nodeId1,
            data: {
              full_name: node1.full_name,
              position: node1.position,
              department_id: node1.department_id,
              description: node1.description || null,
              avatar_url: node1.avatar_url || null,
              color: node1.color || null,
              size: (node1.size || null) as { [key: string]: unknown } | null,
              coordinates: { x: x2, y: y2 } as { [key: string]: unknown },
            },
          }),
          putMutation.mutateAsync({
            id: nodeId2,
            data: {
              full_name: node2.full_name,
              position: node2.position,
              department_id: node2.department_id,
              description: node2.description || null,
              avatar_url: node2.avatar_url || null,
              color: node2.color || null,
              size: (node2.size || null) as { [key: string]: unknown } | null,
              coordinates: { x: x1, y: y1 } as { [key: string]: unknown },
            },
          }),
        ])
        await queryClient.invalidateQueries({ queryKey: getGetApiV10OrganizationChartQueryKey() })
        toast.success('Da doi vi tri thanh cong')
      } catch (error) {
        toast.error(extractErrorMessage(error))
      }
    },
    [canEditPersonnel, nodes, putMutation, queryClient],
  )

  // Update node color and size
  const handleUpdateStyle = useCallback(
    async (nodeId: string, color: string | null, width: number, height: number) => {
      if (!canEditPersonnel) return
      const node = nodes.find((n) => n.id === nodeId)
      if (!node) return
      try {
        await putMutation.mutateAsync({
          id: nodeId,
          data: {
            full_name: node.full_name,
            position: node.position,
            department_id: node.department_id,
            description: node.description || null,
            avatar_url: node.avatar_url || null,
            color: color,
            size: { width, height } as { [key: string]: unknown },
          },
        })
        await queryClient.invalidateQueries({ queryKey: getGetApiV10OrganizationChartQueryKey() })
        toast.success('Đã cập nhật kiểu dáng')
      } catch (error) {
        toast.error(extractErrorMessage(error))
      }
    },
    [canEditPersonnel, nodes, putMutation, queryClient],
  )

  return {
    canViewDetail,
    canDeletePersonnel,
    canEditPersonnel,
    canDropPersonnel,
    canCreateRootNode,
    isDialogOpen,
    setIsDialogOpen,
    editingNode,
    setEditingNode,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    pendingDeleteIdRef,
    viewingNode,
    setViewingNode,
    zoom,
    setZoom,
    nodes,
    departmentOptions,
    isLoading: orgQuery.isLoading,
    isFetching: orgQuery.isFetching,
    isMutating,
    isUpdating,
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
  }
}
