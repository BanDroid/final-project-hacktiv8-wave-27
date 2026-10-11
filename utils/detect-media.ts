export type MediaCategory =
  | "text"
  | "image"
  | "audio"
  | "video"
  | "document"
  | "unknown";

export function detectMediaType(file: File): MediaCategory {
  const mime = file.type.toLowerCase();

  if (mime.startsWith("text/")) return "text";
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("audio/")) return "audio";
  if (mime.startsWith("video/")) return "video";

  if (
    mime === "application/pdf" ||
    mime === "application/json" ||
    mime === "application/xml" ||
    mime === "application/rtf" ||
    mime === "application/msword" ||
    mime.startsWith("application/vnd.") ||
    mime === "application/zip" ||
    mime === "application/octet-stream" ||
    mime.startsWith("application/vnd.openxmlformats")
  ) {
    return "document";
  }

  return "unknown";
}
