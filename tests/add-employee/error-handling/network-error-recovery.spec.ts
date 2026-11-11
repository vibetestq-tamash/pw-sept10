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

  test('Handle network error gracefully during employee creation', async ({ App }) => {
    const data = errorHandling.networkErrorDuringSave;

    // Step 1: Navigate to Add Employee page
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Fill employee details
    await App.addEmployeePage.enterFirstName(data.firstName);
    await App.addEmployeePage.enterLastName(data.lastName);
    await App.addEmployeePage.enterUniqueEmployeeId();

    // Step 3: Go offline and attempt to save
    await App.addEmployeePage.simulateOfflineMode();
    await App.addEmployeePage.clickOnSaveButton();

    // Step 4: Verify the form stays on screen and keeps the entered data
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();
    await App.addEmployeePage.verifyFirstNameValue(data.firstName);

    // Step 5: Restore the network connection
    await App.addEmployeePage.restoreOnlineMode();
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

  test('Recover from network error during save', async ({ App }) => {
    const data = errorHandling.networkErrorRecovery;

    // Step 1: Navigate to Add Employee form
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Fill the form
    await App.addEmployeePage.enterFirstName(data.firstName);
    await App.addEmployeePage.enterLastName(data.lastName);

    // Step 3: Save while offline and verify the form data is retained
    await App.addEmployeePage.simulateOfflineMode();
    await App.addEmployeePage.clickOnSaveButton();
    await App.addEmployeePage.verifyFirstNameValue(data.firstName);

    // Step 4: Restore the connection and retry the save
    await App.addEmployeePage.restoreOnlineMode();
    await App.addEmployeePage.clickOnSaveButton();

    // Step 5: Verify the employee is saved after recovery
    await App.addEmployeePage.verifyExpectedMessageDisplayed(messages.successSaved);
    await App.personalDetailsPage.VerifyPersonalDetailsDisplayed();
  });
});
