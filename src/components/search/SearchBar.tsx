"use client";

import { type FormEvent, useState } from "react";

export interface SearchBarProps {
  onSearch: (query: string) => void;
  defaultValue?: string;
  className?: string;
}

export function SearchBar({
  onSearch,
  defaultValue = "",
  className = "",
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // バリデーション
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) {
      setError("検索キーワードは2文字以上で入力してください");
      return;
    }
    if (trimmedQuery.length > 100) {
      setError("検索キーワードは100文字以内で入力してください");
      return;
    }

    setError("");
    onSearch(trimmedQuery);
  };

  const handleChange = (value: string) => {
    setQuery(value);
    // リアルタイムバリデーション
    if (value.trim().length > 0 && value.trim().length < 2) {
      setError("検索キーワードは2文字以上で入力してください");
    } else {
      setError("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <svg
            className="h-5 w-5 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <title>検索アイコン</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="検索キーワードを入力..."
          className={`w-full rounded-md border py-3 pl-11 pr-4 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
          }`}
          aria-label="検索キーワード"
          aria-invalid={!!error}
          aria-describedby={error ? "search-error" : undefined}
        />
      </div>
      {error && (
        <p id="search-error" className="mt-1 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
