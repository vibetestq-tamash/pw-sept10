# REST API testing with Playwright

These lessons test the **EmployeeRestSample** API
([QtpSudhakarTrainings/EmployeeRestSample](https://github.com/QtpSudhakarTrainings/EmployeeRestSample))
with Playwright's `request` fixture. No browser is used.

## Setup

1. In the EmployeeRestSample project: `npm install`, then `npm start` (it runs on http://localhost:5002)
2. In this project: `npm install`
3. Run all the lessons:

```bash
npx playwright test --project=api
```

Run a single lesson with `npx playwright test --project=api tests/api/02Parameters.spec.ts`.
To test a deployed copy of the API, set `API_BASE_URL=https://your-host npx playwright test --project=api`.

## Lessons

| File | What it teaches |
|------|-----------------|
| `01RequestBasics.spec.ts` | `request.get`, `baseURL`, `status()`, `ok()`, `toBeOK()`, headers, `json()` vs `text()`, checking response shape, response time, `failOnStatusCode` |
| `02Parameters.spec.ts` | Path params (`/members/1`), query params (`params` option, `URLSearchParams`), header params, 404 cases |
| `03RequestData.spec.ts` | Body formats: `data` (JSON object / raw string), `form` (urlencoded), `multipart` (file upload); data-driven tests from `testdata/members.json`; cleanup in `afterEach` |
| `04Authentication.spec.ts` | Basic Auth (manual header, helper, `httpCredentials`, `test.use`), API key, Bearer JWT (login, then send the token; decode claims), OAuth2 client credentials; negative auth tests |
| `05CrudFlow.spec.ts` | End-to-end Create → Read → Update → Delete in `serial` mode with a shared id, plus the same flow in one test using `try/finally` |
| `06CrudWithFixtures.spec.ts` | Custom fixtures (`api`, `createMember` in `fixtures/api.ts`) with automatic cleanup, `test.step`, partial PUT updates, negative PUT/DELETE tests, `request.fetch` with a method |

## Switching the auth strategy

The API protects `/api/members` with **one** strategy at a time (Basic Auth by default).
To try another one, change the `app.use(...)` line in the API's `app.js`, restart it, and pass
the matching `AUTH_MODE` so the right block in lesson 4 runs:

| `app.js` line | Command |
|---|---|
| `app.use(basicAuth)` | `npx playwright test --project=api tests/api/04Authentication.spec.ts` |
| `app.use(apiKeyAuth)` | `AUTH_MODE=apikey npx playwright test --project=api tests/api/04Authentication.spec.ts` |
| `app.use(bearerAuth)` | `AUTH_MODE=jwt npx playwright test --project=api tests/api/04Authentication.spec.ts` |
| `app.use(oauth2Auth)` | `AUTH_MODE=oauth2 npx playwright test --project=api tests/api/04Authentication.spec.ts` |

Lessons 1-3, 5 and 6 use Basic Auth, so run them with the default `basicAuth` setting.

## API rules the tests check

- `name`: required, 4–25 characters, letters and spaces only. `uniqueName()` in `fixtures/api.ts` makes valid unique names without digits.
- `gender`: `male` or `female` (any letter case)
- Only `name` and `gender` are allowed in the body
- Uploads: `png`, `jpg`, `jpeg` or `gif`, under 5 MB, in a field named `file`
- New ids are "highest id + 1", so a deleted id can be reused. Tests that delete data check by unique name, not only by id.
