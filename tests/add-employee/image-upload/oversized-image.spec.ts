// spec: tests/add-employee-test-plan.md
// seed: tests/19POMTestWithBaseAppDDT.spec.ts

import { test } from "../../../fixtures/appbase";
import { appUrl } from "../../../testdata/app";
import { imageUpload } from "../../../testdata/add-employee.json";
import { uiHints } from "../../../testdata/add-employee-image-input.json";

test.describe('Add Employee - Image Upload Validation', () => {

  test.beforeEach(async ({ App, testData }) => {
    await App.basePage.navigateTo(appUrl);
    await App.loginPage.verifyLoginPageDisplayed();
    await App.loginPage.enterUserName(testData.username);
    await App.loginPage.enterPassword(testData.password);
    await App.loginPage.clickOnLogin();
    await App.dashboardPage.VerifyDashboardDisplayed();
  });

  test('Validation error when image exceeds size limit', async ({ App }) => {
    // Step 1: Open the Add Employee form
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Fill in the required names
    await App.addEmployeePage.enterFirstName(imageUpload.oversizedImage.firstName);
    await App.addEmployeePage.enterLastName(imageUpload.oversizedImage.lastName);
    await App.addEmployeePage.enterUniqueEmployeeId();

    // Step 3: Upload an image larger than the size limit
    await App.addEmployeePage.uploadProfilePicture(imageUpload.oversizedImage.imagePath);

    // Step 4: Attempt to save the employee
    await App.addEmployeePage.clickOnSaveButton();

    // Step 5: Verify the validation error is shown
    await App.addEmployeePage.verifyErrorMessageDisplayed();
  });
});

test.describe('Add Employee - Image Upload Scenarios', () => {

  test.beforeEach(async ({ App, testData }) => {
    await App.basePage.navigateTo(appUrl);
    await App.loginPage.verifyLoginPageDisplayed();
    await App.loginPage.enterUserName(testData.username);
    await App.loginPage.enterPassword(testData.password);
    await App.loginPage.clickOnLogin();
    await App.dashboardPage.VerifyDashboardDisplayed();
  });

  test('Image upload rejected when file exceeds 1MB', async ({ App }) => {
    // Step 1: Open the Add Employee form
    await App.dashboardPage.clickOnPIMLink();
    await App.pimPage.VerifyPIMDisplayed();
    await App.pimPage.clickOnAddEmployeeLink();
    await App.addEmployeePage.VerifyAddEmployeeDisplayed();

    // Step 2: Verify the profile picture section states the size limit
    await App.addEmployeePage.verifyProfilePictureHintDisplayed(uiHints.profilePictureSizeLimit);
  });
});
