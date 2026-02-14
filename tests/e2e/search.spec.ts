import { test, expect } from '@playwright/test';

test.describe('Product Discovery', () => {
  test('should search for a product and filter results', async ({ page }) => {
    // 1. Go to products page to find a valid search term
    await page.goto('/products');
    
    // Wait for products to load
    // We target h3s specifically within the main content area (not the sidebar)
    // The product grid usually has a specific class or we can assume it's the one with a link parent
    const firstProductTitle = page.locator('main h3').first(); 
    // Actually, sidebar is usually aside, main content is div.flex-1. 
    // Let's rely on the fact that product cards have links.
    // Better: page.locator('a > h3').first() assuming the card title is inside a link, 
    // OR just use the text color class if unique, OR just skip the sidebar headings.
    
    // Sidebar headings are "Categories", "Search", "Sort By", "Price Range".
    // We can filter those out.
    const productTitles = page.locator('h3').filter({ hasNotText: /Categories|Search|Sort By|Price Range/ });
    await expect(productTitles.first()).toBeVisible();
    const productName = await productTitles.first().textContent();
    
    if (!productName) throw new Error('No products found to search for');
    
    console.log(`Searching for: ${productName}`);

    // 2. Perform Search via Navbar
    const searchInput = page.getByPlaceholder('Search products...').first(); // .first() because mobile nav might duplicate it in DOM or similar
    await searchInput.fill(productName);
    
    // Wait for debounce (500ms) or press enter
    await page.keyboard.press('Enter');

    // 3. Verify URL and Results
    await expect(page).toHaveURL(new RegExp(`q=${encodeURIComponent(productName).replace(/%20/g, '.*')}`)); // Regex to handle potential encoding diffs
    
    // The specific product should be visible
    await expect(page.getByRole('heading', { name: `Results for "${productName}"` })).toBeVisible();
    await expect(page.locator('h3', { hasText: productName }).first()).toBeVisible();

    // 4. Test "No Results" Filter
    // Set a crazy high min price
    const minPriceInput = page.getByPlaceholder('Min');
    await minPriceInput.fill('999999');
    await page.getByRole('button', { name: 'Apply Price Range' }).click();

    // Verify "No products found"
    await expect(page.getByText('No products found')).toBeVisible();

    // 5. Clear Filters
    await page.getByRole('button', { name: 'Clear All Filters' }).click();
    
    // Verify products are back
    await expect(page.locator('h3').first()).toBeVisible();
    await expect(page.getByText('No products found')).not.toBeVisible();
  });
});
