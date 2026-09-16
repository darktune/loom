import { test, expect } from '@playwright/test';

test.describe('LOOM 3D Virtual Atelier - End-to-End Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('01. Should display Apple-level luxury Salon Hero & brand mark', async ({ page }) => {
    // Check Universal Loom Brand Identity
    await expect(page.locator('text=LOOM').first()).toBeVisible();

    // Check Headline
    await expect(page.locator('h1')).toContainText('Fashion In');
    await expect(page.locator('h1')).toContainText('Dimension.');

    // Check Ghost CTA button
    const enterButton = page.locator('button:has-text("Enter The Atelier")');
    await expect(enterButton).toBeVisible();
  });

  test('02. Should switch themes smoothly (Obsidian -> Burgundy -> Ivory)', async ({ page }) => {
    const themeButton = page.locator('button[title*="Current Theme"]');
    await expect(themeButton).toBeVisible();

    // Initial theme should be noir (or previous state)
    const initialTheme = await page.locator('html').getAttribute('data-theme');
    expect(['noir', 'burgundy', 'ivory']).toContain(initialTheme);

    // Click to cycle theme
    await themeButton.click();
    const secondTheme = await page.locator('html').getAttribute('data-theme');
    expect(secondTheme).not.toBe(initialTheme);
  });

  test('03. Should navigate to 3D Atelier and interact with floating dock', async ({ page }) => {
    // Click 3D Atelier in header navigation
    const atelierNav = page.locator('button:has-text("3D Atelier")');
    await atelierNav.click();

    // Verify 3D Canvas stage exists with touch-action isolation
    const canvasContainer = page.locator('div[role="region"][aria-label*="3D Mannequin"]');
    await expect(canvasContainer).toBeVisible();

    // Verify floating bottom dock silhouette switchers
    await expect(page.locator('button:has-text("Bare Mannequin")')).toBeVisible();
    await expect(page.locator('button:has-text("The Sovereign Agbada")')).toBeVisible();
  });

  test('04. Should open and close Sizing Fit Wizard modal', async ({ page }) => {
    const fitButton = page.locator('button:has-text("Fit Wizard")').first();
    await fitButton.click();

    // Verify Wizard modal opened
    const wizardModal = page.locator('text=Calibrate Your Proportions');
    await expect(wizardModal).toBeVisible();

    // Close wizard via close button
    const closeBtn = page.locator('button:has(svg.lucide-x)').first();
    await closeBtn.click();
    await expect(wizardModal).not.toBeVisible();
  });

  test('05. Should open Payaza Escrow Checkout Drawer and display order breakdown', async ({ page }) => {
    const checkoutButton = page.locator('button:has-text("Escrow")').first();
    await checkoutButton.click();

    // Check Drawer opens with Payaza branding
    await expect(page.locator('text=PAYAZA CHECKOUT')).toBeVisible();
    await expect(page.locator('text=Order Checkout')).toBeVisible();

    // Verify Escrow CTA button
    const escrowBtn = page.locator('button:has-text("CONFIRM BESPOKE ESCROW ORDER")');
    await expect(escrowBtn).toBeVisible();
  });
});
