// tests/fixtures.ts
import { test as base } from '@playwright/test';
import { AIPlaygroundPage } from '../pages/AIPlaygroundPage';
import { FlakyLoaderCard } from '../pages/components/FlakyLoaderCard';
import { DynamicLoginCard } from '../pages/components/DynamicLoginCard';
import { MovingTargetCard } from '../pages/components/MovingTargetCard';
import { InvisibleSuccessCard } from '../pages/components/InvisibleSuccessCard';

type Fixtures = {
  aiPlaygroundPage: AIPlaygroundPage;
  flakyLoaderCard: FlakyLoaderCard;
  dynamicLoginCard: DynamicLoginCard;
  movingTargetCard: MovingTargetCard;
  invisibleSuccessCard: InvisibleSuccessCard;
};

export const test = base.extend<Fixtures>({
  aiPlaygroundPage: async ({ page }, use) => {
    await use(new AIPlaygroundPage(page));
  },
  flakyLoaderCard: async ({ page }, use) => {
    await use(new FlakyLoaderCard(page));
  },
  dynamicLoginCard: async ({ page }, use) => {
    await use(new DynamicLoginCard(page));
  },
  movingTargetCard: async ({ page }, use) => {
    await use(new MovingTargetCard(page));
  },
  invisibleSuccessCard: async ({ page }, use) => {
    await use(new InvisibleSuccessCard(page));
  },
});

export { expect } from '@playwright/test';
