import { AxiosRequestConfig, Method } from 'axios';

export type IHttpServiceArgs = Parameters<IHttpService['fetch']>;

export type IHttpMethod = Method;
export type IHttpConfig = AxiosRequestConfig;
export interface IHttpService {
  fetch<T>(
    url: string,
    method: IHttpMethod,
    config?: IHttpConfig,
    isPrivateRequest?: boolean
  ): Promise<T>;
}
