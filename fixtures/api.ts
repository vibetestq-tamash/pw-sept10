// Shared helpers + a custom fixture for the REST API lessons in tests/api.
//
// The API under test is EmployeeRestSample (https://github.com/QtpSudhakarTrainings/EmployeeRestSample).
// Start it with `npm start` in that project; it listens on http://localhost:5002.

import { test as base, expect, APIRequestContext } from '@playwright/test';

// ---------------------------------------------------------------------------
// Demo credentials (they match middleware/auth/config.js in the API project).
// In a real project, read these from environment variables / a .env file.
// ---------------------------------------------------------------------------
export const creds = {
    basic: { username: 'admin', password: 'admin' },
    apiKey: { headerName: 'x-api-key', value: 'demo-api-key-12345' },
    jwtLogin: { username: 'admin', password: 'admin' },
    oauth2: { grant_type: 'client_credentials', client_id: 'demo-client', client_secret: 'demo-secret' },
};

/** Builds "Authorization: Basic base64(username:password)". */
export function basicAuthHeader(username: string, password: string) {
    return { Authorization: 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64') };
}

/** Builds "Authorization: Bearer <token>". */
export function bearerAuthHeader(token: string) {
    return { Authorization: `Bearer ${token}` };
}

/**
 * The API only accepts names made of letters and spaces, 4 to 25 characters long.
 * Date.now() is digits only, so we map every digit to a letter (0->a, 1->b, ...)
 * to get a name that is unique per run and still valid.
 */
export function uniqueName(prefix = 'Pw') {
    const letters = 'abcdefghij';
    const stamp = String(Date.now()).replace(/\d/g, d => letters[Number(d)]);
    const random = Array.from({ length: 3 }, () => letters[Math.floor(Math.random() * 10)]).join('');
    return `${prefix}${stamp}${random}`; // e.g. "Pwbghjcadeffbcjhd" (17 chars)
}

/** Shape of a member returned by the API. */
export type Member = {
    id: number;
    name: string;
    gender: string;
};

// ---------------------------------------------------------------------------
// Custom fixtures
//   api          -> an APIRequestContext that already sends Basic Auth on every call
//   createMember -> creates a member for the test and deletes it afterwards (cleanup)
// ---------------------------------------------------------------------------
type ApiFixtures = {
    api: APIRequestContext;
    createMember: (data?: Partial<Pick<Member, 'name' | 'gender'>>) => Promise<Member>;
};

export const test = base.extend<ApiFixtures>({
    api: async ({ playwright, baseURL }, use) => {
        const api = await playwright.request.newContext({
            baseURL,
            extraHTTPHeaders: {
                Accept: 'application/json',
                ...basicAuthHeader(creds.basic.username, creds.basic.password),
            },
        });
        await use(api);
        await api.dispose(); // always release the context
    },

    createMember: async ({ api }, use) => {
        const created: number[] = [];

        await use(async (data = {}) => {
            const response = await api.post('/api/members', {
                data: { name: uniqueName(), gender: 'male', ...data },
            });
            expect(response.status(), await response.text()).toBe(201);
            const member: Member = await response.json();
            created.push(member.id);
            return member;
        });

        // Teardown: runs after the test, even if the test failed.
        // NOTE: this API gives new members "highest id + 1", so a deleted id can be handed
        // to another test running in parallel. Tests that DELETE a member should therefore
        // create that member themselves, not through this fixture.
        for (const id of created) {
            await api.delete(`/api/members/${id}`);
        }
    },
});

export { expect };
