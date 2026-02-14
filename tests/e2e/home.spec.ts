import { test, expect } from '@playwright/test';

test('homepage has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/SwiftShop/);

  // Check for the main heading
  await expect(page.locator('text=SwiftShop').first()).toBeVisible();
  
  // Check for the "Products" link
  await expect(page.getByRole('link', { name: 'Products', exact: true }).first()).toBeVisible();
});
