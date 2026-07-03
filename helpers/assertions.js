import { expect } from '@playwright/test';

// Assert no JavaScript errors on the page
export async function assertNoConsoleErrors(page) {
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error' && !msg.text().includes('favicon')) {
      errors.push(msg.text());
    }
  });
  return () => expect(errors, `Console errors found: ${errors.join(', ')}`).toHaveLength(0);
}

// Assert element is in viewport
export async function assertInViewport(page, selector) {
  const element = page.locator(selector).first();
  await expect(element).toBeVisible();
  await expect(element).toBeInViewport();
}

// Assert page loads under X milliseconds
export async function assertPageLoadTime(page, url, maxMs = 5000) {
  const start = Date.now();
  await page.goto(url);
  const elapsed = Date.now() - start;
  expect(elapsed, `Page load took ${elapsed}ms, expected under ${maxMs}ms`).toBeLessThan(maxMs);
}
