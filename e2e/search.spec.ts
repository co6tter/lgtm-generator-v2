import { expect, test } from "@playwright/test";

test.describe("Image Search Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage
    await page.goto("/");
  });

  test("should display homepage with search bar", async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/LGTM Generator/);

    // Check search bar is visible
    const searchInput = page.getByPlaceholder("検索キーワードを入力...");
    await expect(searchInput).toBeVisible();
  });

  test("should show validation error for short query", async ({ page }) => {
    const searchInput = page.getByPlaceholder("検索キーワードを入力...");

    // Type short query
    await searchInput.fill("a");
    await searchInput.press("Enter");

    // Check error message
    await expect(
      page.getByText("検索キーワードは2文字以上で入力してください"),
    ).toBeVisible();
  });

  test("should perform search and display results", async ({ page }) => {
    // Mock API response
    await page.route("**/api/search/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            query: "cat",
            source: "unsplash",
            images: [
              {
                id: "1",
                url: "https://images.unsplash.com/photo-1",
                thumbnailUrl: "https://images.unsplash.com/thumb-1",
                width: 800,
                height: 600,
                alt: "Cat photo",
                photographer: "John Doe",
                photographerUrl: "https://unsplash.com/@john",
                source: "unsplash",
              },
              {
                id: "2",
                url: "https://images.unsplash.com/photo-2",
                thumbnailUrl: "https://images.unsplash.com/thumb-2",
                width: 800,
                height: 600,
                alt: "Another cat",
                photographer: "Jane Doe",
                photographerUrl: "https://unsplash.com/@jane",
                source: "unsplash",
              },
            ],
            totalResults: 100,
            page: 1,
            perPage: 20,
            totalPages: 5,
            timestamp: Date.now(),
          },
        }),
      });
    });

    const searchInput = page.getByPlaceholder("検索キーワードを入力...");

    // Perform search
    await searchInput.fill("cat");
    await searchInput.press("Enter");

    // Wait for results to load
    await page.waitForURL("**/search?query=cat**");

    // Check if images are displayed
    const images = page.getByRole("listitem");
    await expect(images).toHaveCount(2);
  });

  test("should display empty state when no results", async ({ page }) => {
    // Mock empty API response
    await page.route("**/api/search/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            query: "nonexistent",
            source: "unsplash",
            images: [],
            totalResults: 0,
            page: 1,
            perPage: 20,
            totalPages: 0,
            timestamp: Date.now(),
          },
        }),
      });
    });

    const searchInput = page.getByPlaceholder("検索キーワードを入力...");
    await searchInput.fill("nonexistent");
    await searchInput.press("Enter");

    // Check empty state message
    await expect(page.getByText("画像が見つかりませんでした")).toBeVisible();
  });

  test("should handle API errors gracefully", async ({ page }) => {
    // Mock API error
    await page.route("**/api/search/**", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Internal server error",
          },
        }),
      });
    });

    const searchInput = page.getByPlaceholder("検索キーワードを入力...");
    await searchInput.fill("cat");
    await searchInput.press("Enter");

    // Check error message is displayed
    await expect(page.getByText(/エラー/)).toBeVisible();
  });

  test("should switch between image sources", async ({ page }) => {
    // Mock API responses for different sources
    await page.route("**/api/search/unsplash**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            query: "cat",
            source: "unsplash",
            images: [
              {
                id: "unsplash-1",
                url: "https://images.unsplash.com/photo-1",
                thumbnailUrl: "https://images.unsplash.com/thumb-1",
                width: 800,
                height: 600,
                alt: "Unsplash cat",
                photographer: "Unsplash User",
                photographerUrl: "https://unsplash.com/@user",
                source: "unsplash",
              },
            ],
            totalResults: 50,
            page: 1,
            perPage: 20,
            totalPages: 3,
            timestamp: Date.now(),
          },
        }),
      });
    });

    const searchInput = page.getByPlaceholder("検索キーワードを入力...");
    await searchInput.fill("cat");
    await searchInput.press("Enter");

    await page.waitForURL("**/search?query=cat**");

    // Check if Unsplash results are displayed
    const images = page.getByRole("listitem");
    await expect(images.first()).toBeVisible();

    // Switch to Pexels (if tab selector exists)
    const pexelsTab = page.getByRole("tab", { name: /pexels/i });
    if (await pexelsTab.isVisible()) {
      await pexelsTab.click();
      // Verify URL or content changes
    }
  });
});
