// spec: tests/add-employee-test-plan.md
// seed: tests/19POMTestWithBaseAppDDT.spec.ts

import { test } from "../../../fixtures/appbase";
import { appUrl } from "../../../testdata/app";
import { errorHandling, messages } from "../../../testdata/add-employee-error-happy.json";

test.describe('Add Employee - Error Handling', () => {
  test.beforeEach(async ({ App, testData }) => {
    await App.basePage.navigateTo(appUrl);
    await App.loginPage.verifyLoginPageDisplayed();
    await App.loginPage.enterUserName(testData.username);
    await App.loginPage.enterPassword(testData.password);
    await App.loginPage.clickOnLogin();
    await App.dashboardPage.VerifyDashboardDisplayed();
  });

  test('Handle server error during employee creation', async ({ App }) => {
    const data = errorHandling.serverErrorDuringSave;

    // Step 1: Navigate to Add Employee page
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Simulate a server error by aborting API POST requests
    await App.addEmployeePage.blockApiPostRequests();

    // Step 3: Fill employee details and save
    await App.addEmployeePage.enterFirstName(data.firstName);
    await App.addEmployeePage.enterLastName(data.lastName);
    await App.addEmployeePage.enterUniqueEmployeeId();
    await App.addEmployeePage.clickOnSaveButton();

    // Step 4: Verify the form stays on screen and keeps the entered data
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();
    await App.addEmployeePage.verifyFirstNameValue(data.firstName);

    // Step 5: Remove the API mock
    await App.addEmployeePage.unblockApiRequests();
  });
});

test.describe('Add Employee - Error Handling and Recovery', () => {
  test.beforeEach(async ({ App, testData }) => {
    await App.basePage.navigateTo(appUrl);
    await App.loginPage.verifyLoginPageDisplayed();
    await App.loginPage.enterUserName(testData.username);
    await App.loginPage.enterPassword(testData.password);
    await App.loginPage.clickOnLogin();
    await App.dashboardPage.VerifyDashboardDisplayed();
  });

  test('Handle server error response', async ({ App }) => {
    const data = errorHandling.serverErrorRecovery;

    // Step 1: Navigate to Add Employee form
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Simulate a server error by aborting API POST requests
    await App.addEmployeePage.blockApiPostRequests();

    // Step 3: Fill employee details and attempt to save (will fail)
    await App.addEmployeePage.enterFirstName(data.firstName);
    await App.addEmployeePage.enterLastName(data.lastName);
    await App.addEmployeePage.clickOnSaveButton();

    // Step 4: Verify the form remains usable after the error
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();
    await App.addEmployeePage.verifyFirstNameValue(data.firstName);

    // Step 5: Remove the API mock and retry the save
    await App.addEmployeePage.unblockApiRequests();
    await App.addEmployeePage.clickOnSaveButton();

    // Step 6: Verify eventual success
    await App.addEmployeePage.verifyExpectedMessageDisplayed(messages.successSaved);
  });
});
