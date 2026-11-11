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

  test('Employee ID is auto-generated correctly', async ({ App }) => {
    // Step 1: Navigate to Add Employee page
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Verify the auto-generated Employee Id is numeric and capture it
    await App.addEmployeePage.verifyEmployeeIdIsNumeric();
    const firstEmployeeId = (await App.addEmployeePage.getEmployeeIdValue()) ?? '';

    // Step 3: Fill the name fields and save the first employee
    await App.addEmployeePage.enterFirstName(happyPath.requiredFieldsOnly.firstName);
    await App.addEmployeePage.enterLastName(happyPath.requiredFieldsOnly.lastName);
    await App.addEmployeePage.clickOnSaveButton();
    await App.addEmployeePage.verifyExpectedMessageDisplayed(messages.successSaved);
    await App.personalDetailsPage.VerifyPersonalDetailsDisplayed();

    // Step 4: Navigate back to Add Employee for a second employee
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 5: Verify the new Employee Id is numeric and incremented from the first one
    await App.addEmployeePage.verifyEmployeeIdIsNumeric();
    await App.addEmployeePage.verifyEmployeeIdGreaterThan(firstEmployeeId);
  });
});
