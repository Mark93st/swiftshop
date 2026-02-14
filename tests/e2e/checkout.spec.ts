import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('should initiate checkout with correct cart items', async ({ page }) => {
    // 1. Add item to cart
    await page.goto('/products');
    await page.getByRole('button', { name: 'Add to Cart' }).first().click();
    await page.getByRole('link', { name: 'Cart' }).click();

    // 2. Setup Network Mocking
    // We intercept the POST request to our backend
    await page.route('/api/checkout', async route => {
      // Verify the request payload contains items
      const postData = route.request().postDataJSON();
      expect(postData.items).toHaveLength(1);
      expect(postData.items[0]).toHaveProperty('id');
      expect(postData.items[0]).toHaveProperty('quantity', 1);

      // Return a mock Stripe session URL
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ url: 'http://localhost:3000/mock-checkout-success' }),
      });
    });

    // 3. Click Checkout
    // Wait for the button to be ready
    const checkoutBtn = page.getByRole('button', { name: 'Proceed to Checkout' });
    await expect(checkoutBtn).toBeVisible();
    await checkoutBtn.click();

    // 4. Verify Redirection
    // The app should redirect to the URL returned by our mock
    await expect(page).toHaveURL('http://localhost:3000/mock-checkout-success');
  });
});
