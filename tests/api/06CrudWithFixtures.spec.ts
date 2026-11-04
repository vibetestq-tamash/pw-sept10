// LESSON 6 - Reusable API fixtures, test.step and negative CRUD tests
//
// The earlier lessons repeat the auth header and clean up by hand. fixtures/api.ts
// moves that setup into custom fixtures:
//
//   api          -> an APIRequestContext with baseURL + Basic Auth already set
//   createMember -> creates a member for this test and deletes it after the test
//
// Each test gets its own fresh data, so the tests are independent and can run in parallel.
//
// Run:  npx playwright test --project=api tests/api/06CrudWithFixtures.spec.ts

import { test, expect, uniqueName, Member } from '../../fixtures/api';

test.describe('Lesson 6 - READ', () => {

    test('The api fixture sends the auth header for us', async ({ api }) => {
        const response = await api.get('/api/members'); // no headers option needed
        expect(response.status()).toBe(200);
    });

    test('Read a member created by the fixture', async ({ api, createMember }) => {
        const member = await createMember({ gender: 'female' });

        const response = await api.get(`/api/members/${member.id}`);
        expect(await response.json()).toEqual([member]);
    });
});

test.describe('Lesson 6 - UPDATE (PUT)', () => {

    test('Update only the name (partial update)', async ({ api, createMember }) => {
        const member = await createMember({ gender: 'male' });
        const newName = uniqueName('Renamed');

        const response = await api.put(`/api/members/${member.id}`, { data: { name: newName } });

        expect(response.status()).toBe(200);
        // The gender we did not send stays the same
        expect((await response.json()).member).toEqual({ id: member.id, name: newName, gender: 'male' });
    });

    test('Update only the gender', async ({ api, createMember }) => {
        const member = await createMember({ gender: 'male' });

        const response = await api.put(`/api/members/${member.id}`, { data: { gender: 'female' } });

        expect((await response.json()).member).toEqual({ ...member, gender: 'female' });
    });

    test('Use test.step to label each part of the test', async ({ api, createMember }) => {
        // Steps show up in the HTML report and in trace viewer
        const member = await test.step('Arrange: create a member', async () => {
            return createMember();
        });

        const newName = uniqueName('Step');
        await test.step('Act: rename the member', async () => {
            const response = await api.put(`/api/members/${member.id}`, { data: { name: newName } });
            expect(response.ok()).toBeTruthy();
        });

        await test.step('Assert: GET returns the new name', async () => {
            const [saved]: Member[] = await (await api.get(`/api/members/${member.id}`)).json();
            expect(saved.name).toBe(newName);
        });
    });

    // Negative PUT cases, data-driven
    const invalidUpdates = [
        { case: 'name too short', data: { name: 'Abc' }, msg: 'Name should be 4 to 25 characters long' },
        { case: 'name with symbols', data: { name: 'John@Smith' }, msg: 'Name should only contain Alphabets' },
        { case: 'invalid gender', data: { gender: 'x' }, msg: 'Gender should be either male or female only' },
        { case: 'extra field', data: { name: 'John Carter', gender: 'male', id: 1 }, msg: 'Please provide only name and gender' },
    ];
    for (const { case: caseName, data, msg } of invalidUpdates) {
        test(`PUT rejects invalid data: ${caseName}`, async ({ api, createMember }) => {
            const member = await createMember();

            const response = await api.put(`/api/members/${member.id}`, { data });
            expect(response.status()).toBe(400);
            expect(await response.json()).toEqual({ msg });

            // The record was not changed
            const [unchanged] = await (await api.get(`/api/members/${member.id}`)).json();
            expect(unchanged).toEqual(member);
        });
    }

    test('PUT on an id that does not exist returns 404', async ({ api }) => {
        const response = await api.put('/api/members/999999', { data: { name: 'Nobody Here' } });

        expect(response.status()).toBe(404);
        expect((await response.json()).msg).toBe("Member with id 999999 doesn't exist");
    });
});

test.describe('Lesson 6 - DELETE', () => {

    test('Delete removes exactly the member we asked for', async ({ api, createMember }) => {
        // `keep` comes from the fixture (cleaned up automatically).
        // `remove` is created directly, because this test deletes it itself (see fixtures/api.ts).
        const keep = await createMember();
        const remove: Member = await (await api.post('/api/members', {
            data: { name: uniqueName('Remove'), gender: 'female' },
        })).json();

        const response = await api.delete(`/api/members/${remove.id}`);
        expect(response.status()).toBe(200);

        // Check by name: the freed id may already belong to a member from a parallel test
        const all: Member[] = await (await api.get('/api/members')).json();
        expect(all.find(m => m.name === remove.name)).toBeUndefined();
        expect(all).toContainEqual(keep);
    });

    test('DELETE on an id that does not exist returns 404', async ({ api }) => {
        const response = await api.delete('/api/members/999999');

        expect(response.status()).toBe(404);
        expect((await response.json()).msg).toBe("Member with id 999999 doesn't exist");
    });
});

test.describe('Lesson 6 - Unauthenticated CRUD', () => {
    // The plain `request` fixture has no auth, so every operation must be refused
    const calls = [
        { method: 'GET', path: '/api/members' },
        { method: 'GET', path: '/api/members/1' },
        { method: 'POST', path: '/api/members' },
        { method: 'PUT', path: '/api/members/1' },
        { method: 'DELETE', path: '/api/members/1' },
    ];
    for (const { method, path } of calls) {
        test(`${method} ${path} without auth returns 401`, async ({ request }) => {
            // request.fetch() takes the HTTP method as an option
            const response = await request.fetch(path, { method, data: { name: 'No Auth', gender: 'male' } });
            expect(response.status()).toBe(401);
        });
    }
});
