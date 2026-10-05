import { test, expect } from '../../../src/fixtures';
import data from '../../../test-data/local-storage-session.json';

test.describe('localStorage Session', () => {
  test(
    'Writes the session to localStorage after a successful login',
    { tag: ['@smoke', '@ui', '@feature:local-storage-session'] },
    async ({ localStorageSessionCard, authHelper }) => {
      await test.step('Log in with valid credentials', async () => {
        await localStorageSessionCard.login(data.validUser.username, data.validUser.password);
        await expect(localStorageSessionCard.welcome).toBeVisible();
      });

      await test.step('Verify the session is stored in localStorage', async () => {
        const session = await authHelper.getSession();
        expect(session).not.toBeNull();
        expect(session?.user).toBe(data.validUser.username);
        expect(session?.token).toBe(data.sessionToken);
        expect(session?.expires).toBeGreaterThan(Date.now());
      });
    },
  );

  test(
    'Shows the welcome message after a successful login',
    { tag: ['@smoke', '@ui', '@feature:local-storage-session'] },
    async ({ localStorageSessionCard }) => {
      await test.step('Log in with valid credentials', async () => {
        await localStorageSessionCard.login(data.validUser.username, data.validUser.password);
      });

      await test.step('Verify the welcome message is shown and the login form is hidden', async () => {
        await expect(localStorageSessionCard.welcome).toBeVisible();
        await expect(localStorageSessionCard.welcome).toHaveText(data.messages.welcome);
        await expect(localStorageSessionCard.form).toBeHidden();
      });
    },
  );

  test(
    'Clears localStorage and resets the UI after logout',
    { tag: ['@regression', '@ui', '@feature:local-storage-session'] },
    async ({ localStorageSessionCard, authHelper }) => {
      await test.step('Log in and confirm the session exists', async () => {
        await localStorageSessionCard.login(data.validUser.username, data.validUser.password);
        await expect(localStorageSessionCard.welcome).toBeVisible();
        expect(await authHelper.hasSession()).toBe(true);
      });

      await test.step('Log out', async () => {
        await localStorageSessionCard.logout();
      });

      await test.step('Verify localStorage is cleared and the login form is restored', async () => {
        expect(await authHelper.getSession()).toBeNull();
        await expect(localStorageSessionCard.form).toBeVisible();
        await expect(localStorageSessionCard.welcome).toBeHidden();
        await expect(localStorageSessionCard.logoutButton).toBeHidden();
        await expect(localStorageSessionCard.usernameInput).toHaveValue('');
        await expect(localStorageSessionCard.passwordInput).toHaveValue('');
      });
    },
  );

  test(
    'Shows an error message and stores no session when credentials are invalid',
    { tag: ['@regression', '@ui', '@feature:local-storage-session'] },
    async ({ localStorageSessionCard, authHelper }) => {
      await test.step('Log in with invalid credentials', async () => {
        await localStorageSessionCard.login(data.invalidUser.username, data.invalidUser.password);
      });

      await test.step('Verify the error is shown and no session is created', async () => {
        await expect(localStorageSessionCard.error).toBeVisible();
        await expect(localStorageSessionCard.error).toHaveText(data.messages.invalidCredentials);
        await expect(localStorageSessionCard.welcome).toBeHidden();
        expect(await authHelper.hasSession()).toBe(false);
      });
    },
  );
});
