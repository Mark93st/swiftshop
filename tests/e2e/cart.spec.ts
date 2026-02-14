import { test, expect } from '@playwright/test';

test.describe('Cart Management', () => {
  test('should add item to cart, update quantity, and remove it', async ({ page }) => {
    // 1. Navigate to products page
    await page.goto('/products');

    // 2. Find a product card (first one)
    // We target the "Add to Cart" button within the first product card
    const addToCartBtn = page.getByRole('button', { name: 'Add to Cart' }).first();
    
    // Ensure button is visible before clicking
    await expect(addToCartBtn).toBeVisible();
    await addToCartBtn.click();

    // 3. Verify success message (Toast) or Cart Badge
    // Checking for the toast message "Added ... to cart"
    await expect(page.getByText(/Added .* to cart/)).toBeVisible();

    // Check cart badge in navbar (assuming it shows '1')
    const cartLink = page.getByRole('link', { name: 'Cart' });
    await expect(cartLink).toContainText('1');

    // 4. Navigate to Cart page
    await cartLink.click();
    await expect(page).toHaveURL('/cart');
    await expect(page.getByRole('heading', { name: 'Your Shopping Cart' })).toBeVisible();

    // 5. Verify item is in cart
    // We expect at least one remove button to exist
    const removeBtn = page.getByRole('button', { name: 'Remove' });
    await expect(removeBtn).toBeVisible();

    // 6. Update Quantity
    // Get initial total price
    const totalElement = page.locator('text=Total').locator('..').locator('span').nth(1);
    const initialTotalText = await totalElement.textContent();
    const initialTotal = parseFloat(initialTotalText?.replace('$', '') || '0');

    // Click "Increase quantity"
    await page.getByLabel('Increase quantity').click();

    // Verify quantity increased to 2
    await expect(page.locator('span.w-8.text-center')).toHaveText('2');

    // Verify total price increased (wait for it to be greater than initial)
    // We poll until the text changes
    await expect(async () => {
        const newTotalText = await totalElement.textContent();
        const newTotal = parseFloat(newTotalText?.replace('$', '') || '0');
        expect(newTotal).toBeGreaterThan(initialTotal);
    }).toPass();

    // 7. Remove Item
    await removeBtn.click();

    // 8. Verify Empty State
    await expect(page.getByText('Your cart is empty')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Browse Products' })).toBeVisible();
  });
});
