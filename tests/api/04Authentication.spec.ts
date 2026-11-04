// LESSON 4 - Authentication
//
// The Employee API supports five auth strategies, but only ONE protects /api/members at a time.
// You pick it in app.js of the API project (Basic Auth is the default):
//
//   AUTH_MODE=basic   app.use(basicAuth)    Authorization: Basic base64(admin:admin)
//   AUTH_MODE=apikey  app.use(apiKeyAuth)   x-api-key: demo-api-key-12345
//   AUTH_MODE=jwt     app.use(bearerAuth)   POST /api/auth/login -> Authorization: Bearer <jwt>
//   AUTH_MODE=oauth2  app.use(oauth2Auth)   POST /oauth/token    -> Authorization: Bearer <token>
//
// The two token endpoints are always public, so their tests run in every mode.
// Tests that call /api/members with a given strategy are skipped unless AUTH_MODE matches the server:
//
//   npx playwright test tests/api/04Authentication.spec.ts                  (basic)
//   AUTH_MODE=jwt npx playwright test tests/api/04Authentication.spec.ts    (after switching app.js)

import { test, expect } from '@playwright/test';
import { BASE_URL, creds, basicAuthHeader, bearerAuthHeader } from '../../fixtures/api';

const AUTH_MODE = (process.env.AUTH_MODE || 'basic').toLowerCase();
const protectedPath = `${BASE_URL}/api/members`;

// ---------------------------------------------------------------------------
// 1. Basic Auth
// ---------------------------------------------------------------------------
test.describe('Lesson 4 - Basic Auth', () => {
    test.skip(AUTH_MODE !== 'basic', 'Server is not running Basic Auth');

    test('Option A: build the Authorization header yourself', async ({ request }) => {
        // "admin:admin" -> base64 -> "YWRtaW46YWRtaW4="
        const token = Buffer.from('admin:admin').toString('base64');

        const response = await request.get(protectedPath, {
            headers: { Authorization: `Basic ${token}` },
        });

        expect(response.status()).toBe(200);
    });

    test('Option B: use a small helper function', async ({ request }) => {
        const response = await request.get(protectedPath, {
            headers: basicAuthHeader(creds.basic.username, creds.basic.password),
        });

        expect(response.status()).toBe(200);
    });

    test('Option C: let Playwright do it with httpCredentials', async ({ playwright }) => {
        // httpCredentials applies to every request made with this context.
        // send: 'always' sends the header on the first request. With the default
        // ('unauthorized'), Playwright waits for a 401 + WWW-Authenticate challenge and then retries.
        const context = await playwright.request.newContext({
            httpCredentials: { username: 'admin', password: 'admin', send: 'always' },
        });

        const response = await context.get(protectedPath);
        expect(response.status()).toBe(200);

        await context.dispose();
    });

    test.describe('Option D: test.use() sets credentials for a whole block', () => {
        // Every `request` (and `page`) in this describe block now authenticates.
        // No `send` option, so Playwright waits for the server's 401 challenge, then retries.
        test.use({ httpCredentials: { username: 'admin', password: 'admin' } });

        test('The request fixture authenticates automatically', async ({ request }) => {
            const response = await request.get(protectedPath);
            expect(response.status()).toBe(200);
        });
    });

    test('Missing credentials -> 401 and a WWW-Authenticate challenge', async ({ request }) => {
        const response = await request.get(protectedPath);

        expect(response.status()).toBe(401);
        expect(response.headers()['www-authenticate']).toBe('Basic realm="401"');
        expect(await response.json()).toEqual({ error: 'unauthorized' });
    });

    // Negative cases, data-driven
    const badCredentials = [
        { case: 'wrong password', user: 'admin', pass: 'wrong' },
        { case: 'wrong username', user: 'root', pass: 'admin' },
        { case: 'empty password', user: 'admin', pass: '' },
        { case: 'wrong case', user: 'ADMIN', pass: 'ADMIN' },
    ];
    for (const { case: caseName, user, pass } of badCredentials) {
        test(`Invalid credentials are rejected: ${caseName}`, async ({ request }) => {
            const response = await request.get(protectedPath, { headers: basicAuthHeader(user, pass) });
            expect(response.status()).toBe(401);
        });
    }

    test('Wrong auth scheme is rejected', async ({ request }) => {
        const response = await request.get(protectedPath, { headers: bearerAuthHeader('some-token') });
        expect(response.status()).toBe(401);
    });

    test('The upload endpoint is protected too', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/api/upload`, {
            multipart: { file: { name: 'a.png', mimeType: 'image/png', buffer: Buffer.from('x') } },
        });
        expect(response.status()).toBe(401);
    });
});

// ---------------------------------------------------------------------------
// 2. API Key (a static key in a custom header)
// ---------------------------------------------------------------------------
test.describe('Lesson 4 - API Key', () => {
    test.skip(AUTH_MODE !== 'apikey', 'Server is not running API Key auth');

    test('A valid key in the x-api-key header is accepted', async ({ request }) => {
        const response = await request.get(protectedPath, {
            headers: { [creds.apiKey.headerName]: creds.apiKey.value },
        });
        expect(response.status()).toBe(200);
    });

    test('A missing or invalid key is rejected', async ({ request }) => {
        const cases: Record<string, string>[] = [{}, { 'x-api-key': 'wrong-key' }];
        for (const headers of cases) {
            const response = await request.get(protectedPath, { headers });
            expect(response.status()).toBe(401);
            expect((await response.json()).message).toBe("Missing or invalid 'x-api-key' header");
        }
    });
});

// ---------------------------------------------------------------------------
// 3. Bearer Token (JWT): log in first, then send the token
// ---------------------------------------------------------------------------
test.describe('Lesson 4 - Bearer Token (JWT)', () => {

    // POST /api/auth/login is public, so these tests run in every mode
    test('Login returns a JWT access token', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/api/auth/login`, { data: creds.jwtLogin });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body).toEqual({
            token_type: 'Bearer',
            access_token: expect.any(String),
            expires_in: '1h',
        });

        // A JWT has three base64url parts: header.payload.signature
        const parts = body.access_token.split('.');
        expect(parts).toHaveLength(3);

        // The payload is readable (not encrypted), so we can check its claims
        const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
        expect(payload.sub).toBe('admin');
        expect(payload.exp - payload.iat).toBe(3600);
    });

    test('Login with a wrong password returns 401', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/api/auth/login`, {
            data: { username: 'admin', password: 'wrong' },
        });

        expect(response.status()).toBe(401);
        expect((await response.json()).error).toBe('invalid_credentials');
    });

    test.describe('Using the token', () => {
        test.skip(AUTH_MODE !== 'jwt', 'Server is not running Bearer (JWT) auth');

        test('Token chaining: login, then call a protected endpoint', async ({ request }) => {
            // Step 1 - get the token
            const login = await request.post(`${BASE_URL}/api/auth/login`, { data: creds.jwtLogin });
            const { access_token } = await login.json();

            // Step 2 - send it in the Authorization header
            const response = await request.get(protectedPath, { headers: bearerAuthHeader(access_token) });
            expect(response.status()).toBe(200);
        });

        test('A tampered token is rejected', async ({ request }) => {
            const login = await request.post(`${BASE_URL}/api/auth/login`, { data: creds.jwtLogin });
            const { access_token } = await login.json();

            const response = await request.get(protectedPath, { headers: bearerAuthHeader(access_token + 'x') });
            expect(response.status()).toBe(401);
            expect((await response.json()).message).toBe('Invalid or expired token');
        });
    });
});

// ---------------------------------------------------------------------------
// 4. OAuth2 Client Credentials: exchange client id/secret for an access token
// ---------------------------------------------------------------------------
test.describe('Lesson 4 - OAuth2 Client Credentials', () => {

    test('Token endpoint issues an access token', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/oauth/token`, { data: creds.oauth2 });

        expect(response.status()).toBe(200);
        expect(await response.json()).toEqual({
            token_type: 'Bearer',
            access_token: expect.stringMatching(/^[a-f0-9]{48}$/), // opaque token, not a JWT
            expires_in: 3600,
        });
    });

    test('OAuth2 token endpoints usually take form data too', async ({ request }) => {
        // Many real OAuth2 servers only accept application/x-www-form-urlencoded
        const response = await request.post(`${BASE_URL}/oauth/token`, { form: creds.oauth2 });
        expect(response.status()).toBe(200);
    });

    test('A wrong client secret returns 401 invalid_client', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/oauth/token`, {
            data: { ...creds.oauth2, client_secret: 'wrong' },
        });
        expect(response.status()).toBe(401);
        expect(await response.json()).toEqual({ error: 'invalid_client' });
    });

    test('A wrong grant type returns 400 unsupported_grant_type', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/oauth/token`, {
            data: { ...creds.oauth2, grant_type: 'password' },
        });
        expect(response.status()).toBe(400);
        expect(await response.json()).toEqual({ error: 'unsupported_grant_type' });
    });

    test.describe('Using the token', () => {
        test.skip(AUTH_MODE !== 'oauth2', 'Server is not running OAuth2 auth');

        // Get the token once and reuse it in every test of this block
        let accessToken: string;
        test.beforeAll(async ({ playwright }) => {
            const ctx = await playwright.request.newContext();
            const response = await ctx.post(`${BASE_URL}/oauth/token`, { data: creds.oauth2 });
            accessToken = (await response.json()).access_token;
            await ctx.dispose();
        });

        test('Access token is accepted', async ({ request }) => {
            const response = await request.get(protectedPath, { headers: bearerAuthHeader(accessToken) });
            expect(response.status()).toBe(200);
        });

        test('An unknown token is rejected', async ({ request }) => {
            const response = await request.get(protectedPath, { headers: bearerAuthHeader('0'.repeat(48)) });
            expect(response.status()).toBe(401);
            expect((await response.json()).error).toBe('invalid_token');
        });
    });
});
