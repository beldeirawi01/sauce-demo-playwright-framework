import { test, expect } from '@playwright/test';

test.describe("Booking API", { tag: "@api" }, () => {
    test("GET /booking returns a list of booking ids", async ({ request }) => {
        const response = await request.get('/booking');
        expect(response.status()).toBe(200);

        const bookings = await response.json();
        expect(Array.isArray(bookings)).toBe(true);
        expect(bookings.length).toBeGreaterThan(0);
        expect(bookings[0]).toHaveProperty('bookingid');
    });
});

