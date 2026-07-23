export type QuotationRow = Record<string, unknown>;

export interface QuotationRowProps {
  row: QuotationRow;
  statusRows: QuotationRow[];
  calibrationRows: QuotationRow[];
  serviceRows?: QuotationRow[];
  isStatusLoading: boolean;
  loadingStatus: string | null;
  onStatusChange: (id: string, statusId: string) => void;
  onViewDetail: (row: QuotationRow) => void;
  onOpenEmailModal: (row: QuotationRow) => void;
  onOpenResponseModal: (row: QuotationRow) => void;
  onDelete: (id: string) => void;
}

export interface QuotationTableProps {
  rows: QuotationRow[];
  onLoadMore?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  serviceRows?: QuotationRow[];
}

export interface EmailModalState {
  open: boolean;
  quotation: QuotationRow | null;
  price: string;
  status: string;
  files: File[];
  fileError: string | null;
  isSending: boolean;
}

export interface ResponseModalState {
  open: boolean;
  quotation: QuotationRow | null;
  price: string;
  status: string;
  files: File[];
  fileError: string | null;
  isSubmitting: boolean;
}

export interface ConfirmDialogState {
  open: boolean;
  targetId?: string;
}

export interface StatusChangeConfirmState {
  open: boolean;
  quotationId?: string;
  statusId?: string;
}

// Re-export for convenience
export type { QuotationTableProps as Props };

