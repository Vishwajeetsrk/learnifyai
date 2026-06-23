// Upload validation and security utilities
// Prevents malicious files, validates types, sanitizes filenames

export type FileCategory = "image" | "video" | "audio" | "document" | "archive" | "code" | "other";

export interface FileValidationConfig {
  maxSize: number; // bytes
  accept: string[]; // MIME types or extensions like ".pdf"
  maxFiles?: number;
  minDimensions?: { width: number; height: number };
  maxDimensions?: { width: number; height: number };
  category?: FileCategory;
}

export interface ValidatedFile {
  file: File;
  id: string;
  category: FileCategory;
  sanitized_name: string;
  preview_url?: string;
  dimensions?: { width: number; height: number };
  duration?: number; // for audio/video
}

export interface ValidationError {
  file: File;
  code: string;
  message: string;
}

const DANGEROUS_EXTENSIONS = new Set([
  "exe",
  "bat",
  "cmd",
  "com",
  "msi",
  "scr",
  "pif",
  "vbs",
  "js",
  "jse",
  "wsf",
  "wsh",
  "ps1",
  "reg",
  "inf",
  "lnk",
  "hta",
  "cpl",
  "msp",
  "mst",
  "gadget",
  "application",
]);

const DOUBLE_EXTENSION_PATTERN =
  /\.(jpg|jpeg|png|gif|bmp|tiff|svg|webp|pdf|doc|docx|xls|xlsx|ppt|pptx)\.(exe|bat|cmd|com|scr|pif|vbs|js|wsf|wsh|ps1|hta|gadget)$/i;

const MIME_MAP: Record<string, string[]> = {
  "image/*": [
    "image/png",
    "image/jpeg",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "image/bmp",
    "image/tiff",
  ],
  "video/*": ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo", "video/x-matroska"],
  "audio/*": ["audio/mpeg", "audio/wav", "audio/ogg", "audio/webm", "audio/aac", "audio/flac"],
  ".pdf": ["application/pdf"],
  ".doc": ["application/msword"],
  ".docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  ".xls": ["application/vnd.ms-excel"],
  ".xlsx": ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  ".ppt": ["application/vnd.ms-powerpoint"],
  ".pptx": ["application/vnd.openxmlformats-officedocument.presentationml.presentation"],
  ".json": ["application/json", "text/plain"],
  ".zip": ["application/zip", "application/x-zip-compressed"],
  ".txt": ["text/plain", "text/csv"],
  ".md": ["text/markdown", "text/plain"],
};

function sanitizeFilename(name: string): string {
  // Remove path separators, null bytes, and dangerous characters
  let clean = name
    .replace(/[/\\]/g, "")
    .replace(/\0/g, "")
    .replace(/[<>"|?*]/g, "")
    .replace(/\.{2,}/g, ".")
    .trim();

  // Prevent hidden files
  if (clean.startsWith(".")) {
    clean = "file_" + clean;
  }

  // Truncate if too long (keep extension)
  const parts = clean.split(".");
  if (parts.length > 1) {
    const ext = parts.pop()!;
    const base = parts.join(".");
    if (base.length > 200) {
      clean = base.slice(0, 200) + "." + ext;
    }
  } else if (clean.length > 200) {
    clean = clean.slice(0, 200);
  }

  return clean || "unnamed_file";
}

function getFileExtension(name: string): string {
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

function getCategoryFromMime(mime: string): FileCategory {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  if (
    mime.includes("pdf") ||
    mime.includes("word") ||
    mime.includes("document") ||
    mime.includes("sheet") ||
    mime.includes("presentation") ||
    mime.includes("text/")
  )
    return "document";
  if (mime.includes("zip") || mime.includes("rar") || mime.includes("tar") || mime.includes("gz"))
    return "archive";
  if (
    mime.includes("javascript") ||
    mime.includes("json") ||
    mime.includes("xml") ||
    mime.includes("html") ||
    mime.includes("css")
  )
    return "code";
  return "other";
}

function matchesAccept(mime: string, accept: string[]): boolean {
  for (const pattern of accept) {
    if (pattern.endsWith("/*")) {
      const prefix = pattern.slice(0, -2);
      if (mime.startsWith(prefix + "/")) return true;
    } else if (pattern.startsWith(".")) {
      // Extension match handled separately
      continue;
    } else if (mime === pattern) {
      return true;
    }
  }
  return false;
}

function matchesAcceptExtension(ext: string, accept: string[]): boolean {
  for (const pattern of accept) {
    if (pattern.startsWith(".") && pattern.toLowerCase().slice(1) === ext) {
      return true;
    }
  }
  return false;
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image dimensions"));
    };
    img.src = url;
  });
}

function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    const url = URL.createObjectURL(file);
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(video.duration);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(0);
    };
    video.src = url;
  });
}

function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const audio = document.createElement("audio");
    audio.preload = "metadata";
    const url = URL.createObjectURL(file);
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(audio.duration);
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(0);
    };
    audio.src = url;
  });
}

function createPreviewUrl(file: File, category: FileCategory): string | undefined {
  if (category === "image" || category === "video") {
    return URL.createObjectURL(file);
  }
  return undefined;
}

export function generateFileId(): string {
  return `file_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function formatSpeed(bytesPerSecond: number): string {
  return formatFileSize(bytesPerSecond) + "/s";
}

export function formatETA(seconds: number): string {
  if (seconds < 60) return `${Math.ceil(seconds)}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.ceil(seconds % 60)}s`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}

export async function validateFiles(
  files: File[],
  config: FileValidationConfig,
  existingCount: number = 0,
): Promise<{ valid: ValidatedFile[]; errors: ValidationError[] }> {
  const valid: ValidatedFile[] = [];
  const errors: ValidationError[] = [];
  const maxFiles = config.maxFiles ?? Infinity;

  for (const file of files) {
    // Check file count
    if (valid.length + existingCount >= maxFiles) {
      errors.push({ file, code: "TOO_MANY_FILES", message: `Maximum ${maxFiles} files allowed` });
      continue;
    }

    // Check extension for dangerous types
    const ext = getFileExtension(file.name);
    if (DANGEROUS_EXTENSIONS.has(ext)) {
      errors.push({
        file,
        code: "DANGEROUS_FILE",
        message: `.${ext} files are not allowed for security reasons`,
      });
      continue;
    }

    // Check double extension
    if (DOUBLE_EXTENSION_PATTERN.test(file.name)) {
      errors.push({
        file,
        code: "DOUBLE_EXTENSION",
        message: "Suspicious double extension detected",
      });
      continue;
    }

    // Check file size
    if (file.size > config.maxSize) {
      errors.push({
        file,
        code: "FILE_TOO_LARGE",
        message: `File is ${formatFileSize(file.size)}, max allowed is ${formatFileSize(config.maxSize)}`,
      });
      continue;
    }

    // Check MIME type
    if (config.accept.length > 0) {
      const mimeMatch = matchesAccept(file.type, config.accept);
      const extMatch = matchesAcceptExtension(ext, config.accept);
      if (!mimeMatch && !extMatch) {
        errors.push({
          file,
          code: "INVALID_TYPE",
          message: `File type "${file.type || ext}" is not supported`,
        });
        continue;
      }
    }

    // Sanitize filename
    const sanitized_name = sanitizeFilename(file.name);
    const category = getCategoryFromMime(file.type);

    // Build validated file
    const validated: ValidatedFile = {
      file,
      id: generateFileId(),
      category,
      sanitized_name,
      preview_url: createPreviewUrl(file, category),
    };

    // Get dimensions for images
    if (category === "image") {
      try {
        const dims = await getImageDimensions(file);
        validated.dimensions = dims;

        if (config.minDimensions) {
          if (
            dims.width < config.minDimensions.width ||
            dims.height < config.minDimensions.height
          ) {
            errors.push({
              file,
              code: "IMAGE_TOO_SMALL",
              message: `Image must be at least ${config.minDimensions.width}x${config.minDimensions.height}px`,
            });
            continue;
          }
        }

        if (config.maxDimensions) {
          if (
            dims.width > config.maxDimensions.width ||
            dims.height > config.maxDimensions.height
          ) {
            errors.push({
              file,
              code: "IMAGE_TOO_LARGE",
              message: `Image must be no larger than ${config.maxDimensions.width}x${config.maxDimensions.height}px`,
            });
            continue;
          }
        }
      } catch {
        // Dimensions are optional, continue without them
      }
    }

    // Get duration for video/audio
    if (category === "video") {
      validated.duration = await getVideoDuration(file);
    } else if (category === "audio") {
      validated.duration = await getAudioDuration(file);
    }

    valid.push(validated);
  }

  return { valid, errors };
}

// Storage configuration for different upload contexts
export const STORAGE_CONFIGS: Record<string, FileValidationConfig> = {
  avatar: {
    maxSize: 5 * 1024 * 1024, // 5MB
    accept: ["image/png", "image/jpeg", "image/webp"],
    maxFiles: 1,
    minDimensions: { width: 200, height: 200 },
    maxDimensions: { width: 4000, height: 4000 },
    category: "image",
  },
  banner: {
    maxSize: 5 * 1024 * 1024, // 5MB
    accept: ["image/png", "image/jpeg", "image/webp"],
    maxFiles: 1,
    minDimensions: { width: 800, height: 200 },
    maxDimensions: { width: 4000, height: 2000 },
    category: "image",
  },
  course_thumbnail: {
    maxSize: 8 * 1024 * 1024, // 8MB
    accept: ["image/png", "image/jpeg", "image/webp"],
    maxFiles: 1,
    minDimensions: { width: 800, height: 600 },
    category: "image",
  },
  lesson_video: {
    maxSize: 200 * 1024 * 1024, // 200MB
    accept: ["video/mp4", "video/webm", "video/quicktime"],
    maxFiles: 1,
    category: "video",
  },
  community_post: {
    maxSize: 50 * 1024 * 1024, // 50MB
    accept: ["image/*", "video/*", ".pdf", ".doc", ".docx"],
    maxFiles: 5,
  },
  assignment: {
    maxSize: 20 * 1024 * 1024, // 20MB
    accept: [".pdf", ".doc", ".docx", ".txt", ".zip", ".rar"],
    maxFiles: 1,
  },
  ai_photo: {
    maxSize: 4 * 1024 * 1024, // 4MB
    accept: ["image/png", "image/jpeg", "image/webp"],
    maxFiles: 1,
    category: "image",
  },
  playground: {
    maxSize: 10 * 1024 * 1024, // 10MB
    accept: [
      ".js",
      ".ts",
      ".tsx",
      ".jsx",
      ".json",
      ".html",
      ".css",
      ".py",
      ".java",
      ".c",
      ".cpp",
      ".go",
      ".rs",
      ".md",
      ".txt",
      ".zip",
    ],
    maxFiles: 50,
  },
  cert_template: {
    maxSize: 2 * 1024 * 1024, // 2MB
    accept: [".json"],
    maxFiles: 1,
  },
};
