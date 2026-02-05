import { test, expect } from '@playwright/test';

test('Booking Flow Step 1 to Step 3', async ({ page }) => {
    try {
        // Capture browser logs and errors
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', exception => console.log(`PAGE ERROR: "${exception}"`));

        console.log('Navigating to homepage...');
        await page.goto('/');

        console.log('Clicking "จองทัวร์" sidebar menu...');
        await page.getByText('จองทัวร์', { exact: true }).click();

        // Wait for Step 1 Routes
        console.log('Waiting for route cards...');
        await page.waitForSelector('.shadow-card', { timeout: 10000 });

        // Click first route
        console.log('Clicking first route card...');
        const firstRoute = page.locator('.shadow-card').first();
        await firstRoute.click();

        // Wait for Step 2 Round selection
        console.log('Waiting for Step 2 (Round Selection)...');
        await page.waitForTimeout(1000); // Wait for transition
        await expect(page.getByText('2. เลือกรอบเดินทาง')).toBeVisible();

        // Click a round to go to Step 3
        console.log('Selecting a round...');
        const firstRound = page.locator('div.border.border-gray-200\\/50').first(); // Adjust selector based on App.tsx structure

        // Try to find the "click to select" text or just click the container
        const selectButton = firstRound.getByText('คลิกเพื่อเลือกรอบนี้');
        if (await selectButton.isVisible()) {
            await selectButton.click();
        } else {
            await firstRound.click();
        }

        // Wait for Step 3
        console.log('Waiting for Step 3 (Passenger Info)...');
        await page.waitForTimeout(1000);

        // Check if "ข้อมูลผู้โดยสาร" is visible
        const step3Header = page.getByText('ข้อมูลผู้โดยสาร');
        await expect(step3Header).toBeVisible();
        console.log('Step 3 Header Visible!');

        // Check for the price which caused crash
        const priceElement = page.locator('span.font-bold.text-rt-blue').last();
        await expect(priceElement).toBeVisible();
        console.log('Price displayed correctly:', await priceElement.textContent());

        // Take screenshot of success
        await page.screenshot({ path: 'booking_success.png' });
    } catch (error) {
        console.error('Test failed:', error);
        await page.screenshot({ path: 'booking_error.png' });
        throw error;
    }
});
