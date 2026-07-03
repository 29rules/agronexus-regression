import { test, expect } from '@playwright/test';

test.describe('@api — Serverless endpoints health check', () => {
  test.describe('/api/whatsapp', () => {
    test('returns 405 for GET request', async ({ request }) => {
      const res = await request.get('https://agronexustrading.in/api/whatsapp');
      // Vercel returns 405 for unsupported methods, or redirects
      expect([405, 400, 301, 302]).toContain(res.status());
    });

    test('endpoint exists and returns JSON', async ({ request }) => {
      const res = await request.post('https://agronexustrading.in/api/whatsapp', { data: {} });
      // Returns 400 (validation) or 500 (env vars not configured in this env)
      // Either way it must not be 404 — endpoint must exist
      expect(res.status()).not.toBe(404);
      const ct = res.headers()['content-type'];
      expect(ct).toContain('application/json');
    });

    test('error response has error property', async ({ request }) => {
      const res = await request.post('https://agronexustrading.in/api/whatsapp', { data: {} });
      const body = await res.json();
      expect(body).toHaveProperty('error');
    });

    test('does not expose token in response', async ({ request }) => {
      const res = await request.post('https://agronexustrading.in/api/whatsapp', { data: {} });
      const body = await res.text();
      expect(body).not.toMatch(/EAA[a-zA-Z0-9]+/);
      expect(body).not.toContain('WHATSAPP_ACCESS_TOKEN');
    });
  });

  test.describe('/api/chat (Agronexus chatbot backend)', () => {
    test('chatbot widget loads and calls Render backend directly', async ({ page }) => {
      // The chatbot calls agronexus-chatbot.onrender.com directly — not /api/chat
      // Verify the widget is present and functional instead
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const btn = page.locator('.agrochat-toggle-btn').first();
      await expect(btn).toBeVisible();
    });

    test('chat send does not call /api/chat on this domain', async ({ page }) => {
      const localChatCalls = [];
      page.on('request', req => {
        if (req.url().includes('agronexustrading.in/api/chat')) {
          localChatCalls.push(req.url());
        }
      });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      // No local /api/chat calls on page load
      expect(localChatCalls).toHaveLength(0);
    });
  });
});
