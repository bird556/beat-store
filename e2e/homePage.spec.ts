import { test, expect } from '@playwright/test';

// Shared setup for all tests
test.beforeEach(async ({ page }) => {
  await page.goto('/');

  // Wait for and close the dialog if it appears
  const dialog = page.getByRole('dialog', { name: 'Exclusive Beat Drops' });
  if (await dialog.isVisible()) {
    await dialog.waitFor();
    await page.getByRole('button', { name: 'Close' }).click();
  }
});

// 🏠 Home Page Title Test
test('home page has title', async ({ page }) => {
  const expectedTitles = [
    'Birdie Bands | High-Quality Type Beats & Instrumentals',
    'Birdie Bands | Trap & G-Funk Beats',
  ];

  const actualTitle = await page.title();
  expect(expectedTitles).toContain(actualTitle);
});

// 🎵 Navigate to Beats Page
test('clicking nav link takes you to beat page', async ({ page }) => {
  await page.getByRole('link', { name: 'Beats', exact: true }).click();
  await expect(page).toHaveURL('/beats');
});

// 🔙 Return to Home Page from Beats Page
test('clicking nav link takes you to home page', async ({ page }) => {
  await page.getByRole('link', { name: 'Beats', exact: true }).click();
  await page.getByRole('link', { name: 'Home', exact: true }).click();
  await expect(page).toHaveURL('/');
});

// 📞 Navigate to Contact Page
test('clicking nav link takes you to contact page', async ({ page }) => {
  await page.getByRole('link', { name: 'Contact', exact: true }).click();
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Contact', exact: true })
    .click();

  await expect(page).toHaveURL('/contact');
});
