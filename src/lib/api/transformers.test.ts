import { describe, expect, it } from "vitest";
import type { PexelsPhoto, PixabayImage, UnsplashPhoto } from "@/types";
import {
  convertPexelsToImage,
  convertPixabayToImage,
  convertUnsplashToImage,
} from "./transformers";

describe("Transformers", () => {
  describe("convertUnsplashToImage", () => {
    it("should convert Unsplash photo to Image format", () => {
      const unsplashPhoto: UnsplashPhoto = {
        id: "123",
        urls: {
          raw: "https://example.com/raw.jpg",
          full: "https://example.com/full.jpg",
          regular: "https://example.com/regular.jpg",
          small: "https://example.com/small.jpg",
          thumb: "https://example.com/thumb.jpg",
        },
        width: 1920,
        height: 1080,
        user: {
          id: "user123",
          name: "John Doe",
          username: "johndoe",
          links: {
            html: "https://unsplash.com/@johndoe",
          },
        },
        links: {
          html: "https://unsplash.com/photos/123",
        },
        alt_description: "A beautiful photo",
        tags: [{ title: "nature" }, { title: "landscape" }],
      };

      const result = convertUnsplashToImage(unsplashPhoto);

      expect(result).toEqual({
        id: "unsplash_123",
        url: "https://example.com/regular.jpg",
        thumbnailUrl: "https://example.com/small.jpg",
        width: 1920,
        height: 1080,
        photographer: "John Doe",
        photographerUrl: "https://unsplash.com/@johndoe",
        source: "unsplash",
        sourceUrl: "https://unsplash.com/photos/123",
        alt: "A beautiful photo",
        tags: ["nature", "landscape"],
      });
    });

    it("should handle missing alt_description", () => {
      const unsplashPhoto: UnsplashPhoto = {
        id: "123",
        urls: {
          raw: "https://example.com/raw.jpg",
          full: "https://example.com/full.jpg",
          regular: "https://example.com/regular.jpg",
          small: "https://example.com/small.jpg",
          thumb: "https://example.com/thumb.jpg",
        },
        width: 1920,
        height: 1080,
        user: {
          id: "user123",
          name: "John Doe",
          username: "johndoe",
          links: {
            html: "https://unsplash.com/@johndoe",
          },
        },
        links: {
          html: "https://unsplash.com/photos/123",
        },
        alt_description: null,
      };

      const result = convertUnsplashToImage(unsplashPhoto);

      expect(result.alt).toBeUndefined();
    });

    it("should handle missing tags", () => {
      const unsplashPhoto: UnsplashPhoto = {
        id: "123",
        urls: {
          raw: "https://example.com/raw.jpg",
          full: "https://example.com/full.jpg",
          regular: "https://example.com/regular.jpg",
          small: "https://example.com/small.jpg",
          thumb: "https://example.com/thumb.jpg",
        },
        width: 1920,
        height: 1080,
        user: {
          id: "user123",
          name: "John Doe",
          username: "johndoe",
          links: {
            html: "https://unsplash.com/@johndoe",
          },
        },
        links: {
          html: "https://unsplash.com/photos/123",
        },
        alt_description: "A photo",
      };

      const result = convertUnsplashToImage(unsplashPhoto);

      expect(result.tags).toBeUndefined();
    });
  });

  describe("convertPexelsToImage", () => {
    it("should convert Pexels photo to Image format", () => {
      const pexelsPhoto: PexelsPhoto = {
        id: 456,
        width: 1920,
        height: 1080,
        url: "https://pexels.com/photo/456",
        photographer: "Jane Smith",
        photographer_url: "https://pexels.com/@janesmith",
        photographer_id: 789,
        avg_color: "#000000",
        src: {
          original: "https://example.com/original.jpg",
          large: "https://example.com/large.jpg",
          large2x: "https://example.com/large2x.jpg",
          medium: "https://example.com/medium.jpg",
          small: "https://example.com/small.jpg",
          portrait: "https://example.com/portrait.jpg",
          landscape: "https://example.com/landscape.jpg",
          tiny: "https://example.com/tiny.jpg",
        },
        liked: false,
        alt: "Beautiful landscape",
      };

      const result = convertPexelsToImage(pexelsPhoto);

      expect(result).toEqual({
        id: "pexels_456",
        url: "https://example.com/large.jpg",
        thumbnailUrl: "https://example.com/medium.jpg",
        width: 1920,
        height: 1080,
        photographer: "Jane Smith",
        photographerUrl: "https://pexels.com/@janesmith",
        source: "pexels",
        sourceUrl: "https://pexels.com/photo/456",
        alt: "Beautiful landscape",
      });
    });
  });

  describe("convertPixabayToImage", () => {
    it("should convert Pixabay image to Image format", () => {
      const pixabayImage: PixabayImage = {
        id: 789,
        pageURL: "https://pixabay.com/photo/789",
        type: "photo",
        tags: "nature, landscape, mountain",
        previewURL: "https://example.com/preview.jpg",
        previewWidth: 150,
        previewHeight: 100,
        webformatURL: "https://example.com/webformat.jpg",
        webformatWidth: 640,
        webformatHeight: 480,
        largeImageURL: "https://example.com/large.jpg",
        imageWidth: 1920,
        imageHeight: 1080,
        imageSize: 1024000,
        views: 1000,
        downloads: 500,
        likes: 50,
        comments: 10,
        user_id: 123,
        user: "photographer123",
        userImageURL: "https://example.com/user.jpg",
      };

      const result = convertPixabayToImage(pixabayImage);

      expect(result).toEqual({
        id: "pixabay_789",
        url: "https://example.com/large.jpg",
        thumbnailUrl: "https://example.com/webformat.jpg",
        width: 1920,
        height: 1080,
        photographer: "photographer123",
        photographerUrl: "https://pixabay.com/users/photographer123-123/",
        source: "pixabay",
        sourceUrl: "https://pixabay.com/photo/789",
        tags: ["nature", "landscape", "mountain"],
      });
    });

    it("should handle tags with extra whitespace", () => {
      const pixabayImage: PixabayImage = {
        id: 789,
        pageURL: "https://pixabay.com/photo/789",
        type: "photo",
        tags: "nature,  landscape,mountain",
        previewURL: "https://example.com/preview.jpg",
        previewWidth: 150,
        previewHeight: 100,
        webformatURL: "https://example.com/webformat.jpg",
        webformatWidth: 640,
        webformatHeight: 480,
        largeImageURL: "https://example.com/large.jpg",
        imageWidth: 1920,
        imageHeight: 1080,
        imageSize: 1024000,
        views: 1000,
        downloads: 500,
        likes: 50,
        comments: 10,
        user_id: 123,
        user: "photographer123",
        userImageURL: "https://example.com/user.jpg",
      };

      const result = convertPixabayToImage(pixabayImage);

      expect(result.tags).toEqual(["nature", "landscape", "mountain"]);
    });
  });
});
