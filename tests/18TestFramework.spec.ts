// Features provided by Playwright Test Framework

import { test } from "../fixtures/appbase";

// Designing the Tests, structuring them, and writing assertions to validate application behavior.
// Automatic Fixtures : page, browser, and context are automatically provided by Playwright Test Framework.
// Parallel Test Execution : using workers
// Test Hooks : (beforeAll, beforeEach, afterAll, afterEach)
// Test Configuration and Customization : playwright.config.ts file allows customization of test behavior.
// Rich Set of Matchers for Assertions : expect API provides a wide range of matchers to validate application behavior.

// Tests, Verifications, Hooks (Pre and Post Conditions), Data Driving, Exception Handling
// UI for Execution, Debugging Features, Auto Sync with Application Speed
// Reports, Screenshots, Video, Trace
// CI: CI Runners, Docker

// Creating Scenarios

test.describe('Login Tests', () => { // Grouping all login related tests

    // Hooks for setting up and tearing down test conditions
    // Hooks are optional and use it when pre or post conditions are needed

    // test.beforeEach(async ({ },testinfo) => {
    //     console.log("Executing before each hook for test:"+ testinfo.title);
    //     if(testinfo.title.includes("Valid Login")){
    //         testinfo.setTimeout(60000); // Set timeout to 60 seconds for Valid Login test
    //     }
    // });
    
    // test.afterEach(async ({ }) => {
    //     console.log("Executing after each hook for test:"+ test.info().title);
    // });

    // test.beforeAll(async ({ }) => {
    //     console.log("Executing before all hook for test:"+ test.info().title);
    // });
    // test.afterAll(async ({ }) => {
    //     console.log("Executing after all hook for test:"+ test.info().title);
    // });

    test('Valid Login', async ({ }) => {
        console.log("Executing Valid Login test:"+ test.info().title);
        // console.log("Test data:", testData);
    });

    test('Invalid Login', async ({ }) => {
        console.log("Executing Invalid Login test:"+ test.info().title);
    });

    test("Empty Login", async ({ }) => {
        console.log("Executing Empty Login test:"+ test.info().title);
    });
    
    test("verify error message on empty username", async ({ }) => {
        console.log("Executing verify error message on empty username test:"+ test.info().title);
    });

    test("verify error message on empty password", async ({ }) => {
        console.log("Executing verify error message on empty password test:"+ test.info().title);
    });

});