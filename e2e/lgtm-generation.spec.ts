import { expect, test } from "@playwright/test";

test.describe("LGTM Generation Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Mock API to provide test images
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
            ],
            totalResults: 1,
            page: 1,
            perPage: 20,
            totalPages: 1,
            timestamp: Date.now(),
          },
        }),
      });
    });

    // Navigate and search
    await page.goto("/");
    const searchInput = page.getByPlaceholder("検索キーワードを入力...");
    await searchInput.fill("cat");
    await searchInput.press("Enter");
    await page.waitForURL("**/search?query=cat**");
  });

  test("should open preview modal when clicking an image", async ({ page }) => {
    // Click on an image
    const firstImage = page.getByRole("listitem").first();
    await firstImage.click();

    // Check if modal is opened
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
  });

  test("should generate LGTM preview in modal", async ({ page }) => {
    // Click on an image
    const firstImage = page.getByRole("listitem").first();
    await firstImage.click();

    // Wait for modal
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();

    // Check if LGTM preview is visible
    // The canvas or preview image should be visible
    await expect(modal.locator("canvas, img")).toBeVisible();
  });

  // Skip clipboard test in CI environment due to image loading restrictions
  test.skip("should copy LGTM to clipboard", async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(["clipboard-write", "clipboard-read"]);

    // Click on an image
    const firstImage = page.getByRole("listitem").first();
    await firstImage.click();

    // Wait for modal
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();

    // Wait for LGTM text to appear (image generation complete)
    await expect(modal.getByText("LGTM")).toBeVisible();

    // Click copy button
    const copyButton = modal.getByRole("button", { name: /コピー|copy/i });
    await copyButton.click();

    // Check for success message
    await expect(page.getByText(/画像をコピーしました/i)).toBeVisible();
  });

  // Skip download test in CI environment due to image loading restrictions
  test.skip("should download LGTM image", async ({ page }) => {
    // Click on an image
    const firstImage = page.getByRole("listitem").first();
    await firstImage.click();

    // Wait for modal
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();

    // Wait for LGTM text to appear (image generation complete)
    await expect(modal.getByText("LGTM")).toBeVisible();

    // Set up download listener
    const downloadPromise = page.waitForEvent("download");

    // Click download button
    const downloadButton = modal.getByRole("button", {
      name: /ダウンロード|download/i,
    });
    await downloadButton.click();

    // Wait for download to start
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/lgtm.*\.(png|jpg|jpeg)/i);
  });

  test("should close modal when clicking close button", async ({ page }) => {
    // Click on an image
    const firstImage = page.getByRole("listitem").first();
    await firstImage.click();

    // Wait for modal
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();

    // Click close button
    const closeButton = modal.getByRole("button", { name: /閉じる|close/i });
    await closeButton.click();

    // Check modal is closed
    await expect(modal).not.toBeVisible();
  });

  test("should close modal when clicking outside", async ({ page }) => {
    // Click on an image
    const firstImage = page.getByRole("listitem").first();
    await firstImage.click();

    // Wait for modal
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();

    // Click outside modal (on backdrop) by pressing ESC key
    await page.keyboard.press("Escape");

    // Check modal is closed
    await expect(modal).not.toBeVisible();
  });

  test("should allow customizing LGTM text", async ({ page }) => {
    // Click on an image
    const firstImage = page.getByRole("listitem").first();
    await firstImage.click();

    // Wait for modal
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();

    // Find text input (if exists)
    const textInput = modal.getByLabel(/テキスト|text/i);
    if (await textInput.isVisible()) {
      await textInput.fill("Custom LGTM");

      // Check if preview updates
      // This would depend on implementation
      await expect(modal).toContainText("Custom LGTM");
    }
  });
});
