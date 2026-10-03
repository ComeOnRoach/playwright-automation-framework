import { test } from "../../../src/fixtures/playground.fixture";

test.describe("Re-enable Button", { tag: "@ci" }, () => {
  test('button is disabled after click and becomes enabled again with a "Ready" status', async ({
    reenableButtonCard,
  }) => {
    await test.step("Click the re-enable button", async () => {
      await reenableButtonCard.clickButton();
    });

    await test.step("Verify the button is disabled", async () => {
      await reenableButtonCard.assertButtonDisabled();
    });

    await test.step('Verify the status shows "Ready" and the button is enabled again (after ~3s)', async () => {
      await reenableButtonCard.assertStatusReady();
      await reenableButtonCard.assertButtonEnabled();
    });
  });
});
