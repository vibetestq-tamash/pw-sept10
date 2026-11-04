// LESSON 2 - Parameters: path, query and header
//
//   Path parameter   -> part of the URL path:         /api/members/1
//   Query parameter  -> after the '?' in the URL:     /api/members?gender=female
//   Header parameter -> sent in the request headers:  Accept: application/json
//
// Playwright takes query parameters through the `params` option, so you don't have
// to build or URL-encode the query string yourself.
//
// Run:  npx playwright test --project=api tests/api/02Parameters.spec.ts

import { test, expect } from '@playwright/test';
import { basicAuthHeader, Member } from '../../fixtures/api';

const headers = basicAuthHeader('admin', 'admin');

test.describe('Lesson 2 - Path parameters', () => {

    test('GET /api/members/:id returns that one member', async ({ request }) => {
        const id = 1;
        const response = await request.get(`/api/members/${id}`, { headers });

        expect(response.status()).toBe(200);
        const body: Member[] = await response.json();

        // This API wraps the single member in an array
        expect(body).toHaveLength(1);
        expect(body[0].id).toBe(id);
        expect(body[0].name).toBe('John Smith');
    });

    // The same test with several values (data-driven, one test per id)
    for (const id of [1, 2, 3]) {
        test(`GET /api/members/${id} returns the member with id ${id}`, async ({ request }) => {
            const response = await request.get(`/api/members/${id}`, { headers });

            expect(response.status()).toBe(200);
            expect((await response.json())[0].id).toBe(id);
        });
    }

    test('An id that does not exist returns 404 with a message', async ({ request }) => {
        const id = 999999;
        const response = await request.get(`/api/members/${id}`, { headers });

        expect(response.status()).toBe(404);
        expect(await response.json()).toEqual({ msg: `Member with id ${id} doesn't exist` });
    });

    test('A non-numeric id returns 404', async ({ request }) => {
        const response = await request.get('/api/members/abc', { headers });

        expect(response.status()).toBe(404);
    });
});

test.describe('Lesson 2 - Query parameters', () => {

    test('Pass query params with the `params` option', async ({ request }) => {
        // Sends GET /api/members?gender=female
        const response = await request.get('/api/members', {
            headers,
            params: { gender: 'female' },
        });

        expect(response.status()).toBe(200);
        const members: Member[] = await response.json();
        expect(members.length).toBeGreaterThan(0);
        for (const m of members) {
            expect(m.gender.toLowerCase()).toBe('female');
        }
    });

    test('Pass query params directly in the URL', async ({ request }) => {
        // Works too, but you have to encode special characters yourself
        const response = await request.get('/api/members?gender=male', { headers });

        expect(response.status()).toBe(200);
        const members: Member[] = await response.json();
        expect(members.every(m => m.gender.toLowerCase() === 'male')).toBeTruthy();
    });

    test('The response URL shows the final query string', async ({ request }) => {
        const response = await request.get('/api/members', {
            headers,
            params: { gender: 'female' },
        });

        expect(response.url()).toContain('/api/members?gender=female');
    });

    test('The gender filter is case-insensitive', async ({ request }) => {
        const lower = await (await request.get('/api/members', { headers, params: { gender: 'female' } })).json();
        const upper = await (await request.get('/api/members', { headers, params: { gender: 'FEMALE' } })).json();

        expect(upper).toEqual(lower);
    });

    test('A filter value with no matches returns 404', async ({ request }) => {
        const response = await request.get('/api/members', { headers, params: { gender: 'unknown' } });

        expect(response.status()).toBe(404);
        expect((await response.json()).msg).toBe("Member with gender unknown doesn't exist");
    });

    test('Query parameters the API does not know are ignored', async ({ request }) => {
        const response = await request.get('/api/members', { headers, params: { page: 2, sort: 'name' } });

        expect(response.status()).toBe(200);
        expect(Array.isArray(await response.json())).toBeTruthy();
    });

    test('URLSearchParams also works and handles encoding', async ({ request }) => {
        // `params` also accepts URLSearchParams or a string
        const params = new URLSearchParams();
        params.set('gender', 'female');

        const response = await request.get('/api/members', { headers, params });
        expect(response.status()).toBe(200);
    });
});

test.describe('Lesson 2 - Header parameters', () => {

    test('Send custom headers on a single request', async ({ request }) => {
        const response = await request.get('/api/members/1', {
            headers: {
                ...headers,                 // auth header
                Accept: 'application/json', // what we want back
                'X-Request-Id': 'lesson-2', // a custom header (ignored by this API)
            },
        });

        expect(response.status()).toBe(200);
        expect(response.headers()['content-type']).toContain('application/json');
    });

    test('Check the headers the server sent back', async ({ request }) => {
        const response = await request.get('/api/members/1', { headers });

        // headersArray() keeps duplicates and the original order
        const contentType = response.headersArray().find(h => h.name.toLowerCase() === 'content-type');
        expect(contentType?.value).toContain('application/json');
        expect(Number(response.headers()['content-length'])).toBeGreaterThan(0);
    });
});
