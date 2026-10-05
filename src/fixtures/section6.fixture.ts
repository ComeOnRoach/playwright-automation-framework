// src/fixtures/section6.fixture.ts
// Card fixtures depend on `aiPlaygroundPage` so navigation always happens first.
import { test as base } from './base.fixture';
import { LocalStorageSessionCard } from '../pages/AIPlaygroundPage/local-storage-session.page';
import { AuthHelper } from '../helpers/auth.helper';
import sessionData from '../../test-data/local-storage-session.json';

type Fixtures = {
  localStorageSessionCard: LocalStorageSessionCard;
  authHelper: AuthHelper;
};

export const test = base.extend<Fixtures>({
  localStorageSessionCard: async ({ page, aiPlaygroundPage: _navigated }, use) => {
    await use(new LocalStorageSessionCard(page));
  },
  authHelper: async ({ page, aiPlaygroundPage: _navigated }, use) => {
    await use(new AuthHelper(page, sessionData.storageKey));
  },
});
