import { test } from "../fixtures/base";
    
test('Login Test', async ({ testData, loginPage, basePage, addEmployeePage, personalDetailsPage, dashboardPage, pimPage }) => {

    await basePage.navigateTo("https://qtpsudhakar-vibetestq-hrm.up.railway.app");
    
    await loginPage.verifyLoginPageDisplayed();
    await loginPage.enterUserName(testData.username);
    await loginPage.enterPassword(testData.password);
    await loginPage.clickOnLogin();

    await dashboardPage.VerifyDashboardDisplayed();
    await dashboardPage.clickOnPIMLink();

    await pimPage.VerifyPIMDisplayed();
    await pimPage.clickOnAddEmployeeLink();
    
    await addEmployeePage.VerifyAddEmployeeDisplayed();
    await addEmployeePage.enterFirstName('John');
    await addEmployeePage.enterLastName('Doe');
    await addEmployeePage.enterUniqueEmployeeId();
    await addEmployeePage.clickOnSaveButton();

    await personalDetailsPage.VerifyPersonalDetailsDisplayed();

});