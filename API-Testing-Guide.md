# API Testing with Playwright: Step-by-Step Guide

This guide shows how to test the **Employee REST API** ([EmployeeRestSample](https://github.com/QtpSudhakarTrainings/EmployeeRestSample))
with Playwright.

> **New to APIs?** Read **[API-Basics.md](API-Basics.md)** first. It explains endpoints, resources,
> parameters, headers, methods, JSON and status codes without any code. This guide assumes you know those words.

The finished tests for every topic are in `tests/api/`. Read a section, then open the matching file and run it.

---

## Contents

**Getting started**
1. [Setup](#1-setup)
2. [How Playwright sends an API request](#2-how-playwright-sends-an-api-request)
3. [From API concept to Playwright code](#3-from-api-concept-to-playwright-code)
4. [Two helpers you'll use everywhere](#4-two-helpers-youll-use-everywhere)

**One recipe per method**
5. [GET all members](#5-get-all-members)
6. [GET one member (path parameter)](#6-get-one-member-path-parameter)
7. [GET with a filter (query parameter)](#7-get-with-a-filter-query-parameter)
8. [POST: create a member](#8-post-create-a-member)
9. [PUT: update a member](#9-put-update-a-member)
10. [PATCH: partial update (not supported here)](#10-patch-partial-update-not-supported-here)
11. [DELETE: remove a member](#11-delete-remove-a-member)

**Checking responses**
12. [The response checklist](#12-the-response-checklist)
13. [Reading the response body](#13-reading-the-response-body)
14. [Which `expect` to use](#14-which-expect-to-use)

**Going further**
15. [Other body formats: form and file upload](#15-other-body-formats-form-and-file-upload)
16. [Authentication in Playwright](#16-authentication-in-playwright)
17. [From requirement to test cases](#17-from-requirement-to-test-cases)
18. [A full CRUD test](#18-a-full-crud-test)
19. [Test data and cleanup](#19-test-data-and-cleanup)
20. [Reusing code: helpers and fixtures](#20-reusing-code-helpers-and-fixtures)
21. [Running and debugging](#21-running-and-debugging)
22. [Common mistakes](#22-common-mistakes)
23. [Practice exercises (with answers)](#23-practice-exercises-with-answers)
24. [Cheat sheet](#24-cheat-sheet)

---

## 1. Setup

**Step 1: Start the API** (in one terminal, and keep it open)

```bash
git clone https://github.com/QtpSudhakarTrainings/EmployeeRestSample.git
cd EmployeeRestSample
npm install
npm start                      # prints: Server started on port 5002
```

**Step 2: Check it answers**

```bash
curl -u admin:admin http://localhost:5002/api/members/1
# [{"id":1,"name":"John Smith","gender":"Male"}]
```

**Step 3: Install and run the tests** (in a second terminal)

```bash
cd pw-sept10
npm install
npx playwright test tests/api
```

### Project files

```
pw-sept10/
├── API-Basics.md                <- concepts (read first)
├── API-Testing-Guide.md         <- this guide
├── fixtures/api.ts              <- BASE_URL, login helpers, uniqueName(), fixtures
├── testdata/members.json        <- test data for data-driven tests
├── files/logo.png               <- image used in the upload test
└── tests/api/
    ├── 01RequestBasics.spec.ts       sections 2, 5, 12-14
    ├── 02Parameters.spec.ts          sections 6, 7
    ├── 03RequestData.spec.ts         sections 8, 15, 17
    ├── 04Authentication.spec.ts      section 16
    ├── 05CrudFlow.spec.ts            sections 9-11, 18
    └── 06CrudWithFixtures.spec.ts    sections 19, 20
```

---

## 2. How Playwright sends an API request

In UI tests you use the `page` object to click and type. For API tests you use the **`request`** object
to send HTTP requests. **No browser opens**, and Playwright talks to the API directly.

### Your first test, line by line

```ts
import { test, expect } from '@playwright/test';                    // 1

test('Get member 1', async ({ request }) => {                        // 2
    const response = await request.get(                              // 3
        'http://localhost:5002/api/members/1',                       // 4
        {
            headers: {                                               // 5
                Authorization: 'Basic ' + Buffer.from('admin:admin').toString('base64'),
            },
        }
    );

    expect(response.status()).toBe(200);                             // 6

    const body = await response.json();                              // 7
    expect(body[0].name).toBe('John Smith');                         // 8
});
```

| Line | What it does |
|------|--------------|
| 1 | Imports `test` (to define a test) and `expect` (to check results) |
| 2 | Defines a test. `{ request }` asks Playwright for its API client |
| 3 | `request.get(...)` sends a **GET** request. `await` waits for the response to arrive |
| 4 | The **URL**: base URL + resource path + path parameter |
| 5 | **Headers**: here, the Basic Auth login (`admin:admin` in base64) |
| 6 | Checks the **status code** is 200 |
| 7 | Reads the **body** and turns the JSON text into a JavaScript value |
| 8 | Checks a **value** in the body. The API returns an array, so `[0]` is the first item |

> ⚠️ **Always `await`**: `request.get(...)`, `response.json()` and `response.text()` all need `await`.
> Forget it and you get a `Promise` instead of data, and the test fails in a confusing way.

### Run it

```bash
npx playwright test tests/api/01RequestBasics.spec.ts
```

---

## 3. From API concept to Playwright code

Every part of a request from [API-Basics.md](API-Basics.md) has a matching place in Playwright:

| API concept | Playwright code | Example |
|-------------|-----------------|---------|
| **Method** GET | `request.get(url, options)` | `request.get(url)` |
| **Method** POST | `request.post(url, options)` | `request.post(url, { data })` |
| **Method** PUT | `request.put(url, options)` | `request.put(url, { data })` |
| **Method** PATCH | `request.patch(url, options)` | `request.patch(url, { data })` |
| **Method** DELETE | `request.delete(url, options)` | `request.delete(url)` |
| **URL** + path parameter | 1st argument | `` `${BASE_URL}/api/members/${id}` `` |
| **Query parameters** | `params` option | `{ params: { gender: 'male' } }` |
| **Headers** | `headers` option | `{ headers: { Authorization: '...' } }` |
| **JSON body** | `data` option | `{ data: { name: 'Alice Walker', gender: 'female' } }` |
| **Form body** | `form` option | `{ form: { name: 'Alice Walker', gender: 'female' } }` |
| **File upload** | `multipart` option | `{ multipart: { file: {...} } }` |

And for the **response**:

| Response part | Playwright code | Gives you |
|---------------|-----------------|-----------|
| Status code | `response.status()` | `200` |
| Status text | `response.statusText()` | `'OK'` |
| Success? (2xx) | `response.ok()` | `true` / `false` |
| Headers | `response.headers()` | `{ 'content-type': 'application/json; ...' }` |
| Body as JSON | `await response.json()` | an object or array |
| Body as text | `await response.text()` | a string |

**The general shape of every request:**

```ts
const response = await request.METHOD(URL, {
    headers: { ... },     // login, content type ...       (optional)
    params:  { ... },     // query parameters               (optional)
    data:    { ... },     // body, for POST / PUT / PATCH   (optional)
});
```

> When you pass an object to `data`, Playwright turns it into JSON and sets `Content-Type: application/json` for you.

---

## 4. Two helpers you'll use everywhere

Typing the base URL and the login in every test is repetitive and hard to change, so `fixtures/api.ts` holds them once:

```ts
// The base URL, in one place. Override with:  API_BASE_URL=https://my-server npx playwright test tests/api
export const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5002';

// Builds the Basic Auth header: { Authorization: 'Basic YWRtaW46YWRtaW4=' }
export function basicAuthHeader(username: string, password: string) {
    return { Authorization: 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64') };
}
```

At the top of a test file:

```ts
import { test, expect } from '@playwright/test';
import { BASE_URL, basicAuthHeader } from '../../fixtures/api';

const headers = basicAuthHeader('admin', 'admin');
```

**All the examples below assume these three lines.**

---

# One recipe per method

Each recipe has the same parts: **what it does → input needed → curl (manual) → Playwright → expected response → what to check.**

---

## 5. GET all members

| | |
|---|---|
| **What it does** | reads the whole collection |
| **Endpoint** | `GET /api/members` |
| **Input** | URL + login header. **No body** |
| **Success** | `200 OK`, body = array of members |

**Manually:**

```bash
curl -u admin:admin http://localhost:5002/api/members
```

**Playwright:**

```ts
test('GET all members', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/members`, { headers });

    // 1. status
    expect(response.status()).toBe(200);

    // 2. header
    expect(response.headers()['content-type']).toContain('application/json');

    // 3. body structure: an array with at least one member
    const members = await response.json();
    expect(Array.isArray(members)).toBeTruthy();
    expect(members.length).toBeGreaterThan(0);

    // 4. every member has the right fields and types
    for (const member of members) {
        expect(member).toEqual({
            id: expect.any(Number),
            name: expect.any(String),
            gender: expect.any(String),
        });
    }
});
```

**Expected response:**

```json
[
  { "id": 1, "name": "John Smith", "gender": "Male" },
  { "id": 2, "name": "Mike Bax", "gender": "Male" }
]
```

**What to check:** status 200 · JSON content type · it's an array · each item has `id` (number), `name`, `gender`.

> 📄 `tests/api/01RequestBasics.spec.ts`

---

## 6. GET one member (path parameter)

| | |
|---|---|
| **What it does** | reads one item by its id |
| **Endpoint** | `GET /api/members/{id}` |
| **Input** | the id **in the URL path** + login header. **No body** |
| **Success** | `200 OK`, body = `[ member ]` (an array with one item) |
| **Failure** | `404 Not Found` if the id doesn't exist |

**Manually:**

```bash
curl -u admin:admin http://localhost:5002/api/members/1
```

**Playwright, positive test:**

```ts
test('GET one member by id', async ({ request }) => {
    const id = 1;                                                    // path parameter
    const response = await request.get(`${BASE_URL}/api/members/${id}`, { headers });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveLength(1);                                    // array with one member
    expect(body[0].id).toBe(id);
    expect(body[0].name).toBe('John Smith');
});
```

**Playwright, negative test (id doesn't exist):**

```ts
test('GET a member that does not exist', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/members/999999`, { headers });

    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({ msg: "Member with id 999999 doesn't exist" });
});
```

**What to check:** status · the returned id equals the one you asked for · the values · a 404 plus message for an unknown id.

> 📄 `tests/api/02Parameters.spec.ts`

---

## 7. GET with a filter (query parameter)

| | |
|---|---|
| **What it does** | reads only the members that match a condition |
| **Endpoint** | `GET /api/members?gender={male\|female}` |
| **Input** | query parameter `gender` + login header. **No body** |
| **Success** | `200 OK`, body = array of matching members |
| **Failure** | `404` if no member has that gender |

**Manually:**

```bash
curl -u admin:admin "http://localhost:5002/api/members?gender=female"
```

**Playwright:** use the `params` option. Playwright builds the `?gender=female` part for you:

```ts
test('GET members filtered by gender', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/members`, {
        headers,
        params: { gender: 'female' },        // → /api/members?gender=female
    });

    expect(response.status()).toBe(200);

    const members = await response.json();
    expect(members.length).toBeGreaterThan(0);
    for (const m of members) {
        expect(m.gender.toLowerCase()).toBe('female');    // every result matches the filter
    }
});
```

Writing it straight into the URL also works: `` request.get(`${BASE_URL}/api/members?gender=female`, { headers }) ``.
`params` is cleaner, and it encodes special characters (spaces, `&`) safely.

**Negative test:**

```ts
test('Filter with no matches returns 404', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/members`, { headers, params: { gender: 'unknown' } });

    expect(response.status()).toBe(404);
    expect((await response.json()).msg).toBe("Member with gender unknown doesn't exist");
});
```

**What to check:** **every** returned item matches the filter (not just the first) · a 404 when nothing matches.

> 📄 `tests/api/02Parameters.spec.ts`

---

## 8. POST: create a member

| | |
|---|---|
| **What it does** | creates a new member |
| **Endpoint** | `POST /api/members` (no id, because the server creates it) |
| **Input** | login header + **JSON body with `name` and `gender`** (both required) |
| **Success** | `201 Created`, body = the new member **with its new id** |
| **Failure** | `400 Bad Request` + message if a rule is broken |

**Manually:**

```bash
curl -u admin:admin -X POST -H "Content-Type: application/json" \
     -d '{"name":"Alice Walker","gender":"female"}' \
     http://localhost:5002/api/members
```

**Playwright:** the body goes in `data`:

```ts
test('POST creates a member', async ({ request }) => {
    const newMember = { name: 'Alice Walker', gender: 'female' };

    const response = await request.post(`${BASE_URL}/api/members`, {
        headers,
        data: newMember,                         // the body (sent as JSON)
    });

    // 1. status: 201 Created (not just 200)
    expect(response.status()).toBe(201);

    // 2. the response echoes what we sent...
    const created = await response.json();
    expect(created.name).toBe(newMember.name);
    expect(created.gender).toBe(newMember.gender);

    // 3. ...plus an id chosen by the server
    expect(created.id).toEqual(expect.any(Number));

    // 4. it's really saved: read it back with GET
    const check = await request.get(`${BASE_URL}/api/members/${created.id}`, { headers });
    expect((await check.json())[0].name).toBe('Alice Walker');

    // cleanup: delete what we created (see section 19)
    await request.delete(`${BASE_URL}/api/members/${created.id}`, { headers });
});
```

**Expected response:**

```json
{ "id": 21, "name": "Alice Walker", "gender": "female" }
```

**Negative test:**

```ts
test('POST rejects a name that is too short', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/members`, {
        headers,
        data: { name: 'Bob', gender: 'male' },
    });

    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({ msg: 'Name should be 4 to 25 characters long' });
});
```

**What to check:** status **201** · the returned data equals what you sent · a new numeric id · a GET finds it · invalid data gets 400 + the right message.

> 📄 `tests/api/03RequestData.spec.ts`

---

## 9. PUT: update a member

| | |
|---|---|
| **What it does** | updates an existing member |
| **Endpoint** | `PUT /api/members/{id}` |
| **Input** | **id in the URL** + login header + **JSON body with the new values** |
| **Success** | `200 OK`, body = `{ msg, member }` |
| **Failure** | `404` unknown id · `400` invalid data |

> **This API's PUT accepts partial updates:** send only `name`, only `gender`, or both.
> Fields you don't send are kept. (Textbook PUT replaces the whole record; see [API-Basics.md §6](API-Basics.md#6-http-methods-get-post-put-patch-delete).)

**Manually:**

```bash
curl -u admin:admin -X PUT -H "Content-Type: application/json" \
     -d '{"name":"Alice Cooper"}' \
     http://localhost:5002/api/members/21
```

**Playwright:** an update needs something to update, so **create first**, then update:

```ts
test('PUT updates a member', async ({ request }) => {
    // Arrange: create a member to update
    const create = await request.post(`${BASE_URL}/api/members`, {
        headers, data: { name: 'Alice Walker', gender: 'female' },
    });
    const id = (await create.json()).id;

    // Act: update only the name
    const response = await request.put(`${BASE_URL}/api/members/${id}`, {
        headers,
        data: { name: 'Alice Cooper' },
    });

    // Assert: the response
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.msg).toBe(`Member with id ${id} is updated successfully`);
    expect(body.member).toEqual({ id, name: 'Alice Cooper', gender: 'female' });   // gender unchanged

    // Assert: it was really saved
    const check = await request.get(`${BASE_URL}/api/members/${id}`, { headers });
    expect((await check.json())[0].name).toBe('Alice Cooper');

    // cleanup
    await request.delete(`${BASE_URL}/api/members/${id}`, { headers });
});
```

**Expected response:**

```json
{
  "msg": "Member with id 21 is updated successfully",
  "member": { "id": 21, "name": "Alice Cooper", "gender": "female" }
}
```

**What to check:** status 200 · the message · the changed field is new · **the fields you didn't send are unchanged** · a GET shows the change · unknown id → 404.

> 📄 `tests/api/05CrudFlow.spec.ts`, `tests/api/06CrudWithFixtures.spec.ts`

---

## 10. PATCH: partial update (not supported here)

| | |
|---|---|
| **What it does (in general)** | changes **only** the fields you send |
| **Endpoint (in general)** | `PATCH /api/members/{id}` |
| **Input** | id in the URL + login header + body with **only the changed fields** |
| **In this API** | ❌ **not available**: returns `404` with an HTML page `Cannot PATCH /api/members/{id}` |

On an API that supports PATCH, the Playwright code looks exactly like PUT:

```ts
const response = await request.patch(`${BASE_URL}/api/members/${id}`, {
    headers,
    data: { gender: 'male' },          // only the field to change
});
```

With the Employee API you can still test that PATCH is **correctly refused**:

```ts
test('PATCH is not supported', async ({ request }) => {
    const response = await request.patch(`${BASE_URL}/api/members/1`, {
        headers,
        data: { gender: 'male' },
    });

    expect(response.status()).toBe(404);
    expect(response.headers()['content-type']).toContain('text/html');   // an HTML error page, not JSON
    expect(await response.text()).toContain('Cannot PATCH /api/members/1');
});
```

Notice the body is **HTML, not JSON**, so we read it with `response.text()`. Calling `response.json()` here would throw an error.

> To update only some fields in this API, use **PUT** with just those fields (section 9).

> 📄 `tests/api/05CrudFlow.spec.ts`

---

## 11. DELETE: remove a member

| | |
|---|---|
| **What it does** | deletes a member |
| **Endpoint** | `DELETE /api/members/{id}` |
| **Input** | **id in the URL** + login header. **No body** |
| **Success** | `200 OK`, body = `{ msg, members }` (the remaining list) |
| **Failure** | `404` if the id doesn't exist (or was already deleted) |

**Manually:**

```bash
curl -u admin:admin -X DELETE http://localhost:5002/api/members/21
```

**Playwright:**

```ts
test('DELETE removes a member', async ({ request }) => {
    // Arrange: create a member to delete
    const create = await request.post(`${BASE_URL}/api/members`, {
        headers, data: { name: 'Delete Me', gender: 'male' },
    });
    const id = (await create.json()).id;

    // Act
    const response = await request.delete(`${BASE_URL}/api/members/${id}`, { headers });

    // Assert: the response
    expect(response.status()).toBe(200);
    expect((await response.json()).msg).toBe(`Member with id ${id} is deleted successfully`);

    // Assert: it's really gone
    const check = await request.get(`${BASE_URL}/api/members/${id}`, { headers });
    expect(check.status()).toBe(404);
});
```

**Negative test:**

```ts
test('DELETE a member that does not exist', async ({ request }) => {
    const response = await request.delete(`${BASE_URL}/api/members/999999`, { headers });

    expect(response.status()).toBe(404);
    expect((await response.json()).msg).toBe("Member with id 999999 doesn't exist");
});
```

**What to check:** status 200 · the message · a GET afterwards returns 404 · an unknown id → 404.

> ⚠️ **Never delete data you didn't create** (such as id 1). Other tests and other people rely on it.
> Always create the record in the test, then delete it.

> 📄 `tests/api/05CrudFlow.spec.ts`

---

### All methods at a glance

| Method | Playwright call | Id in URL | Body (`data`) | Success | Then verify with |
|--------|-----------------|-----------|---------------|---------|------------------|
| GET all | `request.get(url)` | ❌ | ❌ | 200 | — |
| GET one | `request.get(url + '/' + id)` | ✅ | ❌ | 200 | — |
| GET filter | `request.get(url, { params })` | ❌ | ❌ | 200 | every item matches |
| POST | `request.post(url, { data })` | ❌ | ✅ all fields | **201** | GET the new id |
| PUT | `request.put(url + '/' + id, { data })` | ✅ | ✅ new values | 200 | GET shows the change |
| PATCH | `request.patch(url + '/' + id, { data })` | ✅ | ✅ changed fields | *404 here* | — |
| DELETE | `request.delete(url + '/' + id)` | ✅ | ❌ | 200 | GET returns 404 |

(`url` = `` `${BASE_URL}/api/members` ``, and every call also passes `headers` for the login.)

---

# Checking responses

## 12. The response checklist

For every response, work down this list. Not every test needs every check, but think about each one.

| # | Check | Code |
|---|-------|------|
| 1 | **Status code** | `expect(response.status()).toBe(201)` |
| 2 | **Headers** | `expect(response.headers()['content-type']).toContain('application/json')` |
| 3 | **Body structure**: array or object? which fields? | `expect(Array.isArray(body)).toBeTruthy()` · `expect(body).toHaveProperty('id')` |
| 4 | **Data types** | `expect(body.id).toEqual(expect.any(Number))` |
| 5 | **Values** | `expect(body.name).toBe('Alice Walker')` |
| 6 | **Error messages** (negative tests) | `expect(body.msg).toBe('Name should be 4 to 25 characters long')` |
| 7 | **Really saved?** (after POST / PUT / DELETE) | do a GET and check it |
| 8 | **Response time** | see below |

### Status

```ts
expect(response.status()).toBe(200);        // exact code. Best: clear and strict
expect(response.ok()).toBeTruthy();         // any 2xx
await expect(response).toBeOK();            // any 2xx, and prints the response if it fails
```

> **Check the exact code.** `ok()` passes for both 200 and 201, but POST *should* be 201.

### Headers

```ts
const headers = response.headers();         // header names are always lower-case here
expect(headers['content-type']).toContain('application/json');
```

### Response time

```ts
const start = Date.now();
const response = await request.get(`${BASE_URL}/api/members`, { headers });
expect(Date.now() - start).toBeLessThan(2000);       // under 2 seconds
```

### A 4xx doesn't fail the test by itself

Playwright does **not** throw on `400`, `401` or `404`. It hands you the response and **you** decide.
That is what makes negative tests possible:

```ts
const response = await request.get(`${BASE_URL}/api/members`);   // no login on purpose
expect(response.status()).toBe(401);                             // ✅ the test passes, 401 is expected
```

---

## 13. Reading the response body

First **look at the real response** (Swagger, curl, or `console.log`), then write your checks.

```ts
const body = await response.json();
console.log(body);                     // see what you got
```

### The three shapes in this API

**1. An array of objects:** `GET /api/members`, and `GET /api/members/{id}`

```json
[ { "id": 1, "name": "John Smith", "gender": "Male" } ]
```

```ts
body[0]           // the first member  → { id: 1, name: 'John Smith', gender: 'Male' }
body[0].name      // → 'John Smith'
body.length       // → how many members
```

**2. A plain object:** `POST /api/members`

```json
{ "id": 21, "name": "Alice Walker", "gender": "female" }
```

```ts
body.id           // → 21
body.name         // → 'Alice Walker'
```

**3. An object inside an object:** `PUT /api/members/{id}`

```json
{ "msg": "Member with id 21 is updated successfully",
  "member": { "id": 21, "name": "Alice Cooper", "gender": "female" } }
```

```ts
body.msg            // → 'Member with id 21 is updated successfully'
body.member.name    // → 'Alice Cooper'
```

### Searching inside an array

```ts
const members = await response.json();

// find one item
const alice = members.find(m => m.name === 'Alice Walker');
expect(alice).toBeDefined();

// check every item
expect(members.every(m => m.gender.toLowerCase() === 'male')).toBeTruthy();

// list of ids
const ids = members.map(m => m.id);
expect(ids).toContain(21);
```

### JSON or text?

| Use | When |
|-----|------|
| `await response.json()` | the body is JSON (`content-type: application/json`) |
| `await response.text()` | the body is HTML or plain text, like the PATCH error page |

---

## 14. Which `expect` to use

| Matcher | Use for | Example |
|---------|---------|---------|
| `toBe(x)` | one exact value (number, string, boolean) | `expect(body.id).toBe(1)` |
| `toEqual(obj)` | a **whole** object or array, every field | `expect(body).toEqual({ msg: 'Not found' })` |
| `toMatchObject(obj)` | **some** fields of an object | `expect(body).toMatchObject({ name: 'Alice Walker' })` |
| `toContain(x)` | part of a string, or an item in an array | `expect(body.msg).toContain('deleted')` |
| `toHaveLength(n)` | the size of an array or string | `expect(body).toHaveLength(1)` |
| `toHaveProperty('k')` | a field exists | `expect(body).toHaveProperty('id')` |
| `toBeGreaterThan(n)` | numbers | `expect(body.length).toBeGreaterThan(0)` |
| `toBeTruthy()` / `toBeFalsy()` | true-ish / false-ish | `expect(response.ok()).toBeTruthy()` |
| `toBeUndefined()` | something is missing | `expect(found).toBeUndefined()` |
| `expect.any(Number)` | "any number" inside `toEqual` | `{ id: expect.any(Number) }` |
| `expect.stringMatching(/re/)` | text that matches a pattern | `{ gender: expect.stringMatching(/^(male\|female)$/i) }` |

**`toEqual` vs `toMatchObject`:**

```ts
const body = { id: 21, name: 'Alice Walker', gender: 'female' };

expect(body).toEqual({ name: 'Alice Walker' });            // ❌ fails: id and gender are missing
expect(body).toMatchObject({ name: 'Alice Walker' });      // ✅ passes: only checks name
expect(body).toEqual({ id: expect.any(Number), name: 'Alice Walker', gender: 'female' });  // ✅ all fields
```

**Show the response when a check fails.** Add a message as the second argument to `expect`:

```ts
expect(response.status(), await response.text()).toBe(201);
// if it fails you see why, e.g.  {"msg":"Name should only contain Alphabets"}
```

---

# Going further

## 15. Other body formats: form and file upload

### Form data (`form`)

Same as `data`, but sent as `application/x-www-form-urlencoded`, the way an HTML form sends it:

```ts
const response = await request.post(`${BASE_URL}/api/members`, {
    headers,
    form: { name: 'Robert Brown', gender: 'male' },     // sent as: name=Robert+Brown&gender=male
});
expect(response.status()).toBe(201);
```

### File upload (`multipart`)

| | |
|---|---|
| **Endpoint** | `POST /api/upload` |
| **Input** | login header + a multipart field named **`file`** |
| **Rules** | png / jpg / jpeg / gif only, under 5 MB |
| **Success** | `201`, `{ "success": true, "message": "File uploaded successfully!", ... }` |
| **Failure** | `400`, `{ "success": false, "message": "Unsupported extension!" }` |

```ts
import fs from 'fs';

test('Upload an image', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/upload`, {
        headers,
        multipart: {
            file: {                                      // "file" = the field name the API expects
                name: 'logo.png',                        // file name sent to the server
                mimeType: 'image/png',                   // file type
                buffer: fs.readFileSync('files/logo.png'),   // file content
            },
        },
    });

    expect(response.status()).toBe(201);
    expect((await response.json()).success).toBe(true);
});
```

> 📄 `tests/api/03RequestData.spec.ts`

---

## 16. Authentication in Playwright

Only **one** auth type is active in the API at a time (Basic by default). [API-Basics.md §13](API-Basics.md#13-authentication) explains each one.

### Basic Auth: three ways

```ts
// 1. Build the header yourself
const response = await request.get(`${BASE_URL}/api/members`, {
    headers: { Authorization: 'Basic ' + Buffer.from('admin:admin').toString('base64') },
});

// 2. Use the helper
const response = await request.get(`${BASE_URL}/api/members`, {
    headers: basicAuthHeader('admin', 'admin'),
});

// 3. Let Playwright add it to every request in a group
test.describe('Logged in', () => {
    test.use({ httpCredentials: { username: 'admin', password: 'admin' } });

    test('no header needed', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/api/members`);
        expect(response.status()).toBe(200);
    });
});
```

### API Key

```ts
const response = await request.get(`${BASE_URL}/api/members`, {
    headers: { 'x-api-key': 'demo-api-key-12345' },
});
```

### Bearer Token (JWT): two requests, chained

```ts
test('Log in, then use the token', async ({ request }) => {
    // Request 1: log in
    const login = await request.post(`${BASE_URL}/api/auth/login`, {
        data: { username: 'admin', password: 'admin' },
    });
    expect(login.status()).toBe(200);
    const token = (await login.json()).access_token;        // take the token from response 1

    // Request 2: use the token
    const response = await request.get(`${BASE_URL}/api/members`, {
        headers: { Authorization: `Bearer ${token}` },       // ...and send it in request 2
    });
    expect(response.status()).toBe(200);
});
```

### OAuth2 Client Credentials

```ts
const tokenResponse = await request.post(`${BASE_URL}/oauth/token`, {
    data: { grant_type: 'client_credentials', client_id: 'demo-client', client_secret: 'demo-secret' },
});
const token = (await tokenResponse.json()).access_token;

const response = await request.get(`${BASE_URL}/api/members`, {
    headers: { Authorization: `Bearer ${token}` },
});
```

### Negative auth tests: always include these

```ts
test('No login → 401', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/members`);
    expect(response.status()).toBe(401);
});

test('Wrong password → 401', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/members`, { headers: basicAuthHeader('admin', 'wrong') });
    expect(response.status()).toBe(401);
});
```

### Switching the API's auth type

1. In the API's `app.js`, comment out `app.use(basicAuth)` and uncomment another line, for example `app.use(bearerAuth)`
2. Restart the API with `npm start`
3. Run lesson 4 with the matching mode:

```bash
AUTH_MODE=jwt    npx playwright test tests/api/04Authentication.spec.ts
AUTH_MODE=apikey npx playwright test tests/api/04Authentication.spec.ts
AUTH_MODE=oauth2 npx playwright test tests/api/04Authentication.spec.ts
```

> 📄 `tests/api/04Authentication.spec.ts`

---

## 17. From requirement to test cases

Good API tests come from the **rules (requirements)**, not from guessing. Example:

> **Requirement:** *A member's name must be 4 to 25 characters, letters and spaces only. Gender must be male or female.*

**Step 1: write the test cases as a table** (positive, negative, boundary):

| Case | name | gender | Expected status | Expected message |
|------|------|--------|-----------------|------------------|
| shortest valid (boundary) | `Anna` (4) | male | 201 | — |
| longest valid (boundary) | 25 letters | male | 201 | — |
| too short (boundary) | `Bob` (3) | male | 400 | Name should be 4 to 25 characters long |
| too long (boundary) | 26 letters | male | 400 | Name should be 4 to 25 characters long |
| digit in name | `John Smith2` | male | 400 | Name should only contain Alphabets |
| invalid gender | `John Carter` | other | 400 | Gender should be either male or female only |
| missing name | — | male | 400 | Please provide a name and gender |
| extra field | + `age: 30` | male | 400 | Please provide only name and gender |

**Step 2: put the table in a data file** (`testdata/members.json`):

```json
{
  "invalidMembers": [
    { "case": "name too short", "body": { "name": "Bob", "gender": "male" }, "msg": "Name should be 4 to 25 characters long" },
    { "case": "invalid gender", "body": { "name": "John Carter", "gender": "other" }, "msg": "Gender should be either male or female only" }
  ]
}
```

**Step 3: one loop creates one test per row:**

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

**Boundary tests** check the values right at the edges:

```ts
for (const name of ['Anna', 'A'.repeat(25)]) {            // 4 and 25 characters: both allowed
    test(`Accept a name of ${name.length} characters`, async ({ request }) => {
        const response = await request.post(`${BASE_URL}/api/members`, { headers, data: { name, gender: 'male' } });
        expect(response.status()).toBe(201);
        await request.delete(`${BASE_URL}/api/members/${(await response.json()).id}`, { headers });   // cleanup
    });
}
```

To add a case, add a row to the JSON file. No code changes needed.

> 📄 `tests/api/03RequestData.spec.ts`

---

## 18. A full CRUD test

Test the whole life of a record: **C**reate → **R**ead → **U**pdate → **R**ead → **D**elete → **R**ead.

### Option A: one test (simplest)

```ts
test('CRUD for a member', async ({ request }) => {
    // CREATE
    const create = await request.post(`${BASE_URL}/api/members`, {
        headers, data: { name: 'Crud Tester', gender: 'male' },
    });
    expect(create.status()).toBe(201);
    const id = (await create.json()).id;                 // remember the id for the next steps

    // READ
    const read = await request.get(`${BASE_URL}/api/members/${id}`, { headers });
    expect((await read.json())[0].name).toBe('Crud Tester');

    // UPDATE
    const update = await request.put(`${BASE_URL}/api/members/${id}`, {
        headers, data: { name: 'Crud Updated' },
    });
    expect(update.status()).toBe(200);

    // READ again: was the update saved?
    const readAgain = await request.get(`${BASE_URL}/api/members/${id}`, { headers });
    expect((await readAgain.json())[0].name).toBe('Crud Updated');

    // DELETE
    const del = await request.delete(`${BASE_URL}/api/members/${id}`, { headers });
    expect(del.status()).toBe(200);

    // READ again: is it gone?
    const readDeleted = await request.get(`${BASE_URL}/api/members/${id}`, { headers });
    expect(readDeleted.status()).toBe(404);
});
```

### Option B: one test per step, run in order

```ts
test.describe('Member CRUD', () => {
    test.describe.configure({ mode: 'serial' });     // run in order; stop if a step fails

    let id: number;                                  // shared between the steps

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
        const response = await request.put(`${BASE_URL}/api/members/${id}`, { headers, data: { gender: 'female' } });
        expect((await response.json()).member.gender).toBe('female');
    });

    test('Delete', async ({ request }) => {
        const response = await request.delete(`${BASE_URL}/api/members/${id}`, { headers });
        expect(response.status()).toBe(200);
    });
});
```

| | Option A | Option B |
|---|---|---|
| Simple to write | ✅ | ✅ |
| Report shows which step failed | line number only | ✅ step name |
| Each test independent | ✅ | ❌ (steps depend on each other) |

> 📄 `tests/api/05CrudFlow.spec.ts`

---

## 19. Test data and cleanup

### Rule 1: every test creates its own data

Don't rely on another test running first, or on id `7` happening to exist. Create → test → delete.

### Rule 2: use unique names

When tests run many times, unique names stop them clashing. **Careful:** this API doesn't allow digits in names,
so `'User' + Date.now()` gets a **400**. `uniqueName()` in `fixtures/api.ts` produces letters only:

```ts
import { uniqueName } from '../../fixtures/api';

const name = uniqueName();      // e.g. "Pwbghjcadeffbcjhd"
```

### Rule 3: clean up, even when the test fails

`afterEach` runs after every test, **pass or fail**:

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
    createdIds.push((await response.json()).id);      // remember it for cleanup
    expect(response.status()).toBe(201);
});
```

> 📄 `tests/api/03RequestData.spec.ts`

---

## 20. Reusing code: helpers and fixtures

**Level 1: helpers (enough for most beginners).** `fixtures/api.ts` exports `BASE_URL`, `basicAuthHeader()`,
`bearerAuthHeader()`, `uniqueName()` and `creds`. Import what you need.

**Level 2: custom fixtures (when you're ready).** A fixture is something Playwright **prepares before** a test
and **cleans up after** it. You already use one: `request`. `fixtures/api.ts` adds two more:

| Fixture | What it gives you |
|---------|-------------------|
| `api` | like `request`, but the base URL and the login are already set, so you can write `api.get('/api/members')` |
| `createMember` | creates a member for the test and **deletes it automatically** afterwards |

```ts
import { test, expect } from '../../fixtures/api';      // import test from OUR file

test('Update a member', async ({ api, createMember }) => {
    const member = await createMember({ gender: 'male' });         // prepared for us

    const response = await api.put(`/api/members/${member.id}`, {  // short path, no headers
        data: { gender: 'female' },
    });
    expect((await response.json()).member.gender).toBe('female');
    // no cleanup code: createMember deletes the member after the test
});
```

> 📄 `tests/api/06CrudWithFixtures.spec.ts`

---

## 21. Running and debugging

```bash
npx playwright test tests/api                         # all API tests
npx playwright test tests/api/02Parameters.spec.ts    # one file
npx playwright test tests/api -g "POST"               # only tests with "POST" in the title
npx playwright test tests/api --workers=1             # one at a time: easier to read logs
npx playwright show-report                            # open the HTML report
```

**Debugging tips:**

```ts
console.log(response.status(), await response.text());       // see exactly what came back

expect(response.status(), await response.text()).toBe(201);  // show the body when the check fails

await test.step('Create member', async () => { /* ... */ }); // named steps in the report
```

---

## 22. Common mistakes

| Symptom | Cause | Fix |
|---------|-------|-----|
| `connect ECONNREFUSED 127.0.0.1:5002` | the API isn't running | `npm start` in the EmployeeRestSample folder |
| every test gets **401** | missing or wrong login, or another auth type is on in `app.js` | check the header; check which `app.use(...)` line is active |
| POST gets **400** `Name should only contain Alphabets` | the name has digits or `_` (`'User' + Date.now()`) | use `uniqueName()` |
| received value is a `Promise` | forgot `await` before `response.json()` | `const body = await response.json()` |
| `body.name` is `undefined` after GET by id | the API returns an **array** | `body[0].name` |
| `SyntaxError: Unexpected token <` from `response.json()` | the body is HTML, not JSON (e.g. PATCH error) | use `response.text()` |
| PATCH returns **404** | this API has no PATCH endpoint | use PUT with only the fields to change |
| test passes alone, fails with others | tests share data or depend on order | each test creates its own data; use serial mode for dependent steps |
| upload gets **400** | wrong file type, or the field isn't named `file` | png/jpg/jpeg/gif, field `file` |

---

## 23. Practice exercises (with answers)

Try each one yourself before you open the answer.

**1. GET one member:** `GET /api/members/2` returns 200 and the name `Mike Bax`.

<details><summary>Answer</summary>

```ts
test('Member 2 is Mike Bax', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/members/2`, { headers });
    expect(response.status()).toBe(200);
    expect((await response.json())[0].name).toBe('Mike Bax');
});
```
</details>

**2. Query filter:** `GET /api/members?gender=male` returns only male members.

<details><summary>Answer</summary>

```ts
test('Only males', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/members`, { headers, params: { gender: 'male' } });
    const members = await response.json();
    for (const m of members) {
        expect(m.gender.toLowerCase()).toBe('male');
    }
});
```
</details>

**3. Create:** POST a member with your own name. Check 201, the name, and that the id is a number. Clean up.

<details><summary>Answer</summary>

```ts
test('Create my member', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/members`, {
        headers, data: { name: 'Priya Sharma', gender: 'female' },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.name).toBe('Priya Sharma');
    expect(body.id).toEqual(expect.any(Number));
    await request.delete(`${BASE_URL}/api/members/${body.id}`, { headers });
});
```
</details>

**4. Validation:** POST with the name `Ab`. Check 400 and the exact message.

<details><summary>Answer</summary>

```ts
test('Name Ab is rejected', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/members`, { headers, data: { name: 'Ab', gender: 'male' } });
    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({ msg: 'Name should be 4 to 25 characters long' });
});
```
</details>

**5. PUT one field:** create a member, PUT only `{ gender: 'female' }`, check the name did **not** change.

<details><summary>Answer</summary>

```ts
test('PUT gender only keeps the name', async ({ request }) => {
    const create = await request.post(`${BASE_URL}/api/members`, { headers, data: { name: 'Keep Name', gender: 'male' } });
    const id = (await create.json()).id;

    const response = await request.put(`${BASE_URL}/api/members/${id}`, { headers, data: { gender: 'female' } });
    const member = (await response.json()).member;
    expect(member.gender).toBe('female');
    expect(member.name).toBe('Keep Name');

    await request.delete(`${BASE_URL}/api/members/${id}`, { headers });
});
```
</details>

**6. Delete twice:** delete a member, then delete it again. What should the second call return?

<details><summary>Answer</summary>

`404`, because it's already gone.

```ts
test('Delete twice', async ({ request }) => {
    const create = await request.post(`${BASE_URL}/api/members`, { headers, data: { name: 'Twice Gone', gender: 'male' } });
    const id = (await create.json()).id;

    expect((await request.delete(`${BASE_URL}/api/members/${id}`, { headers })).status()).toBe(200);
    expect((await request.delete(`${BASE_URL}/api/members/${id}`, { headers })).status()).toBe(404);
});
```
</details>

**7. Wrong password:** call `GET /api/members` with password `Admin` (capital A). What happens?

<details><summary>Answer</summary>

`401`. Passwords are case-sensitive.

```ts
test('Password is case-sensitive', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/members`, { headers: basicAuthHeader('admin', 'Admin') });
    expect(response.status()).toBe(401);
});
```
</details>

**8. Token:** log in at `/api/auth/login` and check you get a non-empty `access_token` with `token_type` `Bearer`.

<details><summary>Answer</summary>

```ts
test('Login gives a token', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/login`, { data: { username: 'admin', password: 'admin' } });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.token_type).toBe('Bearer');
    expect(body.access_token.length).toBeGreaterThan(0);
});
```
</details>

**9. Upload:** upload `test.gif` (any content) → expect 201. Upload `test.pdf` → expect 400.

<details><summary>Answer</summary>

```ts
test('gif allowed, pdf refused', async ({ request }) => {
    const gif = await request.post(`${BASE_URL}/api/upload`, {
        headers, multipart: { file: { name: 'test.gif', mimeType: 'image/gif', buffer: Buffer.from('x') } },
    });
    expect(gif.status()).toBe(201);

    const pdf = await request.post(`${BASE_URL}/api/upload`, {
        headers, multipart: { file: { name: 'test.pdf', mimeType: 'application/pdf', buffer: Buffer.from('x') } },
    });
    expect(pdf.status()).toBe(400);
});
```
</details>

**10. PATCH:** send `PATCH /api/members/1`. What status do you get, and why do you read the body with `text()`?

<details><summary>Answer</summary>

`404`, because the API has no PATCH endpoint. The body is an HTML page, not JSON, so `json()` would fail.

```ts
test('PATCH not supported', async ({ request }) => {
    const response = await request.patch(`${BASE_URL}/api/members/1`, { headers, data: { gender: 'male' } });
    expect(response.status()).toBe(404);
    expect(await response.text()).toContain('Cannot PATCH');
});
```
</details>

---

## 24. Cheat sheet

```ts
import { test, expect } from '@playwright/test';
import { BASE_URL, basicAuthHeader } from '../../fixtures/api';
const headers = basicAuthHeader('admin', 'admin');

// ───── Requests ─────
await request.get(`${BASE_URL}/api/members`, { headers });                                   // GET all
await request.get(`${BASE_URL}/api/members/1`, { headers });                                 // GET one (path param)
await request.get(`${BASE_URL}/api/members`, { headers, params: { gender: 'male' } });       // GET filter (query param)
await request.post(`${BASE_URL}/api/members`, { headers, data: { name: 'Alice Walker', gender: 'female' } });  // POST
await request.put(`${BASE_URL}/api/members/5`, { headers, data: { name: 'New Name' } });     // PUT
await request.patch(`${BASE_URL}/api/members/5`, { headers, data: { gender: 'male' } });     // PATCH (404 here)
await request.delete(`${BASE_URL}/api/members/5`, { headers });                              // DELETE
await request.post(`${BASE_URL}/api/members`, { headers, form: { name: 'Form User', gender: 'male' } });       // form body
await request.post(`${BASE_URL}/api/upload`, { headers,
    multipart: { file: { name: 'a.png', mimeType: 'image/png', buffer: fs.readFileSync('files/logo.png') } } }); // upload

// ───── Response ─────
response.status()             // 200
response.ok()                 // true for 2xx
response.headers()            // { 'content-type': '...' }
await response.json()         // body as object / array
await response.text()         // body as string

// ───── Checks ─────
expect(response.status()).toBe(201);
expect(response.headers()['content-type']).toContain('application/json');
expect(body).toEqual({ id: expect.any(Number), name: 'Alice Walker', gender: 'female' });
expect(body).toMatchObject({ name: 'Alice Walker' });
expect(body).toHaveLength(1);
expect(body.msg).toContain('deleted');

// ───── Login headers ─────
{ Authorization: 'Basic ' + Buffer.from('admin:admin').toString('base64') }   // Basic
{ 'x-api-key': 'demo-api-key-12345' }                                         // API key
{ Authorization: `Bearer ${token}` }                                          // JWT / OAuth2

// ───── Test structure ─────
test.describe('Group', () => { /* tests */ });
test.describe.configure({ mode: 'serial' });          // run in order
test.afterEach(async ({ request }) => { /* cleanup */ });
await test.step('Step name', async () => { /* ... */ });
for (const row of rows) { test(`Case ${row.case}`, async ({ request }) => { /* ... */ }); }
```

---

**Next steps:** run `npx playwright test tests/api`, open the report with `npx playwright show-report`,
then read the lesson files in order from `01` to `06`. Each one builds on the one before.
