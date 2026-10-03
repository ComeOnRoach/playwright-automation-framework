// src/fixtures/section5.fixture.ts
// Card fixtures depend on `aiPlaygroundPage` so navigation always happens first.
import { test as base } from './base.fixture';
import { MultiStepFormCard } from '../pages/AIPlaygroundPage/multi-step-form.page';
import { CheckoutCard } from '../pages/AIPlaygroundPage/checkout.page';
import { ConditionalFieldsCard } from '../pages/AIPlaygroundPage/conditional-fields.page';

type Fixtures = {
  multiStepFormCard: MultiStepFormCard;
  checkoutCard: CheckoutCard;
  conditionalFieldsCard: ConditionalFieldsCard;
};

export const test = base.extend<Fixtures>({
  multiStepFormCard: async ({ page, aiPlaygroundPage: _navigated }, use) => {
    await use(new MultiStepFormCard(page));
  },
  checkoutCard: async ({ page, aiPlaygroundPage: _navigated }, use) => {
    await use(new CheckoutCard(page));
  },
  conditionalFieldsCard: async ({ page, aiPlaygroundPage: _navigated }, use) => {
    await use(new ConditionalFieldsCard(page));
  },
});
