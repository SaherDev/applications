import { IHttpConfig, IHttpMethod } from './http-service.interface';

import { ICachedRequest } from './cached-request.interface';

export class CachedRequest implements ICachedRequest {
  constructor(
    public readonly id: string,
    public readonly url: string,
    public readonly method: IHttpMethod,
    public readonly config: IHttpConfig,
    public readonly privateRequest: boolean,
    public readonly tag: string,
    public readonly timeStamp: number,
    public readonly error: any
  ) {}
}
