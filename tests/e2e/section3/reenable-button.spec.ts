import { test, expect } from "../../../src/fixtures";

test.describe("Re-enable Button", { tag: "@ci" }, () => {
  test('button is disabled after click and becomes enabled again with a "Ready" status', async ({
    reenableButtonCard,
  }) => {
    await test.step("Click the re-enable button", async () => {
      await reenableButtonCard.clickButton();
    });

    await test.step("Verify the button is disabled", async () => {
      await expect(reenableButtonCard.reenableButton).toBeVisible();
      await expect(reenableButtonCard.reenableButton).toBeDisabled();
    });

    await test.step('Verify the status shows "Ready" and the button is enabled again (after ~3s)', async () => {
      await expect(reenableButtonCard.reenableStatus).toBeVisible();
      await expect(reenableButtonCard.reenableStatus).toHaveText('Ready', { timeout: 10000 });
      // The button is re-enabled ~3s after the click; the assertion retries until then.
      await expect(reenableButtonCard.reenableButton).toBeEnabled({ timeout: 10000 });
    });
  });
});
