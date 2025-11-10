"use client";

import { useState } from "react";
import type { Image as ImageType } from "@/types";

export interface ImageCardProps {
  image: ImageType;
  onClick: (image: ImageType) => void;
  className?: string;
}

export function ImageCard({ image, onClick, className = "" }: ImageCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`group relative cursor-pointer overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-lg ${className}`}
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
      style={{ aspectRatio: "1 / 1" }}
    >
      {/* ローディングスピナー */}
      {isLoading && !hasError && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgb(243 244 246)",
            zIndex: 20,
          }}
          className="dark:bg-gray-700"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      )}

      {/* エラー表示 */}
      {hasError && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgb(243 244 246)",
          }}
          className="dark:bg-gray-700"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            画像読み込みエラー
          </p>
        </div>
      )}

      {/* 画像 */}
      <img
        src={image.thumbnailUrl}
        alt={image.alt || `${image.photographer}による写真`}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          opacity: isLoading || hasError ? 0 : 1,
          transition: "opacity 300ms",
        }}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />

      {/* ホバー時のオーバーレイ */}
      <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-200 group-hover:opacity-20" />

      {/* クレジット情報 */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <p className="truncate text-sm font-medium text-white">
          Photo by {image.photographer}
        </p>
      </div>
    </div>
  );
}
