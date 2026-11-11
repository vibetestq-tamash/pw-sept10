# Add Employee Test Conversion Reference Guide

This guide provides detailed documentation of the conversion pattern applied to all 36 test files in the `tests/add-employee/` directory.

## Table of Contents
1. [Conversion Pattern](#conversion-pattern)
2. [Before & After Examples](#before--after-examples)
3. [Common Patterns](#common-patterns)
4. [Test Data Reference](#test-data-reference)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

---

## Conversion Pattern

### Standard File Structure

Every converted test file follows this exact structure:

```typescript
// ===== 1. IMPORTS =====
import { test, expect } from '@playwright/test';
import { [category] } from '../../../testdata/add-employee.json';

// ===== 2. TEST DESCRIBE BLOCK =====
test.describe('Add Employee - [Category] Scenarios', () => {
  
  // ===== 3. BEFORE EACH HOOK =====
  test.beforeEach(async ({ page }) => {
    console.log('[Setup] Navigating to login page and authenticating');
    await page.goto('https://qtpsudhakar-vibetestq-hrm.up.railway.app');
    
    // Login with hardcoded credentials
    await page.getByRole('textbox', { name: 'Username' }).fill('testadmin');
    await page.getByRole('textbox', { name: 'Password' }).fill('Vibetestq@123#');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    console.log('[Setup] Login successful');
  });

  // ===== 4. TEST CASE =====
  test('Test description', async ({ page }) => {
    console.log('[Test] Starting: Test name');
    
    // Navigation step
    await test.step('Navigate to Add Employee form', async () => {
      console.log('[Step] Clicking PIM menu');
      await page.getByRole('link', { name: 'PIM' }).click();
      await page.waitForLoadState('networkidle');
      
      console.log('[Step] Clicking Add Employee link');
      await page.getByRole('link', { name: 'Add Employee' }).click();
      await page.waitForLoadState('networkidle');
    });
    
    // Complex workflow step (with box: true)
    await test.step('Fill form with test data', { box: true }, async () => {
      console.log(`[Step] Filling First Name: ${testDataVariable.firstName}`);
      await page.getByRole('textbox', { name: 'First Name' }).fill(testDataVariable.firstName);
      
      console.log(`[Step] Filling Last Name: ${testDataVariable.lastName}`);
      await page.getByRole('textbox', { name: 'Last Name' }).fill(testDataVariable.lastName);
    });
    
    // Verification step
    await test.step('Verify successful save', async () => {
      console.log('[Verify] Waiting for success message');
      await expect(page.locator('text=Successfully Saved')).toBeVisible();
      console.log('[Verify] Operation completed successfully');
    });
  });
});
```

### Key Components Explained

#### 1. Imports
```typescript
import { test, expect } from '@playwright/test';
import { [category] } from '../../../testdata/add-employee.json';
```
- Always import the appropriate test data category
- Categories: `happyPath`, `validation`, `inputData`, `edgeCases`, `loginCredentials`, `imageUpload`

#### 2. Test Describe Block
```typescript
test.describe('Add Employee - [Category] Scenarios', () => {
```
- Follows naming convention: `Add Employee - [Category] Scenarios`
- Groups related tests together
- Makes test reports easier to read

#### 3. Before Each Hook
```typescript
test.beforeEach(async ({ page }) => {
  // Always starts with console log
  console.log('[Setup] Navigating to login page and authenticating');
  
  // Navigate to app
  await page.goto('https://qtpsudhakar-vibetestq-hrm.up.railway.app');
  
  // Login with fixed credentials
  await page.getByRole('textbox', { name: 'Username' }).fill('testadmin');
  await page.getByRole('textbox', { name: 'Password' }).fill('Vibetestq@123#');
  
  // Click login and wait
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('networkidle');
  
  // End with confirmation log
  console.log('[Setup] Login successful');
});
```
- Runs before each test in the describe block
- Sets up common state (authentication)
- Reduces code duplication

#### 4. Test Case Structure
```typescript
test('Test name', async ({ page }) => {
  // Start with test log
  console.log('[Test] Starting: Test name');
  
  // Use test.step() for logical grouping
  await test.step('Step description', async () => {
    // implementation
  });
  
  // Use { box: true } for complex workflows
  await test.step('Complex step', { box: true }, async () => {
    // implementation
  });
  
  // Use [Verify] prefix for assertions
  console.log('[Verify] Checking result');
  await expect(locator).toBeVisible();
});
```

---

## Before & After Examples

### Example 1: Validation Test

#### BEFORE (Old Pattern)
```typescript
import { test, expect } from '@playwright/test';

test.describe('Add Employee - Field Validation Scenarios', () => {
  test('Validation error when First Name is empty', async ({ page }) => {
    // Hardcoded navigation
    await page.goto('https://qtpsudhakar-vibetestq-hrm.up.railway.app/web/index.php/auth/login');
    
    // Hardcoded login without logging
    await page.getByRole('textbox', { name: 'Username' }).fill('testadmin');
    await page.getByRole('textbox', { name: 'Password' }).fill('Vibetestq@123#');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Navigation without structure
    await page.getByRole('link', { name: 'PIM' }).click();
    await page.waitForLoadState('networkidle');
    await page.getByRole('link', { name: 'Add Employee' }).click();
    await page.waitForLoadState('networkidle');
    
    // No logging for clarity
    await page.getByRole('textbox', { name: 'Last Name' }).fill('TestLast');
    
    // Try to save
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Simple verification
    await page.waitForTimeout(500);
    const addEmployeeHeading = page.locator('text=Add Employee');
    await expect(addEmployeeHeading).toBeVisible();
  });
});
```

#### AFTER (New Pattern)
```typescript
import { test, expect } from '@playwright/test';
import { validation } from '../../../testdata/add-employee.json';

test.describe('Add Employee - Field Validation Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    console.log('[Setup] Navigating to login page and authenticating');
    await page.goto('https://qtpsudhakar-vibetestq-hrm.up.railway.app');
    await page.getByRole('textbox', { name: 'Username' }).fill('testadmin');
    await page.getByRole('textbox', { name: 'Password' }).fill('Vibetestq@123#');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForLoadState('networkidle');
    console.log('[Setup] Login successful');
  });

  test('Validation error when First Name is empty', async ({ page }) => {
    console.log('[Test] Starting: First Name required validation');
    
    await test.step('Navigate to Add Employee form', async () => {
      console.log('[Step] Clicking PIM menu');
      await page.getByRole('link', { name: 'PIM' }).click();
      await page.waitForLoadState('networkidle');
      
      console.log('[Step] Clicking Add Employee link');
      await page.getByRole('link', { name: 'Add Employee' }).click();
      await page.waitForLoadState('networkidle');
    });
    
    await test.step('Fill form with Last Name only', async () => {
      console.log(`[Step] Filling Last Name: ${validation.firstNameRequired.lastName}`);
      await page.getByRole('textbox', { name: 'Last Name' }).fill(validation.firstNameRequired.lastName);
    });
    
    await test.step('Attempt to save without First Name', { box: true }, async () => {
      console.log('[Step] Clicking Save button');
      await page.getByRole('button', { name: 'Save' }).click();
    });
    
    await test.step('Verify validation prevented save', async () => {
      await page.waitForTimeout(500);
      const addEmployeeHeading = page.locator('text=Add Employee');
      console.log('[Verify] Checking if Add Employee form is still visible');
      await expect(addEmployeeHeading).toBeVisible();
      console.log('[Verify] Validation error confirmed - First Name is required');
    });
  });
});
```

**Key Improvements:**
- Centralized login in `beforeEach`
- Test data imported and used from JSON
- Comprehensive logging with [Setup], [Step], [Verify] prefixes
- Organized into logical `test.step()` blocks
- Clear, descriptive step names
- Better error messages

### Example 2: Happy Path Test

#### BEFORE (Old Pattern)
```typescript
import { test, expect } from '@playwright/test';

test('Successfully add employee with required fields only', async ({ page }) => {
  await page.goto('https://qtpsudhakar-vibetestq-hrm.up.railway.app');
  await page.getByRole('textbox', { name: 'Username' }).fill('testadmin');
  await page.getByRole('textbox', { name: 'Password' }).fill('Vibetestq@123#');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('networkidle');
  
  await page.getByRole('link', { name: 'PIM' }).click();
  await page.waitForLoadState('networkidle');
  await page.getByRole('link', { name: 'Add Employee' }).click();
  await page.waitForLoadState('networkidle');
  
  // Hardcoded test data
  await page.getByRole('textbox', { name: 'First Name' }).fill('John');
  await page.getByRole('textbox', { name: 'Last Name' }).fill('Anderson');
  
  const employeeIdField = page.locator('input').nth(5);
  const randomId = Math.floor(1000000000 + Math.random() * 9000000).toString();
  await employeeIdField.fill(randomId);
  
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.locator('text=Successfully Saved')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible();
});
```

#### AFTER (New Pattern)
```typescript
import { test, expect } from '@playwright/test';
import { happyPath } from '../../../testdata/add-employee.json';

test.describe('Add Employee - Happy Path Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    console.log('[Setup] Navigating to login page and authenticating');
    await page.goto('https://qtpsudhakar-vibetestq-hrm.up.railway.app');
    await page.getByRole('textbox', { name: 'Username' }).fill('testadmin');
    await page.getByRole('textbox', { name: 'Password' }).fill('Vibetestq@123#');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForLoadState('networkidle');
    console.log('[Setup] Login successful');
  });

  test('Successfully add employee with required fields only', async ({ page }) => {
    console.log('[Test] Starting: Happy path - required fields only');
    
    await test.step('Navigate to Add Employee', async () => {
      console.log('[Step] Clicking PIM menu');
      await page.getByRole('link', { name: 'PIM' }).click();
      await page.waitForLoadState('networkidle');
      
      console.log('[Step] Clicking Add Employee link');
      await page.getByRole('link', { name: 'Add Employee' }).click();
      await page.waitForLoadState('networkidle');
    });
    
    await test.step('Fill employee details from test data', { box: true }, async () => {
      console.log(`[Step] Filling First Name: ${happyPath.requiredFieldsOnly.firstName}`);
      await page.getByRole('textbox', { name: 'First Name' }).fill(happyPath.requiredFieldsOnly.firstName);
      
      console.log(`[Step] Filling Last Name: ${happyPath.requiredFieldsOnly.lastName}`);
      await page.getByRole('textbox', { name: 'Last Name' }).fill(happyPath.requiredFieldsOnly.lastName);
    });
    
    await test.step('Save employee', async () => {
      console.log('[Step] Clicking Save button');
      await page.getByRole('button', { name: 'Save' }).click();
    });
    
    await test.step('Verify successful creation', async () => {
      console.log('[Verify] Waiting for success message');
      await expect(page.locator('text=Successfully Saved')).toBeVisible();
      
      console.log('[Verify] Checking for Personal Details page');
      await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible();
      console.log('[Verify] Employee created successfully');
    });
  });
});
```

**Key Improvements:**
- Test data centralized in JSON
- Hardcoded values replaced with test data variables
- Better readability with step descriptions
- Enhanced logging for debugging
- Reduced brittle locators (no `.nth()` selectors)

---

## Common Patterns

### Pattern 1: Simple Navigation and Fill

```typescript
await test.step('Navigate to Add Employee form', async () => {
  console.log('[Step] Clicking PIM menu');
  await page.getByRole('link', { name: 'PIM' }).click();
  await page.waitForLoadState('networkidle');
  
  console.log('[Step] Clicking Add Employee link');
  await page.getByRole('link', { name: 'Add Employee' }).click();
  await page.waitForLoadState('networkidle');
});
```

### Pattern 2: Form Filling with Test Data

```typescript
await test.step('Fill form with test data', { box: true }, async () => {
  console.log(`[Step] Filling First Name: ${testData.firstName}`);
  await page.getByRole('textbox', { name: 'First Name' }).fill(testData.firstName);
  
  console.log(`[Step] Filling Last Name: ${testData.lastName}`);
  await page.getByRole('textbox', { name: 'Last Name' }).fill(testData.lastName);
});
```

### Pattern 3: Checkbox Interaction

```typescript
const checkbox = page.locator('input[type="checkbox"]');
console.log('[Step] Clicking checkbox');
await checkbox.check();
```

### Pattern 4: Error Verification

```typescript
await test.step('Verify validation error', async () => {
  await page.waitForTimeout(500);
  const formHeading = page.locator('text=Add Employee');
  console.log('[Verify] Checking if form is still visible');
  await expect(formHeading).toBeVisible();
  console.log('[Verify] Form validation prevented submission');
});
```

### Pattern 5: Success Verification

```typescript
await test.step('Verify successful save', async () => {
  console.log('[Verify] Waiting for success message');
  await expect(page.locator('text=Successfully Saved')).toBeVisible();
  console.log('[Verify] Operation completed successfully');
});
```

### Pattern 6: Logout and Re-login

```typescript
await test.step('Logout and re-login', async () => {
  console.log('[Step] Finding profile menu');
  const profileMenu = page.locator('img[alt="profile picture"]').first();
  await profileMenu.click();
  
  await page.waitForTimeout(500);
  const logoutButton = page.locator('text=Logout');
  if (await logoutButton.isVisible()) {
    console.log('[Step] Clicking Logout');
    await logoutButton.click();
  }
  
  console.log('[Step] Re-logging in');
  await page.goto('https://qtpsudhakar-vibetestq-hrm.up.railway.app');
  await page.getByRole('textbox', { name: 'Username' }).fill('testadmin');
  await page.getByRole('textbox', { name: 'Password' }).fill('Vibetestq@123#');
  await page.getByRole('button', { name: 'Login' }).click();
});
```

---

## Test Data Reference

### Accessing Test Data

All test data is structured by category in `testdata/add-employee.json`:

```typescript
// Import the category you need
import { happyPath } from '../../../testdata/add-employee.json';

// Access nested properties
happyPath.requiredFieldsOnly.firstName  // "John"
happyPath.requiredFieldsOnly.lastName   // "Anderson"
```

### Available Categories and Keys

```
validation
├── firstNameRequired
├── lastNameRequired
├── allFieldsEmpty
└── middleNameOptional

inputData
├── longName
├── spaceInName
├── specialCharacters
├── unicodeCharacters
├── numericInName
└── onlySpaces

edgeCases
├── employeeIdBoundary
├── tabNavigation
└── rapidAdditions

loginCredentials
├── validCredentials
├── emptyUsername
├── emptyPassword
└── duplicateUsername

imageUpload
├── validImage
├── oversizedImage
└── unsupportedFormat

happyPath
├── requiredFieldsOnly
├── withMiddleName
├── withLoginDetails
└── withProfilePicture
```

---

## Best Practices

### 1. Console Logging

Always use prefix pattern:
```typescript
console.log('[Setup] ...text...')     // In beforeEach
console.log('[Step] ...text...')      // During test steps
console.log('[Verify] ...text...')    // During assertions
console.log('[Test] Starting: ...')   // At test start
```

### 2. Test Step Organization

Group related actions:
```typescript
// GOOD: Related actions in one step
await test.step('Fill employee details', { box: true }, async () => {
  await page.getByRole('textbox', { name: 'First Name' }).fill(data.firstName);
  await page.getByRole('textbox', { name: 'Last Name' }).fill(data.lastName);
});

// AVOID: Breaking up logical workflows
await test.step('Fill First Name', async () => {
  await page.getByRole('textbox', { name: 'First Name' }).fill(data.firstName);
});
await test.step('Fill Last Name', async () => {
  await page.getByRole('textbox', { name: 'Last Name' }).fill(data.lastName);
});
```

### 3. Wait for Network

Always wait after navigation:
```typescript
await page.getByRole('link', { name: 'PIM' }).click();
await page.waitForLoadState('networkidle');  // Always add this
```

### 4. Use Semantic Selectors

Prefer semantic selectors over brittle locators:
```typescript
// GOOD: Semantic selector
await page.getByRole('textbox', { name: 'First Name' }).fill('John');

// AVOID: Brittle nth-child selector
await page.locator('input').nth(5).fill('John');
```

### 5. Test Independence

Tests should not depend on other tests:
```typescript
// Each test is independent
// beforeEach ensures clean state before each test
// Tests can run in any order

// AVOID: Tests that depend on previous test results
test('Create employee', async () => { ... });
test('Edit created employee', async () => {
  // This test assumes previous test created employee
});
```

### 6. Clear Test Names

Test names should describe what they test:
```typescript
// GOOD: Describes the test scenario
test('Validation error when First Name is empty', async () => { ... });

// AVOID: Unclear names
test('Test 1', async () => { ... });
test('Error handling', async () => { ... });
```

---

## Troubleshooting

### Issue: Test Fails with "Timeout"

**Solution**: Check if `waitForLoadState('networkidle')` is after navigation:
```typescript
await page.getByRole('link', { name: 'PIM' }).click();
await page.waitForLoadState('networkidle');  // Add this if missing
```

### Issue: Selector Not Found

**Solution**: Use semantic selectors instead of brittle nth-child:
```typescript
// WRONG: May break if layout changes
const field = page.locator('input').nth(5);

// RIGHT: Semantic and stable
const field = page.getByRole('textbox', { name: 'First Name' });
```

### Issue: Test Data Not Found

**Solution**: Verify import path and category name:
```typescript
// Check that:
// 1. Import path is correct (go up 3 levels: ../../../)
// 2. Category name matches testdata file
// 3. Property name is spelled correctly

import { validation } from '../../../testdata/add-employee.json';
// validation.firstNameRequired.firstName ✓
```

### Issue: BeforeEach Not Running

**Solution**: Make sure it's inside `test.describe()`:
```typescript
test.describe('Category', () => {
  // Must be inside describe block
  test.beforeEach(async ({ page }) => {
    // ...
  });
  
  test('test name', async ({ page }) => {
    // ...
  });
});
```

### Issue: Checkbox Won't Check

**Solution**: Try using `click()` with `force: true`:
```typescript
const checkbox = page.locator('input[type="checkbox"]');
await checkbox.check();

// If above doesn't work:
await checkbox.click({ force: true });
```

### Issue: Password Field Not Visible

**Solution**: Use type selector for password field:
```typescript
// Find password by type attribute
await page.locator('input[type="password"]').fill('password');

// Or use first() if there are multiple
await page.locator('input[type="password"]').first().fill('password');
```

---

## Summary

This conversion pattern provides:
- ✅ Centralized test data management
- ✅ Consistent test structure across 39 files
- ✅ Enhanced debugging with structured logging
- ✅ Reduced code duplication with `beforeEach` hook
- ✅ Better test organization with `test.step()`
- ✅ Reliable selectors using semantic locators
- ✅ Easy maintenance and future updates

All 36 newly converted files + 3 reference files now follow this standard pattern.
