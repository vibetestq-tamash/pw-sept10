import { test} from '@playwright/test';

const authFile = '.auth/apiuser.json';

test('authenticate', async ({ request }) => {
  // Send authentication request. Replace with your own.
  await request.post('http://localhost:5002/auth/login', {
    data: {
      'user': 'admin',
      'password': 'admin'
    }
  });
  await request.storageState({ path: authFile });
});