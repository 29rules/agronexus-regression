import { test, expect } from '@playwright/test';

test.describe('@whatsapp — WhatsApp integration', () => {
  test('WA bubble is visible on homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const bubble = page.locator('a[href*="wa.me"]').first();
    await expect(bubble).toBeVisible();
  });

  test('WA bubble is visible on all pages', async ({ page }) => {
    const routes = ['/', '/products', '/about', '/contact'];
    for (const route of routes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      const bubble = page.locator('a[href*="wa.me"]').first();
      await expect(bubble, `WA bubble missing on ${route}`).toBeVisible();
    }
  });

  test('WA bubble link contains valid phone number', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const bubble = page.locator('a[href*="wa.me"]').first();
    const href = await bubble.getAttribute('href');
    expect(href).toMatch(/wa\.me\/\d{10,15}/);
  });

  test('WA bubble link points to Agronexus number', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const bubble = page.locator('a[href*="wa.me"]').first();
    const href = await bubble.getAttribute('href');
    // The Agronexus number is 919909729560
    expect(href).toContain('919909729560');
  });

  test('WA bubble opens in new tab', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const bubble = page.locator('a.wab-bubble').first();
    const target = await bubble.getAttribute('target');
    expect(target).toBe('_blank');
  });

  test('/api/whatsapp returns 400 for missing fields', async ({ request }) => {
    const res = await request.post('https://agronexustrading.in/api/whatsapp', {
      data: {},
    });
    expect(res.status()).toBe(400);
  });

  test('/api/whatsapp does not expose credentials in response', async ({ request }) => {
    const res = await request.post('https://agronexustrading.in/api/whatsapp', {
      data: {},
    });
    const body = await res.text();
    expect(body).not.toMatch(/EAA[a-zA-Z0-9]+/);
    expect(body).not.toContain('WHATSAPP_ACCESS_TOKEN');
    expect(body).not.toContain('PHONE_NUMBER_ID');
  });

  test('WA contact section is on contact page', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    const body = await page.locator('body').innerText();
    expect(body.toLowerCase()).toMatch(/whatsapp|wa\.me/i);
  });
});
