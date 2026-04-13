import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173'; 

test.describe('Authentification CoachFlow', () => {

  test('Un coach doit pouvoir se connecter et voir son dashboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    await page.locator('#email').fill('x@x.co');
    await page.locator('#password').fill('string');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*coach\/dashboard/, { timeout: 10000 });
    await expect(page.getByText(/Aperçu/i)).toBeVisible();
  });

  test('Un élève doit pouvoir se connecter et voir son dashboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    await page.locator('#email').fill('x@x.ca');
    await page.locator('#password').fill('string');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*user\/dashboard/, { timeout: 10000 });
    await expect(page.getByText(/Mes Achats/i)).toBeVisible();
  });
});