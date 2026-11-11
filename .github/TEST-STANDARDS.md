# Test Automation Standards Guide for AI Agents

This document defines the standards, patterns, and conventions used in this project for creating, planning, and healing Playwright tests. All AI agents (Planner, Generator, and Healer) **MUST** follow these standards when working with test automation.

## Project Architecture Overview

### Directory Structure
```
pw-sept10/
├── pom/                          # Page Object Models
│   ├── index.ts
│   ├── basepage.ts
│   ├── loginpage.ts
│   ├── addemployeepage.ts
│   ├── personaldetailspage.ts
│   ├── dashboardpage.ts
│   └── pimpage.ts
├── fixtures/
│   └── appbase.ts               # Playwright fixture with test data and page objects
├── testdata/
│   ├── emp.json                 # Employee test data
│   ├── creds.ts                 # Credentials and secrets
│   └── [other-data].json        # Other domain-specific test data
├── tests/
│   └── *.spec.ts                # Test files using POM and fixtures
├── .github/
│   └── agents/                  # Agent configuration files (this directory)
└── playwright.config.ts
```

---

## 1. Page Object Model (POM) Standards

### 1.1 Base Page Class (`pom/basepage.ts`)

All page classes extend `BasePage` which provides:
- Protected `page: Page` property inherited by all subclasses
- Core navigation and utility methods
- Access modifiers: `public` (external access), `protected` (subclass access), `private` (class-only access)

**Requirements:**
```typescript
import { Locator, Page, expect } from "@playwright/test"

export class BasePage {
    protected page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }

    public getPage() {
        return this.page;
    }

    public async navigateTo(url: string) {
        await this.page.goto(url);
    }

    public async getPageTitle() {
        return await this.page.title();
    }

    public async getCurrentUrl() {
        return this.page.url();
    }
}
```

### 1.2 Page-Specific Classes

**Naming Convention:**
- File: `pom/[pagename]page.ts` (lowercase, PascalCase for class name)
- Class: `export class [PageName]Page extends BasePage`
- Examples: `LoginPage`, `AddEmployeePage`, `PersonalDetailsPage`, `DashboardPage`, `PIMPage`

**Locator Naming Convention:**
- Private locators: `private txt[ElementType][ElementName]: Locator` for text inputs
- Private locators: `private btn[ElementName]: Locator` for buttons
- Private locators: `private lnk[ElementName]: Locator` for links
- Private locators: `private hdr[ElementName]: Locator` for headers
- Prefix meanings: `txt` (textbox), `btn` (button), `lnk` (link), `hdr` (header), `drp` (dropdown), `chk` (checkbox), `rad` (radio)

**Locator Definition Pattern:**
```typescript
// Use Playwright test library utilities
this.txtUserName = page.getByRole('textbox', { name: 'Username' })
    .describe("Username Textbox");

this.btnLogin = page.getByRole('button', { name: 'Login' })
    .describe("Login Button");
```

**Requirements for Each Page Class:**
1. All UI elements are declared as **private Locators** in the constructor
2. Each locator includes `.describe()` for clear identification in logs
3. Public methods wrap locator interactions with clear, descriptive names
4. Methods should represent user actions or verifications, not low-level interactions
5. Include `console.log()` statements for debugging:
   - Log the action performed
   - Include element description from locator
   - Include any relevant parameters

**Method Naming:**
- Action methods: `async enter[Field]()`, `async click[Element]()`, `async select[Element]()`
- Verification methods: `async verify[Component]Displayed()`, `async verify[State]()`
- Composite methods: `async perform[Action]()` (performs multiple related steps)

**Example Page Class:**
```typescript
import { Locator, Page, expect } from "@playwright/test"
import { BasePage } from "./basepage"

export class LoginPage extends BasePage {
    private txtUserName: Locator;
    private txtPassword: Locator;
    private btnLogin: Locator;
    private hdrLogin: Locator;

    constructor(page: Page) {
        super(page);
        
        this.txtUserName = page.getByRole('textbox', { name: 'Username' })
            .describe("Username Textbox");
        this.txtPassword = page.getByRole('textbox', { name: 'Password' })
            .describe("Password Textbox");
        this.btnLogin = page.getByRole('button', { name: 'Login' })
            .describe("Login Button");
        this.hdrLogin = page.getByRole('heading', { name: 'Login' })
            .describe("Login Header");
    }

    public async enterUserName(userName: string) {
        await this.txtUserName.fill(userName);
        console.log(userName + " entered on " + this.txtUserName.description());
    }

    public async enterPassword(password: string) {
        await this.txtPassword.fill(password);
        console.log(`${password} entered on ${this.txtPassword.description()}`);
    }

    public async clickOnLogin() {
        await this.btnLogin.click();
        console.log("Clicked on " + this.btnLogin.description());
    }

    public async verifyLoginPageDisplayed() {
        await expect(this.hdrLogin).toBeVisible();
        console.log("Login Page is displayed");
    }

    public async performLogin(userName: string, password: string) {
        await this.enterUserName(userName);
        await this.enterPassword(password);
        await this.clickOnLogin();
        console.log(`Performed login with username: ${userName} and password: ${password}`);
    }
}
```

### 1.3 POM Index File (`pom/index.ts`)

Export all page classes for convenient importing in fixtures and tests:

```typescript
export * from "./loginpage";
export * from "./addemployeepage";
export * from "./personaldetailspage";
export * from "./basepage";
export * from "./dashboardpage";
export * from "./pimpage";
```

---

## 2. Fixture Standards (`fixtures/appbase.ts`)

### 2.1 Purpose
Fixtures provide:
- Centralized access to all page objects
- Test data injection
- Before/after test hooks for setup and teardown

### 2.2 Fixture Structure

```typescript
import { test as base } from "@playwright/test";
import * as pages from "../pom"
import * as testData from "../testdata/credentials.json";

type tPages = {
    loginPage: pages.LoginPage;
    basePage: pages.BasePage;
    addEmployeePage: pages.AddEmployeePage;
    personalDetailsPage: pages.PersonalDetailsPage;
    dashboardPage: pages.DashboardPage;
    pimPage: pages.PIMPage;
};

export let test = base.extend<
    { testData: typeof testData, App: tPages, baTest: void }, 
    { bAll: void }
>({
    // App fixture: provides all page objects
    App: async ({ page }, use) => {
        await use({
            loginPage: new pages.LoginPage(page),
            basePage: new pages.BasePage(page),
            addEmployeePage: new pages.AddEmployeePage(page),
            personalDetailsPage: new pages.PersonalDetailsPage(page),
            dashboardPage: new pages.DashboardPage(page),
            pimPage: new pages.PIMPage(page),
        });
    },

    // testData fixture: provides test data with logging
    testData: async ({ }, use, testInfo) => {
        console.log("Test data used for test:", testInfo.title, testData);
        await use(testData);
    },

    // baTest: Before Each / After Each hook with auto-invocation
    baTest: [async ({ }, use, testInfo) => {
        console.log("Executing before each hook for test:" + testInfo.title);
        if (testInfo.title.includes("Valid Login")) {
            console.log("This is special handling for Valid Login test");
        }

        await use(); // test execution happens here

        console.log("Updating test status for test:" + testInfo.title);
    }, { auto: true }],

    // bAll: Before All / After All hook at worker scope
    bAll: [async ({ }, use, workerInfo) => {
        console.log("Executing before all hook" + workerInfo.workerIndex);
        await use();
        console.log("Executing after all hook" + workerInfo.workerIndex);
    }, { scope: "worker", auto: true }]
});
```

### 2.3 Fixture Type Definition

Define `tPages` type with all available page objects for type safety.

---

## 3. Test Data Standards (`testdata/`)

### 3.1 Credentials (`testdata/creds.ts`)

Use TypeScript for credentials to support environment variable overrides:

```typescript
export const admin = {
  username: process.env.APP_USER || 'jyothi',
  password: process.env.APP_PASSWORD || 'Jyothi@123#',
};

export const employee = {
  username: process.env.EMP_USER || 'employee1',
  password: process.env.EMP_PASSWORD || 'Employee@123#',
};
```

**Requirements:**
- Never hardcode production credentials
- Use `process.env` for all secrets with fallback defaults for testing
- Keep `.ts` format for JavaScript execution
- Export as named constants for type-safe access

### 3.2 Domain Test Data (`testdata/*.json`)

Use JSON files for domain-specific test data (employees, products, orders, etc.):

**File naming:** `testdata/[entity].json` (lowercase, plural)

**Example: `testdata/emp.json`**
```json
{
    "employees": [
        {
            "firstName": "John",
            "lastName": "Doe"
        },
        {
            "firstName": "Jane",
            "lastName": "Smith"
        },
        {
            "firstName": "Alice",
            "lastName": "Johnson"
        }
    ]
}
```

**Requirements:**
- Structure data with clear entity groupings
- Use descriptive field names
- Support multiple test cases within arrays
- Include realistic data that represents actual use cases

### 3.3 Importing Test Data

In tests:
```typescript
import { employees } from "../testdata/emp.json";
import * as testData from "../testdata/credentials.json";
// or
import { admin, employee } from "../testdata/creds";
```

---

## 4. Test File Standards (`tests/*.spec.ts`)

### 4.1 File Naming
- Use number prefix for test order (optional, can be alphabetical)
- Format: `tests/[number][DescriptiveName].spec.ts`
- Examples: `19POMTestWithBaseAppDDT.spec.ts`, `20POMTestWithBaseAppDDTNormalLoop.spec.ts`

### 4.2 Test Structure

#### 4.2.1 Imports
```typescript
import { test } from "../fixtures/appbase";
import { employees } from "../testdata/emp.json";
```

#### 4.2.2 Test Organization
```typescript
test.describe('Test Suite Name', () => {
    
    test.beforeEach(async ({ App, testData }) => {
        // Common setup for all tests in this suite
        await App.basePage.navigateTo("https://app-url");
        await App.loginPage.verifyLoginPageDisplayed();
        await App.loginPage.enterUserName(testData.username);
        await App.loginPage.enterPassword(testData.password);
        await App.loginPage.clickOnLogin();
        await App.dashboardPage.VerifyDashboardDisplayed();
    });

    // Test implementation
});
```

### 4.3 Data-Driven Testing Patterns

#### Pattern 1: Loop-Based DDT (Multiple Tests)
Creates separate test for each data item, better for reporting:

```typescript
test.describe('Data Driven Tests', () => {
    test.beforeEach(async ({ App, testData }) => {
        // Common setup
    });

    for (const employee of employees) {
        test(`Add Employee Test - ${employee.firstName} ${employee.lastName}`, async ({ App }) => {
            await App.dashboardPage.clickOnPIMLink();
            await App.pimPage.VerifyPIMDisplayed();
            await App.pimPage.clickOnAddEmployeeLink();
            
            await App.addEmployeePage.VerifyAddEmployeeDisplayed();
            await App.addEmployeePage.enterFirstName(employee.firstName);
            await App.addEmployeePage.enterLastName(employee.lastName);
            await App.addEmployeePage.enterUniqueEmployeeId();
            await App.addEmployeePage.clickOnSaveButton();
            
            await App.personalDetailsPage.VerifyPersonalDetailsDisplayed();
        });
    }
});
```

#### Pattern 2: Loop-Based DDT with test.step() (Single Test with Steps)
Better for linear flow, all iterations in one test:

```typescript
test.describe('Data Driven Tests', () => {
    test(`Add Employee Test`, { tag: ['@smoke'] }, async ({ App, testData }) => {
        
        await test.step('Navigate to login page and login', async () => {
            await App.basePage.navigateTo("https://qtpsudhakar-vibetestq-hrm.up.railway.app");
            await App.loginPage.verifyLoginPageDisplayed();
        }, { box: true });

        await test.step('Login to the application', async () => {
            await App.loginPage.enterUserName(testData.username);
            await App.loginPage.enterPassword(testData.password);
            await App.loginPage.clickOnLogin();
            await App.dashboardPage.VerifyDashboardDisplayed();
        }, { box: true });

        for (const employee of employees) {
            await test.step("Navigate to PIM page", async () => {
                await App.dashboardPage.clickOnPIMLink();
                await App.pimPage.VerifyPIMDisplayed();
            }, { box: true });

            await test.step("Click on Add Employee link", async () => {
                await App.pimPage.clickOnAddEmployeeLink();
                await App.addEmployeePage.VerifyAddEmployeeDisplayed();
            }, { box: true });

            await test.step(`Add employee: ${employee.firstName} ${employee.lastName}`, async () => {
                await App.addEmployeePage.enterFirstName(employee.firstName);
                await App.addEmployeePage.enterLastName(employee.lastName);
                await App.addEmployeePage.enterUniqueEmployeeId();
                await App.addEmployeePage.clickOnSaveButton();
                await App.personalDetailsPage.VerifyPersonalDetailsDisplayed();
            }, { box: true });
        }
    });
});
```

### 4.4 Test Best Practices

**Do:**
- Use POM methods for all UI interactions
- Use fixtures to inject dependencies (`App`, `testData`)
- Group related tests with `test.describe()`
- Use `test.beforeEach()` for common setup
- Use `test.step()` for complex workflows with sub-steps
- Include `{ box: true }` for step visibility in reports
- Use tags for test categorization: `{ tag: ['@smoke', '@regression'] }`
- Reference test data by field name (not index): `employee.firstName`

**Don't:**
- Don't use raw `page` object directly; use POM page objects via `App`
- Don't hardcode URLs; use environment variables or config
- Don't hardcode test data; use `testdata/` files
- Don't skip elements verifications; always verify state after actions
- Don't create test files without clear descriptions in imports
- Don't mix test concerns (e.g., login test shouldn't verify employee addition)

---

## 5. Agent Standards for Planning, Generating, and Healing Tests

### 5.1 Planner Agent (`playwright-test-planner.agent.md`)

**Objective:** Create comprehensive test plans exploring the application

**Must Include in Test Plans:**
1. **Plan File Structure:**
   - Markdown file format
   - Clear headings with test suite grouping
   - Numbered test scenarios with descriptive titles
   - Clear step-by-step instructions
   - Expected outcomes and success criteria
   - Assumptions about starting state

2. **Test Plan Content Requirements:**
   - Happy path scenarios (normal workflow)
   - Edge cases and boundary conditions
   - Error handling and validation scenarios
   - Data variations (from `testdata/` files)
   - User flow mapping
   - Page object interactions discovered

3. **Output Structure:**
   ```markdown
   # Test Plan: [Feature Name]
   
   ## Test Suite 1: [Feature Group]
   **Seed File:** `tests/[reference-file].spec.ts`
   
   ### Test 1.1: [Scenario Name]
   **Prerequisite:** [Starting state]
   **Steps:**
   1. [Step description]
   2. [Step description]
   
   **Expected Results:**
   - [Expected outcome]
   
   **Data Used:** [From testdata files]
   ```

### 5.2 Generator Agent (`playwright-test-generator.agent.md`)

**Objective:** Generate Playwright tests from test plans following POM and fixture standards

**Must Generate:**
1. **File Structure:**
   - Save to: `tests/[DescriptiveTestName].spec.ts`
   - Import: `import { test } from "../fixtures/appbase";`
   - Import: `import { [data] } from "../testdata/[filename]";`

2. **Test Code Requirements:**
   - Use `test.describe()` for test suite grouping
   - Use `test()` or `test.step()` for individual tests
   - Always use `App` fixture to access page objects: `App.loginPage`, `App.dashboardPage`, etc.
   - Always use `testData` fixture for credentials
   - Call POM methods (not raw page interactions)
   - Include comments before each step showing the plan step
   - Use `test.step()` with `{ box: true }` for complex flows
   - Use data-driven loop pattern when multiple data items apply

3. **Locator and Interaction Rules:**
   - Never use raw Playwright selectors (e.g., no `page.click('...')`)
   - Always use POM methods (e.g., `App.loginPage.clickOnLogin()`)
   - All page interactions flow through `App` page objects

4. **Example Generated Test:**
   ```typescript
   import { test } from "../fixtures/appbase";
   import { employees } from "../testdata/emp.json";

   test.describe('Add Employee Workflow', () => {
       test.beforeEach(async ({ App, testData }) => {
           await App.basePage.navigateTo("https://app-url");
           await App.loginPage.verifyLoginPageDisplayed();
           await App.loginPage.performLogin(testData.username, testData.password);
           await App.dashboardPage.VerifyDashboardDisplayed();
       });

       for (const employee of employees) {
           test(`Add employee: ${employee.firstName} ${employee.lastName}`, async ({ App }) => {
               // Navigate to PIM
               await App.dashboardPage.clickOnPIMLink();
               await App.pimPage.VerifyPIMDisplayed();

               // Add employee
               await App.pimPage.clickOnAddEmployeeLink();
               await App.addEmployeePage.VerifyAddEmployeeDisplayed();
               await App.addEmployeePage.enterFirstName(employee.firstName);
               await App.addEmployeePage.enterLastName(employee.lastName);
               await App.addEmployeePage.enterUniqueEmployeeId();
               await App.addEmployeePage.clickOnSaveButton();

               // Verify completion
               await App.personalDetailsPage.VerifyPersonalDetailsDisplayed();
           });
       }
   });
   ```

### 5.3 Healer Agent (`playwright-test-healer.agent.md`)

**Objective:** Debug and fix failing Playwright tests

**Must Follow:**
1. **Debugging Workflow:**
   - Run tests to identify failures
   - Debug each failing test
   - Capture snapshots to understand state
   - Analyze error details

2. **Fix Patterns:**
   - Update selectors if POM locators changed
   - Fix timing/synchronization issues
   - Update assertions and expected values
   - Improve test reliability using robust locators

3. **POM-Based Fixes:**
   - If element selectors fail, update POM class locators, not the test
   - Test should use POM methods consistently
   - Never introduce raw Playwright selectors in tests
   - If POM method needs updating, update the method and re-test

4. **Test Reliability:**
   - Use stable, semantic locators (role-based, text-based)
   - Avoid brittle selectors (CSS indices, complex xpaths)
   - Ensure proper waits and synchronization
   - Handle dynamic data with appropriate matching strategies

5. **When to Mark as Skipped:**
   - Only if error is environmental (database, network unavailable)
   - Add `test.fixme()` with comment explaining reason
   - Never skip due to application bugs; tests should validate bugs

---

## 6. Playwright Configuration Standards

### 6.1 Key Requirements
- Use stable locators: role-based, text-based, accessible attributes
- Avoid page index selectors when testing single test
- Configure timeouts appropriately for network and UI rendering
- Use visual snapshots for debugging when needed
- Generate HTML reports for visibility

### 6.2 Recommended Locator Precedence
1. Role-based: `page.getByRole('button', { name: 'Login' })`
2. Label-based: `page.getByLabel('Username')`
3. Placeholder: `page.getByPlaceholder('Search')`
4. Alt text: `page.getByAltText('Logo')`
5. Title: `page.getByTitle('Close')`
6. Test ID: `page.getByTestId('submit-btn')`
7. CSS class (last resort): `page.locator('.login-button')`

---

## 7. Common Test Workflows

### 7.1 Authentication Flow
```typescript
// Setup: Use composite POM method
await App.loginPage.performLogin(testData.username, testData.password);

// Or individual steps
await App.loginPage.enterUserName(testData.username);
await App.loginPage.enterPassword(testData.password);
await App.loginPage.clickOnLogin();
```

### 7.2 Data-Driven with Multiple Records
```typescript
for (const employee of employees) {
    test(`Add employee: ${employee.firstName} ${employee.lastName}`, async ({ App }) => {
        // Test implementation using employee data
    });
}
```

### 7.3 Multi-Step Process with Verification
```typescript
await test.step('Create new record', async () => {
    await App.addPage.fillForm(data);
    await App.addPage.submit();
});

await test.step('Verify record saved', async () => {
    await App.detailsPage.VerifyRecordDisplayed();
    await App.detailsPage.verifyField(data.field);
});
```

---

## 8. Reference Files to Follow

When creating new tests, use these files as templates and references:

**POM Templates:**
- `pom/basepage.ts` - Base class pattern
- `pom/loginpage.ts` - Complete POM example
- `pom/index.ts` - POM exports

**Fixture Template:**
- `fixtures/appbase.ts` - Full fixture implementation

**Test Data Templates:**
- `testdata/creds.ts` - Credentials pattern
- `testdata/emp.json` - Domain data pattern

**Test File Templates:**
- `tests/19POMTestWithBaseAppDDT.spec.ts` - Loop-based DDT with separate tests
- `tests/20POMTestWithBaseAppDDTNormalLoop.spec.ts` - Loop-based DDT with steps

---

## 9. Validation Checklist

Before considering a test complete, verify:

- [ ] Test uses fixture `App` for all page object access
- [ ] Test uses fixture `testData` for all credentials
- [ ] Test imports from `fixtures/appbase`, not base `@playwright/test`
- [ ] All UI interactions use POM methods, never raw `page` object
- [ ] Test data comes from `testdata/` directory (JSON or TS)
- [ ] File is in `tests/` directory with `.spec.ts` extension
- [ ] Test has clear `describe()` suite name
- [ ] Test has descriptive test name (not generic like "Test 1")
- [ ] Complex workflows use `test.step()` with descriptions
- [ ] Data-driven tests use loops over test data arrays
- [ ] All page state changes are verified with POM assertions
- [ ] No hardcoded URLs; use environment variables
- [ ] No hardcoded credentials; use `testData` fixture
- [ ] Comments explain complex logic or non-obvious steps
- [ ] Logging exists for debugging (in POM methods)

---

## 10. Important Notes for AI Agents

**When Planning Tests:**
- Explore the actual application UI to discover real workflows
- Create plans that reflect actual user behavior
- Include both happy paths and error scenarios
- Document all page objects and elements discovered

**When Generating Tests:**
- Follow POM pattern: all UI access through page objects
- Use data from `testdata/` files, not inline
- Import from `fixtures/appbase`, not `@playwright/test`
- Structure with `describe()` and `test()` following examples
- Add inline comments explaining complex steps

**When Healing Tests:**
- First check if POM methods need updates (not the test)
- Update selectors in POM files, not in tests
- Ensure test uses fixtures correctly
- Verify test data paths and imports
- Use snapshots and console logs to debug
- Fix one issue at a time and re-test

---

## 11. Version History

- **v1.0** - Initial standards document
- Created for: Test planning, generation, and healing with Playwright and POM pattern
- Repository: vibetestq-tamash/pw-sept10
- Last Updated: 2026-11-11
