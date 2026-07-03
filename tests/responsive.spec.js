import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: 'Mobile', width: 375, height: 812 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1280, height: 800 },
];

test.describe('@responsive — Layout at all breakpoints', () => {
  for (const vp of VIEWPORTS) {
    test(`[${vp.name}] homepage renders without horizontal scroll`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth, `Horizontal scroll at ${vp.name} (${vp.width}px)`).toBeLessThanOrEqual(vp.width + 5);
    });

    test(`[${vp.name}] WhatsApp bubble is visible`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const bubble = page.locator('a[href*="wa.me"]').first();
      await expect(bubble).toBeVisible();
    });

    test(`[${vp.name}] chatbot toggle is visible`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const btn = page.locator('.agrochat-toggle-btn').first();
      await expect(btn).toBeVisible();
    });

    test(`[${vp.name}] chatbot opens successfully`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const btn = page.locator('.agrochat-toggle-btn').first();
      await btn.click();
      const panel = page.locator('.agrochat-panel').first();
      await expect(panel).toBeVisible({ timeout: 5000 });
    });

    test(`[${vp.name}] navigation is accessible`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const nav = page.locator('nav, header').first();
      await expect(nav).toBeVisible();
    });
  }
});
