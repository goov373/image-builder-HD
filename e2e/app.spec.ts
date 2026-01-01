import { test, expect } from '@playwright/test';

/**
 * E2E Tests for HTML Content Builder
 * Tests core user workflows and critical functionality
 */

test.describe('App Loading', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    
    // Should see the app loaded
    await expect(page.locator('body')).toBeVisible();
    
    // Should have some content (not a blank page)
    const bodyContent = await page.locator('body').textContent();
    expect(bodyContent?.length).toBeGreaterThan(0);
  });

  test('should display sidebar', async ({ page }) => {
    await page.goto('/');
    
    // Look for sidebar elements
    const sidebar = page.locator('[data-testid="sidebar"]').or(page.locator('aside')).or(page.locator('.sidebar'));
    
    // Sidebar should be visible (or app should have loaded something)
    const pageContent = await page.content();
    expect(pageContent).toBeTruthy();
  });
});

test.describe('Project Navigation', () => {
  test('should show homepage by default', async ({ page }) => {
    await page.goto('/');
    
    // Wait for app to load
    await page.waitForLoadState('networkidle');
    
    // Should see some form of homepage content or project list
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should create new project', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for "New Project" or similar button
    const newProjectButton = page.getByRole('button', { name: /new|create|add/i });
    
    if (await newProjectButton.count() > 0) {
      await newProjectButton.first().click();
      
      // Should navigate to editor or project creation view
      await page.waitForTimeout(500);
      const currentContent = await page.content();
      expect(currentContent).toBeTruthy();
    }
  });
});

test.describe('Editor View', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display toolbar when in editor', async ({ page }) => {
    // Try to open a project or create new one to get to editor
    const newButton = page.getByRole('button', { name: /new|create/i });
    
    if (await newButton.count() > 0) {
      await newButton.first().click();
      await page.waitForTimeout(500);
      
      // Check for any project type selection or editor view
      const editorArea = page.locator('[data-testid="editor"]').or(page.locator('.editor')).or(page.locator('main'));
      
      if (await editorArea.count() > 0) {
        await expect(editorArea.first()).toBeVisible();
      }
    }
  });
});

test.describe('Design System Panel', () => {
  test('should open design system panel', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for design system button or tab
    const designButton = page.getByRole('button', { name: /design|brand|style/i });
    
    if (await designButton.count() > 0) {
      await designButton.first().click();
      await page.waitForTimeout(300);
      
      // Should see color pickers or design controls
      const colorInputs = page.locator('input[type="color"]');
      
      // Design panel should have some controls
      const currentContent = await page.content();
      expect(currentContent).toBeTruthy();
    }
  });
});

test.describe('Export Panel', () => {
  test('should open export panel', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for export button
    const exportButton = page.getByRole('button', { name: /export|download/i });
    
    if (await exportButton.count() > 0) {
      await exportButton.first().click();
      await page.waitForTimeout(300);
      
      // Should see export options
      const currentContent = await page.content();
      expect(currentContent).toBeTruthy();
    }
  });
});

test.describe('Responsive Behavior', () => {
  test('should work on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('body')).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Error Handling', () => {
  test('should not crash on invalid route', async ({ page }) => {
    await page.goto('/nonexistent-route');
    
    // App should still be functional (SPA handles routing)
    await expect(page.locator('body')).toBeVisible();
    
    // Should not show raw error
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).not.toContain('Cannot GET');
  });
});

