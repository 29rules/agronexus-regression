import { test, expect } from '@playwright/test';

test.describe('@navigation — Site navigation', () => {
  const routes = [
    { path: '/', title: /agronexus/i },
    { path: '/about', title: /agronexus/i },
    { path: '/products', title: /agronexus/i },
    { path: '/services', title: /agronexus/i },
    { path: '/gallery', title: /agronexus/i },
    { path: '/certifications', title: /agronexus/i },
    { path: '/contact', title: /agronexus/i },
  ];

  test('all routes return 200', async ({ page }) => {
    for (const route of routes) {
      const res = await page.goto(route.path);
      expect(res?.status(), `${route.path} returned ${res?.status()}`).toBe(200);
    }
  });

  test('all routes have correct title', async ({ page }) => {
    for (const route of routes) {
      await page.goto(route.path);
      await expect(page, `${route.path} title mismatch`).toHaveTitle(route.title);
    }
  });

  test('primary nav is present on homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
  });

  test('nav contains Products link', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const link = page.getByRole('link', { name: 'Products' }).first();
    await expect(link).toBeVisible();
  });

  test('nav contains Contact link', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const link = page.getByRole('link', { name: 'Contact' }).first();
    await expect(link).toBeVisible();
  });

  test('nav contains About link', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const link = page.getByRole('link', { name: 'About' }).first();
    await expect(link).toBeVisible();
  });

  test('clicking Products nav link navigates to /products', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const link = page.locator('nav a[href="/products"]').first();
    await link.click();
    await expect(page).toHaveURL(/\/products/);
  });

  test('clicking Contact nav link navigates to /contact', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const link = page.locator('nav a[href="/contact"]').first();
    await link.click();
    await expect(page).toHaveURL(/\/contact/);
  });

  test('footer is present on homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const footer = page.locator('footer, [role="contentinfo"]').first();
    await expect(footer).toBeVisible();
  });

  test('logo links back to homepage', async ({ page }) => {
    await page.goto('/about');
    await page.waitForLoadState('networkidle');
    const logo = page.locator('header a[href="/"]').first();
    await logo.click();
    await expect(page).toHaveURL(/\/$/);
  });
});
