"use client"

import React from 'react'
import { DataTable } from '@/components/shared/data-table'
import { createCategoryColumns } from '../category-columns'
import { useAbility } from '@/hooks/use-ability'
import type {CategoryTableProps} from '@/types/category'

export const CategoryTable: React.FC<CategoryTableProps> = ({
	rows,
	visibleRows,
	expanded,
	isLoading,
	onToggle,
	onEdit,
	onAddChild,
	onDelete,
	onRefresh
}) => {
	const ability = useAbility()
	const columns = createCategoryColumns({
		rows,
		expanded,
		onToggle,
		onEdit,
		onAddChild,
		onDelete,
		ability,
	})

	return (
		<DataTable
					columns={columns}
					data={visibleRows}
					searchPlaceholder="Tìm kiếm danh mục..."
					isLoading={isLoading}
					onRefresh={onRefresh}
					onLoadMore={() => {}}
					hasNextPage={false}
					isFetchingNextPage={false}
		/>
	)
}
