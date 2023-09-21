import { ICachedRequest } from './cached-request.interface';

export class CachedRequest implements ICachedRequest {
  constructor(
    public readonly id: string,
    public readonly input: RequestInfo,
    public readonly init: RequestInit,
    public readonly privateRequest: boolean,
    public readonly tag: string,
    public readonly timeStamp: number,
    public readonly error: any
  ) {}
}
