import { NotifyFunction } from './notify-function.type';

export interface IObserver<T> {
  attach(listener: NotifyFunction<T>): void;
  detach(listener: NotifyFunction<T>): void;
}
