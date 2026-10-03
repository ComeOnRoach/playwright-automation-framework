// src/fixtures/base.fixture.ts
import { test as base } from '@playwright/test';
import { AIPlaygroundPage } from '../pages/ai-playground.page';

type Fixtures = {
  aiPlaygroundPage: AIPlaygroundPage;
};

export const test = base.extend<Fixtures>({
  aiPlaygroundPage: async ({ page }, use) => {
    const aiPlaygroundPage = new AIPlaygroundPage(page);
    await aiPlaygroundPage.navigate();
    await use(aiPlaygroundPage);
  },
});
