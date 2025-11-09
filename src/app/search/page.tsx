"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ImageGrid } from "@/components/image/ImageGrid";
import { Pagination } from "@/components/image/Pagination";
import { PreviewModal } from "@/components/modal/PreviewModal";
import { SearchBar } from "@/components/search/SearchBar";
import { TabSelector } from "@/components/search/TabSelector";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Toast } from "@/components/ui/Toast";
import { useLGTM } from "@/hooks/useLGTM";
import { useSearch } from "@/hooks/useSearch";
import { useToast } from "@/hooks/useToast";
import type { Image, ImageSource } from "@/types";

const TABS = [
  { id: "unsplash" as ImageSource, label: "Unsplash" },
  { id: "pexels" as ImageSource, label: "Pexels" },
  { id: "pixabay" as ImageSource, label: "Pixabay" },
];

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL parameters
  const queryParam = searchParams.get("query") || "";
  const sourceParam = (searchParams.get("source") as ImageSource) || "unsplash";
  const pageParam = Number.parseInt(searchParams.get("page") || "1", 10);

  // Local state
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [activeSource, setActiveSource] = useState<ImageSource>(sourceParam);
  const [searchQuery, setSearchQuery] = useState(queryParam);

  // Search hook
  const { data, error, isLoading } = useSearch({
    query: searchQuery,
    source: activeSource,
    page: currentPage,
    perPage: 20,
  });

  // LGTM generation hook
  const {
    isProcessing: isGeneratingLGTM,
    generateLGTM,
    copyMarkdown,
    download,
    reset: resetLGTM,
  } = useLGTM();

  // Toast notifications hook
  const { toasts, showToast, hideToast } = useToast();

  // Update URL when search parameters change
  const updateURL = (query: string, source: ImageSource, page: number) => {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    params.set("source", source);
    params.set("page", String(page));
    router.push(`/search?${params.toString()}`);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    updateURL(query, activeSource, 1);
  };

  // Handle source change
  const handleSourceChange = (source: ImageSource) => {
    setActiveSource(source);
    setCurrentPage(1);
    updateURL(searchQuery, source, 1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(searchQuery, activeSource, page);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle image click - generate LGTM image
  const handleImageClick = async (image: Image) => {
    setSelectedImage(image);
    // Generate LGTM image when modal opens
    try {
      await generateLGTM(image.url);
    } catch (err) {
      console.error("Failed to generate LGTM image:", err);
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedImage(null);
    resetLGTM();
  };

  // Handle markdown copy - copy markdown format to clipboard
  const handleCopyMarkdown = async () => {
    try {
      await copyMarkdown();
      showToast("マークダウンをコピーしました！", "success");
      handleCloseModal();
    } catch (err) {
      console.error("Failed to copy markdown:", err);
      showToast("マークダウンのコピーに失敗しました", "error");
    }
  };

  // Handle download - download LGTM image
  const handleDownload = () => {
    try {
      const timestamp = Date.now();
      const filename = `lgtm-${timestamp}.png`;
      download(filename);
      showToast("画像をダウンロードしました！", "success");
      handleCloseModal();
    } catch (err) {
      console.error("Failed to download image:", err);
      showToast("画像のダウンロードに失敗しました", "error");
    }
  };

  // Sync with URL on mount
  useEffect(() => {
    if (queryParam) setSearchQuery(queryParam);
    if (sourceParam) setActiveSource(sourceParam);
    if (pageParam) setCurrentPage(pageParam);
  }, [queryParam, sourceParam, pageParam]);

  const showResults = searchQuery.trim().length >= 2;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">画像を検索</h1>
        <SearchBar
          onSearch={handleSearch}
          defaultValue={searchQuery}
          className="mb-4"
        />
        <TabSelector
          tabs={TABS}
          activeTab={activeSource}
          onTabChange={handleSourceChange}
        />
      </div>

      {/* Content */}
      {!showResults && (
        <div className="flex min-h-[400px] items-center justify-center rounded-lg bg-white p-8 text-center">
          <div>
            <svg
              className="mx-auto mb-4 h-16 w-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>検索アイコン</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-lg text-gray-600">
              検索キーワードを入力してください
            </p>
            <p className="mt-2 text-sm text-gray-500">
              2文字以上で検索できます
            </p>
          </div>
        </div>
      )}

      {showResults && (
        <>
          {/* Loading */}
          {isLoading && (
            <div className="flex min-h-[400px] items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {/* Error */}
          {error && !isLoading && (
            <ErrorMessage
              message={error.message || "エラーが発生しました"}
              onRetry={() => handleSearch(searchQuery)}
            />
          )}

          {/* Results */}
          {data && !isLoading && !error && (
            <>
              {/* Results info */}
              <div className="mb-4 text-sm text-gray-600">
                <span className="font-semibold">
                  {data.totalResults.toLocaleString()}
                </span>{" "}
                件の検索結果{" "}
                <span className="text-gray-400">
                  - ページ {data.page} / {data.totalPages}
                </span>
              </div>

              {/* Image grid */}
              <ImageGrid images={data.images} onImageClick={handleImageClick} />

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={data.page}
                    totalPages={data.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Preview modal */}
      {selectedImage && (
        <PreviewModal
          image={selectedImage}
          onClose={handleCloseModal}
          onCopy={handleCopyMarkdown}
          onDownload={handleDownload}
          isOpen={true}
          isLoading={isGeneratingLGTM}
        />
      )}

      {/* Toast notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
