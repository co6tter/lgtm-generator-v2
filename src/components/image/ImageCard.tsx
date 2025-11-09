"use client";

import Image from "next/image";
import { useState } from "react";
import type { Image as ImageType } from "@/types";

export interface ImageCardProps {
  image: ImageType;
  onClick: (image: ImageType) => void;
  className?: string;
}

export function ImageCard({ image, onClick, className = "" }: ImageCardProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className={`group relative cursor-pointer overflow-hidden rounded-lg bg-gray-100 shadow-sm transition-all duration-200 hover:scale-102 hover:shadow-lg ${className}`}
      onClick={() => onClick(image)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(image);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`${image.photographer}の画像を選択`}
    >
      {/* 画像 */}
      <div className="relative aspect-square w-full">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          </div>
        )}
        <Image
          src={image.thumbnailUrl}
          alt={image.alt || `${image.photographer}による写真`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-opacity duration-300"
          style={{ opacity: isLoading ? 0 : 1 }}
          onLoad={() => setIsLoading(false)}
          loading="lazy"
        />
      </div>

      {/* ホバー時のオーバーレイ */}
      <div className="absolute inset-0 bg-black bg-opacity-0 transition-all duration-200 group-hover:bg-opacity-20" />

      {/* クレジット情報 */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <p className="truncate text-sm font-medium text-white">
          Photo by {image.photographer}
        </p>
      </div>
    </div>
  );
}
