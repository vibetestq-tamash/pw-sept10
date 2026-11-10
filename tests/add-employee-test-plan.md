# Add Employee Functionality - Comprehensive Test Plan

## Application Overview

This test plan covers comprehensive testing of the Add Employee functionality in the OrangeHRM application. The Add Employee feature allows HR administrators to create new employee profiles with personal information, employee ID assignment, and optional login credential generation. The plan includes positive scenarios, negative scenarios, edge cases, and boundary condition testing.

## Test Scenarios

### 1. Add Employee - Happy Path Scenarios

**Seed:** `tests/seed.spec.ts`

#### 1.1. Successfully add employee with required fields only

**File:** `tests/add-employee/happy-path/add-employee-required-fields.spec.ts`

**Steps:**
  1. Navigate to PIM module
    - expect: PIM module page loads successfully
  2. Click on Add Employee link
    - expect: Add Employee form is displayed
  3. Enter first name in the First Name field
    - expect: First name is entered successfully
  4. Enter middle name in the Middle Name field
    - expect: Middle name is entered successfully
  5. Enter last name in the Last Name field
    - expect: Last name is entered successfully
  6. Verify Employee ID is auto-populated
    - expect: Employee ID field contains a valid ID
  7. Click Save button
    - expect: Employee is saved successfully
    - expect: Success message is displayed: 'Successfully Saved'
    - expect: Employee can be viewed in the employee list
    - expect: Employee record contains the entered name

#### 1.2. Add employee with profile picture

**File:** `tests/add-employee/happy-path/add-employee-with-profile-picture.spec.ts`

**Steps:**
  1. Navigate to PIM module and click Add Employee
    - expect: Add Employee form is displayed
  2. Click 'Choose File' button to upload a profile picture
    - expect: File upload dialog appears
  3. Select a valid image file (jpg, png, gif up to 1MB, 200px x 200px recommended)
    - expect: File is selected
  4. Verify image is displayed in the profile picture preview
    - expect: Image preview shows the uploaded file
  5. Enter First Name, Middle Name, and Last Name
    - expect: Employee names are entered
  6. Click Save button
    - expect: Employee is saved successfully
    - expect: Profile picture is stored and displayed
    - expect: Success notification appears

#### 1.3. Add employee with login credentials

**File:** `tests/add-employee/happy-path/add-employee-with-login-credentials.spec.ts`

**Steps:**
  1. Navigate to Add Employee form
    - expect: Add Employee form loads
  2. Enter First Name, Middle Name, and Last Name
    - expect: Employee names are entered
  3. Check the 'Create Login Details' checkbox
    - expect: Checkbox is checked
  4. Verify that additional login credential fields appear
    - expect: Login fields become visible
  5. Enter login username and password
    - expect: Credentials are entered
  6. Click Save button
    - expect: Employee is saved successfully
    - expect: Login credentials are configured
    - expect: User can log in with the created credentials

#### 1.4. Employee ID is auto-generated correctly

**File:** `tests/add-employee/happy-path/employee-id-auto-generation.spec.ts`

**Steps:**
  1. Navigate to Add Employee form
    - expect: Form is displayed
  2. Observe the Employee ID field
    - expect: Employee ID field is visible and populated
  3. Verify that Employee ID is pre-populated with a sequential number
    - expect: ID is a valid number and increments from previous employee
  4. Enter employee name details
    - expect: Names are entered
  5. Click Save button
    - expect: Employee ID is auto-generated and increments sequentially
    - expect: Employee is saved with the assigned ID
    - expect: ID remains unchanged after save

### 2. Add Employee - Field Validation Scenarios

**Seed:** `tests/seed.spec.ts`

#### 2.1. Validation error when First Name is empty

**File:** `tests/add-employee/validation/first-name-required.spec.ts`

**Steps:**
  1. Navigate to Add Employee form
    - expect: Form is displayed
  2. Leave First Name field empty
    - expect: Field remains empty
  3. Enter Middle Name and Last Name
    - expect: Fields are populated
  4. Click Save button
    - expect: Validation error message appears indicating First Name is required
    - expect: Employee is not saved
    - expect: Form remains on the same page

#### 2.2. Validation error when Last Name is empty

**File:** `tests/add-employee/validation/last-name-required.spec.ts`

**Steps:**
  1. Navigate to Add Employee form
    - expect: Form is displayed
  2. Enter First Name and Middle Name
    - expect: Fields are populated
  3. Leave Last Name field empty
    - expect: Field remains empty
  4. Click Save button
    - expect: Validation error message appears indicating Last Name is required
    - expect: Employee is not saved

#### 2.3. Middle Name is optional

**File:** `tests/add-employee/validation/middle-name-optional.spec.ts`

**Steps:**
  1. Navigate to Add Employee form
    - expect: Form is displayed
  2. Enter First Name and Last Name
    - expect: Fields are populated
  3. Leave Middle Name field empty
    - expect: Field remains empty
  4. Click Save button
    - expect: Employee is saved successfully without middle name
    - expect: Success message is displayed

#### 2.4. Validation error when all name fields are empty

**File:** `tests/add-employee/validation/all-fields-empty.spec.ts`

**Steps:**
  1. Navigate to Add Employee form
    - expect: Form is displayed
  2. Leave all name fields (First, Middle, Last) empty
    - expect: Fields remain empty
  3. Click Save button
    - expect: Validation error messages appear for empty required fields
    - expect: Employee is not saved

### 3. Add Employee - Input Data Scenarios

**Seed:** `tests/seed.spec.ts`

#### 3.1. Add employee with special characters in name

**File:** `tests/add-employee/input-data/special-characters-in-name.spec.ts`

**Steps:**
  1. Navigate to Add Employee form
    - expect: Form is displayed
  2. Enter First Name with special characters (e.g., 'Jean-Pierre')
    - expect: Special characters are accepted
  3. Enter Last Name with special characters (e.g., 'O'Brien')
    - expect: Special characters are accepted
  4. Click Save button
    - expect: Employee is saved successfully with special characters
    - expect: Special characters are preserved in the employee name
    - expect: Employee appears in the employee list with correct name formatting

#### 3.2. Add employee with very long name

**File:** `tests/add-employee/input-data/long-name-input.spec.ts`

**Steps:**
  1. Navigate to Add Employee form
    - expect: Form is displayed
  2. Enter very long First Name (50+ characters)
    - expect: System accepts long input
  3. Enter very long Last Name (50+ characters)
    - expect: System accepts long input
  4. Click Save button
    - expect: Employee is saved successfully
    - expect: Long names are handled correctly
    - expect: Names are displayed properly without truncation or corruption

#### 3.3. Add employee with numeric values in name

**File:** `tests/add-employee/input-data/numeric-in-name.spec.ts`

**Steps:**
  1. Navigate to Add Employee form
    - expect: Form is displayed
  2. Enter First Name with numeric characters (e.g., 'John123')
    - expect: Numeric characters are accepted
  3. Enter Last Name with numeric characters
    - expect: Numeric characters are accepted
  4. Click Save button
    - expect: Employee is saved with numeric characters in name
    - expect: System accepts names with numbers

#### 3.4. Add employee with leading and trailing spaces

**File:** `tests/add-employee/input-data/spaces-in-name.spec.ts`

**Steps:**
  1. Navigate to Add Employee form
    - expect: Form is displayed
  2. Enter First Name with leading spaces (e.g., '  John')
    - expect: Spaces are entered
  3. Enter Last Name with trailing spaces (e.g., 'Doe  ')
    - expect: Spaces are entered
  4. Click Save button
    - expect: Employee is saved successfully
    - expect: Leading/trailing spaces are trimmed or handled appropriately

#### 3.5. Add employee with Unicode characters

**File:** `tests/add-employee/input-data/unicode-characters.spec.ts`

**Steps:**
  1. Navigate to Add Employee form
    - expect: Form is displayed
  2. Enter First Name with Unicode characters (e.g., 'François')
    - expect: Unicode characters are accepted
  3. Enter Last Name with Unicode characters (e.g., 'Müller')
    - expect: Unicode characters are accepted
  4. Click Save button
    - expect: Employee is saved with Unicode characters preserved
    - expect: Employee name displays correctly in UTF-8 encoding

### 4. Add Employee - Image Upload Scenarios

**Seed:** `tests/seed.spec.ts`

#### 4.1. Upload image within size and dimension constraints

**File:** `tests/add-employee/image-upload/valid-image-upload.spec.ts`

**Steps:**
  1. Navigate to Add Employee form
    - expect: Form is displayed
  2. Click Choose File button
    - expect: File dialog appears
  3. Select valid image (JPG, PNG, or GIF format, under 1MB, 200x200px)
    - expect: File is selected
  4. Verify image preview updates
    - expect: Preview shows the image
  5. Enter employee name details
    - expect: Names are entered
  6. Click Save button
    - expect: Image is uploaded successfully
    - expect: Image preview is displayed correctly
    - expect: Employee is saved with the image

#### 4.2. Image upload rejected for unsupported format

**File:** `tests/add-employee/image-upload/unsupported-format.spec.ts`

**Steps:**
  1. Navigate to Add Employee form
    - expect: Form is displayed
  2. Click Choose File button
    - expect: File dialog appears
  3. Select an unsupported image format (e.g., BMP, TIFF, SVG)
    - expect: File is selected
  4. -
    - expect: File is rejected or error message appears
    - expect: Unsupported format is not uploaded

#### 4.3. Image upload rejected when file exceeds 1MB

**File:** `tests/add-employee/image-upload/oversized-image.spec.ts`

**Steps:**
  1. Navigate to Add Employee form
    - expect: Form is displayed
  2. Click Choose File button
    - expect: File dialog appears
  3. Select an image file larger than 1MB
    - expect: File is rejected with error message indicating size limit
    - expect: Error message specifies the 1MB limit

#### 4.4. Clear uploaded image

**File:** `tests/add-employee/image-upload/clear-image.spec.ts`

**Steps:**
  1. Navigate to Add Employee form
    - expect: Form is displayed
  2. Upload a valid profile image
    - expect: Image is uploaded
  3. Verify image is displayed in preview
    - expect: Preview shows the image
  4. Click the X or remove button next to the image
    - expect: Image removal button is clicked
  5. Click Save button
    - expect: Image is removed from preview
    - expect: Employee is saved without a profile picture
    - expect: Default profile picture is used

#### 4.5. Change uploaded image

**File:** `tests/add-employee/image-upload/change-image.spec.ts`

**Steps:**
  1. Navigate to Add Employee form
    - expect: Form is displayed
  2. Upload first profile image
    - expect: First image is uploaded
  3. Click Choose File again to upload a different image
    - expect: File dialog appears again
  4. Select and upload a second image
    - expect: Second image is selected
  5. -
    - expect: Previous image is replaced with new image
    - expect: Only the latest image is shown in preview

### 5. Add Employee - Login Credentials Scenarios

**Seed:** `tests/seed.spec.ts`

#### 5.1. Create login details for new employee

**File:** `tests/add-employee/login-credentials/create-login-details.spec.ts`

**Steps:**
  1. Navigate to Add Employee form
    - expect: Form is displayed
  2. Enter employee name details
    - expect: Names are entered
  3. Check 'Create Login Details' checkbox
    - expect: Checkbox is checked
  4. Verify login detail fields appear (Username, Password, etc.)
    - expect: Login fields are visible
  5. Enter valid username and password
    - expect: Credentials are entered
  6. Click Save button
    - expect: Employee is saved with login credentials
    - expect: Login credentials are configured in the system
    - expect: Employee can access the system with created credentials

#### 5.2. Skip login detail creation

**File:** `tests/add-employee/login-credentials/skip-login-details.spec.ts`

**Steps:**
  1. Navigate to Add Employee form
    - expect: Form is displayed
  2. Enter employee name details
    - expect: Names are entered
  3. Leave 'Create Login Details' checkbox unchecked
    - expect: Checkbox remains unchecked
  4. Click Save button
    - expect: Employee is saved successfully without login details
    - expect: Employee record is created without system access credentials

#### 5.3. Username validation - empty username

**File:** `tests/add-employee/login-credentials/empty-username.spec.ts`

**Steps:**
  1. Navigate to Add Employee form
    - expect: Form is displayed
  2. Check 'Create Login Details' checkbox
    - expect: Login fields appear
  3. Leave username field empty
    - expect: Field remains empty
  4. Enter password
    - expect: Password is entered
  5. Click Save button
    - expect: Validation error for empty username
    - expect: Employee is not saved with incomplete login details

#### 5.4. Password validation - empty password

**File:** `tests/add-employee/login-credentials/empty-password.spec.ts`

**Steps:**
  1. Navigate to Add Employee form
    - expect: Form is displayed
  2. Check 'Create Login Details' checkbox
    - expect: Login fields appear
  3. Enter username
    - expect: Username is entered
  4. Leave password field empty
    - expect: Field remains empty
  5. Click Save button
    - expect: Validation error for empty password
    - expect: Employee is not saved

#### 5.5. Duplicate username prevention

**File:** `tests/add-employee/login-credentials/duplicate-username.spec.ts`

**Steps:**
  1. Navigate to Add Employee form
    - expect: Form is displayed
  2. Check 'Create Login Details' checkbox
    - expect: Login fields appear
  3. Enter an already existing username
    - expect: Username is entered
  4. Enter password
    - expect: Password is entered
  5. Click Save button
    - expect: Validation error indicating username already exists
    - expect: Employee is not saved
    - expect: User is prompted to use a different username

### 6. Add Employee - Form Navigation and Cancellation

**Seed:** `tests/seed.spec.ts`

#### 6.1. Cancel employee creation

**File:** `tests/add-employee/navigation/cancel-creation.spec.ts`

**Steps:**
  1. Navigate to Add Employee form
    - expect: Form is displayed
  2. Enter some employee information
    - expect: Information is entered
  3. Click Cancel button
    - expect: Form is closed
    - expect: Employee is not saved
    - expect: User is redirected to employee list

#### 6.2. Cancel with unsaved changes confirmation

**File:** `tests/add-employee/navigation/cancel-unsaved-changes.spec.ts`

**Steps:**
  1. Navigate to Add Employee form
    - expect: Form is displayed
  2. Enter employee information
    - expect: Information is entered
  3. Click Cancel button
    - expect: Confirmation dialog appears asking to confirm cancellation
    - expect: User can confirm or continue editing

#### 6.3. Navigate away from Add Employee page

**File:** `tests/add-employee/navigation/navigate-away.spec.ts`

**Steps:**
  1. Navigate to Add Employee form
    - expect: Form is displayed
  2. Enter employee information
    - expect: Information is entered
  3. Click on another menu item or navigate away
    - expect: Navigation is initiated
  4. -
    - expect: Warning dialog appears about unsaved changes
    - expect: User can proceed with navigation or stay on form

#### 6.4. Back button behavior

**File:** `tests/add-employee/navigation/back-button.spec.ts`

**Steps:**
  1. Navigate to Add Employee form
    - expect: Form is displayed
  2. Enter some information
    - expect: Information is entered
  3. Click browser back button
    - expect: Navigation may show confirmation dialog
    - expect: User returns to previous page

### 7. Add Employee - Edge Cases and Boundary Conditions

**Seed:** `tests/seed.spec.ts`

#### 7.1. Employee ID auto-generation at boundary

**File:** `tests/add-employee/edge-cases/employee-id-boundary.spec.ts`

**Steps:**
  1. Add multiple employees in succession
    - expect: Employees are added
  2. Observe the auto-generated Employee IDs
    - expect: IDs are visible in the form
  3. Verify that IDs continue to increment correctly
    - expect: Employee IDs are unique and sequential
    - expect: No ID conflicts occur

#### 7.2. Add employee with only spaces in name

**File:** `tests/add-employee/edge-cases/only-spaces-name.spec.ts`

**Steps:**
  1. Navigate to Add Employee form
    - expect: Form is displayed
  2. Enter only spaces in First Name field (e.g., '     ')
    - expect: Spaces are entered
  3. Click Save button
    - expect: Validation error appears
    - expect: Employee is not saved
    - expect: System treats spaces-only input as invalid

#### 7.3. Rapid successive employee additions

**File:** `tests/add-employee/edge-cases/rapid-additions.spec.ts`

**Steps:**
  1. Add first employee with valid data
    - expect: First employee is saved
  2. Immediately add second employee
    - expect: Second employee is saved
  3. Add third employee in quick succession
    - expect: Third employee is saved
  4. -
    - expect: All employees are saved successfully
    - expect: No data loss or conflicts occur
    - expect: Employee IDs are unique for all additions

#### 7.4. Save button multiple clicks

**File:** `tests/add-employee/edge-cases/multiple-save-clicks.spec.ts`

**Steps:**
  1. Navigate to Add Employee form
    - expect: Form is displayed
  2. Enter valid employee information
    - expect: Information is entered
  3. Click Save button multiple times rapidly
    - expect: Button is clicked multiple times
  4. -
    - expect: Only one employee record is created
    - expect: No duplicate entries are saved
    - expect: System handles multiple clicks gracefully

#### 7.5. Form field tab navigation

**File:** `tests/add-employee/edge-cases/tab-navigation.spec.ts`

**Steps:**
  1. Navigate to Add Employee form
    - expect: Form is displayed
  2. Tab through all form fields in sequence
    - expect: Tab key works
  3. Verify tab order is logical and correct
    - expect: Tab order follows the form layout
    - expect: All interactive elements are accessible via Tab key

### 8. Add Employee - Data Persistence and Verification

**Seed:** `tests/seed.spec.ts`

#### 8.1. Verify employee appears in employee list after creation

**File:** `tests/add-employee/data-persistence/employee-in-list.spec.ts`

**Steps:**
  1. Add a new employee with specific first and last name
    - expect: Employee is added
  2. Navigate to Employee List
    - expect: Employee List page loads
  3. Search or scroll for the newly created employee
    - expect: Employee appears in the list
    - expect: Employee name matches entered data
    - expect: Employee ID is correct

#### 8.2. Verify employee data is persisted in database

**File:** `tests/add-employee/data-persistence/data-persistence.spec.ts`

**Steps:**
  1. Add a new employee
    - expect: Employee is added
  2. Logout from the application
    - expect: User is logged out
  3. Log back in with same or different account
    - expect: User is logged in
  4. Navigate to Employee List and search for the added employee
    - expect: Employee data is still present
    - expect: No data loss occurs after logout/login

#### 8.3. View employee details after creation

**File:** `tests/add-employee/data-persistence/view-employee-details.spec.ts`

**Steps:**
  1. Add a new employee with all available details
    - expect: Employee is added
  2. Click on the employee record to view details
    - expect: Employee details page opens
  3. Verify all entered information is displayed correctly
    - expect: All employee information is retrievable
    - expect: Data format is preserved
    - expect: No data corruption occurs

#### 8.4. Edit employee after creation

**File:** `tests/add-employee/data-persistence/edit-employee.spec.ts`

**Steps:**
  1. Add a new employee
    - expect: Employee is added
  2. Navigate to Employee List
    - expect: Employee List page loads
  3. Click to edit the newly created employee
    - expect: Edit form opens
  4. Modify some details
    - expect: Details are modified
  5. Save the changes
    - expect: Employee details can be edited after creation
    - expect: Changes are saved successfully

### 9. Add Employee - Error Handling and Recovery

**Seed:** `tests/seed.spec.ts`

#### 9.1. Recover from network error during save

**File:** `tests/add-employee/error-handling/network-error-recovery.spec.ts`

**Steps:**
  1. Navigate to Add Employee form
    - expect: Form is displayed
  2. Enter valid employee information
    - expect: Information is entered
  3. Simulate network error or disconnect
    - expect: Network error is simulated
  4. Click Save button
    - expect: Error message is displayed
    - expect: Form retains entered data
    - expect: User can retry save after connection is restored

#### 9.2. Handle server error response

**File:** `tests/add-employee/error-handling/server-error.spec.ts`

**Steps:**
  1. Navigate to Add Employee form
    - expect: Form is displayed
  2. Enter valid employee information
    - expect: Information is entered
  3. Server returns error response (500, timeout, etc.)
    - expect: Error is simulated
  4. Click Save button
    - expect: User-friendly error message is displayed
    - expect: Employee is not saved
    - expect: Form is usable for retry

#### 9.3. Session timeout during form interaction

**File:** `tests/add-employee/error-handling/session-timeout.spec.ts`

**Steps:**
  1. Navigate to Add Employee form
    - expect: Form is displayed
  2. Wait for session to timeout
    - expect: Session times out
  3. Attempt to save employee
    - expect: Session timeout is detected
    - expect: User is redirected to login page
    - expect: User can log back in and retry
