// fixtures/playground.fixture.ts
import { test as base } from '@playwright/test';
import { AIPlaygroundPage } from '../pages/ai-playground.page';
import { FlakyLoaderCard } from '../pages/AIPlaygroundPage/flaky-loader.page';
import { DynamicLoginCard } from '../pages/AIPlaygroundPage/dynamic-selectors.page';
import { MovingTargetCard } from '../pages/AIPlaygroundPage/moving-target.page';
import { InvisibleSuccessCard } from '../pages/AIPlaygroundPage/invisible-success.page';
import { ToastCard } from '../pages/AIPlaygroundPage/toast.page';
import { ReenableButtonCard } from '../pages/AIPlaygroundPage/reenable-button.page';
import { LazyRenderedCard } from '../pages/AIPlaygroundPage/lazy-rendered.page';
import { MultiStepFormCard } from '../pages/AIPlaygroundPage/multi-step-form.page';

type Fixtures = {
  aiPlaygroundPage: AIPlaygroundPage;
  flakyLoaderCard: FlakyLoaderCard;
  dynamicLoginCard: DynamicLoginCard;
  movingTargetCard: MovingTargetCard;
  invisibleSuccessCard: InvisibleSuccessCard;
  toastCard: ToastCard;
  reenableButtonCard: ReenableButtonCard;
  lazyRenderedCard: LazyRenderedCard;
  multiStepFormCard: MultiStepFormCard;
};

export const test = base.extend<Fixtures>({
  aiPlaygroundPage: async ({ page }, use) => {
    const aiPlaygroundPage = new AIPlaygroundPage(page);
    await aiPlaygroundPage.navigate();
    await use(aiPlaygroundPage);
  },
  flakyLoaderCard: async ({ page, aiPlaygroundPage }, use) => {
    await use(new FlakyLoaderCard(page));
  },
  dynamicLoginCard: async ({ page, aiPlaygroundPage }, use) => {
    await use(new DynamicLoginCard(page));
  },
  movingTargetCard: async ({ page, aiPlaygroundPage }, use) => {
    await use(new MovingTargetCard(page));
  },
  invisibleSuccessCard: async ({ page, aiPlaygroundPage }, use) => {
    await use(new InvisibleSuccessCard(page));
  },
  toastCard: async ({ page, aiPlaygroundPage }, use) => {
    await use(new ToastCard(page));
  },
  reenableButtonCard: async ({ page, aiPlaygroundPage }, use) => {
    await use(new ReenableButtonCard(page));
  },
  lazyRenderedCard: async ({ page, aiPlaygroundPage }, use) => {
    await use(new LazyRenderedCard(page));
  },
  multiStepFormCard: async ({ page, aiPlaygroundPage }, use) => {
    await use(new MultiStepFormCard(page));
  },
});

export { expect } from '@playwright/test';
