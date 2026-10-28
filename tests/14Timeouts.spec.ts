import { test, expect } from '@playwright/test';
test('handle timeouts', async ({ page }) => {

    // Timeouts are helpful to continue execution on failure without wasting time

    // Test Timeout Handling: The timeout for executing a single test
    // Default Timeout : 30 seconds

    // Global Timeout: Timeout for the entire execution
    // Action Timeout: when there is an action failure how much time it can wait 
    // Expect Timeout: when there is a verification failure how much time it can wait
        // Default is 5 seconds
    // navigation timeout: Timeout Navigation
    // WebServer Timeout: If any webserver is starting from playwright config


    // Local > Dev > QA > Staging > Production
    // Start Local web server > Test on it
});