import { IHttpConfig, IHttpMethod } from './http-service.interface';

export interface ICachedRequest {
  id: string;
  url: string;
  method: IHttpMethod;
  config: IHttpConfig;
  privateRequest: boolean;
  tag: string;
  timeStamp: number;
  error: any;
}
