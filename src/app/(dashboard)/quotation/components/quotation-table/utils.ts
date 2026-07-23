// Get string value by keys
export const getString = (
  obj: Record<string, unknown> | undefined,
  ...keys: string[]
): string => {
  if (!obj) return "";
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string") return v;
    if (typeof v === "number") return String(v);
  }
  return "";
};
// Get nested object by key
export const getNestedObj = (
  obj: Record<string, unknown> | undefined,
  key: string,
): Record<string, unknown> | undefined => {
  if (!obj) return undefined;
  const v = obj[key];
  if (v && typeof v === "object") return v as Record<string, unknown>;
  return undefined;
};

export const getRowsFromResp = (resp: unknown): unknown[] => {
  if (!resp || typeof resp !== "object") return [];
  const r = resp as { responseData?: { rows?: unknown[] } };
  return Array.isArray(r.responseData?.rows) ? r.responseData!.rows! : [];
};

export const validateFile = (file: File): string | null => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const videoTypes = [
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/avi",
    "video/mov",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-matroska",
  ];

  if (file.size > maxSize) {
    return `File "${file.name}" vượt quá 10MB`;
  }
  if (
    videoTypes.includes(file.type) ||
    file.name.match(/\.(mp4|webm|ogg|avi|mov|mkv)$/i)
  ) {
    return `File "${file.name}" là video, không được phép`;
  }
  return null;
};
