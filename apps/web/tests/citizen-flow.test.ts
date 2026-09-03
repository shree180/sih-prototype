import { test, expect } from '@playwright/test';

test.describe('Citizen Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Citizen signup → report submission → view my reports', async ({ page }) => {
    await page.goto('/auth/sign-up');
    
    await page.fill('[name="email"]', 'citizen@test.com');
    await page.fill('[name="password"]', 'password123');
    await page.fill('[name="displayName"]', 'Test Citizen');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/\/citizen/);
    await expect(page.locator('text=Test Citizen')).toBeVisible();
    
    await page.goto('/citizen/report');
    
    await page.selectOption('[name="disaster_type"]', 'flood');
    await page.fill('[name="description"]', 'Severe flooding in downtown area');
    await page.selectOption('[name="observed_severity"]', 'severe');
    await page.fill('[name="lat"]', '40.7128');
    await page.fill('[name="lng"]', '-74.0060');
    await page.fill('[name="affected_people"]', '100');
    await page.check('[name="infrastructure_impact"]');
    
    await page.setInputFiles('[name="images"]', 'tests/fixtures/test-image.jpg');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Report submitted')).toBeVisible({ timeout: 10000 });
    
    await page.goto('/citizen/my-reports');
    
    await expect(page.locator('text=Severe flooding in downtown area')).toBeVisible();
    await expect(page.locator('text=flood')).toBeVisible();
    await expect(page.locator('text=severe')).toBeVisible();
  });
});