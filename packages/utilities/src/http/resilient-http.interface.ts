import { IObserver } from '../observer';
import { ICachedRequest } from './cached-request.interface';
import { IHttpService } from './http-service.interface';

export interface IResilientHttpService extends IObserver<boolean> {
  get isOnline(): boolean;

  retryFailedRequests(tag?: Readonly<string>): Promise<string[]>;
  findFailedRequests(tag?: string): ICachedRequest[];
  fetch<T>(
    fetchServiceArgs: Parameters<IHttpService['fetch']>,
    id?: Readonly<string>,
    tag?: Readonly<string>,
    saveOnFail?: Readonly<boolean>
  ): Promise<T>;
}
