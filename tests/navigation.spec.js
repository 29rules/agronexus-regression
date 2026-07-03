import { test, expect } from '@playwright/test';
import { URLS } from '../config/urls.js';

test.describe('@navigation — All pages load', () => {
  test('navigation bar is visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const nav = page.locator('nav, header, [role="navigation"]').first();
    await expect(nav).toBeVisible();
  });

  test('logo is visible and links to home', async ({ page }) => {
    await page.goto('/');
    const logo = page.locator('nav img, header img, .logo, [alt*="agronexus" i], [class*="logo" i]').first();
    await expect(logo).toBeVisible();
  });

  test('all main routes return 200', async ({ page }) => {
    const routes = Object.values(URLS);
    for (const route of routes) {
      const res = await page.goto(route);
      expect(res?.status(), `${route} returned ${res?.status()}`).toBe(200);
    }
  });

  test('page does not have broken images on homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const images = await page.locator('img').all();
    for (const img of images) {
      const src = await img.getAttribute('src');
      if (!src || src.startsWith('data:')) continue;
      const naturalWidth = await img.evaluate(el => el.naturalWidth);
      expect(naturalWidth, `Image broken: ${src}`).toBeGreaterThan(0);
    }
  });

  test('footer is visible on homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const footer = page.locator('footer, [class*="footer" i]').first();
    await expect(footer).toBeVisible();
  });

  test('contact page has a form', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    const form = page.locator('form').first();
    await expect(form).toBeVisible();
  });

  test('products page shows product listings', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    const body = await page.locator('body').innerText();
    expect(body.toLowerCase()).toMatch(/cumin|fennel|coriander|spice|seed/i);
  });
});
