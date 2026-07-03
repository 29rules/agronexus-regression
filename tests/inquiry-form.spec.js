import { test, expect } from '@playwright/test';

test.describe('@form — Inquiry / contact form', () => {
  test('contact page loads', async ({ page }) => {
    const res = await page.goto('/contact');
    expect(res?.status()).toBe(200);
  });

  test('inquiry form is visible on /contact', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    const form = page.locator('form').first();
    await expect(form).toBeVisible();
  });

  test('form has all required fields', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('input[placeholder="e.g. Rahul Patel"]').first()).toBeVisible();
    await expect(page.locator('input[placeholder="Company name"]').first()).toBeVisible();
    await expect(page.locator('input[placeholder="you@company.com"]').first()).toBeVisible();
    await expect(page.locator('select').first()).toBeVisible();
    await expect(page.locator('button[type="submit"]').first()).toBeVisible();
  });

  test('form shows submit button', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    const submitBtn = page.locator('button[type="submit"]').first();
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeEnabled();
  });

  test('name field accepts text input', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    const nameInput = page.locator('input[placeholder="e.g. Rahul Patel"]').first();
    await nameInput.fill('Test User');
    await expect(nameInput).toHaveValue('Test User');
  });

  test('email field accepts valid email', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    const emailInput = page.locator('input[placeholder="you@company.com"]').first();
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');
  });

  test('product dropdown has options', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    const select = page.locator('select').first();
    const options = await select.locator('option').count();
    expect(options).toBeGreaterThan(1);
  });

  test('form heading is Send an inquiry', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    const heading = page.getByRole('heading', { name: /send an inquiry/i });
    await expect(heading).toBeVisible();
  });
});
