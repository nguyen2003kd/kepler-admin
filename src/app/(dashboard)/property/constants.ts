export const GROUP_OPTIONS = [
  { value: "SALE", label: "Mua và bán" },
  { value: "RENT", label: "Thuê và cho thuê" },
  { value: "DISTRIBUTION", label: "Dự án phân phối" },
  { value: "INVESTMENT", label: "Dự án kêu gọi đầu tư" },
  { value: "MA", label: "Dự án cần M&A" },
] as const;

export const UNIT_OPTIONS = [
  { value: "VND", label: "đồng" },
  { value: "VND_MONTH", label: "đồng/tháng" },
  { value: "VND_M2", label: "đồng/m²" },
  { value: "VND_M2_MONTH", label: "đồng/m²/tháng" },
  { value: "USD", label: "USD" },
  { value: "USD_MONTH", label: "USD/tháng" },
  { value: "USD_M2", label: "USD/m²" },
  { value: "USD_M2_MONTH", label: "USD/m²/tháng" },
] as const;

export const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Bản nháp — chỉ admin thấy" },
  { value: "PUBLISHED", label: "Hiển thị trên website" },
] as const;

export const DIRECTIONS = [
  "Đông",
  "Tây",
  "Nam",
  "Bắc",
  "Đông Bắc",
  "Đông Nam",
  "Tây Bắc",
  "Tây Nam",
] as const;

export const MAX_MEDIA_FILES = 20;

export const GROUP_LABELS: Record<string, string> = Object.fromEntries(
  GROUP_OPTIONS.map((option) => [option.value, option.label]),
);

export const UNIT_LABELS: Record<string, string> = Object.fromEntries(
  UNIT_OPTIONS.map((option) => [option.value, option.label]),
);

export const CLIENT_DOMAIN =
  process.env.NEXT_PUBLIC_CLIENT_DOMAIN ||
  (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");
