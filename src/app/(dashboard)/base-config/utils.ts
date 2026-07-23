import baseConfig from "@/configs/base";
import { ImagePickerFile } from "@/components/shared/image-picker";

// Helper function to get image URL
export const getImageUrl = (
  file: ImagePickerFile | Record<string, unknown> | null | undefined
) => {
  if (!file) return "";

  let imagePath = "";
  // Use compressed version if available, fallback to original path
  if (
    file &&
    typeof file === "object" &&
    "compress_info" in file &&
    file.compress_info
  ) {
    const compressInfo = file.compress_info as Record<string, unknown>;
    imagePath = String(
      compressInfo.desktop || compressInfo.tablet || file.path || ""
    );
  } else {
    imagePath = String(file?.path || "");
  }

  // Add domain if path doesn't start with http
  return imagePath.startsWith("http")
    ? imagePath
    : `${baseConfig.imgEndpointDomain}${imagePath}`;
};

// Convert API file object to ImagePickerFile format
export const toImagePickerFile = (
  file: Record<string, unknown> | null | undefined
): ImagePickerFile | null => {
  if (!file) return null;
  return {
    id: String(file.id || ""),
    path: String(file.path || ""),
    name: String(file.name || ""),
    mime: String(file.mime || ""),
    size: String(file.size || ""),
    compress_info: file.compress_info as ImagePickerFile["compress_info"],
  };
};
