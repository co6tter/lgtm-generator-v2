import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoadingSpinner } from "./LoadingSpinner";

describe("LoadingSpinner Component", () => {
  it("should render with role status", () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
  });

  it("should have aria-label for accessibility", () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByLabelText("読み込み中");
    expect(spinner).toBeInTheDocument();
  });

  it("should render screen reader text", () => {
    render(<LoadingSpinner />);
    expect(screen.getByText("読み込み中...")).toBeInTheDocument();
  });

  it("should apply medium size by default", () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("w-8", "h-8", "border-3");
  });

  it("should apply small size when specified", () => {
    render(<LoadingSpinner size="sm" />);
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("w-4", "h-4", "border-2");
  });

  it("should apply large size when specified", () => {
    render(<LoadingSpinner size="lg" />);
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("w-12", "h-12", "border-4");
  });

  it("should apply custom className", () => {
    render(<LoadingSpinner className="custom-spinner" />);
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("custom-spinner");
  });

  it("should have animation classes", () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("animate-spin", "rounded-full");
  });

  it("should have correct border styles", () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass(
      "border-solid",
      "border-blue-500",
      "border-t-transparent",
    );
  });
});
