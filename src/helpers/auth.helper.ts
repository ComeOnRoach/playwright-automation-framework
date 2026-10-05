// src/helpers/auth.helper.ts
import { Page } from '@playwright/test';
import { Session } from '../types/session.types';

export class AuthHelper {
  private readonly page: Page;
  private readonly storageKey: string;

  constructor(page: Page, storageKey: string) {
    this.page = page;
    this.storageKey = storageKey;
  }

  async getSession(): Promise<Session | null> {
    const raw = await this.page.evaluate((key) => localStorage.getItem(key), this.storageKey);
    return raw ? (JSON.parse(raw) as Session) : null;
  }

  async hasSession(): Promise<boolean> {
    return (await this.getSession()) !== null;
  }
}
