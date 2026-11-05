// LESSON 7 - Reusing authentication: write the login once
//
// Repeating the login in every request is noisy, and logging in to get a token in
// every test is slow. Here are the ways to write it once, from simplest to most reusable:
//
//   1. One `headers` constant per file      -> still pass { headers } on every call
//   2. test.use({ extraHTTPHeaders })       -> every request in the block logs in automatically
//   3. test.use({ httpCredentials })        -> the same for Basic Auth, Playwright answers the 401
//   4. Get a token once in beforeAll         -> every test reuses the saved token
//   5. A login helper function               -> any file can get a token in one line
//   (6. A custom fixture with the login built in: see fixtures/api.ts and lesson 06)
//
// All of this is done in code. Nothing is configured in playwright.config.ts.
//
// Run:  npx playwright test tests/api/07ReuseAuthentication.spec.ts
// The token tests (4, 5) call /api/members only when the API runs with Bearer (JWT) auth:
//       AUTH_MODE=jwt npx playwright test tests/api/07ReuseAuthentication.spec.ts

import { test, expect } from '@playwright/test';
import { BASE_URL, basicAuthHeader, bearerAuthHeader, getJwtToken } from '../../fixtures/api';

const AUTH_MODE = (process.env.AUTH_MODE || 'basic').toLowerCase();

// ---------------------------------------------------------------------------
// 1. One constant per file
// ---------------------------------------------------------------------------
test.describe('Lesson 7.1 - One headers constant', () => {
    test.skip(AUTH_MODE !== 'basic', 'Server is not running Basic Auth');

    const headers = basicAuthHeader('admin', 'admin'); // written once...

    test('GET all members', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/api/members`, { headers }); // ...used everywhere
        expect(response.status()).toBe(200);
    });

    test('GET one member', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/api/members/1`, { headers });
        expect(response.status()).toBe(200);
    });
});

// ---------------------------------------------------------------------------
// 2. test.use({ extraHTTPHeaders }): the header is added to every request in this block
// ---------------------------------------------------------------------------
test.describe('Lesson 7.2 - test.use with extraHTTPHeaders', () => {
    test.skip(AUTH_MODE !== 'basic', 'Server is not running Basic Auth');

    test.use({ extraHTTPHeaders: basicAuthHeader('admin', 'admin') });

    test('No headers option needed', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/api/members`);
        expect(response.status()).toBe(200);
    });

    test('Works for every method', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/api/members`, { params: { gender: 'female' } });
        expect(response.status()).toBe(200);
    });

    test('A test can still override the header', async ({ request }) => {
        // Headers passed on the call win over the ones from test.use
        const response = await request.get(`${BASE_URL}/api/members`, {
            headers: basicAuthHeader('admin', 'wrong'),
        });
        expect(response.status()).toBe(401);
    });
});

// ---------------------------------------------------------------------------
// 3. test.use({ httpCredentials }): Basic Auth handled by Playwright
// ---------------------------------------------------------------------------
test.describe('Lesson 7.3 - test.use with httpCredentials', () => {
    test.skip(AUTH_MODE !== 'basic', 'Server is not running Basic Auth');

    // Playwright sends the credentials after the server answers 401 with a
    // "WWW-Authenticate: Basic" challenge, then retries the request.
    test.use({ httpCredentials: { username: 'admin', password: 'admin' } });

    test('No headers option needed', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/api/members/1`);
        expect(response.status()).toBe(200);
    });
});

// ---------------------------------------------------------------------------
// 4. Get a token once in beforeAll, reuse it in every test
// ---------------------------------------------------------------------------
test.describe('Lesson 7.4 - Log in once, reuse the token', () => {
    let token: string; // shared by every test in this block

    test.beforeAll(async ({ playwright }) => {
        // The `request` fixture only exists inside a test, so beforeAll creates its own context.
        // Note: beforeAll runs once per worker, so with several workers you may see a few logins.
        const context = await playwright.request.newContext();
        const login = await context.post(`${BASE_URL}/api/auth/login`, {
            data: { username: 'admin', password: 'admin' },
        });
        expect(login.status()).toBe(200);
        token = (await login.json()).access_token;
        await context.dispose();
    });

    test('The token was saved', async () => {
        expect(token.split('.')).toHaveLength(3); // a JWT: header.payload.signature
    });

    test.describe('Using the saved token', () => {
        test.skip(AUTH_MODE !== 'jwt', 'Server is not running Bearer (JWT) auth');

        test('GET all members with the saved token', async ({ request }) => {
            const response = await request.get(`${BASE_URL}/api/members`, { headers: bearerAuthHeader(token) });
            expect(response.status()).toBe(200);
        });

        test('GET one member with the same token', async ({ request }) => {
            const response = await request.get(`${BASE_URL}/api/members/1`, { headers: bearerAuthHeader(token) });
            expect(response.status()).toBe(200);
        });
    });
});

// ---------------------------------------------------------------------------
// 5. A login helper: any test file can get a token in one line
// ---------------------------------------------------------------------------
test.describe('Lesson 7.5 - A login helper function', () => {

    test('getJwtToken() returns a token', async ({ request }) => {
        const token = await getJwtToken(request); // defined in fixtures/api.ts
        expect(token).toBeTruthy();
    });

    test.describe('Using the helper', () => {
        test.skip(AUTH_MODE !== 'jwt', 'Server is not running Bearer (JWT) auth');

        test('Log in and call the API', async ({ request }) => {
            const token = await getJwtToken(request);
            const response = await request.get(`${BASE_URL}/api/members`, { headers: bearerAuthHeader(token) });
            expect(response.status()).toBe(200);
        });
    });
});
