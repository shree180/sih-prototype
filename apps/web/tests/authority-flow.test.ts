import { test, expect } from '@playwright/test';

test.describe('Authority Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Authority signin → view dashboard → verify incident → export CSV', async ({ page }) => {
    await page.goto('/auth/sign-in');
    
    await page.fill('[name="email"]', 'authority@test.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/\/authority/);
    await expect(page.locator('text=Dashboard')).toBeVisible();
    
    await page.goto('/authority/incidents');
    
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('text=Severe flooding in downtown area')).toBeVisible();
    
    await page.click('text=Severe flooding in downtown area');
    
    await expect(page).toHaveURL(/\/authority\/incidents\/.*/);
    await expect(page.locator('text=Verification Panel')).toBeVisible();
    
    await page.selectOption('[name="verification_status"]', 'verified');
    await page.selectOption('[name="final_severity"]', 'severe');
    await page.fill('[name="notes"]', 'Verified by ground team');
    await page.click('button:has-text("Submit Verification")');
    
    await expect(page.locator('text=Verification submitted')).toBeVisible();
    
    await page.goto('/authority/exports');
    
    await page.click('button:has-text("Export CSV")');
    
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Download")');
    const download = await downloadPromise;
    
    expect(download.suggestedFilename()).toContain('.csv');
  });
});