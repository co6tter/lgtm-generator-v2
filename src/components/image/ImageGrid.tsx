"use client";

import type { Image as ImageType } from "@/types";
import { ImageCard } from "./ImageCard";

export interface ImageGridProps {
  images: ImageType[];
  onImageClick: (image: ImageType) => void;
  className?: string;
}

export function ImageGrid({
  images,
  onImageClick,
  className = "",
}: ImageGridProps) {
  if (images.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg bg-white dark:bg-gray-800 p-8 text-center">
        <div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            画像が見つかりませんでした
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            別のキーワードで検索してみてください
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-6 ${className}`}
      role="list"
    >
      {images.map((image) => (
        <div key={image.id} role="listitem">
          <ImageCard image={image} onClick={onImageClick} />
        </div>
      ))}
    </div>
  );
}
