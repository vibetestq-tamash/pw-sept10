// spec: tests/add-employee-test-plan.md
// seed: tests/19POMTestWithBaseAppDDT.spec.ts

import { test } from "../../../fixtures/appbase";
import { appUrl } from "../../../testdata/app";
import { happyPath, loginDetailsSkipped } from "../../../testdata/add-employee-login-nav.json";

test.describe('Add Employee - Login Credentials', () => {
  test.beforeEach(async ({ App, testData }) => {
    await App.basePage.navigateTo(appUrl);
    await App.loginPage.verifyLoginPageDisplayed();
    await App.loginPage.enterUserName(testData.username);
    await App.loginPage.enterPassword(testData.password);
    await App.loginPage.clickOnLogin();
    await App.dashboardPage.VerifyDashboardDisplayed();
  });

  test('Successfully add employee without login details', async ({ App }) => {
    // Step 1: Navigate to Add Employee page
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Fill employee details only, leave Create Login Details unchecked
    await App.addEmployeePage.enterFirstName(happyPath.requiredFieldsOnly.firstName);
    await App.addEmployeePage.enterLastName(happyPath.requiredFieldsOnly.lastName);
    await App.addEmployeePage.enterUniqueEmployeeId();

    // Step 3: Save employee
    await App.addEmployeePage.clickOnSaveButton();

    // Step 4: Verify employee was created
    await App.personalDetailsPage.VerifyPersonalDetailsDisplayed();
  });

  test('Skip login detail creation', async ({ App }) => {
    // Step 1: Navigate to Add Employee form
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Fill employee details and leave login credentials skipped
    await App.addEmployeePage.enterFirstName(loginDetailsSkipped.firstName);
    await App.addEmployeePage.enterLastName(loginDetailsSkipped.lastName);

    // Step 3: Verify Create Login Details checkbox is unchecked by default
    await App.addEmployeePage.verifyCreateLoginDetailsCheckboxNotChecked();

    // Step 4: Save employee without login details
    await App.addEmployeePage.clickOnSaveButton();

    // Step 5: Verify success message
    await App.addEmployeePage.verifySuccessMessageDisplayed();
  });
});
