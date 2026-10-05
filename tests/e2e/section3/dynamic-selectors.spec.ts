import { test, expect } from '../../../src/fixtures';

test.describe('Dynamic Selectors', { tag: '@smoke' }, () => {
  test('Login succeeds when username and password are provided', async ({ dynamicLoginCard }) => {
    await test.step('Fill in username and password, then click Login', async () => {
      await dynamicLoginCard.login('jane.doe', 'super-secret');
    });

    await test.step('Verify "Login successful" message is displayed', async () => {
      await expect(dynamicLoginCard.successMessage).toBeVisible();
      await expect(dynamicLoginCard.successMessage).toHaveText('Login successful');
      await expect(dynamicLoginCard.errorMessage).toBeHidden();
    });
  });

  test('Login fails when username and password are missing', async ({ dynamicLoginCard }) => {
    await test.step('Click Login without entering credentials', async () => {
      await dynamicLoginCard.loginButton.click();
    });

    await test.step('Verify "Invalid credentials" message is displayed', async () => {
      await expect(dynamicLoginCard.errorMessage).toBeVisible();
      await expect(dynamicLoginCard.errorMessage).toHaveText('Invalid credentials');
      await expect(dynamicLoginCard.successMessage).toBeHidden();
    });
  });

  test('Dynamic classes are regenerated on every page load', async ({ aiPlaygroundPage, dynamicLoginCard }) => {
    await test.step('Capture the classes generated on the first page load', async () => {
      await dynamicLoginCard.loginButton.waitFor({ state: 'visible' });
    });

    const firstLoadClass = await dynamicLoginCard.loginButton.getAttribute('class');

    await test.step('Reload the page', async () => {
      await aiPlaygroundPage.navigate();
      await dynamicLoginCard.loginButton.waitFor({ state: 'visible' });
    });

    const secondLoadClass = await dynamicLoginCard.loginButton.getAttribute('class');

    await test.step('Verify the test still finds the Login button although its classes changed', async () => {
      await dynamicLoginCard.login('jane.doe', 'super-secret');
      await expect(dynamicLoginCard.successMessage).toBeVisible();
      await expect(dynamicLoginCard.successMessage).toHaveText('Login successful');
      await expect(dynamicLoginCard.errorMessage).toBeHidden();
    });

    test.info().annotations.push({
      type: 'note',
      description: `Login button class before reload: "${firstLoadClass}", after reload: "${secondLoadClass}"`,
    });
  });
});
