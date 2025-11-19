/**
 * Image processing utilities using Canvas API
 * Handles LGTM text overlay on images with automatic resizing
 */

/**
 * Options for LGTM image processing
 */
export interface LGTMOptions {
  /** Text to overlay on the image (default: "LGTM") */
  text?: string;
  /** Font size in pixels (default: auto-calculated as 4% of image height) */
  fontSize?: number;
  /** Font family (default: "Arial, sans-serif") */
  fontFamily?: string;
  /** Text color (default: "rgba(255, 255, 255, 0.6)") */
  textColor?: string;
  /** Shadow color (default: "transparent") */
  shadowColor?: string;
  /** Shadow blur radius (default: 0) */
  shadowBlur?: number;
  /** Shadow offset X (default: 0) */
  shadowOffsetX?: number;
  /** Shadow offset Y (default: 0) */
  shadowOffsetY?: number;
  /** Maximum width in pixels (default: 800) */
  maxWidth?: number;
  /** Maximum height in pixels (default: 800) */
  maxHeight?: number;
}

/**
 * Result of image processing
 */
export interface ProcessImageResult {
  /** Data URL of the processed image */
  dataUrl: string;
  /** Blob of the processed image */
  blob: Blob;
  /** Width of the processed image in pixels */
  width: number;
  /** Height of the processed image in pixels */
  height: number;
}

const DEFAULT_OPTIONS: Required<LGTMOptions> = {
  text: "LGTM",
  fontSize: 0, // Will be calculated based on image height
  fontFamily: "Arial, sans-serif",
  textColor: "rgba(255, 255, 255, 0.6)",
  shadowColor: "transparent",
  shadowBlur: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  maxWidth: 800, // Default max width (800px)
  maxHeight: 800, // Default max height (800px)
};

/**
 * Load an image from URL with CORS support
 */
async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error(`Failed to load image from URL: ${url}`));

    img.src = url;
  });
}

/**
 * Calculate responsive font size based on image height
 * Default: 4% of image height
 */
function calculateFontSize(imageHeight: number, options: LGTMOptions): number {
  if (options.fontSize && options.fontSize > 0) {
    return options.fontSize;
  }

  // Use 4% of image height as default (reduced from 5%)
  const percentage = 0.04;
  return Math.floor(imageHeight * percentage);
}

/**
 * Calculate dimensions to fit within max width/height while maintaining aspect ratio
 */
function calculateResizedDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number,
): { width: number; height: number } {
  // If image is already smaller than max dimensions, return original size
  if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
    return { width: originalWidth, height: originalHeight };
  }

  // Calculate aspect ratio
  const aspectRatio = originalWidth / originalHeight;

  let newWidth = originalWidth;
  let newHeight = originalHeight;

  // If width exceeds max width
  if (newWidth > maxWidth) {
    newWidth = maxWidth;
    newHeight = Math.floor(newWidth / aspectRatio);
  }

  // If height still exceeds max height
  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = Math.floor(newHeight * aspectRatio);
  }

  return { width: newWidth, height: newHeight };
}

/**
 * Process image with LGTM text overlay
 * - Resizes image to fit within max dimensions while maintaining aspect ratio
 * - Overlays LGTM text in the center
 * - Returns data URL and blob for copying/downloading
 *
 * @param imageUrl - URL of the image to process
 * @param options - Optional configuration for text and image processing
 * @returns ProcessImageResult containing dataUrl, blob, width, and height
 */
export async function processImageWithLGTM(
  imageUrl: string,
  options: LGTMOptions = {},
): Promise<ProcessImageResult> {
  const startTime = performance.now();

  try {
    // Load image
    const img = await loadImage(imageUrl);

    // Merge options with defaults
    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

    // Calculate resized dimensions
    const { width, height } = calculateResizedDimensions(
      img.width,
      img.height,
      mergedOptions.maxWidth,
      mergedOptions.maxHeight,
    );

    // Create canvas with resized dimensions
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get canvas context");
    }

    // Draw image with new dimensions (this will resize the image)
    ctx.drawImage(img, 0, 0, width, height);

    // Calculate font size if not provided (based on resized height)
    const fontSize = calculateFontSize(height, options);
    const fontString = `400 ${fontSize}px ${mergedOptions.fontFamily}`;
    ctx.font = fontString;

    // Calculate text position (center of image)
    const x = canvas.width / 2;
    const y = canvas.height / 2;

    // Draw text directly without any shadow or background
    ctx.fillStyle = mergedOptions.textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(mergedOptions.text, x, y);

    // Convert to data URL
    const dataUrl = canvas.toDataURL("image/png", 1.0);

    // Convert to blob for downloading
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) {
            resolve(b);
          } else {
            reject(new Error("Failed to create blob from canvas"));
          }
        },
        "image/png",
        1.0,
      );
    });

    const endTime = performance.now();
    const processingTime = endTime - startTime;

    console.log(`Image processed in ${processingTime.toFixed(2)}ms`);

    return {
      dataUrl,
      blob,
      width: canvas.width,
      height: canvas.height,
    };
  } catch (error) {
    console.error("Error processing image:", error);
    throw error;
  }
}

/**
 * Copy image to clipboard
 * @param blob - Image blob to copy
 * @throws Error if Clipboard API is not supported or copy fails
 */
export async function copyImageToClipboard(blob: Blob): Promise<void> {
  try {
    if (!navigator.clipboard || !navigator.clipboard.write) {
      throw new Error("Clipboard API not supported");
    }

    const clipboardItem = new ClipboardItem({
      "image/png": blob,
    });

    await navigator.clipboard.write([clipboardItem]);
  } catch (error) {
    console.error("Error copying to clipboard:", error);
    throw new Error("クリップボードへのコピーに失敗しました");
  }
}

/**
 * Copy markdown text to clipboard
 * @param imageUrl - URL of the image
 * @returns Markdown formatted as: ![LGTM](imageUrl)
 * @throws Error if Clipboard API is not supported or copy fails
 */
export async function copyMarkdownToClipboard(imageUrl: string): Promise<void> {
  try {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      throw new Error("Clipboard API not supported");
    }

    const markdown = `![LGTM](${imageUrl})`;
    await navigator.clipboard.writeText(markdown);
  } catch (error) {
    console.error("Error copying markdown to clipboard:", error);
    throw new Error("マークダウンのコピーに失敗しました");
  }
}

/**
 * Download image as file
 * @param blob - Image blob to download
 * @param filename - Filename for the downloaded file (default: "lgtm.png")
 * @throws Error if download fails
 */
export function downloadImage(blob: Blob, filename = "lgtm.png"): void {
  try {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading image:", error);
    throw new Error("画像のダウンロードに失敗しました");
  }
}
