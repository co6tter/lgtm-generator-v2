import { describe, expect, it } from "vitest";
import { pixabaySearchQuerySchema, searchQuerySchema } from "./validators";

describe("Validators", () => {
  describe("searchQuerySchema", () => {
    it("should validate valid search query", () => {
      const result = searchQuerySchema.parse({
        query: "cat",
        page: "1",
        perPage: "20",
      });

      expect(result).toEqual({
        query: "cat",
        page: 1,
        perPage: 20,
      });
    });

    it("should use default values", () => {
      const result = searchQuerySchema.parse({
        query: "cat",
      });

      expect(result.page).toBe(1);
      expect(result.perPage).toBe(20);
    });

    it("should coerce string numbers to numbers", () => {
      const result = searchQuerySchema.parse({
        query: "cat",
        page: "2",
        perPage: "15",
      });

      expect(result.page).toBe(2);
      expect(result.perPage).toBe(15);
    });

    it("should reject query shorter than 2 characters", () => {
      expect(() => {
        searchQuerySchema.parse({
          query: "a",
          page: "1",
          perPage: "20",
        });
      }).toThrow("検索キーワードは2文字以上で入力してください");
    });

    it("should reject query longer than 100 characters", () => {
      expect(() => {
        searchQuerySchema.parse({
          query: "a".repeat(101),
          page: "1",
          perPage: "20",
        });
      }).toThrow("検索キーワードは100文字以内で入力してください");
    });

    it("should reject page less than 1", () => {
      expect(() => {
        searchQuerySchema.parse({
          query: "cat",
          page: "0",
          perPage: "20",
        });
      }).toThrow();
    });

    it("should reject perPage less than 10", () => {
      expect(() => {
        searchQuerySchema.parse({
          query: "cat",
          page: "1",
          perPage: "9",
        });
      }).toThrow();
    });

    it("should reject perPage greater than 30", () => {
      expect(() => {
        searchQuerySchema.parse({
          query: "cat",
          page: "1",
          perPage: "31",
        });
      }).toThrow();
    });

    it("should accept perPage at minimum boundary (10)", () => {
      const result = searchQuerySchema.parse({
        query: "cat",
        page: "1",
        perPage: "10",
      });

      expect(result.perPage).toBe(10);
    });

    it("should accept perPage at maximum boundary (30)", () => {
      const result = searchQuerySchema.parse({
        query: "cat",
        page: "1",
        perPage: "30",
      });

      expect(result.perPage).toBe(30);
    });
  });

  describe("pixabaySearchQuerySchema", () => {
    it("should validate valid pixabay query with imageType", () => {
      const result = pixabaySearchQuerySchema.parse({
        query: "cat",
        page: "1",
        perPage: "20",
        imageType: "photo",
      });

      expect(result).toEqual({
        query: "cat",
        page: 1,
        perPage: 20,
        imageType: "photo",
      });
    });

    it('should use default imageType "all"', () => {
      const result = pixabaySearchQuerySchema.parse({
        query: "cat",
      });

      expect(result.imageType).toBe("all");
    });

    it("should accept valid imageType values", () => {
      const types = ["photo", "illustration", "vector", "all"] as const;

      for (const type of types) {
        const result = pixabaySearchQuerySchema.parse({
          query: "cat",
          imageType: type,
        });

        expect(result.imageType).toBe(type);
      }
    });

    it("should reject invalid imageType", () => {
      expect(() => {
        pixabaySearchQuerySchema.parse({
          query: "cat",
          imageType: "invalid",
        });
      }).toThrow();
    });

    it("should inherit searchQuerySchema validations", () => {
      expect(() => {
        pixabaySearchQuerySchema.parse({
          query: "a",
          imageType: "photo",
        });
      }).toThrow("検索キーワードは2文字以上で入力してください");
    });
  });
});
