// LESSON 1 - The basics of API testing with Playwright
//
// Playwright can test REST APIs without opening a browser. The built-in `request`
// fixture is an APIRequestContext with methods for every HTTP verb:
//     request.get()  request.post()  request.put()  request.patch()  request.delete()  request.head()  request.fetch()
//
// Each call returns an APIResponse. The parts you check most often:
//     response.status()      -> 200, 201, 404 ...
//     response.ok()          -> true for any 2xx status
//     response.headers()     -> all response headers (names are lower-case)
//     await response.json()  -> body parsed as JSON
//     await response.text()  -> body as a plain string
//
// Run:  npx playwright test tests/api/01RequestBasics.spec.ts
// No baseURL is set in playwright.config.ts, so every request uses a full URL built from
// BASE_URL (fixtures/api.ts). Change it in one place, or set the API_BASE_URL environment variable.

import { test, expect } from '@playwright/test';
import { BASE_URL, basicAuthHeader } from '../../fixtures/api';

// Every /api/members call needs authentication. Lesson 4 covers it in depth.
// For now we send a Basic Auth header with each request.
const authHeaders = basicAuthHeader('admin', 'admin');

test.describe('Lesson 1 - Request basics', () => {

    test('GET with a hard-coded full URL', async ({ request }) => {
        // The simplest possible API call: a complete URL as a string
        const response = await request.get('http://localhost:5002/api/members', { headers: authHeaders });

        expect(response.status()).toBe(200);
    });

    test('GET with a URL built from the BASE_URL constant', async ({ request }) => {
        // Better: keep the host in one constant, so switching environments is a one-line change
        const response = await request.get(`${BASE_URL}/api/members`, { headers: authHeaders });

        // toBeOK() passes for any 2xx status. When it fails, Playwright prints the response.
        await expect(response).toBeOK();
    });

    test('Check status code, status text and ok()', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/api/members`, { headers: authHeaders });

        expect(response.status()).toBe(200);
        expect(response.statusText()).toBe('OK');
        expect(response.ok()).toBeTruthy();
    });

    test('Check response headers', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/api/members`, { headers: authHeaders });

        const headers = response.headers(); // a plain object, header names are lower-case
        console.log(headers);

        expect(headers['content-type']).toContain('application/json');
        expect(headers['x-powered-by']).toBe('Express');
    });

    test('Read the body as JSON and check its structure', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/api/members`, { headers: authHeaders });
        const members = await response.json();

        // The endpoint returns an array of { id, name, gender }
        expect(Array.isArray(members)).toBeTruthy();
        expect(members.length).toBeGreaterThan(0);

        // Check the shape of every item
        for (const member of members) {
            expect(member).toEqual({
                id: expect.any(Number),
                name: expect.any(String),
                gender: expect.stringMatching(/^(male|female)$/i),
            });
        }
    });

    test('Read the body as text', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/api/members`, { headers: authHeaders });
        const text = await response.text();

        expect(text.startsWith('[')).toBeTruthy(); // the raw JSON string
        expect(JSON.parse(text)).toEqual(await response.json());
    });

    test('Check that the list is sorted by id', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/api/members`, { headers: authHeaders });
        const ids: number[] = (await response.json()).map((m: { id: number }) => m.id);

        const sorted = [...ids].sort((a, b) => a - b);
        expect(ids).toEqual(sorted);
    });

    test('Measure the response time', async ({ request }) => {
        const start = Date.now();
        const response = await request.get(`${BASE_URL}/api/members`, { headers: authHeaders });
        const elapsed = Date.now() - start;

        console.log(`GET /api/members took ${elapsed} ms`);
        expect(response.ok()).toBeTruthy();
        expect(elapsed).toBeLessThan(2000);
    });

    test('A 401 response is still a response, not an exception', async ({ request }) => {
        // No auth header. Playwright does NOT throw on 4xx/5xx, so you assert the status yourself.
        const response = await request.get(`${BASE_URL}/api/members`);

        expect(response.status()).toBe(401);
        expect(response.ok()).toBeFalsy();
        expect(await response.json()).toEqual({ error: 'unauthorized' });
    });

    test('failOnStatusCode makes non-2xx responses throw', async ({ request }) => {
        // Use this when any non-2xx response should fail the test straight away.
        await expect(
            request.get(`${BASE_URL}/api/members`, { failOnStatusCode: true })
        ).rejects.toThrow(/401/);
    });
});
