import { expect, test } from "@playwright/test";

test.describe("Error Handling", () => {
  test("should handle rate limit errors", async ({ page }) => {
    // Mock rate limit error
    await page.route("**/api/search/**", async (route) => {
      await route.fulfill({
        status: 429,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message:
              "検索回数の上限に達しました。しばらく経ってから再度お試しください。",
          },
        }),
        headers: {
          "Retry-After": "3600",
        },
      });
    });

    await page.goto("/");
    const searchInput = page.getByPlaceholder("検索キーワードを入力...");
    await searchInput.fill("cat");
    await searchInput.press("Enter");

    // Check error message is displayed
    await expect(page.getByText(/検索回数の上限に達しました/i)).toBeVisible();
  });

  test("should handle network errors", async ({ page }) => {
    // Mock network error
    await page.route("**/api/search/**", async (route) => {
      await route.abort("failed");
    });

    await page.goto("/");
    const searchInput = page.getByPlaceholder("検索キーワードを入力...");
    await searchInput.fill("cat");
    await searchInput.press("Enter");

    // Check error message is displayed
    await expect(page.getByText(/エラー|ネットワーク/i)).toBeVisible();
  });

  test("should handle 404 errors", async ({ page }) => {
    // Navigate to non-existent page
    await page.goto("/non-existent-page");

    // Check 404 page is displayed
    await expect(page.getByText(/404|Not Found|見つかりません/i)).toBeVisible();
  });

  test("should handle invalid API responses", async ({ page }) => {
    // Mock invalid JSON response
    await page.route("**/api/search/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: "invalid json",
      });
    });

    await page.goto("/");
    const searchInput = page.getByPlaceholder("検索キーワードを入力...");
    await searchInput.fill("cat");
    await searchInput.press("Enter");

    // Check error is handled gracefully
    await expect(page.getByText(/エラー/i)).toBeVisible();
  });

  test("should retry failed requests", async ({ page }) => {
    let requestCount = 0;

    // Fail first request, succeed on second
    await page.route("**/api/search/**", async (route) => {
      requestCount++;

      if (requestCount === 1) {
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
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: {
              query: "cat",
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
      }
    });

    await page.goto("/");
    const searchInput = page.getByPlaceholder("検索キーワードを入力...");
    await searchInput.fill("cat");
    await searchInput.press("Enter");

    // Wait for retry and check if results load
    await page.waitForTimeout(2000);

    // Should eventually show empty state instead of error
    await expect(page.getByText("画像が見つかりませんでした")).toBeVisible();
  });

  test("should handle CORS errors gracefully", async ({ page }) => {
    // Mock CORS error
    await page.route("**/api/search/**", async (route) => {
      await route.abort("accessdenied");
    });

    await page.goto("/");
    const searchInput = page.getByPlaceholder("検索キーワードを入力...");
    await searchInput.fill("cat");
    await searchInput.press("Enter");

    // Check error message is displayed
    await expect(page.getByText(/エラー/i)).toBeVisible();
  });
});
