export type Category = {
	id: string
	name: string
	code?: string
	position?: number
	note?: string | null
	description?: string | null
	parent_category_id?: string | null
	created_at?: string
	updated_at?: string | null
	created_by?: string | null
	updated_by?: string | null
	link?: string | null
	is_service?: boolean | null
	categories?: Category[]
	icon_url?: string | null
}

export interface CategoryColumnsProps {
	rows: Array<Category & { depth: number; parentId: string | null }>
	expanded: Record<string, boolean>
	onToggle: (id: string) => void
	onEdit: (category: Category) => void
	onAddChild: (category: Category) => void
	onDelete: (id: string) => void
}
export interface CategoryFormProps {
	isEditing: boolean
	editingCategory?: Category | null
	values: {
		name: string
		code: string
		description: string
		position: string
		parent_category_id: string
		link: string
		is_service?: boolean
		icon_url: string
	}
	categories: Category[]
	saving: boolean
	onValuesChange: (updater: (prev: CategoryFormProps['values']) => CategoryFormProps['values']) => void
	onSave: () => void
	onCancel: () => void
}

export interface CategoryStatsProps {
	stats: {
		total: number
		active: number
		root: number
		nested: number
	}
}
export interface CategoryTableProps {
    rows: Array<Category & { depth: number; parentId: string | null }>
    visibleRows: Array<Category & { depth: number; parentId: string | null }>
    expanded: Record<string, boolean>
    isLoading: boolean
    onToggle: (id: string) => void
    onEdit: (category: Category) => void
    onAddChild: (category: Category) => void
    onDelete: (id: string) => void
    onRefresh: () => void
}