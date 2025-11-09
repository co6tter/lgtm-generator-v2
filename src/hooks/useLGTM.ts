"use client";

import { useCallback, useState } from "react";
import type { LGTMOptions, ProcessImageResult } from "@/lib/image-processor";
import {
  copyImageToClipboard,
  downloadImage,
  processImageWithLGTM,
} from "@/lib/image-processor";

export interface UseLGTMResult {
  isProcessing: boolean;
  error: Error | null;
  processedImage: ProcessImageResult | null;
  generateLGTM: (imageUrl: string, options?: LGTMOptions) => Promise<void>;
  copyToClipboard: () => Promise<void>;
  download: (filename?: string) => void;
  reset: () => void;
}

/**
 * Hook for LGTM image generation and management
 * Handles image processing, clipboard copy, and download
 */
export function useLGTM(): UseLGTMResult {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [processedImage, setProcessedImage] =
    useState<ProcessImageResult | null>(null);

  /**
   * Generate LGTM image from URL
   */
  const generateLGTM = useCallback(
    async (imageUrl: string, options?: LGTMOptions) => {
      setIsProcessing(true);
      setError(null);

      try {
        const result = await processImageWithLGTM(imageUrl, options);
        setProcessedImage(result);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Unknown error occurred");
        setError(error);
        console.error("Failed to generate LGTM image:", error);
      } finally {
        setIsProcessing(false);
      }
    },
    [],
  );

  /**
   * Copy processed image to clipboard
   */
  const copyToClipboard = useCallback(async () => {
    if (!processedImage) {
      throw new Error("No processed image available");
    }

    try {
      await copyImageToClipboard(processedImage.blob);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to copy to clipboard");
      setError(error);
      throw error;
    }
  }, [processedImage]);

  /**
   * Download processed image
   */
  const download = useCallback(
    (filename = "lgtm.png") => {
      if (!processedImage) {
        throw new Error("No processed image available");
      }

      try {
        downloadImage(processedImage.blob, filename);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to download image");
        setError(error);
        throw error;
      }
    },
    [processedImage],
  );

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setIsProcessing(false);
    setError(null);
    setProcessedImage(null);
  }, []);

  return {
    isProcessing,
    error,
    processedImage,
    generateLGTM,
    copyToClipboard,
    download,
    reset,
  };
}
