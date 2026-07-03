import { test, expect } from '@playwright/test';

test.describe('@chatbot — Nexus AI chatbot', () => {
  test('chatbot toggle button is visible on homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const btn = page.locator('.agrochat-toggle-btn').first();
    await expect(btn).toBeVisible();
  });

  test('chat panel is not visible on page load', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Panel exists in DOM but should not be visible until toggled
    const panel = page.locator('.agrochat-panel').first();
    await expect(panel).not.toBeVisible();
  });

  test('clicking toggle opens the chat panel', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const btn = page.locator('.agrochat-toggle-btn').first();
    await btn.click();
    const panel = page.locator('.agrochat-panel').first();
    await expect(panel).toBeVisible({ timeout: 5000 });
  });

  test('welcome message appears on chat open', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const btn = page.locator('.agrochat-toggle-btn').first();
    await btn.click();
    const panel = page.locator('.agrochat-panel').first();
    await expect(panel).toBeVisible({ timeout: 5000 });
    await expect(panel).toContainText(/hello|agrobot|assistant/i);
  });

  test('close button closes the chat panel', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const btn = page.locator('.agrochat-toggle-btn').first();
    await btn.click();
    await page.waitForTimeout(500);
    const closeBtn = page.locator('.agrochat-close-btn').first();
    await expect(closeBtn).toBeVisible({ timeout: 3000 });
    await closeBtn.click();
    const panel = page.locator('.agrochat-panel').first();
    await expect(panel).not.toBeVisible({ timeout: 3000 });
  });

  test('chatbot toggle is visible on all pages', async ({ page }) => {
    const routes = ['/', '/products', '/about', '/contact'];
    for (const route of routes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      const btn = page.locator('.agrochat-toggle-btn').first();
      await expect(btn, `Chatbot toggle missing on ${route}`).toBeVisible();
    }
  });

  test('suggestion buttons appear when chat opens', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const btn = page.locator('.agrochat-toggle-btn').first();
    await btn.click();
    const suggestions = page.locator('.suggestion-btn').first();
    await expect(suggestions).toBeVisible({ timeout: 3000 });
  });

  test('/api/chat endpoint responds without crashing', async ({ request }) => {
    const res = await request.post('https://agronexustrading.in/api/chat', {
      data: { message: 'What products do you sell?', session_id: 'test-session-123' },
    });
    expect(res.status()).toBeLessThan(500);
  });
});
