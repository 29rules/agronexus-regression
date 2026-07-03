import { test, expect } from '@playwright/test';

test.describe('@chatbot — Nexus AI chatbot', () => {
  test('chatbot toggle button is visible on homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // The AgroChat toggle button
    const btn = page.locator('.agrochat-toggle-btn, [aria-label*="chat" i], [aria-label*="agrobot" i]').first();
    await expect(btn).toBeVisible();
  });

  test('chat panel is hidden on page load', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
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

  test('welcome message appears without making API call', async ({ page }) => {
    const apiCalls = [];
    page.on('request', req => {
      if (req.url().includes('/chat')) apiCalls.push(req.url());
    });
    await page.goto('/');
    const btn = page.locator('.agrochat-toggle-btn').first();
    await btn.click();
    await page.waitForTimeout(1000);
    expect(apiCalls).toHaveLength(0);
    const panel = page.locator('.agrochat-panel');
    await expect(panel).toContainText(/hello|hi|agrobot|assistant/i);
  });

  test('close button closes the chat panel', async ({ page }) => {
    await page.goto('/');
    const btn = page.locator('.agrochat-toggle-btn').first();
    await btn.click();
    const closeBtn = page.locator('.agrochat-close-btn, .agrochat-panel button[aria-label*="close" i]').first();
    await closeBtn.click();
    const panel = page.locator('.agrochat-panel').first();
    await expect(panel).not.toBeVisible({ timeout: 3000 });
  });

  test('chatbot is visible on all pages', async ({ page }) => {
    const routes = ['/', '/products', '/about', '/contact'];
    for (const route of routes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      const btn = page.locator('.agrochat-toggle-btn').first();
      await expect(btn, `Chatbot toggle missing on ${route}`).toBeVisible();
    }
  });

  test('/api/chat endpoint responds to POST', async ({ request }) => {
    const res = await request.post('https://agronexustrading.in/api/chat', {
      data: { message: 'What products do you sell?', session_id: 'test-session-123' },
    });
    // Should respond (not 404/500)
    expect(res.status()).toBeLessThan(500);
  });

  test('suggestion buttons are shown on chat open', async ({ page }) => {
    await page.goto('/');
    const btn = page.locator('.agrochat-toggle-btn').first();
    await btn.click();
    const suggestions = page.locator('.suggestions, .suggestion-btn');
    await expect(suggestions.first()).toBeVisible({ timeout: 3000 });
  });
});
