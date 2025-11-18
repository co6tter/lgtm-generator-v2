"use client";

import Image from "next/image";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import type { Image as ImageType } from "@/types";

export interface PreviewModalProps {
  image: ImageType;
  onClose: () => void;
  onCopy: () => void;
  onDownload: () => void;
  isOpen: boolean;
  isLoading?: boolean;
  className?: string;
}

export function PreviewModal({
  image,
  onClose,
  onCopy,
  onDownload,
  isOpen,
  isLoading = false,
  className = "",
}: PreviewModalProps) {
  // ESCキーで閉じる
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    // ボディのスクロールを無効化
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 背景クリックで閉じる
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity duration-200 ${className}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-4xl animate-fade-in rounded-lg bg-white dark:bg-gray-800 p-6 shadow-2xl sm:p-8">
        {/* 閉じるボタン */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-500 dark:text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="モーダルを閉じる"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <title>閉じる</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* 画像プレビュー */}
        <div className="mb-6">
          <h2
            id="modal-title"
            className="mb-4 text-center text-xl font-bold text-gray-900 dark:text-gray-100"
          >
            LGTM プレビュー
          </h2>
          <div className="relative mx-auto aspect-video max-h-[60vh] w-full overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={image.url}
              alt={image.alt || `${image.photographer}による写真`}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-contain"
              priority
            />
            {/* LGTMテキストオーバーレイ */}
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-4xl font-normal text-white/60 sm:text-5xl md:text-6xl">
                LGTM
              </p>
            </div>
          </div>
        </div>

        {/* クレジット情報 */}
        <div className="mb-6 text-center text-sm text-gray-600 dark:text-gray-300">
          <p>
            Photo by{" "}
            {image.photographerUrl ? (
              <a
                href={image.photographerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:underline"
              >
                {image.photographer}
              </a>
            ) : (
              <span className="font-medium">{image.photographer}</span>
            )}{" "}
            on{" "}
            <a
              href={image.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:underline"
            >
              {image.source.charAt(0).toUpperCase() + image.source.slice(1)}
            </a>
          </p>
        </div>

        {/* アクションボタン */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            variant="primary"
            onClick={onCopy}
            disabled={isLoading}
            className="flex items-center justify-center gap-2"
            aria-label="画像をコピー"
          >
            {isLoading ? (
              <>
                <svg
                  className="h-5 w-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <title>処理中</title>
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                処理中...
              </>
            ) : (
              <>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <title>コピー</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                画像をコピー
              </>
            )}
          </Button>
          <Button
            variant="secondary"
            onClick={onDownload}
            disabled={isLoading}
            className="flex items-center justify-center gap-2"
            aria-label="画像をダウンロード"
          >
            {isLoading ? (
              <>
                <svg
                  className="h-5 w-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <title>処理中</title>
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                処理中...
              </>
            ) : (
              <>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <title>ダウンロード</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                画像をダウンロード
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
