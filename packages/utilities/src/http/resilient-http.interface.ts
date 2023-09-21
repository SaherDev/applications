import { IObserver } from '../observer';
import { ICachedRequest } from './cached-request.interface';
import { HTTPService } from './http.service';

export interface IResilientHttpService extends IObserver<boolean> {
  get isOnline(): boolean;

  retryFailedRequests(tag?: Readonly<string>): Promise<string[]>;
  findFailedRequests(tag?: string): ICachedRequest[];
  fetch(
    fetchServiceArgs: Parameters<HTTPService['fetch']>,
    id?: Readonly<string>,
    tag?: Readonly<string>,
    saveOnFail?: Readonly<boolean>
  ): Promise<Response>;
}
