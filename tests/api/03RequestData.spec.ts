// LESSON 3 - Sending data in the request body
//
// Playwright has a separate option for each body format:
//
//   data      -> JSON. A JS object is serialized and Content-Type: application/json is set for you.
//                Strings and Buffers are sent as they are.
//   form      -> HTML form, Content-Type: application/x-www-form-urlencoded
//   multipart -> file uploads / multipart/form-data
//
// Test data can be written inline, built in code, or read from a file
// (testdata/members.json). Because the tests create data, they also delete it afterwards.
//
// Run:  npx playwright test tests/api/03RequestData.spec.ts

import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { BASE_URL, basicAuthHeader, uniqueName, Member } from '../../fixtures/api';
import testData from '../../testdata/members.json';

const headers = basicAuthHeader('admin', 'admin');

// Track what each test creates so afterEach can delete it, even when the test fails.
let createdIds: number[] = [];

test.afterEach(async ({ request }) => {
    for (const id of createdIds) {
        await request.delete(`${BASE_URL}/api/members/${id}`, { headers });
    }
    createdIds = [];
});

test.describe('Lesson 3 - JSON body with `data`', () => {

    test('POST a JS object (serialized to JSON for you)', async ({ request }) => {
        const newMember = { name: uniqueName(), gender: 'female' };

        const response = await request.post(`${BASE_URL}/api/members`, { headers, data: newMember });

        expect(response.status()).toBe(201);
        const body: Member = await response.json();
        createdIds.push(body.id);

        // The response echoes our data plus a new id from the server
        expect(body).toMatchObject(newMember);
        expect(body.id).toEqual(expect.any(Number));
    });

    test('POST a raw JSON string (set Content-Type yourself)', async ({ request }) => {
        const name = uniqueName();
        const json = JSON.stringify({ name, gender: 'male' });

        const response = await request.post(`${BASE_URL}/api/members`, {
            headers: { ...headers, 'Content-Type': 'application/json' },
            data: json,
        });

        expect(response.status()).toBe(201);
        const body: Member = await response.json();
        createdIds.push(body.id);
        expect(body.name).toBe(name);
    });

    test('Build the request body from a TypeScript type', async ({ request }) => {
        type NewMember = Pick<Member, 'name' | 'gender'>;
        const payload: NewMember = { name: uniqueName('Typed'), gender: 'male' };

        const response = await request.post(`${BASE_URL}/api/members`, { headers, data: payload });
        const body: Member = await response.json();
        createdIds.push(body.id);

        expect(response.status()).toBe(201);
        expect(body.name).toBe(payload.name);
    });
});

test.describe('Lesson 3 - Form body with `form`', () => {

    test('POST as application/x-www-form-urlencoded', async ({ request }) => {
        const name = uniqueName('Form');

        // Sent on the wire as: name=Form...&gender=female
        const response = await request.post(`${BASE_URL}/api/members`, {
            headers,
            form: { name, gender: 'female' },
        });

        expect(response.status()).toBe(201);
        const body: Member = await response.json();
        createdIds.push(body.id);
        expect(body).toMatchObject({ name, gender: 'female' });
    });
});

test.describe('Lesson 3 - Test data from a JSON file', () => {

    // One test per entry in testdata/members.json -> validMembers
    for (const member of testData.validMembers) {
        test(`Create a valid member: ${member.name} (${member.gender})`, async ({ request }) => {
            const response = await request.post(`${BASE_URL}/api/members`, { headers, data: member });

            expect(response.status()).toBe(201);
            const body: Member = await response.json();
            createdIds.push(body.id);
            expect(body).toMatchObject(member);
        });
    }

    // Negative tests: every invalid body must be rejected with 400 and the right message
    for (const { case: caseName, body, msg } of testData.invalidMembers) {
        test(`Reject invalid data: ${caseName}`, async ({ request }) => {
            const response = await request.post(`${BASE_URL}/api/members`, { headers, data: body });

            expect(response.status()).toBe(400);
            expect(await response.json()).toEqual({ msg });
        });
    }

    test('Reject an empty body', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/api/members`, { headers, data: {} });

        expect(response.status()).toBe(400);
        expect((await response.json()).msg).toBe('Please provide a name and gender');
    });
});

test.describe('Lesson 3 - Boundary values for the name length (4 to 25)', () => {
    // Test right at the edges of a rule: the last valid and first invalid values
    const cases = [
        { length: 3, status: 400 },
        { length: 4, status: 201 },
        { length: 25, status: 201 },
        { length: 26, status: 400 },
    ];

    for (const { length, status } of cases) {
        test(`A name of ${length} characters returns ${status}`, async ({ request }) => {
            const name = 'A'.repeat(length);
            const response = await request.post(`${BASE_URL}/api/members`, { headers, data: { name, gender: 'male' } });

            expect(response.status()).toBe(status);
            if (status === 201) {
                createdIds.push((await response.json()).id); // afterEach deletes it
            } else {
                expect((await response.json()).msg).toBe('Name should be 4 to 25 characters long');
            }
        });
    }
});

test.describe('Lesson 3 - File upload with `multipart`', () => {

    test('Upload a file from disk', async ({ request }) => {
        const filePath = path.join(__dirname, '..', '..', 'files', 'logo.png');

        const response = await request.post(`${BASE_URL}/api/upload`, {
            headers,
            multipart: {
                // the field name "file" is what the API expects
                file: {
                    name: 'logo.png',
                    mimeType: 'image/png',
                    buffer: fs.readFileSync(filePath),
                },
            },
        });

        expect(response.status()).toBe(201);
        expect(await response.json()).toMatchObject({
            success: true,
            message: 'File uploaded successfully!',
            url: expect.stringContaining('logo.png'),
        });
    });

    test('Upload a file built in memory', async ({ request }) => {
        // No file on disk needed: the API only checks the extension and the size
        const response = await request.post(`${BASE_URL}/api/upload`, {
            headers,
            multipart: {
                file: { name: 'generated.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('fake-jpeg-bytes') },
            },
        });

        expect(response.status()).toBe(201);
        expect((await response.json()).success).toBe(true);
    });

    test('Reject an unsupported file type', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/api/upload`, {
            headers,
            multipart: {
                file: { name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('hello') },
            },
        });

        expect(response.status()).toBe(400);
        expect(await response.json()).toEqual({ success: false, message: 'Unsupported extension!' });
    });

    test('Reject a file larger than 5 MB', async ({ request }) => {
        const sixMb = Buffer.alloc(6 * 1024 * 1024, 1);

        const response = await request.post(`${BASE_URL}/api/upload`, {
            headers,
            multipart: {
                file: { name: 'big.png', mimeType: 'image/png', buffer: sixMb },
            },
        });

        expect(response.status()).toBe(400);
        expect((await response.json()).message).toBe('File must be less than 5MB');
    });
});
