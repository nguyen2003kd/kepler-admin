"use client"

import React, { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Header } from '@/components/layout/header'
import Can from '@/acl/Can'
import { CategoryEdit } from '@/app/(dashboard)/category/components/category-edit'
import { CategoryCreate } from '@/app/(dashboard)/category/components/category-create'
import { CategoryBulkCreate } from '@/app/(dashboard)/category/components/category-buikcreate'
import { CategoryStats } from '@/app/(dashboard)/category/components/category-stats'
import { CategoryTable } from '@/app/(dashboard)/category/components/category-table'
import {
  useGetApiV10Category,
  useDeleteApiV10CategoryId,
  getGetApiV10CategoryQueryKey,
} from '@/api/endpoints/category'
import type { Category } from '@/types/category'
import { toast } from '@/components/ui/toaster'
import { extractErrorMessage } from '@/utils/error'
import { useAbility } from "@/hooks/use-ability";
// Helper: flatten nested categories into rows with depth for indentation
const flattenCategories = (items: Category[], depth = 0, parentId: string | null = null) => {
	const rows: Array<Category & { depth: number; parentId: string | null }> = []
	for (const it of items) {
		rows.push({ ...it, depth, parentId })
		if (it.categories && it.categories.length > 0) {
			rows.push(...flattenCategories(it.categories, depth + 1, it.id))
		}
	}
	return rows
}

const Page: React.FC = () => {
	const queryClient = useQueryClient()

	// Use generated query hook to fetch categories
	const { data: categoriesData, isLoading } = useGetApiV10Category(undefined, undefined)

	// Normalize categories from the API envelope
	const categories: Category[] = React.useMemo(() => {
		if (!categoriesData) return []
		
		// Handle different possible response structures
		if (Array.isArray(categoriesData)) {
			return categoriesData as Category[]
		}
		
		// Check for nested response data
		const responseData = (categoriesData as { responseData?: Category[] })?.responseData
		if (Array.isArray(responseData)) {
			return responseData
		}
		
		const data = (categoriesData as { data?: Category[] })?.data
		if (Array.isArray(data)) {
			return data
		}
		
		return []
	}, [categoriesData])

	// Mutations
	const deleteMutation = useDeleteApiV10CategoryId()

	// Form state
	const [editing, setEditing] = useState<Category | null>(null)
	const [createParentId, setCreateParentId] = useState<string | undefined>(undefined)
	const [expanded, setExpanded] = React.useState<Record<string, boolean>>({})
 	 const ability = useAbility();
	const rows = React.useMemo(() => flattenCategories(categories), [categories])

	// Filter visible rows based on expanded state
	const visibleRows = React.useMemo(() => {
		return rows.filter(row => {
			if (row.depth === 0) return true
			let parent = row.parentId
			while (parent) {
				if (!expanded[parent]) return false
				const parentRow = rows.find(r => r.id === parent)
				parent = parentRow?.parentId || null
			}
			return true
		})
	}, [rows, expanded])

	const toggle = (id: string) => setExpanded((s) => ({ ...s, [id]: !s[id] }))

	// note: create/edit saving handled inside feature components

	const startEdit = (category: Category) => {
		setEditing(category)
	}

	const handleAddChild = (parent: Category) => {
		setCreateParentId(parent.id)
		setExpanded(prev => ({ ...prev, [parent.id]: true }))
	}

	const doDelete = async (id: string) => {
		if (!confirm('Bạn có chắc chắn muốn xóa danh mục này? Điều này sẽ ảnh hưởng đến các danh mục con.')) return
		try {
			await deleteMutation.mutateAsync({ id })
			await queryClient.invalidateQueries({ queryKey: getGetApiV10CategoryQueryKey() })
			toast.success({title:'Xóa danh mục thành công', content:'Danh mục đã được xóa.'})
		} catch (e) {
			console.error('Delete failed', e)
			const msg = extractErrorMessage(e)
			toast.error({ title: 'Xóa thất bại', content: msg })
		}
	}

	const cancelEdit = () => {
		setEditing(null)
	}

	const handleCreateOpenChange = (open: boolean) => {
		if (!open) {
			setCreateParentId(undefined)
		}
	}

	const stats = {
		total: categories.length,
		active: categories.filter(c => c.categories && c.categories.length > 0).length,
		root: categories.filter(c => !c.parent_category_id).length,
		nested: categories.filter(c => c.parent_category_id).length,
	}

	return (
		<div>
			<Header title="Danh mục" />
			<main className="container mx-auto p-4 md:p-6">
				<div className="space-y-8">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div>
							<h2 className="text-3xl font-bold tracking-tight">Danh mục</h2>
							<p className="text-muted-foreground">
								Quản lý danh mục sản phẩm
							</p>
						</div>
						<Can I="create" a="category">
							<div className="flex space-x-2">
								<CategoryCreate parentId={createParentId} onOpenChange={handleCreateOpenChange} />
								<CategoryBulkCreate />
							</div>
						</Can>
					</div>

					{/* Edit flow handled by per-row component */}
					{editing && (
						<CategoryEdit category={editing} onDone={cancelEdit} />
					)}

					{/* Category Stats */}
					{ability.can('view_statistics', 'category') && (
					<CategoryStats stats={stats} />
					)}

					{/* Categories Table */}
					<CategoryTable
						rows={rows}
						visibleRows={visibleRows}
						expanded={expanded}
						isLoading={isLoading}
						onToggle={toggle}
						onEdit={startEdit}
						onAddChild={handleAddChild}
						onDelete={doDelete}
						onRefresh={() => queryClient.invalidateQueries({ queryKey: getGetApiV10CategoryQueryKey() })}
					/>
				</div>
			</main>
		</div>
	)
}

export default Page

