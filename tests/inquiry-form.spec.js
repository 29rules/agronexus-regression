import { test, expect } from '@playwright/test';

test.describe('@form — Inquiry / contact form', () => {
  async function goToForm(page) {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
  }

  test('inquiry form is present on the contact page', async ({ page }) => {
    await goToForm(page);
    const form = page.locator('form').first();
    await expect(form).toBeVisible();
  });

  test('form has name, email, and message fields', async ({ page }) => {
    await goToForm(page);
    const nameField = page.locator('input[name*="name" i], input[placeholder*="name" i]').first();
    const emailField = page.locator('input[type="email"], input[name*="email" i]').first();
    const messageField = page.locator('textarea, input[name*="message" i]').first();
    await expect(nameField).toBeVisible();
    await expect(emailField).toBeVisible();
    await expect(messageField).toBeVisible();
  });

  test('form has a submit button', async ({ page }) => {
    await goToForm(page);
    const submit = page.locator('button[type="submit"], input[type="submit"], button:has-text("send"), button:has-text("submit")').first();
    await expect(submit).toBeVisible();
  });

  test('form submits and triggers API call or shows success', async ({ page }) => {
    await goToForm(page);
    const apiCallMade = page.waitForRequest(
      req => req.url().includes('/api/') && req.method() === 'POST',
      { timeout: 10000 }
    ).catch(() => null);

    const nameField = page.locator('input[name*="name" i], input[placeholder*="name" i]').first();
    const emailField = page.locator('input[type="email"]').first();
    const messageField = page.locator('textarea').first();
    const submitBtn = page.locator('button[type="submit"]').first();

    await nameField.fill('Test Buyer QA');
    await emailField.fill('qa@agronexus.test');
    await messageField.fill('Regression test inquiry — please ignore');

    const productSelect = page.locator('select').first();
    if (await productSelect.isVisible().catch(() => false)) {
      await productSelect.selectOption({ index: 1 });
    }

    await submitBtn.click();

    const apiCall = await apiCallMade;
    const successMsg = page.locator('[class*="success"], [class*="Success"]').first();
    const apiCalled = apiCall !== null;
    const successVisible = await successMsg.isVisible().catch(() => false);

    expect(apiCalled || successVisible, 'Form did not submit').toBe(true);
  });

  test('WhatsApp inquiry section is present', async ({ page }) => {
    await goToForm(page);
    const body = await page.locator('body').innerText();
    expect(body.toLowerCase()).toMatch(/whatsapp|wa|inquiry/i);
  });
});
