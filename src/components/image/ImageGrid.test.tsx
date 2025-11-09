import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Image } from "@/types";
import { ImageGrid } from "./ImageGrid";

// Mock ImageCard component
vi.mock("./ImageCard", () => ({
  ImageCard: ({
    image,
    onClick,
  }: {
    image: Image;
    onClick: (img: Image) => void;
  }) => (
    <button type="button" onClick={() => onClick(image)}>
      {image.alt || "Image"}
    </button>
  ),
}));

describe("ImageGrid Component", () => {
  const mockImages: Image[] = [
    {
      id: "1",
      url: "https://example.com/image1.jpg",
      thumbnailUrl: "https://example.com/thumb1.jpg",
      width: 800,
      height: 600,
      alt: "Cat photo",
      photographer: "John Doe",
      photographerUrl: "https://example.com/john",
      source: "unsplash",
    },
    {
      id: "2",
      url: "https://example.com/image2.jpg",
      thumbnailUrl: "https://example.com/thumb2.jpg",
      width: 800,
      height: 600,
      alt: "Dog photo",
      photographer: "Jane Doe",
      photographerUrl: "https://example.com/jane",
      source: "pexels",
    },
  ];

  it("should render images when provided", () => {
    render(<ImageGrid images={mockImages} onImageClick={vi.fn()} />);
    expect(screen.getByText("Cat photo")).toBeInTheDocument();
    expect(screen.getByText("Dog photo")).toBeInTheDocument();
  });

  it("should render empty state when no images", () => {
    render(<ImageGrid images={[]} onImageClick={vi.fn()} />);
    expect(screen.getByText("画像が見つかりませんでした")).toBeInTheDocument();
    expect(
      screen.getByText("別のキーワードで検索してみてください"),
    ).toBeInTheDocument();
  });

  it("should call onImageClick when image is clicked", async () => {
    const handleImageClick = vi.fn();
    const user = userEvent.setup();

    render(<ImageGrid images={mockImages} onImageClick={handleImageClick} />);
    const firstImage = screen.getByText("Cat photo");

    await user.click(firstImage);
    expect(handleImageClick).toHaveBeenCalledWith(mockImages[0]);
  });

  it("should render grid with role list", () => {
    render(<ImageGrid images={mockImages} onImageClick={vi.fn()} />);
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("should render each image in a listitem", () => {
    render(<ImageGrid images={mockImages} onImageClick={vi.fn()} />);
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(2);
  });

  it("should apply custom className", () => {
    const { container } = render(
      <ImageGrid
        images={mockImages}
        onImageClick={vi.fn()}
        className="custom-grid"
      />,
    );
    const grid = container.querySelector('[role="list"]');
    expect(grid).toHaveClass("custom-grid");
  });

  it("should apply responsive grid classes", () => {
    const { container } = render(
      <ImageGrid images={mockImages} onImageClick={vi.fn()} />,
    );
    const grid = container.querySelector('[role="list"]');
    expect(grid).toHaveClass("grid", "grid-cols-1", "sm:grid-cols-2");
  });

  it("should render correct number of images", () => {
    const manyImages = Array.from({ length: 20 }, (_, i) => ({
      ...mockImages[0],
      id: String(i),
      alt: `Image ${i}`,
    }));

    render(<ImageGrid images={manyImages} onImageClick={vi.fn()} />);
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(20);
  });
});
