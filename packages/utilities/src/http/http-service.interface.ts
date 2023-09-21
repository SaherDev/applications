import { AxiosRequestConfig, Method } from 'axios';

export type IHttpServiceArgs = Parameters<IHttpService['fetch']>;

export interface IHttpService {
  fetch<T>(
    url: string,
    method: Method,
    config?: AxiosRequestConfig,
    isPrivateRequest?: boolean
  ): Promise<T>;
}
