import { test, expect } from '@playwright/test';

test.describe('@api — Serverless endpoints health check', () => {
  test.describe('/api/whatsapp', () => {
    test('returns 405 for GET request', async ({ request }) => {
      const res = await request.get('https://agronexustrading.in/api/whatsapp');
      expect([405, 400]).toContain(res.status());
    });

    test('returns 400 for empty POST body', async ({ request }) => {
      const res = await request.post('https://agronexustrading.in/api/whatsapp', { data: {} });
      expect(res.status()).toBe(400);
    });

    test('returns JSON content-type', async ({ request }) => {
      const res = await request.post('https://agronexustrading.in/api/whatsapp', { data: {} });
      expect(res.headers()['content-type']).toContain('application/json');
    });

    test('error response has error property', async ({ request }) => {
      const res = await request.post('https://agronexustrading.in/api/whatsapp', { data: {} });
      const body = await res.json();
      expect(body).toHaveProperty('error');
    });

    test('returns 400 when name is missing', async ({ request }) => {
      const res = await request.post('https://agronexustrading.in/api/whatsapp', {
        data: { product: 'Cumin Seeds', message: 'Test message' },
      });
      expect(res.status()).toBe(400);
    });
  });

  test.describe('/api/chat (Agronexus chatbot backend)', () => {
    test('responds to POST', async ({ request }) => {
      const res = await request.post('https://agronexustrading.in/api/chat', {
        data: { message: 'Hello', session_id: 'test-123' },
      });
      // The chat API proxies to Render — should not 404
      expect(res.status()).not.toBe(404);
    });

    test('response time is under 20 seconds', async ({ request }) => {
      const start = Date.now();
      await request.post('https://agronexustrading.in/api/chat', {
        data: { message: 'Hi', session_id: 'perf-test' },
      });
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(20000);
    });
  });
});
