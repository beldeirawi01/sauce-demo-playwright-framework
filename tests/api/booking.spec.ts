import { test, expect, APIRequestContext } from '@playwright/test';

async function getToken(request: APIRequestContext): Promise<string> {
    const response = await request.post('/auth', {
        data: { username: 'admin', password: 'password123' }
    });
    return (await response.json()).token;
}

async function createBooking(request: APIRequestContext): Promise<number> {
    const response = await request.post('/booking', {
        data: {
            firstname: 'Jane',
            lastname: 'Tester',
            totalprice: 150,
            depositpaid: true,
            bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
            additionalneeds: 'Breakfast'
        }
    });
    return (await response.json()).bookingid;
}



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

    test("PUT /booking/{id} updates a booking", async ({ request }) => {
        const token = await getToken(request);
        const id = await createBooking(request);

        const updated = {
            firstname: 'Janet',
            lastname: 'Updated',
            totalprice: 200,
            depositpaid: false,
            bookingdates: { checkin: '2026-12-10', checkout: '2026-12-15' },
            additionalneeds: 'Late checkout'
        };

        const response = await request.put(`/booking/${id}`, {
            data: updated,
            headers: { Cookie: `token=${token}`, Accept: 'application/json' }
        });
        expect(response.status()).toBe(200);
        expect(await response.json()).toMatchObject(updated);
    });

    test("DELETE /booking/{id} deletes a booking", async ({ request }) => {
        const token = await getToken(request);
        const id = await createBooking(request);

        const deleteResponse = await request.delete(`/booking/${id}`, {
            headers: { Cookie: `token=${token}` }
        });
        expect(deleteResponse.status()).toBe(201);

        const getResponse = await request.get(`/booking/${id}`);
        console.log('get after delete:', getResponse.status());
        expect(getResponse.status()).toBe(404);
    })

    test("PUT /booking/{id} without a token is rejected", async ({ request }) => {
        const id = await createBooking(request);

        const response = await request.put(`/booking/${id}`, {
            data: { firstname: 'No', lastname: 'Token', totalprice: 1, depositpaid: true,
                    bookingdates: { checkin: '2026-12-01', checkout: '2026-12-02' } },
            headers: { Accept: 'application/json' }
        });
        
        expect(response.status()).toBe(403);
        const getResponse = await request.get(`/booking/${id}`);
        expect(getResponse.status()).toBe(200);
        expect((await getResponse.json()).firstname).toBe('Jane');
    });

    test("DELETE /booking/{id} without a token is rejected", async ({ request }) => {
        const id = await createBooking(request);

        const response = await request.delete(`/booking/${id}`);
        expect(response.status()).toBe(403);

        const getResponse = await request.get(`/booking/${id}`);
        expect(getResponse.status()).toBe(200);
        expect((await getResponse.json()).firstname).toBe('Jane');

    })

    test("POST /booking with a missing required field is rejected", async ({ request }) => {
        test.fail(true, "Restful-booker returns 500 instead of a 4xx status when a required field is missing");
        
        const response = await request.post('/booking', {
            data: {
                lastname: 'Tester',
                totalprice: 150,
                depositpaid: true,
                bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' }
            }
        });
        expect(response.status()).toBe(400);
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