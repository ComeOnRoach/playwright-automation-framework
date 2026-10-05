import { test, expect } from '../../../src/fixtures';
import data from '../../../test-data/priority-board.json';

const [firstTask, secondTask, thirdTask] = data.tasks;

const confirmationFor = (task: string, column: string): string =>
  data.messageTemplate.replace('{task}', task).replace('{column}', column);

test.describe('Priority Board', () => {
  test(
    'Shows all three tasks in Backlog and none in In Progress on load',
    { tag: ['@smoke', '@ui', '@feature:priority-board'] },
    async ({ priorityBoardCard }) => {
      await test.step('Verify every task is visible in Backlog', async () => {
        for (const task of data.tasks) {
          await expect(priorityBoardCard.taskIn(priorityBoardCard.backlogColumn, task)).toBeVisible();
        }
        await expect(priorityBoardCard.backlogColumn.locator('.task-card')).toHaveCount(data.tasks.length);
      });

      await test.step('Verify In Progress is empty', async () => {
        await expect(priorityBoardCard.inProgressColumn.locator('.task-card')).toHaveCount(0);
      });
    },
  );

  test(
    'Moves a task from Backlog to In Progress when dragged',
    { tag: ['@smoke', '@ui', '@feature:priority-board'] },
    async ({ priorityBoardCard }) => {
      await test.step('Drag the task to In Progress', async () => {
        await priorityBoardCard.dragTask(firstTask, priorityBoardCard.backlogColumn, priorityBoardCard.inProgressColumn);
      });

      await test.step('Verify the task is in In Progress and no longer in Backlog', async () => {
        await expect(priorityBoardCard.taskIn(priorityBoardCard.inProgressColumn, firstTask)).toBeVisible();
        await expect(priorityBoardCard.taskIn(priorityBoardCard.backlogColumn, firstTask)).toBeHidden();
      });
    },
  );

  test(
    'Moves a task from In Progress back to Backlog when dragged',
    { tag: ['@smoke', '@ui', '@feature:priority-board'] },
    async ({ priorityBoardCard }) => {
      await test.step('Move the task to In Progress first', async () => {
        await priorityBoardCard.dragTask(firstTask, priorityBoardCard.backlogColumn, priorityBoardCard.inProgressColumn);
        await expect(priorityBoardCard.taskIn(priorityBoardCard.inProgressColumn, firstTask)).toBeVisible();
      });

      await test.step('Drag the task back to Backlog', async () => {
        await priorityBoardCard.dragTask(firstTask, priorityBoardCard.inProgressColumn, priorityBoardCard.backlogColumn);
      });

      await test.step('Verify the task is in Backlog and no longer in In Progress', async () => {
        await expect(priorityBoardCard.taskIn(priorityBoardCard.backlogColumn, firstTask)).toBeVisible();
        await expect(priorityBoardCard.taskIn(priorityBoardCard.inProgressColumn, firstTask)).toBeHidden();
      });
    },
  );

  test(
    'Shows a confirmation message after a move',
    { tag: ['@smoke', '@ui', '@feature:priority-board'] },
    async ({ priorityBoardCard }) => {
      await expect(priorityBoardCard.confirmation).toBeEmpty();

      await priorityBoardCard.dragTask(firstTask, priorityBoardCard.backlogColumn, priorityBoardCard.inProgressColumn);

      await expect(priorityBoardCard.confirmation).toBeVisible();
      await expect(priorityBoardCard.confirmation).not.toBeEmpty();
    },
  );

  test(
    'Names the task and In Progress in the confirmation after moving from Backlog',
    { tag: ['@smoke', '@ui', '@feature:priority-board'] },
    async ({ priorityBoardCard }) => {
      await priorityBoardCard.dragTask(secondTask, priorityBoardCard.backlogColumn, priorityBoardCard.inProgressColumn);

      await expect(priorityBoardCard.confirmation).toBeVisible();
      await expect(priorityBoardCard.confirmation).toHaveText(confirmationFor(secondTask, data.columns.inProgress));
    },
  );

  test(
    'Names the task and Backlog in the confirmation after moving back from In Progress',
    { tag: ['@regression', '@ui', '@feature:priority-board'] },
    async ({ priorityBoardCard }) => {
      await test.step('Move the task to In Progress first', async () => {
        await priorityBoardCard.dragTask(secondTask, priorityBoardCard.backlogColumn, priorityBoardCard.inProgressColumn);
        await expect(priorityBoardCard.taskIn(priorityBoardCard.inProgressColumn, secondTask)).toBeVisible();
      });

      await test.step('Move it back and verify the confirmation', async () => {
        await priorityBoardCard.dragTask(secondTask, priorityBoardCard.inProgressColumn, priorityBoardCard.backlogColumn);
        await expect(priorityBoardCard.confirmation).toBeVisible();
        await expect(priorityBoardCard.confirmation).toHaveText(confirmationFor(secondTask, data.columns.backlog));
      });
    },
  );

  test(
    'Updates the confirmation to the latest move after consecutive moves',
    { tag: ['@regression', '@ui', '@feature:priority-board'] },
    async ({ priorityBoardCard }) => {
      await test.step('Move two tasks to In Progress', async () => {
        await priorityBoardCard.dragTask(firstTask, priorityBoardCard.backlogColumn, priorityBoardCard.inProgressColumn);
        await expect(priorityBoardCard.confirmation).toHaveText(confirmationFor(firstTask, data.columns.inProgress));

        await priorityBoardCard.dragTask(thirdTask, priorityBoardCard.backlogColumn, priorityBoardCard.inProgressColumn);
      });

      await test.step('Verify the confirmation names the latest move', async () => {
        await expect(priorityBoardCard.confirmation).toHaveText(confirmationFor(thirdTask, data.columns.inProgress));
      });
    },
  );

  for (const task of data.tasks) {
    test(
      `Moves "${task}" to In Progress and leaves the other tasks in Backlog`,
      { tag: ['@regression', '@ui', '@feature:priority-board'] },
      async ({ priorityBoardCard }) => {
        await priorityBoardCard.dragTask(task, priorityBoardCard.backlogColumn, priorityBoardCard.inProgressColumn);

        await expect(priorityBoardCard.taskIn(priorityBoardCard.inProgressColumn, task)).toBeVisible();
        for (const other of data.tasks.filter((t) => t !== task)) {
          await expect(priorityBoardCard.taskIn(priorityBoardCard.backlogColumn, other)).toBeVisible();
        }
      },
    );
  }
});
