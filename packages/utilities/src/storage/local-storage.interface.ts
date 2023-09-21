export interface ILocalStorage {
  getStore(): Promise<Record<string, any>>;
  getItem<T>(key: string): Promise<T | null>;
  setItem<T>(key: string, value: T): Promise<T>;
  removeItem(key: string): Promise<void>;
}
