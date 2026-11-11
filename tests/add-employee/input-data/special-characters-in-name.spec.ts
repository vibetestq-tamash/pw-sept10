// spec: tests/add-employee-test-plan.md
// seed: tests/19POMTestWithBaseAppDDT.spec.ts

import { test } from "../../../fixtures/appbase";
import { appUrl } from "../../../testdata/app";
import { inputData } from "../../../testdata/add-employee.json";

test.describe('Add Employee - Input Data Scenarios', () => {

  test.beforeEach(async ({ App, testData }) => {
    await App.basePage.navigateTo(appUrl);
    await App.loginPage.verifyLoginPageDisplayed();
    await App.loginPage.enterUserName(testData.username);
    await App.loginPage.enterPassword(testData.password);
    await App.loginPage.clickOnLogin();
    await App.dashboardPage.VerifyDashboardDisplayed();
  });

  test('Add employee with special characters in name', async ({ App }) => {
    // Step 1: Open the Add Employee form
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Enter names containing special characters
    await App.addEmployeePage.enterFirstName(inputData.specialCharacters.firstName);
    await App.addEmployeePage.enterLastName(inputData.specialCharacters.lastName);
    await App.addEmployeePage.enterUniqueEmployeeId();

    // Step 3: Save the employee
    await App.addEmployeePage.clickOnSaveButton();

    // Step 4: Verify the employee was created
    await App.personalDetailsPage.VerifyPersonalDetailsDisplayed();
  });
});
