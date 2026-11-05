import { test, expect } from "@playwright/test"

test("API test example for reading using basic auth", async ({ request }) => {
    //http://localhost:5002/api/members/

    // CRUD
    // Create: For creating a record: post
    // Read: For reading a record: get
    // Update: For updating a record: put
    // Delete: For deleting a record: delete

    // patch: For partially updating a record: patch

    const response = await request.get("http://localhost:5002/api/members/", {
        headers: {
            "Authorization": "Basic " + Buffer.from("admin:admin").toString("base64")
        }
    });
    // verify 200 status
    expect(response.status()).toBe(200);

    const responseBody = await response.body();
    console.log(responseBody.toString());
    await request.storageState({path:".auth/apiuser.json"});
});
