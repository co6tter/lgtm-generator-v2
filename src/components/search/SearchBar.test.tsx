import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SearchBar } from "./SearchBar";

describe("SearchBar Component", () => {
  it("should render search input", () => {
    render(<SearchBar onSearch={vi.fn()} />);
    const input = screen.getByLabelText("検索キーワード");
    expect(input).toBeInTheDocument();
  });

  it("should render with placeholder text", () => {
    render(<SearchBar onSearch={vi.fn()} />);
    expect(
      screen.getByPlaceholderText("検索キーワードを入力..."),
    ).toBeInTheDocument();
  });

  it("should render with default value", () => {
    render(<SearchBar onSearch={vi.fn()} defaultValue="cat" />);
    const input = screen.getByLabelText("検索キーワード");
    expect(input).toHaveValue("cat");
  });

  it("should update value when typing", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={vi.fn()} />);
    const input = screen.getByLabelText("検索キーワード");

    await user.type(input, "dog");
    expect(input).toHaveValue("dog");
  });

  it("should call onSearch with trimmed query on submit", async () => {
    const handleSearch = vi.fn();
    const user = userEvent.setup();
    render(<SearchBar onSearch={handleSearch} />);

    const input = screen.getByLabelText("検索キーワード");
    await user.type(input, "  cat  ");
    await user.type(input, "{Enter}");

    expect(handleSearch).toHaveBeenCalledWith("cat");
  });

  it("should show error for query shorter than 2 characters", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={vi.fn()} />);

    const input = screen.getByLabelText("検索キーワード");
    await user.type(input, "a");
    await user.type(input, "{Enter}");

    await waitFor(() => {
      expect(
        screen.getByText("検索キーワードは2文字以上で入力してください"),
      ).toBeInTheDocument();
    });
  });

  it("should show error for query longer than 100 characters", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={vi.fn()} />);

    const input = screen.getByLabelText("検索キーワード");
    await user.type(input, "a".repeat(101));
    await user.type(input, "{Enter}");

    await waitFor(() => {
      expect(
        screen.getByText("検索キーワードは100文字以内で入力してください"),
      ).toBeInTheDocument();
    });
  });

  it("should not call onSearch when validation fails", async () => {
    const handleSearch = vi.fn();
    const user = userEvent.setup();
    render(<SearchBar onSearch={handleSearch} />);

    const input = screen.getByLabelText("検索キーワード");
    await user.type(input, "a");
    await user.type(input, "{Enter}");

    expect(handleSearch).not.toHaveBeenCalled();
  });

  it("should clear error on valid input", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={vi.fn()} />);

    const input = screen.getByLabelText("検索キーワード");

    // First trigger error
    await user.type(input, "a");
    await user.type(input, "{Enter}");

    await waitFor(() => {
      expect(
        screen.getByText("検索キーワードは2文字以上で入力してください"),
      ).toBeInTheDocument();
    });

    // Then fix it
    await user.clear(input);
    await user.type(input, "cat");

    await waitFor(() => {
      expect(
        screen.queryByText("検索キーワードは2文字以上で入力してください"),
      ).not.toBeInTheDocument();
    });
  });

  it("should show error border when validation fails", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={vi.fn()} />);

    const input = screen.getByLabelText("検索キーワード");
    await user.type(input, "a");
    await user.type(input, "{Enter}");

    await waitFor(() => {
      expect(input).toHaveClass("border-red-500");
    });
  });

  it("should have search icon", () => {
    render(<SearchBar onSearch={vi.fn()} />);
    expect(screen.getByText("検索アイコン")).toBeInTheDocument();
  });

  it("should set aria-invalid when there is an error", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={vi.fn()} />);

    const input = screen.getByLabelText("検索キーワード");
    await user.type(input, "a");
    await user.type(input, "{Enter}");

    await waitFor(() => {
      expect(input).toHaveAttribute("aria-invalid", "true");
    });
  });

  it("should associate error message with input using aria-describedby", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={vi.fn()} />);

    const input = screen.getByLabelText("検索キーワード");
    await user.type(input, "a");
    await user.type(input, "{Enter}");

    await waitFor(() => {
      expect(input).toHaveAttribute("aria-describedby", "search-error");
    });
  });

  it("should apply custom className to form", () => {
    const { container } = render(
      <SearchBar onSearch={vi.fn()} className="custom-search-bar" />,
    );
    const form = container.querySelector("form");
    expect(form).toHaveClass("custom-search-bar");
  });

  it("should show realtime validation error", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={vi.fn()} />);

    const input = screen.getByLabelText("検索キーワード");
    await user.type(input, "a");

    await waitFor(() => {
      expect(
        screen.getByText("検索キーワードは2文字以上で入力してください"),
      ).toBeInTheDocument();
    });
  });

  it("should clear realtime error when input becomes valid", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={vi.fn()} />);

    const input = screen.getByLabelText("検索キーワード");
    await user.type(input, "a");

    await waitFor(() => {
      expect(
        screen.getByText("検索キーワードは2文字以上で入力してください"),
      ).toBeInTheDocument();
    });

    await user.type(input, "b");

    await waitFor(() => {
      expect(
        screen.queryByText("検索キーワードは2文字以上で入力してください"),
      ).not.toBeInTheDocument();
    });
  });
});
