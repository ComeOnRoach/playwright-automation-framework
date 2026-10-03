import { test, expect } from "../../../src/fixtures";

test.describe("Toast", () => {
  test(
    '"Trigger Toast" button shows the "Action completed" toast and then dismisses it',
    { tag: ["@smoke", "@ci"] },
    async ({ toastCard }) => {
      await test.step("Click the Trigger Toast button", async () => {
        await toastCard.triggerToast();
      });

      await test.step('Verify the toast is visible with the "Action completed" message', async () => {
        // The toast never toggles display/visibility, only a 'show' class that drives
        // a CSS opacity transition, so toBeVisible() alone would pass even when hidden.
        await expect(toastCard.toast.toast).toHaveClass(/show/);
        await expect(toastCard.toast.toast).toHaveText('Action completed');
      });

      await test.step("Verify the toast disappears", async () => {
        // The toast stays in the DOM and only loses the 'show' class (CSS opacity fade),
        // so toBeHidden() would not catch it; assert the class is removed instead.
        await expect(toastCard.toast.toast).not.toHaveClass(/show/, { timeout: 10000 });
      });
    },
  );
});
