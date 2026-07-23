"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FolderTree, TrendingUp } from 'lucide-react'
import type {CategoryStatsProps} from '@/types/category'

export const CategoryStats: React.FC<CategoryStatsProps> = ({ stats }) => {
	return (
		<div className="grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Tổng danh mục</CardTitle>
					<FolderTree className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.total}</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Danh mục gốc</CardTitle>
					<TrendingUp className="h-4 w-4 text-green-600" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.root}</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Danh mục con</CardTitle>
					<FolderTree className="h-4 w-4 text-blue-600" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.nested}</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Có danh mục con</CardTitle>
					<FolderTree className="h-4 w-4 text-orange-600" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.active}</div>
				</CardContent>
			</Card>
		</div>
	)
}