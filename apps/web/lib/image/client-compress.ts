export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: "jpeg" | "webp" | "png";
}

export interface CompressedImage {
  file: File;
  dataUrl: string;
  width: number;
  height: number;
  originalSize: number;
  compressedSize: number;
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

function correctOrientation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  orientation: number
): { width: number; height: number } {
  let newWidth = width;
  let newHeight = height;

  switch (orientation) {
    case 2:
      ctx.transform(-1, 0, 0, 1, width, 0);
      break;
    case 3:
      ctx.transform(-1, 0, 0, -1, width, height);
      break;
    case 4:
      ctx.transform(1, 0, 0, -1, 0, height);
      break;
    case 5:
      ctx.transform(0, 1, 1, 0, 0, 0);
      newWidth = height;
      newHeight = width;
      break;
    case 6:
      ctx.transform(0, 1, -1, 0, height, 0);
      newWidth = height;
      newHeight = width;
      break;
    case 7:
      ctx.transform(0, -1, -1, 0, height, width);
      newWidth = height;
      newHeight = width;
      break;
    case 8:
      ctx.transform(0, -1, 1, 0, 0, width);
      newWidth = height;
      newHeight = width;
      break;
  }

  return { width: newWidth, height: newHeight };
}

export async function readExifOrientation(file: File): Promise<number> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target?.result) {
        resolve(1);
        return;
      }
      const view = new DataView(e.target.result as ArrayBuffer);
      if (view.getUint16(0, false) !== 0xffd8) {
        resolve(1);
        return;
      }

      let offset = 2;
      while (offset < view.byteLength) {
        const marker = view.getUint16(offset, false);
        offset += 2;

        if (marker === 0xffe1) {
          const length = view.getUint16(offset, false);
          const exifStart = offset + 2;

          if (exifStart + 6 <= view.byteLength) {
            const endian = view.getUint16(exifStart, false);
            const littleEndian = endian === 0x4949;
            const firstIFDOffset = view.getUint32(exifStart + 4, littleEndian);
            const ifdOffset = exifStart + firstIFDOffset;

            if (ifdOffset + 2 <= view.byteLength) {
              const numEntries = view.getUint16(ifdOffset, littleEndian);
              for (let i = 0; i < numEntries; i++) {
                const entryOffset = ifdOffset + 2 + i * 12;
                if (entryOffset + 12 > view.byteLength) break;
                const tag = view.getUint16(entryOffset, littleEndian);
                if (tag === 0x0112) {
                  const orientation = view.getUint16(entryOffset + 8, littleEndian);
                  resolve(orientation);
                  return;
                }
              }
            }
          }
          offset += length;
        } else if ((marker & 0xff00) === 0xff00) {
          const length = view.getUint16(offset, false);
          offset += length;
        } else {
          break;
        }
      }
      resolve(1);
    };
    reader.onerror = () => resolve(1);
    reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
  });
}

export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressedImage> {
  const {
    maxWidth = 2048,
    maxHeight = 2048,
    quality = 0.85,
    format = "jpeg",
  } = options;

  const originalSize = file.size;
  const orientation = await readExifOrientation(file);
  const { width: origWidth, height: origHeight } = await getImageDimensions(file);

  let width = origWidth;
  let height = origHeight;

  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get canvas 2D context");
  }

  if (orientation !== 1) {
    const corrected = correctOrientation(ctx, width, height, orientation);
    canvas.width = corrected.width;
    canvas.height = corrected.height;
  }

  const img = new Image();
  img.src = URL.createObjectURL(file);
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });

  ctx.drawImage(img, 0, 0, width, height);

  const mimeType = format === "png" ? "image/png" : format === "webp" ? "image/webp" : "image/jpeg";
  const dataUrl = canvas.toDataURL(mimeType, quality);

  const byteString = atob(dataUrl.split(",")[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  const compressedFile = new File([arrayBuffer], file.name.replace(/\.[^.]+$/, `.${format}`), {
    type: mimeType,
    lastModified: Date.now(),
  });

  return {
    file: compressedFile,
    dataUrl,
    width,
    height,
    originalSize,
    compressedSize: compressedFile.size,
  };
}

export async function compressImages(
  files: File[],
  options: CompressionOptions = {}
): Promise<CompressedImage[]> {
  return Promise.all(files.map((f) => compressImage(f, options)));
}

export function generateFilePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target?.result) {
        reject(new Error("Failed to generate preview"));
        return;
      }
      resolve(e.target.result as string);
    };
    reader.onerror = () => reject(new Error("Failed to generate preview"));
    reader.readAsDataURL(file);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}