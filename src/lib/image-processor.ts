/**
 * Image processing utilities using Canvas API
 * Handles LGTM text overlay on images
 */

export interface LGTMOptions {
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  textColor?: string;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
}

export interface ProcessImageResult {
  dataUrl: string;
  blob: Blob;
  width: number;
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
 * Calculate responsive font size (4% of image height)
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
 * Process image and overlay LGTM text
 * Returns data URL and blob for copying/downloading
 */
export async function processImageWithLGTM(
  imageUrl: string,
  options: LGTMOptions = {},
): Promise<ProcessImageResult> {
  const startTime = performance.now();

  try {
    // Load image
    const img = await loadImage(imageUrl);

    // Create canvas
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get canvas context");
    }

    // Draw original image
    ctx.drawImage(img, 0, 0);

    // Merge options with defaults
    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

    // Calculate font size if not provided
    const fontSize = calculateFontSize(img.height, options);
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
 * Format: ![LGTM](imageUrl)
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
