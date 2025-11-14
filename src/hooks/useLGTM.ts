"use client";

import { useCallback, useState } from "react";
import type { LGTMOptions, ProcessImageResult } from "@/lib/image-processor";
import {
  copyImageToClipboard,
  copyMarkdownToClipboard,
  downloadImage,
  processImageWithLGTM,
} from "@/lib/image-processor";

export interface UseLGTMResult {
  isProcessing: boolean;
  error: Error | null;
  processedImage: ProcessImageResult | null;
  originalImageUrl: string | null;
  generateLGTM: (imageUrl: string, options?: LGTMOptions) => Promise<void>;
  copyImageToClipboard: () => Promise<void>;
  copyMarkdown: () => Promise<void>;
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
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);

  /**
   * Generate LGTM image from URL
   */
  const generateLGTM = useCallback(
    async (imageUrl: string, options?: LGTMOptions) => {
      setIsProcessing(true);
      setError(null);
      setOriginalImageUrl(imageUrl);

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
  const copyImage = useCallback(async () => {
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
   * Copy markdown text to clipboard
   * Format: ![LGTM](imageUrl)
   */
  const copyMarkdown = useCallback(async () => {
    if (!processedImage) {
      throw new Error("No processed image available");
    }

    try {
      await copyMarkdownToClipboard(processedImage.dataUrl);
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error("Failed to copy markdown to clipboard");
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
    setOriginalImageUrl(null);
  }, []);

  return {
    isProcessing,
    error,
    processedImage,
    originalImageUrl,
    generateLGTM,
    copyImageToClipboard: copyImage,
    copyMarkdown,
    download,
    reset,
  };
}
