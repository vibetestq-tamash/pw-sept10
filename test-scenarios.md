# OrangeHRM Add Employee - Test Scenarios

## Overview
This document outlines comprehensive test scenarios for the OrangeHRM "Add Employee" feature, covering positive, negative, edge cases, and boundary conditions.

---

## 1. POSITIVE TEST SCENARIOS

### PS-1: Add Employee with Minimum Required Fields
**Objective:** Create an employee with only mandatory fields filled
- **Precondition:** User is logged in and on Add Employee form
- **Steps:**
  1. Enter First Name: "John"
  2. Enter Last Name: "Smith"
  3. Leave Employee ID as auto-generated (0558)
  4. Leave Middle Name empty
  5. Leave Photo upload empty
  6. Click Save button
- **Expected Result:** Employee created successfully, redirect to personal details page, employee appears in Employee List (519 records total)

### PS-2: Add Employee with All Fields Populated
**Objective:** Create an employee with complete information
- **Precondition:** User is logged in and on Add Employee form
- **Steps:**
  1. Enter First Name: "Jane"
  2. Enter Middle Name: "Marie"
  3. Enter Last Name: "Doe"
  4. Employee ID: Accept auto-generated value
  5. Enable "Create Login Details" toggle
  6. Enter Username: "janedoe"
  7. Enter Password: "Test@1234"
  8. Confirm Password: "Test@1234"
  9. Upload employee photo (valid jpg/png file)
  10. Click Save button
- **Expected Result:** Employee created successfully with login credentials, personal details page displayed, employee searchable in system

### PS-3: Add Employee with Special Characters in Name
**Objective:** Verify system handles special characters in employee names
- **Precondition:** User is logged in and on Add Employee form
- **Steps:**
  1. Enter First Name: "Jean-Pierre"
  2. Enter Middle Name: "O'Brien"
  3. Enter Last Name: "García-López"
  4. Click Save button
- **Expected Result:** Employee created successfully, special characters preserved in name

### PS-4: Add Employee with Multiple Middle Names
**Objective:** Verify system handles multiple middle names
- **Precondition:** User is logged in and on Add Employee form
- **Steps:**
  1. Enter First Name: "Michael"
  2. Enter Middle Name: "James David"
  3. Enter Last Name: "Thompson"
  4. Click Save button
- **Expected Result:** Employee created successfully with full middle names preserved

### PS-5: Add Employee with Space in Names
**Objective:** Verify system accepts names with spaces
- **Precondition:** User is logged in and on Add Employee form
- **Steps:**
  1. Enter First Name: "Mary Ann"
  2. Enter Last Name: "Von Neumann"
  3. Click Save button
- **Expected Result:** Employee created successfully, spaces preserved in names

---

## 2. NEGATIVE TEST SCENARIOS

### NS-1: Submit Form with Empty First Name
**Objective:** Verify first name is mandatory field
- **Precondition:** User is logged in and on Add Employee form
- **Steps:**
  1. Leave First Name empty
  2. Enter Last Name: "Smith"
  3. Click Save button
- **Expected Result:** Error message displayed: "First Name is required", form not submitted, user remains on Add Employee page

### NS-2: Submit Form with Empty Last Name
**Objective:** Verify last name is mandatory field
- **Precondition:** User is logged in and on Add Employee form
- **Steps:**
  1. Enter First Name: "John"
  2. Leave Last Name empty
  3. Click Save button
- **Expected Result:** Error message displayed: "Last Name is required", form not submitted, user remains on Add Employee page

### NS-3: Submit Form with Both First and Last Name Empty
**Objective:** Verify both required fields validation
- **Precondition:** User is logged in and on Add Employee form
- **Steps:**
  1. Leave First Name empty
  2. Leave Last Name empty
  3. Click Save button
- **Expected Result:** Multiple error messages displayed, form not submitted

### NS-4: Create Login Details with Mismatched Passwords
**Objective:** Verify password confirmation validation
- **Precondition:** User is logged in and on Add Employee form
- **Steps:**
  1. Enter First Name: "John"
  2. Enter Last Name: "Smith"
  3. Enable "Create Login Details" toggle
  4. Enter Username: "johnsmith"
  5. Enter Password: "Test@1234"
  6. Confirm Password: "Test@5678"
  7. Click Save button
- **Expected Result:** Error message "Passwords do not match", form not submitted

### NS-5: Create Login Details with Weak Password
**Objective:** Verify password strength requirements
- **Precondition:** User is logged in and on Add Employee form
- **Steps:**
  1. Enter First Name: "John"
  2. Enter Last Name: "Smith"
  3. Enable "Create Login Details" toggle
  4. Enter Username: "johnsmith"
  5. Enter Password: "123"
  6. Confirm Password: "123"
  7. Click Save button
- **Expected Result:** Error message about password strength, form not submitted

### NS-6: Create Login Details with Empty Username
**Objective:** Verify username is required when login details enabled
- **Precondition:** User is logged in and on Add Employee form
- **Steps:**
  1. Enter First Name: "John"
  2. Enter Last Name: "Smith"
  3. Enable "Create Login Details" toggle
  4. Leave Username empty
  5. Enter Password: "Test@1234"
  6. Click Save button
- **Expected Result:** Error message "Username is required", form not submitted

### NS-7: Create Login Details with Duplicate Username
**Objective:** Verify username uniqueness constraint
- **Precondition:** User is logged in and on Add Employee form, "testadmin" username already exists
- **Steps:**
  1. Enter First Name: "John"
  2. Enter Last Name: "Smith"
  3. Enable "Create Login Details" toggle
  4. Enter Username: "testadmin" (existing username)
  5. Enter Password: "Test@1234"
  6. Confirm Password: "Test@1234"
  7. Click Save button
- **Expected Result:** Error message "Username already exists", form not submitted

### NS-8: Upload File with Invalid Format
**Objective:** Verify photo format validation (must be jpg, png, or gif)
- **Precondition:** User is logged in and on Add Employee form
- **Steps:**
  1. Enter First Name: "John"
  2. Enter Last Name: "Smith"
  3. Attempt to upload a .txt file as photo
  4. Click Save button
- **Expected Result:** Error message "Invalid file format. Only JPG, PNG, GIF allowed", file not uploaded

### NS-9: Upload File Exceeding Size Limit
**Objective:** Verify photo size limit (max 1MB)
- **Precondition:** User is logged in and on Add Employee form
- **Steps:**
  1. Enter First Name: "John"
  2. Enter Last Name: "Smith"
  3. Attempt to upload a 5MB image file
  4. Click Save button
- **Expected Result:** Error message "File size exceeds 1MB limit", file not uploaded

### NS-10: Submit Form Without Selecting Cancel
**Objective:** Verify form submission validates all fields
- **Precondition:** User is logged in and on Add Employee form
- **Steps:**
  1. Leave all fields empty
  2. Click Save button
- **Expected Result:** Multiple validation errors displayed, form not submitted

---

## 3. EDGE CASE SCENARIOS

### EC-1: Employee Name with Numbers
**Objective:** Verify system accepts numbers in employee names (if allowed)
- **Precondition:** User is logged in and on Add Employee form
- **Steps:**
  1. Enter First Name: "John2"
  2. Enter Last Name: "Smith3"
  3. Click Save button
- **Expected Result:** Employee created or appropriate error message if not allowed

### EC-2: Maximum Length First Name
**Objective:** Verify field accepts very long first names
- **Precondition:** User is logged in and on Add Employee form
- **Steps:**
  1. Enter First Name with 100+ characters
  2. Enter Last Name: "Smith"
  3. Click Save button
- **Expected Result:** Either employee created successfully OR error message about maximum length

### EC-3: Maximum Length Last Name
**Objective:** Verify field accepts very long last names
- **Precondition:** User is logged in and on Add Employee form
- **Steps:**
  1. Enter First Name: "John"
  2. Enter Last Name with 100+ characters
  3. Click Save button
- **Expected Result:** Either employee created successfully OR error message about maximum length

### EC-4: Single Character First Name
**Objective:** Verify minimum length validation
- **Precondition:** User is logged in and on Add Employee form
- **Steps:**
  1. Enter First Name: "J"
  2. Enter Last Name: "Smith"
  3. Click Save button
- **Expected Result:** Employee created successfully OR error message if minimum length is 2 characters

### EC-5: Leading/Trailing Spaces in Names
**Objective:** Verify handling of leading/trailing spaces
- **Precondition:** User is logged in and on Add Employee form
- **Steps:**
  1. Enter First Name: "  John  "
  2. Enter Last Name: "  Smith  "
  3. Click Save button
- **Expected Result:** Employee created with spaces trimmed from name

### EC-6: Only Spaces in First Name
**Objective:** Verify validation rejects whitespace-only input
- **Precondition:** User is logged in and on Add Employee form
- **Steps:**
  1. Enter First Name: "     "
  2. Enter Last Name: "Smith"
  3. Click Save button
- **Expected Result:** Error message "First Name cannot be empty/whitespace only", form not submitted

### EC-7: Employee ID Conflict
**Objective:** Verify employee ID uniqueness
- **Precondition:** User is logged in, employee with ID 0558 already exists
- **Steps:**
  1. Enter First Name: "Jane"
  2. Enter Last Name: "Doe"
  3. Manually change Employee ID to: "0558"
  4. Click Save button
- **Expected Result:** Error message "Employee ID already exists" OR auto-ID assignment prevents conflict

### EC-8: Very Long Username (If Allowed)
**Objective:** Verify username length constraints
- **Precondition:** User is logged in and on Add Employee form
- **Steps:**
  1. Enter First Name: "John"
  2. Enter Last Name: "Smith"
  3. Enable "Create Login Details" toggle
  4. Enter Username with 100+ characters
  5. Enter Password: "Test@1234"
  6. Confirm Password: "Test@1234"
  7. Click Save button
- **Expected Result:** Either accepted OR error message about maximum username length

### EC-9: Username with Special Characters
**Objective:** Verify allowed characters in username
- **Precondition:** User is logged in and on Add Employee form
- **Steps:**
  1. Enter First Name: "John"
  2. Enter Last Name: "Smith"
  3. Enable "Create Login Details" toggle
  4. Enter Username: "john@smith#123"
  5. Enter Password: "Test@1234"
  6. Confirm Password: "Test@1234"
  7. Click Save button
- **Expected Result:** Employee created successfully OR error message about invalid username characters

### EC-10: Photo with Exact 1MB Size
**Objective:** Verify system accepts photo at maximum size
- **Precondition:** User is logged in and on Add Employee form
- **Steps:**
  1. Enter First Name: "John"
  2. Enter Last Name: "Smith"
  3. Upload exactly 1MB image file
  4. Click Save button
- **Expected Result:** Employee created successfully with photo attached

---

## 4. BOUNDARY TEST SCENARIOS

### BT-1: Add Employee and Verify Employee Count Increment
**Objective:** Verify employee count increases correctly
- **Precondition:** Current employee count is 519
- **Steps:**
  1. Add new employee with required fields
  2. Navigate to Employee List
  3. Verify total record count
- **Expected Result:** Employee count increases to 520

### BT-2: Add Multiple Employees in Sequence
**Objective:** Verify system handles multiple employee additions
- **Precondition:** User is logged in and on Add Employee form
- **Steps:**
  1. Add first employee: "Employee1 Test"
  2. Save and verify creation
  3. Click "Add Employee" tab
  4. Add second employee: "Employee2 Test"
  5. Save and verify creation
  6. Navigate to Employee List
- **Expected Result:** Both employees appear in the system with correct count increment

### BT-3: Add Employee at Browser Viewport Boundary
**Objective:** Verify form functionality with different screen sizes
- **Precondition:** Browser viewport at minimum width (320px - mobile)
- **Steps:**
  1. Navigate to Add Employee form
  2. Enter employee details
  3. Click Save button
- **Expected Result:** Form is responsive, all fields accessible, save works correctly

### BT-4: Add Employee with Autofill Data
**Objective:** Verify form clears autofill data appropriately
- **Precondition:** Browser autofill is enabled, previous form data exists
- **Steps:**
  1. Navigate to Add Employee form
  2. Form auto-fills with previously entered data
  3. Clear first name and enter new value: "NewName"
  4. Click Save button
- **Expected Result:** Employee created with new name, autofilled data not used

### BT-5: Cancel Button Functionality
**Objective:** Verify cancel button works correctly
- **Precondition:** User is on Add Employee form with some data entered
- **Steps:**
  1. Enter First Name: "Test"
  2. Enter Last Name: "Employee"
  3. Click Cancel button
- **Expected Result:** Form data discarded, redirected to Employee List, new employee not created

---

## 5. DATA VALIDATION SCENARIOS

### DV-1: SQL Injection Attempt in First Name
**Objective:** Verify input sanitization
- **Precondition:** User is logged in and on Add Employee form
- **Steps:**
  1. Enter First Name: "John'; DROP TABLE employees;--"
  2. Enter Last Name: "Smith"
  3. Click Save button
- **Expected Result:** Employee created with malicious string as literal name (safely escaped), no database damage

### DV-2: HTML/Script Injection in Name
**Objective:** Verify HTML/script tag stripping
- **Precondition:** User is logged in and on Add Employee form
- **Steps:**
  1. Enter First Name: "<script>alert('XSS')</script>"
  2. Enter Last Name: "Smith"
  3. Click Save button
- **Expected Result:** Employee created with HTML tags escaped/stripped, no script execution

### DV-3: Special Unicode Characters in Name
**Objective:** Verify Unicode character support
- **Precondition:** User is logged in and on Add Employee form
- **Steps:**
  1. Enter First Name: "José"
  2. Enter Last Name: "Müller"
  3. Click Save button
- **Expected Result:** Employee created with Unicode characters preserved correctly

### DV-4: Right-to-Left Text Support
**Objective:** Verify RTL language support (Arabic, Hebrew)
- **Precondition:** User is logged in and on Add Employee form
- **Steps:**
  1. Enter First Name: "محمد" (Arabic for Muhammad)
  2. Enter Last Name: "علي" (Arabic for Ali)
  3. Click Save button
- **Expected Result:** Employee created with RTL text displayed correctly

### DV-5: Password with Special Characters
**Objective:** Verify password field accepts special characters
- **Precondition:** User is logged in and on Add Employee form
- **Steps:**
  1. Enter First Name: "John"
  2. Enter Last Name: "Smith"
  3. Enable "Create Login Details" toggle
  4. Enter Username: "johnsmith"
  5. Enter Password: "P@$$w0rd!#%&*"
  6. Confirm Password: "P@$$w0rd!#%&*"
  7. Click Save button
- **Expected Result:** Employee created successfully with special character password

---

## 6. USABILITY & WORKFLOW SCENARIOS

### UW-1: Form Navigation After Employee Creation
**Objective:** Verify navigation to employee profile after save
- **Precondition:** User submits Add Employee form
- **Steps:**
  1. Add employee with required fields
  2. Click Save button
- **Expected Result:** Redirected to employee's personal details page with editable form

### UW-2: Add Another Employee After Completion
**Objective:** Verify quick "Add Another" workflow option
- **Precondition:** Employee created successfully, user on personal details page
- **Steps:**
  1. Look for "Add Another" button or link
  2. If available, click it
- **Expected Result:** Redirected back to blank Add Employee form (OR verify standard flow requires manual navigation)

### UW-3: Form Validation Before Submit
**Objective:** Verify real-time validation feedback
- **Precondition:** User is on Add Employee form
- **Steps:**
  1. Click Save button with empty fields
  2. Observe error messages
  3. Fill First Name field
  4. Verify error for First Name clears
  5. Leave Last Name empty
  6. Observe error still present for Last Name
- **Expected Result:** Real-time validation feedback provided for each field

### UW-4: Employee ID Manual Entry
**Objective:** Verify ability to override auto-generated ID
- **Precondition:** User is on Add Employee form
- **Steps:**
  1. Clear auto-generated Employee ID field
  2. Enter custom ID: "EMP-12345"
  3. Enter required name fields
  4. Click Save button
- **Expected Result:** Employee created with custom ID OR validation error if format invalid

### UW-5: Create Login Details Toggle Impact
**Objective:** Verify form fields conditional display
- **Precondition:** User is on Add Employee form
- **Steps:**
  1. Observe "Create Login Details" toggle is OFF
  2. Username and Password fields should be hidden
  3. Toggle to ON
  4. Username and Password fields should appear
  5. Toggle back to OFF
  6. Fields should disappear
- **Expected Result:** Form fields appear/disappear correctly based on toggle state

---

## 7. PERFORMANCE & STRESS SCENARIOS

### PS-1: Add Employee with Network Latency
**Objective:** Verify form behavior with slow network
- **Precondition:** Network throttled to slow 3G speed
- **Steps:**
  1. Navigate to Add Employee form
  2. Enter employee details
  3. Click Save button
  4. Monitor response time
- **Expected Result:** Form submits successfully, appropriate loading indicator displayed, no timeout

### PS-2: Simultaneous Form Submission (If Possible)
**Objective:** Verify system prevents double submission
- **Precondition:** User on Add Employee form
- **Steps:**
  1. Fill employee details
  2. Click Save button multiple times rapidly
  3. Monitor form behavior
- **Expected Result:** Only one employee record created, duplicate submit prevented

### PS-3: Form Responsiveness with Large Employee Database
**Objective:** Verify form loads quickly with 519+ employees in system
- **Precondition:** Employee database contains 519+ records
- **Steps:**
  1. Navigate to Add Employee form
  2. Measure page load time
  3. Enter details and submit
  4. Measure save response time
- **Expected Result:** Form loads in < 2 seconds, save completes in < 5 seconds

---

## 8. INTEGRATION SCENARIOS

### INT-1: Verify Employee Appears in Global Search
**Objective:** Verify new employee searchable system-wide
- **Precondition:** Employee "John Smith" created with ID 0558
- **Steps:**
  1. Navigate to main search/global search
  2. Search for "John Smith" or "0558"
  3. Verify employee appears in results
- **Expected Result:** Employee found in global search results

### INT-2: Verify Employee Accessible via PIM Module
**Objective:** Verify employee appears in PIM employee list
- **Precondition:** Employee "John Smith" created
- **Steps:**
  1. Navigate to PIM Module
  2. Go to Employee List
  3. Search or filter for "John Smith"
  4. Click on employee record
- **Expected Result:** Employee details page opens with correct information

### INT-3: Verify Login Details Function
**Objective:** Verify created login credentials work
- **Precondition:** Employee "Jane Doe" created with login username "janedoe" and password "Test@1234"
- **Steps:**
  1. Logout from admin account
  2. Navigate to login page
  3. Enter username: "janedoe"
  4. Enter password: "Test@1234"
  5. Click Login
- **Expected Result:** Successfully logged in as employee, redirected to employee dashboard

### INT-4: Verify Employee Photo in Multiple Locations
**Objective:** Verify uploaded photo displays everywhere
- **Precondition:** Employee "John Smith" created with photo
- **Steps:**
  1. View employee in Personal Details page
  2. View employee in Employee List
  3. View employee in Directory
  4. View employee in employee profile/card
- **Expected Result:** Photo displays consistently in all locations

---

## 9. REGRESSION TEST SCENARIOS

### REG-1: Standard Add Employee Workflow (Regression)
**Objective:** Ensure core functionality remains intact
- **Precondition:** User logged in
- **Steps:**
  1. Navigate to PIM → Add Employee
  2. Enter: First Name: "John", Last Name: "Smith"
  3. Click Save
  4. Verify redirect to personal details page
  5. Navigate to Employee List
  6. Verify new employee in list
- **Expected Result:** All steps complete successfully, employee appears in system

### REG-2: Employee Count Accuracy (Regression)
**Objective:** Verify employee counter is accurate
- **Precondition:** Previous employee count is 519
- **Steps:**
  1. Record current employee count
  2. Add new employee
  3. Navigate to Employee List
  4. Verify new count is previous count + 1
- **Expected Result:** Count increments correctly (519 → 520)

### REG-3: Cancel Button Doesn't Save (Regression)
**Objective:** Verify cancel button discard functionality
- **Precondition:** User on Add Employee form
- **Steps:**
  1. Enter: First Name: "TestCancel", Last Name: "Employee"
  2. Click Cancel button
  3. Navigate to Employee List
  4. Search for "TestCancel"
- **Expected Result:** Employee not found, record not created

---

## 10. ACCESSIBILITY & COMPLIANCE SCENARIOS

### ACC-1: Form Keyboard Navigation
**Objective:** Verify form usable with keyboard only
- **Precondition:** User on Add Employee form
- **Steps:**
  1. Use Tab key to navigate through form fields
  2. Fill fields using keyboard only (no mouse)
  3. Use Enter to submit form (or Tab to Save button then Enter)
- **Expected Result:** All fields accessible via Tab, form submittable via keyboard

### ACC-2: Form Labels and Accessibility
**Objective:** Verify form labels correctly associated with fields
- **Precondition:** User on Add Employee form
- **Steps:**
  1. Inspect form with accessibility tools
  2. Verify each input has associated label
  3. Verify required fields marked as required
  4. Check for ARIA attributes
- **Expected Result:** Proper labels, required markers, ARIA attributes present

### ACC-3: Error Message Accessibility
**Objective:** Verify error messages announced to screen readers
- **Precondition:** Form submitted with errors
- **Steps:**
  1. Submit form with missing required fields
  2. Check if errors announced by screen reader
  3. Verify error messages linked to form fields
- **Expected Result:** Error messages properly announced and associated with fields

### ACC-4: Color Contrast in Form
**Objective:** Verify sufficient color contrast
- **Precondition:** User viewing Add Employee form
- **Steps:**
  1. Check labels vs background contrast ratio
  2. Check error messages vs background contrast ratio
  3. Check button text vs button background contrast ratio
- **Expected Result:** All text meets WCAG AA standard (4.5:1 for text)

---

## Summary

| Category | Test Count | Coverage |
|----------|-----------|----------|
| Positive Scenarios | 5 | Happy path, special characters, variations |
| Negative Scenarios | 10 | Required fields, validation, constraints |
| Edge Cases | 10 | Boundary values, length limits, special input |
| Boundary Tests | 5 | System limits, multiple operations |
| Data Validation | 5 | Security, encoding, internationalization |
| Usability/Workflow | 5 | Navigation, real-time validation, conditionals |
| Performance/Stress | 3 | Network, concurrent operations, scale |
| Integration | 4 | Cross-module functionality |
| Regression | 3 | Core functionality consistency |
| Accessibility | 4 | Keyboard, screen readers, compliance |
| **TOTAL** | **54** | **Comprehensive coverage** |

---

## Test Execution Notes

- All scenarios should be executed in Chrome, Firefox, Safari, and Edge browsers
- Test on multiple screen sizes: Desktop (1920x1080), Tablet (768x1024), Mobile (375x667)
- Verify database state before and after each test execution
- Document any variations in behavior across browsers
- Include screenshot evidence for all test results
