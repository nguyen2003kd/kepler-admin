"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
		<Card>
			<CardHeader>
				<CardTitle>Danh sách danh mục</CardTitle>
				<CardDescription>
					Danh sách tất cả các danh mục trong hệ thống
				</CardDescription>
			</CardHeader>
			<CardContent>
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
			</CardContent>
		</Card>
	)
}