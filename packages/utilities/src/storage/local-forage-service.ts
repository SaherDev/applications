import * as localForage from 'localforage';

import { ILocalStorage } from './local-storage.interface';
export class LocalForageService implements ILocalStorage {
  private readonly _storageInstance: LocalForage;
  private _isReady: boolean;
  private _store: Record<string, any> = {};

  constructor(private readonly storeId: string) {
    this.validateArgsOrThrowAnError();
    this._storageInstance = localForage.createInstance({
      name: this.storeId,
    });
    this._isReady = false;
  }

  async getStore(): Promise<Record<string, any>> {
    if (!this._isReady) {
      const entries = await Promise.all(
        (
          await this._storageInstance.keys()
        ).map(async (key) => [key, await this._storageInstance.getItem(key)])
      );

      this._store = Object.fromEntries(entries);
      this._isReady = true;
    }

    return this._store;
  }

  private validateArgsOrThrowAnError(): boolean {
    if (!this.storeId || !this.storeId) {
      throw new Error('Invalid args');
    }
    return true;
  }

  async setItem<T>(key: string, value: T): Promise<T> {
    this._store[key] = value;
    return this._storageInstance.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this._store[key] && delete this._store[key];
    await this._storageInstance.removeItem(key);
  }
  async getItem<T>(key: string): Promise<T | null> {
    return this._storageInstance.getItem(key);
  }
}
