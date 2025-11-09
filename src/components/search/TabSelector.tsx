"use client";

import type { ImageType } from "@/types";

export interface Tab {
  id: ImageType;
  label: string;
}

export interface TabSelectorProps {
  tabs: Tab[];
  activeTab: ImageType;
  onTabChange: (tabId: ImageType) => void;
  className?: string;
}

export function TabSelector({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}: TabSelectorProps) {
  return (
    <div className={`flex gap-2 ${className}`} role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className={`rounded-md px-4 py-2 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isActive
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
