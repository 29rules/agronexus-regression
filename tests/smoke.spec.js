import { test, expect } from '@playwright/test';
import { assertNoConsoleErrors } from '../helpers/assertions.js';

test.describe('@smoke — Site is up and running', () => {
  test('homepage returns 200', async ({ page }) => {
    const response = await page.goto('/');
    expect(response.status()).toBe(200);
  });

  test('homepage has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/agronexus/i);
  });

  test('homepage has no JavaScript errors', async ({ page }) => {
    const checkErrors = await assertNoConsoleErrors(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    checkErrors();
  });

  test('homepage body is not empty', async ({ page }) => {
    await page.goto('/');
    const body = await page.locator('body').innerText();
    expect(body.trim().length).toBeGreaterThan(100);
  });

  test('/api/whatsapp endpoint is reachable', async ({ request }) => {
    const res = await request.post('https://agronexustrading.in/api/whatsapp', {
      data: {},
    });
    // Should return 400 (missing fields) not 404 or 500
    expect([400, 405]).toContain(res.status());
  });

  test('/api/chat endpoint is reachable', async ({ request }) => {
    const res = await request.post('https://agronexustrading.in/api/chat', {
      data: {},
    });
    // Returns 400 (missing fields) or forwards to external service
    expect(res.status()).toBeLessThan(500);
  });

  test('all main pages return 200', async ({ page }) => {
    const routes = ['/', '/about', '/products', '/contact', '/services', '/gallery', '/certifications'];
    for (const route of routes) {
      const res = await page.goto(route);
      expect(res?.status(), `${route} returned ${res?.status()}`).toBe(200);
    }
  });
});
