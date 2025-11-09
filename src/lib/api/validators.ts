import { z } from "zod";

// Search Query Validation Schema
export const searchQuerySchema = z.object({
  query: z
    .string()
    .min(2, "検索キーワードは2文字以上で入力してください")
    .max(100, "検索キーワードは100文字以内で入力してください"),
  page: z.coerce.number().min(1).default(1),
  perPage: z.coerce.number().min(10).max(30).default(20),
});

// Pixabay specific schema with imageType
export const pixabaySearchQuerySchema = searchQuerySchema.extend({
  imageType: z
    .enum(["photo", "illustration", "vector", "all"])
    .default("all")
    .optional(),
});

export type SearchQueryInput = z.infer<typeof searchQuerySchema>;
export type PixabaySearchQueryInput = z.infer<typeof pixabaySearchQuerySchema>;
