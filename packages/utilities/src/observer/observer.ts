import { IObserver } from './observer-interface';
import { NotifyFunction } from './notify-function.type';

export class StateObserver<T> implements IObserver<T> {
  private listeners: NotifyFunction<T>[] = [];
  private _property: T;

  constructor(initialValue: T) {
    this._property = initialValue;
  }

  private notifyListeners(oldValue: T, newValue: T) {
    this.listeners.forEach((listener) => listener(oldValue, newValue));
  }

  public attach(listener: NotifyFunction<T>) {
    this.listeners.push(listener);
  }

  public detach(listener: NotifyFunction<T>) {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  get property(): T {
    return this._property;
  }

  set property(value: T) {
    if (this._property !== value) {
      this.notifyListeners(this._property, value);
      this._property = value;
    }
  }
}
