import {
  IHttpConfig,
  IHttpMethod,
  IHttpService,
} from './http-service.interface';

import { CachedRequest } from './cached-request';
import { ICachedRequest } from './cached-request.interface';
import { ILocalStorage } from '../storage';
import { IResilientHttpService } from './resilient-http.interface';
import { Randoms } from '../randoms';
import { StateObserver } from '../observer';
import { injectable } from 'inversify';

@injectable()
export class ResilientHttpService
  extends StateObserver<boolean>
  implements IResilientHttpService
{
  private _failedRequests: ICachedRequest[] = [];

  constructor(
    private readonly storage: ILocalStorage,
    private readonly httpService: IHttpService,
    private readonly maxRetriesInTimeFrame: [number, number],
    isOnline: boolean = true,
    private readonly retryFailedOnStart: boolean = true
  ) {
    super(isOnline);

    this.validateArgsOrThrowAnError();
    this.getFailedRequestFromTheStore();

    window.addEventListener('online', () => (this.property = true));
    window.addEventListener('offline', () => (this.property = false));
  }

  get isOnline(): boolean {
    return this.property;
  }

  private validateArgsOrThrowAnError(): boolean {
    if (
      !this.storage ||
      !this.httpService ||
      !Array.isArray(this.maxRetriesInTimeFrame) ||
      this.maxRetriesInTimeFrame.length !== 2 ||
      !this.maxRetriesInTimeFrame.every((value) => typeof value === 'number')
    ) {
      throw new Error('Invalid args');
    }
    return true;
  }

  findFailedRequests(tag?: string): ICachedRequest[] {
    const requests = tag
      ? this._failedRequests.filter((value) => value.tag === tag)
      : [...this._failedRequests];

    const uniqueRequestsMap = new Map();
    requests.forEach((request) => {
      const existingRequest = uniqueRequestsMap.get(request.id);
      if (!existingRequest || request.timeStamp > existingRequest.timeStamp) {
        uniqueRequestsMap.set(request.id, request);
      }
    });

    return Array.from(uniqueRequestsMap.values());
  }

  async retryFailedRequests(tag?: string): Promise<string[]> {
    let succeeded = [];
    for (const request of this.findFailedRequests(tag)) {
      (await this.retryFailedRequest(request)) && succeeded.push(request.id);
    }

    return succeeded;
  }

  private async getFailedRequestFromTheStore(): Promise<void> {
    const store = await this.storage.getStore();

    this._failedRequests = [];
    this._failedRequests.push(
      ...Object.values(store)
        .map((value) => this.decodeRequest(value))
        .filter((value) => value)
    );

    if (this.retryFailedOnStart) {
      await this.retryFailedRequests();
    }
  }

  async fetch<T>(
    fetchServiceArgs: Parameters<IHttpService['fetch']>,
    id?: Readonly<string>,
    tag?: Readonly<string>,
    saveOnFailure?: Readonly<boolean>
  ): Promise<T> {
    try {
      if (!id) id = Randoms.uniqueId();
      const response = await this.httpService.fetch<T>(...fetchServiceArgs);

      if (!this.isOnline) {
        this.property = true;
      }

      this.findAndRemoveFailedRequest(id);

      return response;
    } catch (error) {
      await this.handleFailedRequest(
        fetchServiceArgs[0],
        fetchServiceArgs[1],
        fetchServiceArgs[2],
        id,
        tag,
        fetchServiceArgs[3],
        saveOnFailure,
        error
      );

      throw error;
    }
  }

  private findAndRemoveFailedRequest(id: string): void {
    const beforeRemovalLength = this._failedRequests.length;

    this._failedRequests = this._failedRequests.filter(
      (value) => value.id !== id
    );

    if (this._failedRequests.length !== beforeRemovalLength) {
      this.storage.removeItem(id);
    }
  }

  private async retryFailedRequest(request: ICachedRequest): Promise<boolean> {
    try {
      const response = await this.httpService.fetch(
        request.url,
        request.method,
        request.config,
        request.privateRequest
      );

      if (!response)
        throw new Error(
          `ResilientHttpService >> retryFailedRequestM Failed, request = ${request} `
        );

      this.findAndRemoveFailedRequest(request.id);
    } catch (error) {
      return false;
    }
  }

  private async handleFailedRequest(
    url: string,
    method: IHttpMethod,
    config: IHttpConfig = {},
    id: Readonly<string>,
    tag: Readonly<string>,
    privateRequest: Readonly<boolean> = true,
    saveOnFailure: Readonly<boolean>,
    error: any
  ) {
    if (saveOnFailure) {
      const requestTosSave = new CachedRequest(
        id,
        url,
        method,
        config,
        privateRequest,
        tag,
        Date.now(),
        JSON.stringify(error?.message ?? error)
      );

      this._failedRequests.push(requestTosSave);
      await this.storage.setItem(id, requestTosSave);
    }

    if (this.hasReachedRetryLimit(tag)) {
      this.property = false;
    }
  }
  private hasReachedRetryLimit(tag: string): boolean {
    const [maxRetries, timeFrame] = this.maxRetriesInTimeFrame;

    const timestamps = this._failedRequests
      .filter((req) => req.tag === tag)
      .map((req) => req.timeStamp)
      .sort((a, b) => a - b);

    for (let i = 0; i <= timestamps.length - maxRetries; i++) {
      const windowStart = timestamps[i];
      const windowEnd = timestamps[i + maxRetries - 1];

      if (windowEnd - windowStart < timeFrame) {
        return true;
      }
    }

    return false;
  }
  private decodeRequest(request: any): ICachedRequest | null {
    if (
      typeof request.id !== 'string' ||
      !request.url ||
      !request.method ||
      !request.config ||
      typeof request.privateRequest !== 'boolean' ||
      typeof request.tag !== 'string' ||
      typeof request.timeStamp !== 'number'
    ) {
      return null;
    }

    return new CachedRequest(
      request.id,
      request.url,
      request.method,
      request.config,
      request.privateRequest,
      request.tag,
      request.timeStamp,
      request.error
    );
  }
}
