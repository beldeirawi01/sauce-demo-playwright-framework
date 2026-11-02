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

    test("GET /booking/{id} returns the booking details", async ({ request }) => {
        const list = await (await request.get('/booking')).json();
        const id = list[0].bookingid;

        const response = await request.get(`/booking/${id}`);
        expect(response.status()).toBe(200);

        const booking = await response.json();
        expect(booking).toHaveProperty('firstname');
        expect(booking).toHaveProperty('lastname');
        expect(booking).toHaveProperty('totalprice');
        expect(booking).toHaveProperty('depositpaid');
        expect(booking).toHaveProperty('bookingdates');
        expect(booking.bookingdates).toHaveProperty('checkin');
        expect(booking.bookingdates).toHaveProperty('checkout');
    });


    test("POST /booking creates a booking that can be read back", async ({ request }) => {
        const newBooking = {
            firstname: 'Jane',
            lastname: 'Tester',
            totalprice: 150,
            depositpaid: true,
            bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
            additionalneeds: 'Breakfast'
        };

        const createResponse = await request.post('/booking', { data: newBooking });
        expect(createResponse.status()).toBe(200);

        const created = await createResponse.json();
        expect(created).toHaveProperty('bookingid');
        expect(created.booking).toMatchObject(newBooking);

        const getResponse = await request.get(`/booking/${created.bookingid}`);
        expect(getResponse.status()).toBe(200);
        expect(await getResponse.json()).toMatchObject(newBooking);
    });
});

test.describe("Auth API", { tag: "@api" }, () => {
    test("POST /auth returns a token for valid credentials", async ({ request }) => {
        const response = await request.post('/auth', {
            data: { username: 'admin', password: 'password123' }
        });
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body).toHaveProperty('token');
    });


    test("POST /auth with a wrong password does not return a token", async ({ request }) => {
        const response = await request.post('/auth', {
            data: { username: 'admin', password: 'wrong' }
        });
        const body = await response.json();
        console.log(response.status(), body);

        expect(body).not.toHaveProperty('token');
        expect(body).toHaveProperty('reason', "Bad credentials");
    });

    test("POST /auth with a wrong password returns 401 [known defect]", async ({ request }) => {
        test.fail(true, "Restful-booker returns 200 with a reason message instead of 401 for bad credentials");

        const response = await request.post('/auth', {
            data: { username: 'admin', password: 'wrong' }
        });
        expect(response.status()).toBe(401);
    });
});