/**
 * Extract a thumbnail from the first few seconds of a video file.
 * Uses HTML5 video + canvas — works for same-origin videos.
 *
 * @param videoUrl  Full URL or path to the video
 * @param atSeconds  Timestamp (seconds) to capture frame (default 0.5)
 * @param quality    JPEG quality 0–1 (default 0.7)
 * @returns Promise<string>  data URL of the thumbnail
 */
export async function extractVideoThumbnail(
  videoUrl: string,
  atSeconds = 0.5,
  quality = 0.7,
): Promise<string> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
// Set video attributes for better performance and CORS handling
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";

    // Handle CORS / tainted canvas gracefully
    video.onloadedmetadata = () => {
      video.currentTime = Math.min(atSeconds, video.duration);
    };

    video.onseeked = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      try {
        resolve(canvas.toDataURL("image/jpeg", quality));
      } catch {
        // Cross-origin taint → return empty string
        resolve("");
      }
    };

    video.onerror = () => {
      resolve(""); // Fallback on load error
    };

    video.src = videoUrl;
  });
}

/**
 * Generate thumbnail on-the-fly when user selects a video from ImagePicker.
 * Returns thumbnail data URL for immediate display.
 */
export async function generateVideoThumbnail(
  file: { path: string },
  atSeconds = 0.5,
): Promise<string> {
  return extractVideoThumbnail(file.path, atSeconds);
}
