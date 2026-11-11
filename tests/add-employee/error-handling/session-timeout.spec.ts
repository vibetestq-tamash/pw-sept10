// spec: tests/add-employee-test-plan.md
// seed: tests/19POMTestWithBaseAppDDT.spec.ts

import { test } from "../../../fixtures/appbase";
import { appUrl } from "../../../testdata/app";
import { errorHandling } from "../../../testdata/add-employee-error-happy.json";

test.describe('Add Employee - Error Handling', () => {
  test.beforeEach(async ({ App, testData }) => {
    await App.basePage.navigateTo(appUrl);
    await App.loginPage.verifyLoginPageDisplayed();
    await App.loginPage.enterUserName(testData.username);
    await App.loginPage.enterPassword(testData.password);
    await App.loginPage.clickOnLogin();
    await App.dashboardPage.VerifyDashboardDisplayed();
  });

  test('Handle session timeout during employee creation', async ({ App }) => {
    const data = errorHandling.sessionTimeoutDuringSave;

    // Step 1: Navigate to Add Employee page
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Fill employee details
    await App.addEmployeePage.enterFirstName(data.firstName);
    await App.addEmployeePage.enterLastName(data.lastName);
    await App.addEmployeePage.enterUniqueEmployeeId();

    // Step 3: Simulate session expiry by clearing the session cookies
    await App.addEmployeePage.clearSessionCookies();

    // Step 4: Save and verify the session timeout is handled (login page shown)
    await App.addEmployeePage.clickOnSaveButton();
    await App.addEmployeePage.verifySessionTimeoutHandled();
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

  test('Session timeout during form interaction', async ({ App, testData }) => {
    const data = errorHandling.sessionTimeoutDuringFormInteraction;

    // Step 1: Navigate to Add Employee form
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Fill the form
    await App.addEmployeePage.enterFirstName(data.firstName);
    await App.addEmployeePage.enterLastName(data.lastName);

    // Step 3: Simulate session expiry by clearing the session cookies
    await App.addEmployeePage.clearSessionCookies();

    // Step 4: Save and verify the session timeout is handled (login page shown)
    await App.addEmployeePage.clickOnSaveButton();
    await App.addEmployeePage.verifySessionTimeoutHandled();

    // Step 5: Re-login and verify the dashboard is shown
    await App.loginPage.performLogin(testData.username, testData.password);
    await App.dashboardPage.VerifyDashboardDisplayed();
  });
});
