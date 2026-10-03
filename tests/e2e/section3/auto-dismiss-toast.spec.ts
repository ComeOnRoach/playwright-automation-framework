import { test } from "../../../src/fixtures/playground.fixture";

test.describe("Toast", () => {
  test(
    '"Trigger Toast" button shows the "Action completed" toast and then dismisses it',
    { tag: ["@smoke", "@ci"] },
    async ({ toastCard }) => {
      await test.step("Click the Trigger Toast button", async () => {
        await toastCard.triggerToast();
      });

      await test.step('Verify the toast is visible with the "Action completed" message', async () => {
        await toastCard.assertToastShown();
      });

      await test.step("Verify the toast disappears", async () => {
        await toastCard.assertToastGone();
      });
    },
  );
});
