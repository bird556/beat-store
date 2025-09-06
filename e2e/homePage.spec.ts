import { test, expect } from '@playwright/test';

// Home Page Title Test
test('home page has title', async ({ page }) => {
  await page.goto('/');
  expect([
    'Birdie Bands | High-Quality Type Beats & Instrumentals',
    'Birdie Bands | Trap & G-Funk Beats',
  ]).toContain(await page.title());
});

// Click nav link Beats take you to beat page
test('clicking nav link takes you to beat page', async ({ page }) => {
  await page.goto('/');
  // Wait for the dialog to open. This is optional but good practice.
  await page.getByRole('dialog', { name: 'Exclusive Beat Drops' }).waitFor();

  // Find the button with the accessible name "Close" and click it.
  await page.getByRole('button', { name: 'Close' }).click();

  // Now, the "Beats" link is clickable.
  await page.getByRole('link', { name: 'Beats', exact: true }).click();

  await expect(page).toHaveURL('/beats');
});

// Go back to home page from beat page
test('clicking nav link takes you to home page', async ({ page }) => {
  await page.goto('/');
  // Wait for the dialog to open. This is optional but good practice.
  await page.getByRole('dialog', { name: 'Exclusive Beat Drops' }).waitFor();

  // Find the button with the accessible name "Close" and click it.
  await page.getByRole('button', { name: 'Close' }).click();

  await page.getByRole('link', { name: 'Beats', exact: true }).click();

  await page.getByRole('link', { name: 'Home', exact: true }).click();
  await expect(page).toHaveURL('/');
});

// Click nav link Contact take you to contact page
test('clicking nav link takes you to contact page', async ({ page }) => {
  await page.goto('/');

  // Wait for the dialog to open. This is optional but good practice.
  await page.getByRole('dialog', { name: 'Exclusive Beat Drops' }).waitFor();

  // Find the button with the accessible name "Close" and click it.
  await page.getByRole('button', { name: 'Close' }).click();

  await page.getByRole('link', { name: 'Contact', exact: true }).click();
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Contact', exact: true })
    .click();

  await expect(page).toHaveURL('/contact');
});
