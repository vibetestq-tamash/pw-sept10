# Test Automation Standards - Quick Reference

**Full Documentation:** See `.github/TEST-STANDARDS.md`

---

## Quick Checklist: Am I Following Standards?

### POM (Page Object Model)
- [ ] Class extends `BasePage`
- [ ] All locators are `private` with `.describe()`
- [ ] Public methods use camelCase: `enterUserName()`, `clickOnLogin()`
- [ ] Locators named: `txt*`, `btn*`, `lnk*`, `hdr*`, `drp*`, `chk*`, `rad*`
- [ ] Logging with element descriptions in each method

### Fixtures
- [ ] Import: `import { test } from "../fixtures/appbase";`
- [ ] Access pages via: `App.loginPage`, `App.dashboardPage`, etc.
- [ ] Access creds via: `testData.username`, `testData.password`
- [ ] Never use raw `page` object

### Test Data
- [ ] Credentials in: `testdata/creds.ts` with env overrides
- [ ] Domain data in: `testdata/*.json` files
- [ ] Import creds: `import { admin } from "../testdata/creds";`
- [ ] Import data: `import { employees } from "../testdata/emp.json";`

### Test Files
- [ ] Save to: `tests/[DescriptiveName].spec.ts`
- [ ] Import: `import { test } from "../fixtures/appbase";`
- [ ] Use: `test.describe()` and `test()` or `test.step()`
- [ ] All UI via: `App.[page].[method]()`
- [ ] All data via: `testData.[field]` or imported arrays
- [ ] Comments explain each step
- [ ] For loops: `for (const item of array) { test(...) { ... } }`

### Data-Driven Patterns

**Pattern A: Separate Tests (Better for Individual Reporting)**
```typescript
for (const employee of employees) {
    test(`Add employee: ${employee.firstName} ${employee.lastName}`, async ({ App }) => {
        // Implementation
    });
}
```

**Pattern B: Single Test with Steps (Better for Linear Flow)**
```typescript
for (const employee of employees) {
    await test.step(`Add employee: ${employee.firstName}`, async () => {
        // Implementation
    }, { box: true });
}
```

---

## File Structure Reference

```
tests/
├── 19POMTestWithBaseAppDDT.spec.ts          ← Pattern A: Loop with separate tests
└── 20POMTestWithBaseAppDDTNormalLoop.spec.ts ← Pattern B: Loop with test.step()

pom/
├── basepage.ts          ← All classes extend this
├── loginpage.ts         ← Example POM implementation
├── dashboardpage.ts     ← Page object for dashboard
├── pimpage.ts          ← Page object for PIM module
├── addemployeepage.ts  ← Page object for add employee
└── index.ts            ← Export all page classes

fixtures/
└── appbase.ts          ← Define App fixture with all page objects

testdata/
├── creds.ts            ← Credentials (export as named constants)
├── emp.json            ← Employee test data (export in JSON)
└── [other].json        ← Other domain-specific data
```

---

## Page Object Naming Convention

| Prefix | Type | Example |
|--------|------|---------|
| `txt` | Text Input | `txtUserName`, `txtPassword`, `txtFirstName` |
| `btn` | Button | `btnLogin`, `btnSave`, `btnCancel` |
| `lnk` | Link | `lnkDashboard`, `lnkProfile`, `lnkLogout` |
| `hdr` | Header | `hdrLogin`, `hdrDashboard`, `hdrErrorMessage` |
| `drp` | Dropdown | `drpRole`, `drpDepartment`, `drpStatus` |
| `chk` | Checkbox | `chkAgree`, `chkRememberMe`, `chkActive` |
| `rad` | Radio Button | `radMale`, `radFemale`, `radYes` |

---

## Agent Usage Guide

### Planner Agent
**When:** You need a test plan for a feature
**Expects:** Feature description, URL, requirements
**Produces:** Markdown test plan with scenarios, steps, expected results
**Must Include:** Seed file reference, page objects involved, test data files

### Generator Agent
**When:** You have a test plan, need implementation
**Expects:** Test plan markdown file
**Produces:** `.spec.ts` file with complete working test
**Important Rules:**
- Imports from `fixtures/appbase`, never `@playwright/test`
- Uses `App` for all page objects
- Uses `testData` for credentials
- Comments explain each step

### Healer Agent
**When:** Tests are failing, need debugging
**Expects:** Repository with failing tests
**Produces:** Fixed tests, updated POM/data files
**Key Strategy:**
- Fix POM files if selectors broken (not the test)
- Fix testdata files if data wrong (not the test)
- Fix test only for logic issues
- Never add raw Playwright code to tests

---

## Common Patterns

### Login and Navigate
```typescript
test.beforeEach(async ({ App, testData }) => {
    await App.basePage.navigateTo("https://app-url");
    await App.loginPage.verifyLoginPageDisplayed();
    await App.loginPage.performLogin(testData.username, testData.password);
    await App.dashboardPage.VerifyDashboardDisplayed();
});
```

### Verify Page State
```typescript
await App.dashboardPage.VerifyDashboardDisplayed();
// or
await expect(element).toBeVisible();
```

### Use Test Data
```typescript
await App.addPage.enterFirstName(employee.firstName);
await App.addPage.enterLastName(employee.lastName);
```

### Add Step for Clarity
```typescript
await test.step('Add new employee', async () => {
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.enterFirstName('John');
    await App.addEmployeePage.enterLastName('Doe');
    await App.addEmployeePage.clickOnSaveButton();
}, { box: true });
```

---

## Red Flags 🚩 (Don't Do These)

| ❌ Wrong | ✅ Correct | Reason |
|---------|-----------|--------|
| `import { test } from "@playwright/test"` | `import { test } from "../fixtures/appbase"` | Need custom fixture |
| `await page.click('...')` | `await App.page.click('...')` | Use POM, not raw page |
| `const url = 'http://...'` | Use `process.env.APP_URL` | Avoid hardcoding |
| `const user = 'admin'` | Use `testData.username` | Avoid hardcoding credentials |
| Test data in array | Import from `testdata/*.json` | Centralized data management |
| Public locators in POM | Private locators with `.describe()` | Encapsulation and debugging |
| Multiple tests in file | One test per file | Easier management |
| No step comments | Comments before each step | Self-documenting code |

---

## Git Commit Message Template

```
Add test: [Feature name]

- Plan from: [link to test plan if applicable]
- Test file: tests/[FileName].spec.ts
- POM classes: LoginPage, DashboardPage, AddEmployeePage
- Test data: testdata/emp.json
- Covers: Happy path, edge cases

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```

---

## Where to Find Help

| Need | Location | Section |
|------|----------|---------|
| Full standards | `.github/TEST-STANDARDS.md` | All sections |
| POM patterns | `.github/TEST-STANDARDS.md` | Section 1 |
| Test patterns | `.github/TEST-STANDARDS.md` | Section 4 |
| Agent rules | `.github/TEST-STANDARDS.md` | Section 5 |
| Examples | Reference test files | See file structure |
| Agent guidance | `.github/agents/*.agent.md` | Three files |
| Updates summary | `.github/AGENT-UPDATES-SUMMARY.md` | Overview |

---

## Key Files Always Reference

Keep these as "source of truth":

1. **Fixture Structure** → `fixtures/appbase.ts`
2. **POM Example** → `pom/loginpage.ts`
3. **Test Example (Pattern A)** → `tests/19POMTestWithBaseAppDDT.spec.ts`
4. **Test Example (Pattern B)** → `tests/20POMTestWithBaseAppDDTNormalLoop.spec.ts`
5. **Standards Guide** → `.github/TEST-STANDARDS.md`

---

**Last Updated:** 2026-11-11  
**Version:** 1.0
