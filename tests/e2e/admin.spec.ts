import { test, expect } from '@playwright/test';

test.describe('Admin Security', () => {
  test('should allow admin to access dashboard', async ({ page }) => {
    // 1. Login as Admin
    await page.goto('/login');
    await page.getByLabel('Email').fill('admin@swiftshop.com');
    await page.getByLabel('Password').fill('adminpassword123');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Wait for the default redirection to /profile to ensure login is complete
    await expect(page).toHaveURL(/\/profile/);
    
    // 2. Navigate to Admin
    await page.goto('/admin');

    // 3. Verify Admin Access
    await expect(page.getByRole('heading', { name: 'Dashboard Overview' })).toBeVisible();
    await expect(page.getByText('Total Revenue')).toBeVisible();
  });

  test('should redirect regular user away from admin', async ({ page }) => {
    // 1. Login as User
    await page.goto('/login');
    await page.getByLabel('Email').fill('john@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Wait for login
    await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible();

    // 2. Try to Navigate to Admin
    await page.goto('/admin');
    
    // 3. Verify Redirect (Likely Profile Page)
    // Should NOT see dashboard
    await expect(page.getByRole('heading', { name: 'Dashboard Overview' })).not.toBeVisible();
    
    // Should see profile page content (Middleware redirects logged-in users from login back to profile)
    await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible();
  });
});
