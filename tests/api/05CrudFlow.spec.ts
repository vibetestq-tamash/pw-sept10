// LESSON 5 - A full CRUD flow: Create -> Read -> Update -> Delete
//
//   C  POST   /api/members        -> 201 + the new member (with its id)
//   R  GET    /api/members/:id    -> 200 + [member]
//   U  PUT    /api/members/:id    -> 200 + { msg, member }
//   D  DELETE /api/members/:id    -> 200 + { msg, members }
//
// The steps depend on each other (they share the id from the POST), so the block runs
// in 'serial' mode: the tests run in order, and if one fails the rest are skipped.
//
// Run:  npx playwright test tests/api/05CrudFlow.spec.ts

import { test, expect } from '@playwright/test';
import { BASE_URL, basicAuthHeader, uniqueName, Member } from '../../fixtures/api';

const headers = basicAuthHeader('admin', 'admin');

test.describe('Lesson 5 - CRUD flow (serial)', () => {
    test.describe.configure({ mode: 'serial' });

    // Shared between the steps
    let memberId: number;
    const originalName = uniqueName('Crud');
    const updatedName = uniqueName('Upd');

    test('1. CREATE - POST a new member', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/api/members`, {
            headers,
            data: { name: originalName, gender: 'male' },
        });

        expect(response.status()).toBe(201);
        const created: Member = await response.json();
        expect(created).toEqual({ id: expect.any(Number), name: originalName, gender: 'male' });

        memberId = created.id; // save it for the next steps
        console.log(`Created member id ${memberId}`);
    });

    test('2. READ - GET the member by id', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/api/members/${memberId}`, { headers });

        expect(response.status()).toBe(200);
        expect(await response.json()).toEqual([{ id: memberId, name: originalName, gender: 'male' }]);
    });

    test('2b. READ - the member shows up in the full list and in the filter', async ({ request }) => {
        const all: Member[] = await (await request.get(`${BASE_URL}/api/members`, { headers })).json();
        expect(all).toContainEqual({ id: memberId, name: originalName, gender: 'male' });

        const males: Member[] = await (await request.get(`${BASE_URL}/api/members`, { headers, params: { gender: 'male' } })).json();
        expect(males.map(m => m.id)).toContain(memberId);
    });

    test('3. UPDATE - PUT new name and gender', async ({ request }) => {
        const response = await request.put(`${BASE_URL}/api/members/${memberId}`, {
            headers,
            data: { name: updatedName, gender: 'female' },
        });

        expect(response.status()).toBe(200);
        expect(await response.json()).toEqual({
            msg: `Member with id ${memberId} is updated successfully`,
            member: { id: memberId, name: updatedName, gender: 'female' },
        });
    });

    test('3b. UPDATE - check the change was saved (GET again)', async ({ request }) => {
        // Don't trust the PUT response alone: read the record back
        const response = await request.get(`${BASE_URL}/api/members/${memberId}`, { headers });
        const [member] = await response.json();

        expect(member.name).toBe(updatedName);
        expect(member.gender).toBe('female');
    });

    test('4. DELETE - remove the member', async ({ request }) => {
        const response = await request.delete(`${BASE_URL}/api/members/${memberId}`, { headers });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.msg).toBe(`Member with id ${memberId} is deleted successfully`);
        // The response has the remaining list, and our member is not in it
        expect(body.members.map((m: Member) => m.id)).not.toContain(memberId);
    });

    test('4b. DELETE - the member is gone from the list', async ({ request }) => {
        // Note: this API gives new members "highest id + 1", so a freed id can be reused
        // by a test running in parallel. Checking by our unique name is safer than
        // expecting GET /api/members/:id to return 404.
        const all: Member[] = await (await request.get(`${BASE_URL}/api/members`, { headers })).json();

        expect(all.find(m => m.name === updatedName)).toBeUndefined();
    });
});

test.describe('Lesson 5 - CRUD in a single test', () => {
    // The same flow in one test. It is independent, so it can run in parallel with
    // anything else, but a failure only tells you which step broke by its line number.

    test('Create, read, update and delete a member', async ({ request }) => {
        const name = uniqueName('One');

        // CREATE
        const createRes = await request.post(`${BASE_URL}/api/members`, { headers, data: { name, gender: 'female' } });
        expect(createRes.status()).toBe(201);
        const { id } = await createRes.json();

        try {
            // READ
            const readRes = await request.get(`${BASE_URL}/api/members/${id}`, { headers });
            expect((await readRes.json())[0].name).toBe(name);

            // UPDATE
            const updRes = await request.put(`${BASE_URL}/api/members/${id}`, { headers, data: { gender: 'male' } });
            expect((await updRes.json()).member.gender).toBe('male');
        } finally {
            // DELETE (in finally, so it cleans up even if an assertion above fails)
            const delRes = await request.delete(`${BASE_URL}/api/members/${id}`, { headers });
            expect(delRes.status()).toBe(200);
        }
    });
});
