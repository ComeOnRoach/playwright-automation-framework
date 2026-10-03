// src/fixtures/section3.fixture.ts
// Card fixtures depend on `aiPlaygroundPage` so navigation always happens first.
import { test as base } from './base.fixture';
import { FlakyLoaderCard } from '../pages/AIPlaygroundPage/flaky-loader.page';
import { DynamicLoginCard } from '../pages/AIPlaygroundPage/dynamic-selectors.page';
import { MovingTargetCard } from '../pages/AIPlaygroundPage/moving-target.page';
import { InvisibleSuccessCard } from '../pages/AIPlaygroundPage/invisible-success.page';
import { ToastCard } from '../pages/AIPlaygroundPage/toast.page';
import { ReenableButtonCard } from '../pages/AIPlaygroundPage/reenable-button.page';
import { LazyRenderedCard } from '../pages/AIPlaygroundPage/lazy-rendered.page';

type Fixtures = {
  flakyLoaderCard: FlakyLoaderCard;
  dynamicLoginCard: DynamicLoginCard;
  movingTargetCard: MovingTargetCard;
  invisibleSuccessCard: InvisibleSuccessCard;
  toastCard: ToastCard;
  reenableButtonCard: ReenableButtonCard;
  lazyRenderedCard: LazyRenderedCard;
};

export const test = base.extend<Fixtures>({
  flakyLoaderCard: async ({ page, aiPlaygroundPage: _navigated }, use) => {
    await use(new FlakyLoaderCard(page));
  },
  dynamicLoginCard: async ({ page, aiPlaygroundPage: _navigated }, use) => {
    await use(new DynamicLoginCard(page));
  },
  movingTargetCard: async ({ page, aiPlaygroundPage: _navigated }, use) => {
    await use(new MovingTargetCard(page));
  },
  invisibleSuccessCard: async ({ page, aiPlaygroundPage: _navigated }, use) => {
    await use(new InvisibleSuccessCard(page));
  },
  toastCard: async ({ page, aiPlaygroundPage: _navigated }, use) => {
    await use(new ToastCard(page));
  },
  reenableButtonCard: async ({ page, aiPlaygroundPage: _navigated }, use) => {
    await use(new ReenableButtonCard(page));
  },
  lazyRenderedCard: async ({ page, aiPlaygroundPage: _navigated }, use) => {
    await use(new LazyRenderedCard(page));
  },
});
