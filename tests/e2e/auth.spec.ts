import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should allow user to login and logout', async ({ page }) => {
    // 1. Navigate to Login Page
    await page.goto('/login');
    await expect(page).toHaveURL('/login');

    // 2. Fill Credentials
    await page.getByLabel('Email').fill('john@example.com');
    await page.getByLabel('Password').fill('password123');
    
    // 3. Submit
    await page.getByRole('button', { name: 'Login' }).click();

    // 4. Verify Redirect (User is redirected to /profile)
    await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible();
    await expect(page).toHaveURL(/\/profile/);
    
    // 5. Verify User Menu is visible
    const userMenuBtn = page.getByRole('button', { name: 'User menu' });
    await expect(userMenuBtn).toBeVisible();

    // 6. Test Logout
    await userMenuBtn.click();
    // In our new client-side setup, the menu item is a clickable div with text
    await page.getByText('Sign Out').click();
    
    // 7. Verify Logout
    // Navigation to home should happen automatically
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
  });

  test('should protect private routes', async ({ page }) => {
    // 1. Try to access profile directly
    await page.goto('/profile');
    
    // 2. Verify redirected to login
    await expect(page).toHaveURL(/\/login/);
  });
});