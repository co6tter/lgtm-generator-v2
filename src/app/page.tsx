"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SearchBar } from "@/components/search/SearchBar";
import { TabSelector } from "@/components/search/TabSelector";
import type { ImageSource } from "@/types";

const TABS = [
  { id: "unsplash" as ImageSource, label: "Unsplash" },
  { id: "pexels" as ImageSource, label: "Pexels" },
  { id: "pixabay" as ImageSource, label: "Pixabay" },
];

export default function Home() {
  const router = useRouter();
  const [activeSource, setActiveSource] = useState<ImageSource>("unsplash");

  const handleSearch = (query: string) => {
    const params = new URLSearchParams();
    params.set("query", query);
    params.set("source", activeSource);
    params.set("page", "1");
    router.push(`/search?${params.toString()}`);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          LGTM Generator
        </h1>
        <p className="mt-4 text-lg text-gray-600">簡単にLGTM画像を生成しよう</p>

        <div className="mt-12">
          <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-sm">
            <div className="mb-6 flex justify-center">
              <TabSelector
                tabs={TABS}
                activeTab={activeSource}
                onTabChange={setActiveSource}
              />
            </div>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        <div className="mt-16 border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-semibold text-gray-900">使い方</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-3 text-3xl font-bold text-blue-500">1</div>
              <h3 className="mb-2 font-semibold text-gray-900">
                キーワードで画像を検索
              </h3>
              <p className="text-sm text-gray-600">
                検索バーにキーワードを入力して、お好みの画像を探します
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-3 text-3xl font-bold text-blue-500">2</div>
              <h3 className="mb-2 font-semibold text-gray-900">
                お好きな画像を選択
              </h3>
              <p className="text-sm text-gray-600">
                検索結果から気に入った画像をクリックします
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-3 text-3xl font-bold text-blue-500">3</div>
              <h3 className="mb-2 font-semibold text-gray-900">
                LGTM画像をコピー or ダウンロード
              </h3>
              <p className="text-sm text-gray-600">
                生成されたLGTM画像をコピーまたはダウンロードします
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>対応検索ソース: Unsplash / Pexels / Pixabay</p>
        </div>
      </div>
    </main>
  );
}
