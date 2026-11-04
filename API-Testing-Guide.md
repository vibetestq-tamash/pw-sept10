# API Testing with Playwright: A Beginner's Guide

This guide teaches REST API testing with Playwright, one small step at a time.
Every example tests the **Employee REST API** ([EmployeeRestSample](https://github.com/QtpSudhakarTrainings/EmployeeRestSample)).

The finished tests for each topic are in `tests/api/`. Read a section here, then open the matching file and run it.

---

## Contents

1. [What is API testing?](#1-what-is-api-testing)
2. [Get to know the Employee API](#2-get-to-know-the-employee-api)
3. [Setup](#3-setup)
4. [Your first API test](#4-your-first-api-test)
5. [Checking the response](#5-checking-the-response)
6. [Parameters: path, query and header](#6-parameters-path-query-and-header)
7. [Sending data: POST and PUT](#7-sending-data-post-and-put)
8. [Authentication](#8-authentication)
9. [CRUD: Create, Read, Update, Delete](#9-crud-create-read-update-delete)
10. [Negative tests](#10-negative-tests)
11. [Test data and cleanup](#11-test-data-and-cleanup)
12. [Avoid repeating yourself](#12-avoid-repeating-yourself)
13. [Running and debugging](#13-running-and-debugging)
14. [Common mistakes](#14-common-mistakes)
15. [Practice exercises](#15-practice-exercises)
16. [Cheat sheet](#16-cheat-sheet)

---

## 1. What is API testing?

A REST API is a set of URLs that a program talks to. Instead of clicking buttons, you send
an **HTTP request** and get back an **HTTP response**.

```
   Your test                                   Employee API
  ───────────     REQUEST                     ──────────────
  │         │ ──────────────────────────────▶ │            │
  │         │   GET /api/members/1            │            │
  │         │   Authorization: Basic ...      │            │
  │         │                                 │            │
  │         │ ◀────────────────────────────── │            │
  │         │     RESPONSE                    │            │
  ───────────   200 OK                        ──────────────
                [{"id":1,"name":"John Smith","gender":"Male"}]
```

A **request** has:

| Part | Example |
|------|---------|
| Method (what to do) | `GET`, `POST`, `PUT`, `DELETE` |
| URL (where) | `http://localhost:5002/api/members/1` |
| Headers (extra info) | `Authorization: Basic YWRtaW46YWRtaW4=` |
| Body (data, optional) | `{ "name": "Alice Walker", "gender": "female" }` |

A **response** has:

| Part | Example |
|------|---------|
| Status code | `200` OK, `201` Created, `400` Bad Request, `401` Unauthorized, `404` Not Found |
| Headers | `Content-Type: application/json` |
| Body | `[{ "id": 1, "name": "John Smith", "gender": "Male" }]` |

**An API test sends a request and checks the response:** the status code, the body,
and sometimes the headers.

### Why Playwright?

You probably already use Playwright for UI tests. It can also test APIs **without opening a browser**,
using the same `test`, `expect` and reports. API tests run in milliseconds, so they are fast and stable.

---

## 2. Get to know the Employee API

Before you test an API, find out what it does. This API stores "members" (employees).

### Endpoints

| Method | URL | What it does | Success code |
|--------|-----|--------------|--------------|
| GET | `/api/members` | Get all members | 200 |
| GET | `/api/members?gender=female` | Get members filtered by gender | 200 |
| GET | `/api/members/:id` | Get one member | 200 |
| POST | `/api/members` | Create a member | 201 |
| PUT | `/api/members/:id` | Update a member | 200 |
| DELETE | `/api/members/:id` | Delete a member | 200 |
| POST | `/api/upload` | Upload an image file | 201 |
| POST | `/api/auth/login` | Get a JWT token (public) | 200 |
| POST | `/oauth/token` | Get an OAuth2 token (public) | 200 |

### Rules for a member

| Field | Rule | Error message if broken |
|-------|------|-------------------------|
| `name` | required | `Please provide a name and gender` |
| `name` | 4 to 25 characters | `Name should be 4 to 25 characters long` |
| `name` | letters and spaces only (no digits, no `_`) | `Name should only contain Alphabets` |
| `gender` | required, `male` or `female` (any case) | `Gender should be either male or female only` |
| body | only `name` and `gender` allowed | `Please provide only name and gender` |

### Login

Every `/api/members` and `/api/upload` call needs a login. By default the API uses
**Basic Auth** with username `admin` and password `admin`.

> **Tip:** With the API running, open http://localhost:5002/api-docs to see the Swagger page and try every endpoint by hand.
> It always helps to try an API manually before you automate it.

---

## 3. Setup

**Step 1 - Start the API**

```bash
git clone https://github.com/QtpSudhakarTrainings/EmployeeRestSample.git
cd EmployeeRestSample
npm install
npm start          # prints: Server started on port 5002
```

Leave this terminal open. The API has to be running while your tests run.

**Step 2 - Check it works**

```bash
curl -u admin:admin http://localhost:5002/api/members/1
# [{"id":1,"name":"John Smith","gender":"Male"}]
```

**Step 3 - Install this project** (in a second terminal)

```bash
cd pw-sept10
npm install
```

**Step 4 - Run the API tests**

```bash
npx playwright test tests/api
```

### Files used in this guide

```
pw-sept10/
├── fixtures/api.ts              <- BASE_URL, auth helpers, uniqueName(), fixtures
├── testdata/members.json        <- test data for data-driven tests
├── files/logo.png               <- file used in the upload test
└── tests/api/
    ├── 01RequestBasics.spec.ts
    ├── 02Parameters.spec.ts
    ├── 03RequestData.spec.ts
    ├── 04Authentication.spec.ts
    ├── 05CrudFlow.spec.ts
    └── 06CrudWithFixtures.spec.ts
```

---

## 4. Your first API test

```ts
import { test, expect } from '@playwright/test';

test('Get all members', async ({ request }) => {
    const response = await request.get('http://localhost:5002/api/members', {
        headers: {
            Authorization: 'Basic ' + Buffer.from('admin:admin').toString('base64'),
        },
    });

    expect(response.status()).toBe(200);
});
```

What each part does:

| Code | Meaning |
|------|---------|
| `async ({ request })` | Playwright gives you a `request` object for sending HTTP calls. No browser is opened. |
| `request.get(url, options)` | Sends a GET request. There is also `post`, `put`, `patch`, `delete`. |
| `headers: { Authorization: ... }` | Sends the login with the request (more in [section 8](#8-authentication)). |
| `await` | Wait for the response before moving on. **Never forget `await`.** |
| `response.status()` | The status code, such as 200. |

### Keep the URL in one place

Typing `http://localhost:5002` in every test is a problem: if the server moves, you edit every file.
Put it in one constant instead. This project keeps it in `fixtures/api.ts`:

```ts
export const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5002';
```

Then use it in your tests:

```ts
import { BASE_URL } from '../../fixtures/api';

const response = await request.get(`${BASE_URL}/api/members`, { headers });
```

To test a different server, change one line or set an environment variable:
`API_BASE_URL=https://my-server.com npx playwright test tests/api`

> 📄 Full examples: `tests/api/01RequestBasics.spec.ts`

---

## 5. Checking the response

Getting a response is only half the job. Now **assert** that it is correct.

### Status code

```ts
expect(response.status()).toBe(200);     // the exact code
expect(response.ok()).toBeTruthy();      // any 2xx code
await expect(response).toBeOK();         // same as ok(), with a better error message
```

### Body

```ts
const body = await response.json();      // body parsed as JSON (needs await!)
const text = await response.text();      // body as a plain string
```

Check the values:

```ts
const response = await request.get(`${BASE_URL}/api/members/1`, { headers });
const body = await response.json();

// This API returns one member inside an array: [ { id, name, gender } ]
expect(body).toHaveLength(1);
expect(body[0].id).toBe(1);
expect(body[0].name).toBe('John Smith');
```

### Which matcher to use

| Matcher | Use it when | Example |
|---------|-------------|---------|
| `toBe` | one simple value | `expect(body.id).toBe(1)` |
| `toEqual` | the whole object must match | `expect(body).toEqual({ msg: 'Not found' })` |
| `toMatchObject` | only some fields matter | `expect(body).toMatchObject({ name: 'Alice' })` |
| `toContain` | text contains a part | `expect(body.msg).toContain('deleted')` |
| `toHaveLength` | array size | `expect(list).toHaveLength(3)` |
| `toHaveProperty` | a field exists | `expect(body).toHaveProperty('id')` |
| `expect.any(Number)` | any value of that type | `expect(body).toEqual({ id: expect.any(Number), ... })` |

Checking the **shape** of each item, without knowing the exact values:

```ts
const members = await response.json();

for (const member of members) {
    expect(member).toEqual({
        id: expect.any(Number),
        name: expect.any(String),
        gender: expect.stringMatching(/^(male|female)$/i),
    });
}
```

### Headers

```ts
const headers = response.headers();      // header names are always lower-case
expect(headers['content-type']).toContain('application/json');
```

### Errors do not throw

A `401` or `404` is still a normal response. Playwright does **not** fail the test on its own,
so you check the status yourself. That is what lets you write negative tests:

```ts
const response = await request.get(`${BASE_URL}/api/members`);   // no login
expect(response.status()).toBe(401);
```

---

## 6. Parameters: path, query and header

There are three places to put extra information in a request.

| Type | Where | Example |
|------|-------|---------|
| Path parameter | inside the URL path | `/api/members/`**`5`** |
| Query parameter | after `?` in the URL | `/api/members`**`?gender=female`** |
| Header parameter | in the request headers | **`Accept: application/json`** |

### Path parameter

```ts
const id = 2;
const response = await request.get(`${BASE_URL}/api/members/${id}`, { headers });

expect((await response.json())[0].id).toBe(id);
```

### Query parameter

Use the `params` option. Playwright adds the `?` and encodes the values for you:

```ts
// Sends: GET /api/members?gender=female
const response = await request.get(`${BASE_URL}/api/members`, {
    headers,
    params: { gender: 'female' },
});

const members = await response.json();
for (const m of members) {
    expect(m.gender.toLowerCase()).toBe('female');
}
```

Typing it into the URL works too, but `params` is cleaner and safer:

```ts
await request.get(`${BASE_URL}/api/members?gender=female`, { headers });
```

### Header parameter

```ts
const response = await request.get(`${BASE_URL}/api/members/1`, {
    headers: {
        Authorization: 'Basic YWRtaW46YWRtaW4=',
        Accept: 'application/json',
    },
});
```

### Running one test with many values

Use a normal `for` loop around `test()`:

```ts
for (const id of [1, 2, 3]) {
    test(`Get member ${id}`, async ({ request }) => {
        const response = await request.get(`${BASE_URL}/api/members/${id}`, { headers });
        expect(response.status()).toBe(200);
    });
}
```

This creates three separate tests, and each one shows up in the report.

> 📄 Full examples: `tests/api/02Parameters.spec.ts`

---

## 7. Sending data: POST and PUT

To create or update data, send a **body** with the request. Playwright has one option per body format:

| Option | Format | Use for |
|--------|--------|---------|
| `data` | JSON | most REST APIs (the normal case) |
| `form` | `application/x-www-form-urlencoded` | HTML-style forms, many OAuth servers |
| `multipart` | `multipart/form-data` | file uploads |

### JSON body with `data`

Pass a normal JavaScript object. Playwright turns it into JSON and sets `Content-Type: application/json` for you.

```ts
test('Create a member', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/members`, {
        headers,
        data: { name: 'Alice Walker', gender: 'female' },
    });

    expect(response.status()).toBe(201);              // 201 = Created

    const body = await response.json();
    expect(body.name).toBe('Alice Walker');
    expect(body.gender).toBe('female');
    expect(body.id).toEqual(expect.any(Number));      // the server picks the id
});
```

### Form body with `form`

```ts
await request.post(`${BASE_URL}/api/members`, {
    headers,
    form: { name: 'Robert Brown', gender: 'male' },
});
```

### File upload with `multipart`

```ts
import fs from 'fs';

test('Upload an image', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/upload`, {
        headers,
        multipart: {
            file: {                                    // "file" is the field name the API expects
                name: 'logo.png',
                mimeType: 'image/png',
                buffer: fs.readFileSync('files/logo.png'),
            },
        },
    });

    expect(response.status()).toBe(201);
    expect((await response.json()).success).toBe(true);
});
```

### Update with PUT

PUT works like POST, plus the id in the URL. In this API you can send only the fields you want to change:

```ts
const response = await request.put(`${BASE_URL}/api/members/${id}`, {
    headers,
    data: { name: 'New Name' },        // gender stays the same
});

expect(response.status()).toBe(200);
expect((await response.json()).member.name).toBe('New Name');
```

> 📄 Full examples: `tests/api/03RequestData.spec.ts`

---

## 8. Authentication

Authentication proves who you are. Without it the API answers **401 Unauthorized**.

This API supports four kinds. **Only one is switched on at a time**, chosen in the API's `app.js`
(Basic Auth is the default).

| Type | What you send | Real-world use |
|------|---------------|----------------|
| Basic Auth | `Authorization: Basic base64(user:password)` | internal tools, simple services |
| API Key | `x-api-key: demo-api-key-12345` | public APIs (weather, maps) |
| Bearer Token (JWT) | log in first, then `Authorization: Bearer <token>` | most modern web/mobile apps |
| OAuth2 Client Credentials | swap client id + secret for a token, then `Authorization: Bearer <token>` | service-to-service calls |

### 8.1 Basic Auth

The username and password are joined with `:` and base64-encoded:

```
admin:admin  ──base64──▶  YWRtaW46YWRtaW4=
```

**Way 1 - build the header yourself**

```ts
const response = await request.get(`${BASE_URL}/api/members`, {
    headers: {
        Authorization: 'Basic ' + Buffer.from('admin:admin').toString('base64'),
    },
});
expect(response.status()).toBe(200);
```

**Way 2 - a small helper** (in `fixtures/api.ts`)

```ts
export function basicAuthHeader(username: string, password: string) {
    return { Authorization: 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64') };
}

// in a test
const headers = basicAuthHeader('admin', 'admin');
await request.get(`${BASE_URL}/api/members`, { headers });
```

**Way 3 - let Playwright handle it with `httpCredentials`**

```ts
test.describe('With Basic Auth', () => {
    test.use({ httpCredentials: { username: 'admin', password: 'admin' } });

    test('no header needed', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/api/members`);
        expect(response.status()).toBe(200);
    });
});
```

### 8.2 API Key

The key is just a header:

```ts
const response = await request.get(`${BASE_URL}/api/members`, {
    headers: { 'x-api-key': 'demo-api-key-12345' },
});
```

### 8.3 Bearer Token (JWT): log in, then use the token

This takes **two requests**. The second one uses data from the first, which is called **chaining**.

```ts
test('Login and use the token', async ({ request }) => {
    // Step 1: log in to get a token
    const login = await request.post(`${BASE_URL}/api/auth/login`, {
        data: { username: 'admin', password: 'admin' },
    });
    expect(login.status()).toBe(200);
    const token = (await login.json()).access_token;

    // Step 2: send the token with the next request
    const response = await request.get(`${BASE_URL}/api/members`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
});
```

The login response looks like this:

```json
{ "token_type": "Bearer", "access_token": "eyJhbGciOi...", "expires_in": "1h" }
```

### 8.4 OAuth2 Client Credentials

Same idea as JWT, with a different token URL and body:

```ts
const tokenResponse = await request.post(`${BASE_URL}/oauth/token`, {
    data: {
        grant_type: 'client_credentials',
        client_id: 'demo-client',
        client_secret: 'demo-secret',
    },
});
const token = (await tokenResponse.json()).access_token;

await request.get(`${BASE_URL}/api/members`, {
    headers: { Authorization: `Bearer ${token}` },
});
```

### 8.5 Always test the failures too

```ts
test('Wrong password is rejected', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/members`, {
        headers: basicAuthHeader('admin', 'wrong'),
    });
    expect(response.status()).toBe(401);
});

test('No login is rejected', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/members`);
    expect(response.status()).toBe(401);
});
```

### 8.6 Trying the other auth types

1. In the API's `app.js`, comment out `app.use(basicAuth)` and uncomment the one you want, for example `app.use(bearerAuth)`.
2. Restart the API (`npm start`).
3. Tell the tests which type is active:

```bash
AUTH_MODE=jwt    npx playwright test tests/api/04Authentication.spec.ts
AUTH_MODE=apikey npx playwright test tests/api/04Authentication.spec.ts
AUTH_MODE=oauth2 npx playwright test tests/api/04Authentication.spec.ts
```

Tests for the inactive types are skipped with `test.skip(...)`.

> 📄 Full examples: `tests/api/04Authentication.spec.ts`

---

## 9. CRUD: Create, Read, Update, Delete

CRUD is the full life of a record. Testing it end to end shows the API really saves your changes.

| Step | Request | Check |
|------|---------|-------|
| **C**reate | `POST /api/members` | 201, and save the new `id` |
| **R**ead | `GET /api/members/{id}` | 200, data matches what you sent |
| **U**pdate | `PUT /api/members/{id}` | 200, then GET again to confirm the change |
| **D**elete | `DELETE /api/members/{id}` | 200, then confirm it is gone |

### Option A: all in one test (simplest)

```ts
test('CRUD for a member', async ({ request }) => {
    // CREATE
    const create = await request.post(`${BASE_URL}/api/members`, {
        headers,
        data: { name: 'Crud Tester', gender: 'male' },
    });
    expect(create.status()).toBe(201);
    const id = (await create.json()).id;

    // READ
    const read = await request.get(`${BASE_URL}/api/members/${id}`, { headers });
    expect((await read.json())[0].name).toBe('Crud Tester');

    // UPDATE
    const update = await request.put(`${BASE_URL}/api/members/${id}`, {
        headers,
        data: { name: 'Crud Updated' },
    });
    expect(update.status()).toBe(200);

    // READ again: was the update saved?
    const readAgain = await request.get(`${BASE_URL}/api/members/${id}`, { headers });
    expect((await readAgain.json())[0].name).toBe('Crud Updated');

    // DELETE
    const del = await request.delete(`${BASE_URL}/api/members/${id}`, { headers });
    expect(del.status()).toBe(200);
    expect((await del.json()).msg).toBe(`Member with id ${id} is deleted successfully`);
});
```

### Option B: one test per step (clearer report)

Separate tests usually run in parallel and in any order. These steps depend on each other,
so use **serial mode**: the tests run in order, and if one fails the rest are skipped.

```ts
test.describe('Member CRUD', () => {
    test.describe.configure({ mode: 'serial' });

    let id: number;   // shared between the steps

    test('Create', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/api/members`, {
            headers, data: { name: 'Serial Tester', gender: 'male' },
        });
        expect(response.status()).toBe(201);
        id = (await response.json()).id;
    });

    test('Read', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/api/members/${id}`, { headers });
        expect(response.status()).toBe(200);
    });

    test('Update', async ({ request }) => {
        const response = await request.put(`${BASE_URL}/api/members/${id}`, {
            headers, data: { gender: 'female' },
        });
        expect((await response.json()).member.gender).toBe('female');
    });

    test('Delete', async ({ request }) => {
        const response = await request.delete(`${BASE_URL}/api/members/${id}`, { headers });
        expect(response.status()).toBe(200);
    });
});
```

| | Option A (one test) | Option B (serial steps) |
|---|---|---|
| Easy to write | ✅ | ✅ |
| Report shows which step failed | only the line number | ✅ step name |
| Can run in parallel with others | ✅ | runs in order |

> 📄 Full examples: `tests/api/05CrudFlow.spec.ts`

---

## 10. Negative tests

A good tester checks that the API **rejects bad input** as well as accepting good input.
For this API that means:

| Scenario | Expected |
|----------|----------|
| Name missing | 400 + `Please provide a name and gender` |
| Name too short (`Bob`) | 400 + `Name should be 4 to 25 characters long` |
| Name with a digit (`John2`) | 400 + `Name should only contain Alphabets` |
| Gender `other` | 400 + `Gender should be either male or female only` |
| Extra field (`age`) | 400 + `Please provide only name and gender` |
| GET / PUT / DELETE an id that doesn't exist | 404 |
| No login or wrong password | 401 |
| Upload a `.txt` file | 400 + `Unsupported extension!` |

One example:

```ts
test('Name too short is rejected', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/members`, {
        headers,
        data: { name: 'Bob', gender: 'male' },
    });

    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({ msg: 'Name should be 4 to 25 characters long' });
});
```

### Data-driven: many cases, one test body

Writing one test per case gets repetitive. Put the cases in a JSON file instead (`testdata/members.json`):

```json
{
    "invalidMembers": [
        { "case": "missing name",   "body": { "gender": "male" },                 "msg": "Please provide a name and gender" },
        { "case": "name too short", "body": { "name": "Bob", "gender": "male" },  "msg": "Name should be 4 to 25 characters long" },
        { "case": "invalid gender", "body": { "name": "John Carter", "gender": "other" }, "msg": "Gender should be either male or female only" }
    ]
}
```

Then loop over them:

```ts
import testData from '../../testdata/members.json';

for (const { case: caseName, body, msg } of testData.invalidMembers) {
    test(`Reject: ${caseName}`, async ({ request }) => {
        const response = await request.post(`${BASE_URL}/api/members`, { headers, data: body });

        expect(response.status()).toBe(400);
        expect(await response.json()).toEqual({ msg });
    });
}
```

To add a new case, add a line to the JSON file. No code changes needed.

---

## 11. Test data and cleanup

### Unique names

When the same test runs many times, use a unique name so runs don't clash. **Careful:** this API
does not accept digits in names, so `'User' + Date.now()` gets a **400**.
`uniqueName()` in `fixtures/api.ts` turns the digits into letters:

```ts
import { uniqueName } from '../../fixtures/api';

const name = uniqueName();   // e.g. "Pwbghjcadeffbcjhd": only letters, so it is valid
```

### Clean up what you create

Tests that create members should delete them, otherwise the database grows with every run.
Use `afterEach`. It runs **even if the test fails**:

```ts
let createdIds: number[] = [];

test.afterEach(async ({ request }) => {
    for (const id of createdIds) {
        await request.delete(`${BASE_URL}/api/members/${id}`, { headers });
    }
    createdIds = [];
});

test('Create a member', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/members`, {
        headers, data: { name: uniqueName(), gender: 'male' },
    });
    const body = await response.json();
    createdIds.push(body.id);          // remember it for cleanup

    expect(response.status()).toBe(201);
});
```

### Golden rule: every test creates its own data

Don't write a test that only passes because another test ran first, or because id `7` happens to exist.
Create what you need, test it, delete it.

---

## 12. Avoid repeating yourself

Once you have several test files, the same lines show up everywhere: the base URL, the auth header,
create-then-delete. Move them into one shared file, in two levels.

### Level 1: helper functions and constants

Everything shared lives in `fixtures/api.ts`: `BASE_URL`, `basicAuthHeader()`, `bearerAuthHeader()`, `uniqueName()`, `creds`.
Import what you need:

```ts
import { BASE_URL, basicAuthHeader, uniqueName } from '../../fixtures/api';
```

For a beginner, this is enough.

### Level 2: a custom fixture (when you're ready)

A **fixture** is something Playwright prepares before a test and tidies up after it. You already use
the built-in `request` fixture. `fixtures/api.ts` adds two of its own:

- `api`: like `request`, but the base URL and the login are already set
- `createMember`: creates a member for the test and **deletes it automatically** afterwards

```ts
import { test, expect } from '../../fixtures/api';   // note: import from our file

test('Update a member', async ({ api, createMember }) => {
    const member = await createMember({ gender: 'male' });     // set up

    const response = await api.put(`/api/members/${member.id}`, {   // short path, no headers
        data: { gender: 'female' },
    });

    expect((await response.json()).member.gender).toBe('female');
    // no cleanup code: createMember deletes the member after the test
});
```

How the `api` fixture is built, in short:

```ts
export const test = base.extend({
    api: async ({ playwright }, use) => {
        const api = await playwright.request.newContext({
            baseURL: BASE_URL,
            extraHTTPHeaders: basicAuthHeader('admin', 'admin'),
        });
        await use(api);        // the test runs here
        await api.dispose();   // cleanup after the test
    },
});
```

> 📄 Full examples: `tests/api/06CrudWithFixtures.spec.ts`

---

## 13. Running and debugging

### Commands

```bash
npx playwright test tests/api                          # all API tests
npx playwright test tests/api/05CrudFlow.spec.ts       # one file
npx playwright test tests/api -g "Create"              # only tests whose title contains "Create"
npx playwright test tests/api --workers=1            # one at a time (easier to read logs)
npx playwright show-report                             # open the HTML report
```

### Seeing what happened

Print the response while you write a test:

```ts
console.log(response.status());
console.log(await response.json());
```

Put the response body in the assertion message, so a failure shows *why*:

```ts
expect(response.status(), await response.text()).toBe(201);
// on failure you see: {"msg":"Name should only contain Alphabets"}
```

Split a long test into named steps. They show up in the HTML report:

```ts
await test.step('Create member', async () => { /* ... */ });
await test.step('Verify member', async () => { /* ... */ });
```

---

## 14. Common mistakes

| Symptom | Cause | Fix |
|---------|-------|-----|
| `connect ECONNREFUSED 127.0.0.1:5002` | API is not running | `npm start` in the EmployeeRestSample folder |
| Every test gets **401** | missing or wrong login, or a different auth type is on in `app.js` | check the header; check which `app.use(...)` line is active |
| POST gets **400** "Name should only contain Alphabets" | name has digits or `_`, e.g. `'User' + Date.now()` | use `uniqueName()` |
| `expect(received).toBe(expected)`, received is a `Promise` | forgot `await` before `response.json()` | `const body = await response.json()` |
| `body.name` is `undefined` on GET by id | GET `/api/members/:id` returns an **array** | use `body[0].name` |
| Test passes alone, fails with others | tests share data, or depend on each other's order | each test creates its own data; use serial mode for dependent steps |
| Upload gets **400** | wrong file type, or field name not `file` | use png/jpg/jpeg/gif, field `file` |

---

## 15. Practice exercises

Try these yourself before you look at the test files.

1. **Status check** - `GET /api/members/2` returns 200 and the name `Mike Bax`.
2. **Query filter** - `GET /api/members?gender=male` returns only male members.
3. **Create** - POST a member with your own name. Check 201 and that the response contains your name.
4. **Validation** - POST a member with the name `Ab`. Check 400 and the exact error message.
5. **Update gender only** - create a member, PUT just `{ gender: 'female' }`, check the name did not change.
6. **Delete twice** - delete a member, then delete it again. What status do you expect?
7. **Auth** - call `GET /api/members` with password `Admin` (capital A). What do you get?
8. **Chaining** - log in at `/api/auth/login` and check that `access_token` is a non-empty string.
9. **Upload** - upload a `.gif` (any bytes, name it `test.gif`) and check 201. Then try a `.pdf` and check 400.
10. **Data-driven** - add two new invalid cases to `testdata/members.json` and run lesson 3 again.

---

## 16. Cheat sheet

```ts
import { test, expect } from '@playwright/test';
import { BASE_URL, basicAuthHeader } from '../../fixtures/api';

const headers = basicAuthHeader('admin', 'admin');

// ---- Requests ----
await request.get(`${BASE_URL}/api/members`, { headers });
await request.get(`${BASE_URL}/api/members`, { headers, params: { gender: 'male' } });
await request.post(`${BASE_URL}/api/members`, { headers, data: { name: 'Alice Walker', gender: 'female' } });
await request.put(`${BASE_URL}/api/members/5`, { headers, data: { name: 'New Name' } });
await request.delete(`${BASE_URL}/api/members/5`, { headers });
await request.post(`${BASE_URL}/api/members`, { headers, form: { name: 'Form User', gender: 'male' } });
await request.post(`${BASE_URL}/api/upload`, { headers, multipart: { file: { name: 'a.png', mimeType: 'image/png', buffer } } });

// ---- Response ----
response.status()            // 200
response.ok()                // true for 2xx
response.headers()           // { 'content-type': '...' }
await response.json()        // parsed body
await response.text()        // raw body

// ---- Assertions ----
expect(response.status()).toBe(201);
await expect(response).toBeOK();
expect(body).toEqual({ id: expect.any(Number), name: 'Alice Walker', gender: 'female' });
expect(body).toMatchObject({ name: 'Alice Walker' });
expect(list).toHaveLength(3);
expect(body.msg).toContain('deleted');

// ---- Auth headers ----
{ Authorization: 'Basic ' + Buffer.from('admin:admin').toString('base64') }
{ 'x-api-key': 'demo-api-key-12345' }
{ Authorization: `Bearer ${token}` }

// ---- Structure ----
test.describe('Group', () => { ... });
test.describe.configure({ mode: 'serial' });   // run steps in order
test.afterEach(async ({ request }) => { ... }); // cleanup
test.step('Step name', async () => { ... });   // label a step
for (const item of list) { test(`Case ${item}`, async ({ request }) => { ... }); }
```

---

**Next steps:** run `npx playwright test tests/api`, open `npx playwright show-report`, and read the
lesson files in order, `01` through `06`. Each one builds on the one before.
