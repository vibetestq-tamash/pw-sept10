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

  test('Add employee with login credentials', async ({ App }) => {
    // Step 1: Navigate to Add Employee page
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Enter employee name fields
    await App.addEmployeePage.enterFirstName(happyPath.withLoginDetails.firstName);
    await App.addEmployeePage.enterLastName(happyPath.withLoginDetails.lastName);
    await App.addEmployeePage.enterUniqueEmployeeId();

    // Step 3: Check Create Login Details and verify the login fields appear
    await App.addEmployeePage.checkCreateLoginDetailsCheckbox();
    await App.addEmployeePage.verifyCreateLoginDetailsFieldsDisplayed();

    // Step 4: Enter login credentials
    await App.addEmployeePage.enterUsername(happyPath.withLoginDetails.username);
    await App.addEmployeePage.enterPassword(happyPath.withLoginDetails.password);

    // Step 5: Save employee and verify success
    await App.addEmployeePage.clickOnSaveButton();
    await App.addEmployeePage.verifyExpectedMessageDisplayed(messages.successSaved);

    // Step 6: Verify the Personal Details page is shown for the new employee
    await App.personalDetailsPage.VerifyPersonalDetailsDisplayed();
  });
});
