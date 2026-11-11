// spec: tests/add-employee-test-plan.md
// seed: tests/19POMTestWithBaseAppDDT.spec.ts

import { test } from "../../../fixtures/appbase";
import { appUrl } from "../../../testdata/app";
import { happyPath } from "../../../testdata/add-employee.json";
import { messages } from "../../../testdata/add-employee-error-happy.json";

test.describe('Add Employee - Happy Path Scenarios', () => {
  test.beforeEach(async ({ App, testData }) => {
    await App.basePage.navigateTo(appUrl);
    await App.loginPage.verifyLoginPageDisplayed();
    await App.loginPage.enterUserName(testData.username);
    await App.loginPage.enterPassword(testData.password);
    await App.loginPage.clickOnLogin();
    await App.dashboardPage.VerifyDashboardDisplayed();
  });

  test('Successfully add employee with required fields only', async ({ App }) => {
    // Step 1: Navigate to Add Employee page
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Fill required fields and let the Employee Id auto-generate
    await App.addEmployeePage.enterFirstName(happyPath.requiredFieldsOnly.firstName);
    await App.addEmployeePage.enterLastName(happyPath.requiredFieldsOnly.lastName);
    await App.addEmployeePage.enterUniqueEmployeeId();

    // Step 3: Save employee
    await App.addEmployeePage.clickOnSaveButton();
    await App.addEmployeePage.verifyExpectedMessageDisplayed(messages.successSaved);

    // Step 4: Verify the Personal Details page is shown for the new employee
    await App.personalDetailsPage.VerifyPersonalDetailsDisplayed();
  });

  test('Successfully add employee with middle name', async ({ App }) => {
    // Step 1: Navigate to Add Employee page
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Fill employee details including middle name
    await App.addEmployeePage.enterFirstName(happyPath.withMiddleName.firstName);
    await App.addEmployeePage.enterMiddleName(happyPath.withMiddleName.middleName);
    await App.addEmployeePage.enterLastName(happyPath.withMiddleName.lastName);
    await App.addEmployeePage.enterUniqueEmployeeId();

    // Step 3: Save employee
    await App.addEmployeePage.clickOnSaveButton();
    await App.addEmployeePage.verifyExpectedMessageDisplayed(messages.successSaved);

    // Step 4: Verify the Personal Details page is shown for the new employee
    await App.personalDetailsPage.VerifyPersonalDetailsDisplayed();
  });

  test('Employee ID should be auto-generated', async ({ App }) => {
    // Step 1: Navigate to Add Employee page
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Fill only the name fields and let the Employee Id auto-generate
    await App.addEmployeePage.enterFirstName(happyPath.requiredFieldsOnly.firstName);
    await App.addEmployeePage.enterLastName(happyPath.requiredFieldsOnly.lastName);

    // Step 3: Verify the auto-generated Employee Id is numeric
    await App.addEmployeePage.verifyEmployeeIdIsNumeric();

    // Step 4: Save employee
    await App.addEmployeePage.clickOnSaveButton();
    await App.addEmployeePage.verifyExpectedMessageDisplayed(messages.successSaved);

    // Step 5: Verify the Personal Details page is shown for the new employee
    await App.personalDetailsPage.VerifyPersonalDetailsDisplayed();
  });
});
