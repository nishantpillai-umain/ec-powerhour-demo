import { expect, test } from '@playwright/test';

// Named *.e2e.ts so Vitest's default *.test / *.spec glob doesn't pick it up.
test('every ready tool renders with no errors, dialogs or network calls', async ({ page }) => {
  const problems: string[] = [];
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error') problems.push(`console: ${m.text()}`);
  });
  page.on('dialog', (d) => {
    problems.push(`dialog: ${d.message()}`);
    void d.dismiss();
  });
  await page.route('**/*', (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === 'localhost') return route.continue();
    problems.push(`network: ${url.href}`);
    return route.abort();
  });

  await page.goto('/');
  const ready = page.locator('nav .nav-item.ready');
  const count = await ready.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const link = ready.nth(i);
    const name = (await link.textContent())?.trim() ?? '';
    await link.click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(name);
    await expect(page.locator('.placeholder')).toHaveCount(0);
  }

  expect(problems).toEqual([]);
});
