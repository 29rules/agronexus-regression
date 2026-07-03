// Reusable wait helpers used across test files

export async function waitForNetworkIdle(page, timeout = 5000) {
  await page.waitForLoadState('networkidle', { timeout });
}

export async function waitForElement(page, selector, timeout = 10000) {
  await page.waitForSelector(selector, { state: 'visible', timeout });
}

export async function retryClick(page, selector, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await page.click(selector, { timeout: 5000 });
      return;
    } catch {
      if (i === retries - 1) throw new Error(`Could not click ${selector} after ${retries} attempts`);
      await page.waitForTimeout(1000);
    }
  }
}

export async function waitForVisible(page, selector, timeout = 10000) {
  return page.locator(selector).waitFor({ state: 'visible', timeout });
}
