# API Basics: Everything You Need Before Writing API Tests

This document has **no Playwright code**. It explains the ideas behind APIs in plain language, so the
test code in the next guide makes sense.

Every example uses the **Employee REST API** ([EmployeeRestSample](https://github.com/QtpSudhakarTrainings/EmployeeRestSample)),
which stores a list of employees ("members").

**Read this first, then go to [API-Testing-Guide.md](API-Testing-Guide.md)** to write tests in Playwright.

---

## Contents

1. [What is an API?](#1-what-is-an-api)
2. [Client and server](#2-client-and-server)
3. [Resource](#3-resource)
4. [Endpoint](#4-endpoint)
5. [Anatomy of a URL](#5-anatomy-of-a-url)
6. [HTTP methods: GET, POST, PUT, PATCH, DELETE](#6-http-methods-get-post-put-patch-delete)
7. [Parameters: path, query, header, body](#7-parameters-path-query-header-body)
8. [Headers](#8-headers)
9. [JSON in 5 minutes](#9-json-in-5-minutes)
10. [The request body](#10-the-request-body)
11. [The response](#11-the-response)
12. [Status codes](#12-status-codes)
13. [Authentication](#13-authentication)
14. [Putting it together: one request, every part labelled](#14-putting-it-together-one-request-every-part-labelled)
15. [Try it yourself, without code](#15-try-it-yourself-without-code)
16. [What do we test in an API?](#16-what-do-we-test-in-an-api)
17. [Glossary](#17-glossary)
18. [Quick quiz](#18-quick-quiz)

---

## 1. What is an API?

**API** stands for **Application Programming Interface**. It is a way for one program to talk to another.

Think of a restaurant:

| Restaurant | API world |
|------------|-----------|
| You (the customer) | the **client**: a browser, mobile app, Postman, or your test |
| The menu | the **API documentation**: the list of things you can ask for |
| The waiter | the **API**: takes your request to the kitchen and brings back the answer |
| The kitchen | the **server**: does the real work and stores the data |
| Your order | the **request** |
| The food | the **response** |

You never walk into the kitchen. You tell the waiter what you want, in a format the waiter understands,
and the waiter brings back the result. A client never touches the server's database directly either:
it sends a request to the API, and the API sends back a response.

### What is a REST API?

**REST** is the most common style of web API. A REST API:

- works over **HTTP**, the same protocol your browser uses
- organises everything as **resources** (employees, orders, products), each with its own URL
- uses **HTTP methods** (GET, POST, PUT, PATCH, DELETE) to say what to do with a resource
- usually sends and receives data as **JSON**

The Employee API is a REST API.

### Why test the API and not only the UI?

```
   ┌──────────┐       ┌──────────┐       ┌──────────┐
   │    UI    │ ───▶  │   API    │ ───▶  │ Database │
   │ (screen) │       │ (rules)  │       │  (data)  │
   └──────────┘       └──────────┘       └──────────┘
                           ▲
                    API tests go here
```

- The business rules live in the API (for example, "a name must be 4 to 25 letters").
- API tests are **fast** (milliseconds, not seconds) and **stable** (no buttons that move or pages that load slowly).
- You can test the API **before the UI exists**.
- Mobile apps, websites and other systems often share the same API, so one API bug can affect all of them.

---

## 2. Client and server

```
     CLIENT                                         SERVER
  (your test)                                   (Employee API)
 ┌───────────┐         1. REQUEST              ┌─────────────┐
 │           │ ──────────────────────────────▶ │             │
 │           │   "Give me employee number 1"   │  checks the │
 │           │                                 │  login,     │
 │           │         2. RESPONSE             │  finds the  │
 │           │ ◀────────────────────────────── │  data       │
 │           │   "200 OK, here is John Smith"  │             │
 └───────────┘                                 └─────────────┘
```

- The **client** always starts the conversation by sending a **request**.
- The **server** always replies with exactly one **response**.
- Each request is independent. The server doesn't remember your previous request, so you send
  your login (credentials) **with every request**.

---

## 3. Resource

A **resource** is the *thing* the API manages. In the Employee API the main resource is a **member** (an employee).

A resource comes in two forms:

| Form | Meaning | URL | Example response |
|------|---------|-----|------------------|
| **Collection** | all members | `/api/members` | `[ {...}, {...}, {...} ]`, a list |
| **Single item** | one member | `/api/members/1` | `[ { "id": 1, "name": "John Smith", "gender": "Male" } ]` |

Each member looks like this:

```json
{
  "id": 1,
  "name": "John Smith",
  "gender": "Male"
}
```

- `id` is the member's **unique identifier**. The server chooses it when the member is created. You never send it yourself.
- `name` and `gender` are the **fields** (also called attributes or properties) that you provide.

> **Naming tip:** REST APIs usually use **plural nouns** for resources (`/members`, `/orders`, `/products`),
> not verbs (`/getMembers`, `/createOrder`). The *action* comes from the HTTP method, not from the URL.

The Employee API has other resources too:

| Resource | URL | What it is |
|----------|-----|------------|
| members | `/api/members` | employees |
| upload | `/api/upload` | image file uploads |
| login | `/api/auth/login` | gives you a JWT token |
| token | `/oauth/token` | gives you an OAuth2 token |

---

## 4. Endpoint

An **endpoint** is **one HTTP method + one URL**. It is one specific thing the API can do.

The same URL can be several endpoints, one per method:

| Endpoint | What it does |
|----------|--------------|
| `GET    /api/members` | get all members |
| `GET    /api/members?gender=female` | get members, filtered by gender |
| `GET    /api/members/{id}` | get one member |
| `POST   /api/members` | create a member |
| `PUT    /api/members/{id}` | update a member |
| `DELETE /api/members/{id}` | delete a member |
| `POST   /api/upload` | upload an image |
| `POST   /api/auth/login` | log in, get a JWT token |
| `POST   /oauth/token` | get an OAuth2 token |

`{id}` is a **placeholder**: in a real request you replace it with a number, such as `/api/members/5`.

**This is the full list of endpoints you can test in the Employee API.** In a real project this list
comes from the API documentation (often a **Swagger / OpenAPI** page). For this API, start the server
and open http://localhost:5002/api-docs.

---

## 5. Anatomy of a URL

```
  http://localhost:5002/api/members/5?gender=male
  └─┬─┘  └───┬───┘ └─┬─┘└────┬────┘ └┬┘ └─────┬────┘
    │        │       │       │       │        │
 protocol   host    port  resource  path    query
                            path   parameter parameter
  └─────────────┬────────────┘
            BASE URL
```

| Part | In our example | Meaning |
|------|----------------|---------|
| Protocol | `http://` | how to talk. Real servers use `https://` (encrypted) |
| Host | `localhost` | which computer. `localhost` means *this* computer |
| Port | `5002` | which program on that computer |
| **Base URL** | `http://localhost:5002` | protocol + host + port. **The same for every endpoint** |
| Resource path | `/api/members` | which resource |
| Path parameter | `/5` | which single item (the id) |
| Query string | `?gender=male` | extra options: filter, sort, page… |

Several query parameters are joined with `&`:

```
/api/members?gender=male&page=2
            └────┬────┘ └──┬─┘
             param 1    param 2
```

> **Why keep the base URL separate?** The same tests often run against different servers
> (your laptop, a test server, staging). Only the base URL changes, and everything after it stays the same.

---

## 6. HTTP methods: GET, POST, PUT, PATCH, DELETE

The **method** (also called the **verb**) tells the server *what to do* with the resource.

| Method | Action | Real-life example | CRUD letter |
|--------|--------|-------------------|-------------|
| **GET** | read / fetch | look up an employee's details | **R**ead |
| **POST** | create new | add a new employee | **C**reate |
| **PUT** | update / replace | change an employee's record | **U**pdate |
| **PATCH** | update part of it | change only the gender | **U**pdate |
| **DELETE** | remove | remove an employee | **D**elete |

**CRUD** (Create, Read, Update, Delete) is the four basic operations on any data. Most APIs, and most API tests, are built around CRUD.

### What input does each method need?

This is the most important table in this document.

| Method | URL example | Id in URL? | Body? | Success status | Response body |
|--------|-------------|------------|-------|----------------|---------------|
| GET (all) | `/api/members` | ❌ | ❌ none | **200** OK | list of members |
| GET (filter) | `/api/members?gender=male` | ❌ (query param instead) | ❌ none | **200** OK | filtered list |
| GET (one) | `/api/members/5` | ✅ | ❌ none | **200** OK | that member |
| POST | `/api/members` | ❌ (server makes the id) | ✅ **all required fields** | **201** Created | the new member, with its id |
| PUT | `/api/members/5` | ✅ | ✅ the fields to update | **200** OK | message + updated member |
| PATCH | `/api/members/5` | ✅ | ✅ only the changed fields | **200** OK | updated member |
| DELETE | `/api/members/5` | ✅ | ❌ none | **200** OK (often 204) | message + remaining list |

And for **every** call to `/api/members`, you also send the **login** in a header (see [section 13](#13-authentication)).

### Each method, one at a time

#### GET: read data

```
GET /api/members/1
Authorization: Basic YWRtaW46YWRtaW4=
```

- **Input:** URL (with an id, or query parameters to filter), plus the login header
- **No body.** GET only asks, it never sends data to save
- **Changes nothing on the server.** You can call it 100 times and the data stays the same (it is "safe")
- **Response:** `200 OK` + the data. `404 Not Found` if the id doesn't exist

#### POST: create something new

```
POST /api/members
Authorization: Basic YWRtaW46YWRtaW4=
Content-Type: application/json

{ "name": "Alice Walker", "gender": "female" }
```

- **Input:** URL of the **collection** (no id: the server creates it), the login header, a `Content-Type` header, and a **body with all required fields**
- **Response:** `201 Created` + the new member, including the `id` the server gave it:
  ```json
  { "id": 21, "name": "Alice Walker", "gender": "female" }
  ```
- Calling it twice creates **two** members, so POST is **not** repeatable without side effects
- **Bad input** (for example a name that is too short) gives `400 Bad Request` + an error message

#### PUT: update a member

```
PUT /api/members/21
Authorization: Basic YWRtaW46YWRtaW4=
Content-Type: application/json

{ "name": "Alice Cooper", "gender": "female" }
```

- **Input:** URL **with the id** of the member to update, the login header, `Content-Type`, and a body
- **Response:** `200 OK` + a message and the updated member:
  ```json
  { "msg": "Member with id 21 is updated successfully",
    "member": { "id": 21, "name": "Alice Cooper", "gender": "female" } }
  ```
- `404 Not Found` if the id doesn't exist, `400` if the data breaks a rule

> ⚠️ **PUT in theory vs PUT in this API**
> In textbook REST, PUT **replaces the whole record**, so you must send *every* field.
> The Employee API is more relaxed: its PUT also accepts **only some fields** (for example just `{ "gender": "male" }`)
> and keeps the others unchanged. That is really PATCH behaviour.
> APIs differ, and this is exactly why you **read the documentation and test the real behaviour** instead of assuming.

#### PATCH: update only part of a record

```
PATCH /api/members/21
Content-Type: application/json

{ "gender": "male" }
```

- **Input:** URL with the id, plus a body with **only the fields you want to change**
- Fields you don't send stay the same
- **Response:** `200 OK` + the updated record (on APIs that support it)

> ⚠️ **The Employee API does not have a PATCH endpoint.** If you send a PATCH, the server answers
> `404 Not Found` with an HTML page saying `Cannot PATCH /api/members/21`. (Without a login you get `401` first,
> because the login check happens before anything else.)
> To update only some fields in this API, use **PUT** with only those fields.
> Testing that an unsupported method is properly refused is a valid test too.

**PUT vs PATCH in one picture.** Start with `{ id: 21, name: "Alice Walker", gender: "female" }` and send only `{ "gender": "male" }`:

| | Textbook PUT (replace) | PATCH (partial) |
|---|---|---|
| Result | `{ id: 21, gender: "male" }`, **name lost** (or the request is rejected) | `{ id: 21, name: "Alice Walker", gender: "male" }`, **name kept** |

#### DELETE: remove a record

```
DELETE /api/members/21
Authorization: Basic YWRtaW46YWRtaW4=
```

- **Input:** URL with the id, plus the login header. **No body**
- **Response:** `200 OK` + a message (many other APIs return `204 No Content` with an empty body)
  ```json
  { "msg": "Member with id 21 is deleted successfully", "members": [ ...remaining members... ] }
  ```
- Deleting the same id again gives `404 Not Found`, because it's already gone

---

## 7. Parameters: path, query, header, body

A **parameter** is a piece of input you send with a request. There are four places to put it:

| Type | Where it goes | Used for | Employee API example |
|------|---------------|----------|----------------------|
| **Path parameter** | inside the URL path | *which* item | `/api/members/`**`5`** |
| **Query parameter** | after `?` in the URL | filter / sort / search / page | `/api/members`**`?gender=female`** |
| **Header parameter** | in the request headers | info *about* the request: login, format | **`Authorization: Basic ...`** |
| **Body** | the content after the headers | the actual data to save | **`{ "name": "Alice Walker", "gender": "female" }`** |

### How to decide which one is used?

- "**Which** member?" → **path** (`/members/5`)
- "Members **that match** something?" → **query** (`?gender=female`)
- "**Who am I**, and what format do I want?" → **header**
- "**Here is the data** to create or update" → **body** (POST, PUT, PATCH only)

### Required vs optional

| Endpoint | Parameter | Required? |
|----------|-----------|-----------|
| `GET /api/members` | `gender` (query) | optional: leave it out to get everyone |
| `GET /api/members/{id}` | `id` (path) | required: it is part of the URL |
| `POST /api/members` | `name`, `gender` (body) | **both required** |
| `PUT /api/members/{id}` | `name`, `gender` (body) | at least one (in this API) |
| every `/api/members` call | `Authorization` (header) | required |

### Rules for the body fields (from the API's validation)

| Field | Rule | Error if broken (status 400) |
|-------|------|------------------------------|
| `name` + `gender` | both must be present (POST) | `Please provide a name and gender` |
| `name` | 4 to 25 characters | `Name should be 4 to 25 characters long` |
| `name` | letters and spaces only, so no digits, `_` or `@` | `Name should only contain Alphabets` |
| `gender` | `male` or `female` (any letter case) | `Gender should be either male or female only` |
| any other field | not allowed (`id`, `age`, …) | `Please provide only name and gender` |

These rules are the **requirements**, and your tests check that the API enforces them.

---

## 8. Headers

**Headers** are extra information sent with a request or a response, as `Name: value` pairs.
Think of them as the label on an envelope: they describe the contents, but they are not the contents.

### Request headers (you send them)

| Header | Meaning | Example |
|--------|---------|---------|
| `Authorization` | who you are (your login) | `Basic YWRtaW46YWRtaW4=` or `Bearer eyJhbGci...` |
| `Content-Type` | the format of the body **you are sending** | `application/json` |
| `Accept` | the format you **want back** | `application/json` |
| `x-api-key` | a custom header, used by this API's API-key login | `demo-api-key-12345` |

### Response headers (the server sends them)

| Header | Meaning | Example from this API |
|--------|---------|-----------------------|
| `Content-Type` | the format of the response body | `application/json; charset=utf-8` |
| `Content-Length` | size of the body in bytes | `46` |
| `WWW-Authenticate` | sent with a 401: *how* you should log in | `Basic realm="401"` |
| `X-Powered-By` | the technology behind the server | `Express` |
| `Date` | when the response was sent | `Thu, 05 Nov 2026 01:23:53 GMT` |

> **Header names are not case-sensitive.** `Content-Type`, `content-type` and `CONTENT-TYPE` all mean the same thing.

### Content-Type vs Accept

```
You → server:   Content-Type: application/json   "the body I'm sending you is JSON"
                Accept: application/json         "please answer me in JSON"

Server → you:   Content-Type: application/json   "the body I'm sending back is JSON"
```

Common `Content-Type` values:

| Value | When |
|-------|------|
| `application/json` | JSON data, the usual case |
| `application/x-www-form-urlencoded` | HTML form data: `name=Alice&gender=female` |
| `multipart/form-data` | file uploads |
| `text/html` | a web page (for example this API's "Cannot PATCH" error page) |

---

## 9. JSON in 5 minutes

**JSON** (JavaScript Object Notation) is the text format most APIs use for data.

### The building blocks

| Type | Looks like | Example |
|------|------------|---------|
| **Object**: named fields | `{ "key": value, ... }` | `{ "name": "John Smith", "gender": "Male" }` |
| **Array**: an ordered list | `[ value, value, ... ]` | `[ 1, 2, 3 ]` |
| **String**: text | in double quotes | `"John Smith"` |
| **Number** | no quotes | `1`, `3600` |
| **Boolean** | `true` / `false` | `"success": true` |
| **null** | nothing | `"manager": null` |

Rules: keys always use **double quotes**, there is **no comma after the last item**, and there are no comments.

### Reading real responses from this API

**`GET /api/members`** returns an **array of objects**:

```json
[
  { "id": 1, "name": "John Smith", "gender": "Male" },
  { "id": 2, "name": "Mike Bax", "gender": "Male" }
]
```

- `[ ... ]` means a list. The first item is at position **0**, the second at position **1**
- So the first member's name is `response[0].name` → `"John Smith"`

**`GET /api/members/1`** also returns an **array**, with one object inside:

```json
[ { "id": 1, "name": "John Smith", "gender": "Male" } ]
```

> ⚠️ A common surprise: you might expect a single object `{ ... }`, but this API wraps it in `[ ... ]`.
> So the name is `body[0].name`, **not** `body.name`. Always look at the real response before writing checks.

**`PUT /api/members/1`** returns an **object containing an object**:

```json
{
  "msg": "Member with id 1 is updated successfully",
  "member": { "id": 1, "name": "John Smith", "gender": "Male" }
}
```

- The message is `body.msg`
- The updated name is `body.member.name`

**An error** returns an object with a message:

```json
{ "msg": "Name should be 4 to 25 characters long" }
```

---

## 10. The request body

The **body** is the data you send to **create** (POST) or **update** (PUT/PATCH) something.
GET and DELETE normally have **no body**.

| Format | `Content-Type` | Looks like | Used in this API for |
|--------|----------------|------------|----------------------|
| JSON | `application/json` | `{"name":"Alice Walker","gender":"female"}` | members (the main way) |
| Form | `application/x-www-form-urlencoded` | `name=Alice+Walker&gender=female` | members (also accepted), OAuth tokens |
| Multipart | `multipart/form-data` | the file's bytes, in parts | `/api/upload` |

For a file upload this API expects:
- the form field name **`file`**
- an image with extension **png, jpg, jpeg or gif**
- a file smaller than **5 MB**

---

## 11. The response

Every response has three parts:

```
HTTP/1.1 201 Created                              ← 1. STATUS LINE (status code + text)
Content-Type: application/json; charset=utf-8     ← 2. HEADERS
Content-Length: 49

{"id":21,"name":"Alice Walker","gender":"female"} ← 3. BODY
```

| Part | Tells you | Example |
|------|-----------|---------|
| Status code | **did it work?** | `201` |
| Headers | info about the response | `Content-Type: application/json` |
| Body | the actual data, or an error message | `{"id":21, ...}` |

When you **test** an API, you check all three. See [section 16](#16-what-do-we-test-in-an-api).

---

## 12. Status codes

The **status code** is a 3-digit number that summarises the result. The first digit tells you the family:

| Family | Meaning | Think of it as |
|--------|---------|----------------|
| **2xx** | success | ✅ "Done." |
| **3xx** | redirect | ↪️ "Look somewhere else." |
| **4xx** | **client error**: *your request* is wrong | ❌ "You made a mistake." |
| **5xx** | **server error**: the *server* broke | 💥 "We made a mistake." |

### The codes you will meet in the Employee API

| Code | Name | When this API returns it |
|------|------|--------------------------|
| **200** | OK | GET, PUT or DELETE worked; token issued |
| **201** | Created | POST created a member; file uploaded |
| **400** | Bad Request | the data breaks a rule (name too short, wrong gender, extra field, bad file type) |
| **401** | Unauthorized | login missing or wrong |
| **404** | Not Found | that id doesn't exist; no member with that gender; unsupported method such as PATCH |
| **500** | Internal Server Error | the server crashed while saving (shouldn't happen) |

Other common codes in other APIs: **204** No Content (success, empty body; common for DELETE),
**403** Forbidden (logged in, but not allowed), **409** Conflict (for example a duplicate), **422** Unprocessable (validation failed).

### 401 vs 403

| | 401 Unauthorized | 403 Forbidden |
|---|---|---|
| Meaning | "**Who are you?**" You're not logged in, or the login is wrong | "**I know who you are, but no.**" You're logged in without permission |
| Example | wrong password | a normal user trying to delete as an admin |

> **A 4xx is not always a bug!** When you send bad data on purpose, a `400` is the **correct** answer,
> and the test passes. A bug is when the API returns something *different from what it should*:
> `201` for an invalid name, or `500` for a simple mistake.

---

## 13. Authentication

**Authentication** means proving **who you are**. The Employee API refuses `/api/members` and `/api/upload`
requests without a valid login and answers `401`.

Because the server doesn't remember you between requests (see [section 2](#2-client-and-server)),
**you send your credentials with every request**, usually in the `Authorization` header.

The API supports four types. **Only one is switched on at a time**, and Basic Auth is the default.

### 1. Basic Auth: username and password in every request

```
username:password   →   admin:admin   →   base64   →   YWRtaW46YWRtaW4=

Authorization: Basic YWRtaW46YWRtaW4=
```

- **Base64 is not encryption.** Anyone can decode it, which is why real servers use `https`
- Simple, and common for internal tools

### 2. API Key: a secret key in a header

```
x-api-key: demo-api-key-12345
```

- Like a membership card: whoever has the key gets in
- Common in public APIs (weather, maps, payments)

### 3. Bearer Token (JWT): log in once, then use a token

```
Step 1:  POST /api/auth/login   body: { "username": "admin", "password": "admin" }
         ← 200 { "token_type": "Bearer", "access_token": "eyJhbGciOi...", "expires_in": "1h" }

Step 2:  GET /api/members
         Authorization: Bearer eyJhbGciOi...
```

- Like a cinema ticket: buy it once at the counter, then show it at the door
- The token **expires** (here after 1 hour), and then you log in again
- Using data from one response (the token) in the next request is called **chaining**
- The most common type in modern web and mobile apps

### 4. OAuth2 Client Credentials: an application logs in, not a person

```
Step 1:  POST /oauth/token   body: { "grant_type": "client_credentials",
                                     "client_id": "demo-client", "client_secret": "demo-secret" }
         ← 200 { "token_type": "Bearer", "access_token": "4f9c...", "expires_in": 3600 }

Step 2:  GET /api/members
         Authorization: Bearer 4f9c...
```

- Same two-step idea as JWT, but a *program* identifies itself (machine-to-machine)

| Type | What you send | Steps |
|------|---------------|-------|
| Basic | `Authorization: Basic base64(user:pass)` | 1 |
| API Key | `x-api-key: <key>` | 1 |
| JWT | `Authorization: Bearer <token from /api/auth/login>` | 2 |
| OAuth2 | `Authorization: Bearer <token from /oauth/token>` | 2 |

> `/api/auth/login` and `/oauth/token` themselves need **no** login, because they are how you *get* one.

---

## 14. Putting it together: one request, every part labelled

**Create a member:**

```
POST http://localhost:5002/api/members              ← method + base URL + resource path
Authorization: Basic YWRtaW46YWRtaW4=               ← header: login
Content-Type: application/json                      ← header: body format
Accept: application/json                            ← header: format wanted back

{ "name": "Alice Walker", "gender": "female" }      ← body: the data
```

**Response:**

```
HTTP/1.1 201 Created                                ← status: it worked, something was created
Content-Type: application/json; charset=utf-8       ← header: body is JSON

{ "id": 21, "name": "Alice Walker", "gender": "female" }   ← body: new member with its id
```

**Get filtered members:**

```
GET http://localhost:5002/api/members?gender=female  ← method + URL + query parameter
Authorization: Basic YWRtaW46YWRtaW4=                ← header: login
                                                      ← no body for GET
```

---

## 15. Try it yourself, without code

Seeing real requests before automating them makes everything easier.

### Option A: Swagger page (in the browser)

1. Start the API: `npm start` in the EmployeeRestSample folder
2. Open http://localhost:5002/api-docs
3. Click **Authorize**, then enter `admin` / `admin`
4. Open an endpoint, click **Try it out**, then **Execute**
5. Look at the request URL, the response code and the response body

### Option B: curl (in a terminal)

| Want to… | Command |
|----------|---------|
| GET all | `curl -u admin:admin http://localhost:5002/api/members` |
| GET one | `curl -u admin:admin http://localhost:5002/api/members/1` |
| GET filtered | `curl -u admin:admin "http://localhost:5002/api/members?gender=female"` |
| POST | `curl -u admin:admin -X POST -H "Content-Type: application/json" -d '{"name":"Alice Walker","gender":"female"}' http://localhost:5002/api/members` |
| PUT | `curl -u admin:admin -X PUT -H "Content-Type: application/json" -d '{"gender":"male"}' http://localhost:5002/api/members/21` |
| DELETE | `curl -u admin:admin -X DELETE http://localhost:5002/api/members/21` |
| See status + headers | add `-i`, e.g. `curl -i -u admin:admin http://localhost:5002/api/members/1` |
| No login (expect 401) | `curl -i http://localhost:5002/api/members` |

`-u` = login, `-X` = method, `-H` = header, `-d` = body, `-i` = show status and headers.

### Option C: Postman

Import `DEMO API Collection.postman_collection.json` from the EmployeeRestSample project. It has the requests ready to send.

---

## 16. What do we test in an API?

For every endpoint, ask these questions:

| # | Check | Example question |
|---|-------|------------------|
| 1 | **Status code** | Did POST return `201`, not `200` or `500`? |
| 2 | **Headers** | Is `Content-Type` `application/json`? |
| 3 | **Body structure** | Does every member have `id`, `name` and `gender`? Is it an array? |
| 4 | **Body values** | Is the name the one I sent? Is the id a number? |
| 5 | **Error handling** | Is a 3-letter name rejected with `400` and the right message? |
| 6 | **Data really saved** | After PUT, does a GET show the new value? After DELETE, is it gone? |
| 7 | **Security** | Is a request without login refused with `401`? |
| 8 | **Performance** | Does it answer in a reasonable time (say, under 2 seconds)? |

### Kinds of tests

| Kind | Meaning | Example |
|------|---------|---------|
| **Positive** | valid input, should work | create a member with `Alice Walker` / `female` → `201` |
| **Negative** | invalid input, should be refused | gender `other` → `400` |
| **Boundary** | values right at the edge of a rule | names of 3, **4**, **25** and 26 characters |
| **Security** | no login, wrong login | wrong password → `401` |
| **End-to-end (CRUD)** | a full lifecycle | create → read → update → read → delete → read (404) |

### Example: turning one rule into test cases

**Rule:** *"name must be 4 to 25 characters, letters and spaces only."*

| Test case | Input name | Expected status | Expected message |
|-----------|------------|-----------------|------------------|
| Valid typical | `Alice Walker` | 201 | — |
| Boundary: shortest allowed | `Anna` (4) | 201 | — |
| Boundary: too short | `Ann` (3) | 400 | `Name should be 4 to 25 characters long` |
| Boundary: longest allowed | 25 letters | 201 | — |
| Boundary: too long | 26 letters | 400 | `Name should be 4 to 25 characters long` |
| Contains a digit | `John2` | 400 | `Name should only contain Alphabets` |
| Contains a symbol | `John_Smith` | 400 | `Name should only contain Alphabets` |
| Missing | *(not sent)* | 400 | `Please provide a name and gender` |

That is **8 tests from one sentence** of requirements. This is how testers think.

---

## 17. Glossary

| Term | Meaning |
|------|---------|
| **API** | a way for programs to talk to each other |
| **REST** | a common style of web API: resources + HTTP methods + JSON |
| **Client** | whoever sends the request (browser, app, Postman, your test) |
| **Server** | the program that receives requests and sends responses |
| **Request** | what the client sends: method, URL, headers, body |
| **Response** | what the server sends back: status, headers, body |
| **Resource** | a thing the API manages (member, order) |
| **Collection** | all items of a resource: `/api/members` |
| **Endpoint** | one method + one URL: `GET /api/members/{id}` |
| **Base URL** | protocol + host + port: `http://localhost:5002` |
| **Path parameter** | a value inside the URL path: `/members/5` |
| **Query parameter** | a value after `?`: `?gender=male` |
| **Header** | `Name: value` information about a request or response |
| **Body / payload** | the data sent with POST/PUT/PATCH, or returned in a response |
| **JSON** | the text format for data: `{ "key": "value" }` |
| **Status code** | a 3-digit result: 200, 201, 400, 401, 404, 500 |
| **CRUD** | Create, Read, Update, Delete |
| **Authentication** | proving who you are |
| **Token** | a temporary pass you get after logging in |
| **Chaining** | using a value from one response (id, token) in the next request |
| **Swagger / OpenAPI** | a standard format for API documentation, often an interactive page |
| **Idempotent** | calling it many times has the same effect as once (GET, PUT, DELETE: yes; POST: no) |

---

## 18. Quick quiz

Test yourself. Answers are below.

1. What is the difference between a resource and an endpoint?
2. In `http://localhost:5002/api/members/7?gender=male`, what are the base URL, the path parameter and the query parameter?
3. Which methods normally have **no body**?
4. You want to add a new employee. Which method, which URL, and which status code do you expect?
5. You send `{ "name": "Bob", "gender": "male" }` to create a member. What status and message do you expect, and is that a bug?
6. Which header tells the server the format of the body you send?
7. `GET /api/members/1` returns `[{"id":1,"name":"John Smith","gender":"Male"}]`. How do you reach the name?
8. What is the difference between `401` and `404`?
9. You send `PATCH /api/members/1` to this API with a valid login. What happens, and why?
10. Name three things you should check in every response.

<details>
<summary><b>Show answers</b></summary>

1. A **resource** is the thing (members). An **endpoint** is one method + URL acting on it, such as `DELETE /api/members/{id}`.
2. Base URL `http://localhost:5002`, path parameter `7`, query parameter `gender=male`.
3. **GET** and **DELETE**.
4. **POST** to `/api/members` (no id), expect **201 Created**.
5. **400** with `Name should be 4 to 25 characters long`. **Not a bug.** The API correctly refuses a 3-letter name.
6. **Content-Type** (for example `application/json`).
7. It's an array, so `[0]` comes first: `body[0].name`.
8. **401**: you're not logged in, or the login is wrong. **404**: you're logged in, but what you asked for doesn't exist.
9. **404** with an HTML page `Cannot PATCH /api/members/1`, because this API has no PATCH endpoint. Use PUT with only the fields you want to change.
10. Any three of: status code, headers (Content-Type), body structure, body values, error messages, whether the data was really saved, response time.

</details>

---

**Next:** [API-Testing-Guide.md](API-Testing-Guide.md) shows how to do all of this in **Playwright**.
