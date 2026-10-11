import crypto from "crypto";

export interface ImageValidationResult {
  valid: boolean;
  mime?: "image/jpeg" | "image/png" | "image/webp";
  extension?: "jpg" | "png" | "webp";
  width?: number;
  height?: number;
  error?: string;
}

const MAX_IMAGE_DIMENSION = 6000; // Maksimal 6000 x 6000 piksel (mencegah pixel flood / zip bomb)

/**
 * Ekstrak dimensi gambar secara aman dari buffer biner tanpa library eksternal.
 */
function extractDimensions(
  buffer: Buffer,
  format: "jpg" | "png" | "webp"
): { width?: number; height?: number } {
  try {
    if (format === "png" && buffer.length >= 24) {
      if (buffer.subarray(12, 16).toString("ascii") === "IHDR") {
        return {
          width: buffer.readUInt32BE(16),
          height: buffer.readUInt32BE(20),
        };
      }
    }

    if (format === "jpg" && buffer.length >= 10) {
      let offset = 2;
      while (offset < buffer.length - 8) {
        if (buffer[offset] !== 0xff) break;
        const marker = buffer[offset + 1];
        // Stop at Start of Scan (SOS) or End of Image (EOI)
        if (marker === 0xd9 || marker === 0xda) break;
        const length = buffer.readUInt16BE(offset + 2);
        // SOF markers (SOF0 to SOF15, except DHT, JPG, DAC)
        if (
          [0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(
            marker
          ) &&
          offset + 9 <= buffer.length
        ) {
          return {
            height: buffer.readUInt16BE(offset + 5),
            width: buffer.readUInt16BE(offset + 7),
          };
        }
        offset += 2 + length;
      }
    }

    if (format === "webp" && buffer.length >= 30) {
      const type = buffer.subarray(12, 16).toString("ascii");
      if (type === "VP8 " && buffer.length >= 30) {
        return {
          width: buffer.readUInt16LE(26) & 0x3fff,
          height: buffer.readUInt16LE(28) & 0x3fff,
        };
      }
      if (type === "VP8L" && buffer.length >= 25) {
        const b0 = buffer[21];
        const b1 = buffer[22];
        const b2 = buffer[23];
        const b3 = buffer[24];
        return {
          width: 1 + (((b1 & 0x3f) << 8) | b0),
          height: 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6)),
        };
      }
      if (type === "VP8X" && buffer.length >= 30) {
        return {
          width: 1 + (buffer[24] | (buffer[25] << 8) | (buffer[26] << 16)),
          height: 1 + (buffer[27] | (buffer[28] << 8) | (buffer[29] << 16)),
        };
      }
    }
  } catch {
    // Ignore extraction errors and allow default pass if signature is valid
  }

  return {};
}

/**
 * Validates image buffer using magic bytes / file signatures & dimensions.
 * Strictly allowlists only JPEG, PNG, and WebP.
 * Does NOT trust client-supplied Content-Type or file extensions.
 */
export function validateImageBuffer(buffer: Buffer): ImageValidationResult {
  if (!buffer || buffer.length < 12) {
    return {
      valid: false,
      error: "File terlalu kecil atau rusak.",
    };
  }

  let format: "jpg" | "png" | "webp" | null = null;
  let mime: "image/jpeg" | "image/png" | "image/webp" | null = null;

  // 1. JPEG signature: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    format = "jpg";
    mime = "image/jpeg";
  }
  // 2. PNG signature: 89 50 4E 47 0D 0A 1A 0A
  else if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    format = "png";
    mime = "image/png";
  }
  // 3. WebP signature: RIFF....WEBP
  else if (
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    format = "webp";
    mime = "image/webp";
  }

  if (!format || !mime) {
    return {
      valid: false,
      error: "Format file tidak didukung. Hanya file gambar asli berformat JPEG, PNG, atau WebP yang diperbolehkan.",
    };
  }

  // 4. Validasi dimensi gambar (anti-pixel flood)
  const { width, height } = extractDimensions(buffer, format);
  if (
    (width && width > MAX_IMAGE_DIMENSION) ||
    (height && height > MAX_IMAGE_DIMENSION)
  ) {
    return {
      valid: false,
      error: `Dimensi gambar (${width || "?"}x${height || "?"}) melebihi batas maksimal ${MAX_IMAGE_DIMENSION}x${MAX_IMAGE_DIMENSION} piksel.`,
    };
  }

  return { valid: true, mime, extension: format, width, height };
}

/**
 * Generates an unguessable, safe filename without user-controlled paths.
 */
export function generateSafeFileName(
  prefix: string,
  userId: string,
  extension: "jpg" | "png" | "webp"
): string {
  const safePrefix = prefix.replace(/[^a-z0-9_-]/gi, "");
  const safeUserId = userId.replace(/[^a-z0-9_-]/gi, "").slice(0, 40);
  const randomSuffix = crypto.randomBytes(8).toString("hex");
  return `${safePrefix}_${safeUserId}_${Date.now()}_${randomSuffix}.${extension}`;
}
