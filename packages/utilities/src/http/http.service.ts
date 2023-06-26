import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from 'axios';

export class HTTPService {
  private refreshURL: string = '';
  private refreshTokenFailedHandler: Function;
  private isReady: boolean;
  private httpClient: AxiosInstance;

  initialize(
    refreshURL: Readonly<string>,
    refreshTokenFailedHandler: Function
  ): void {
    this.isReady = false;
    if (!refreshURL || !refreshTokenFailedHandler) return;
    this.refreshURL = refreshURL;
    this.refreshTokenFailedHandler = refreshTokenFailedHandler;
    this.httpClient = axios.create();
    this.isReady = true;
  }

  private async refreshTokenAndFetch<T>(
    url: string,
    method: Method,
    config?: AxiosRequestConfig,
    isPrivateRequest: boolean = true
  ): Promise<T> {
    try {
      await this.httpClient.post(this.refreshURL);
      this.setRequestCredentials(config, isPrivateRequest);
      const response: AxiosResponse<T> = await this.httpClient.request({
        url,
        method,
        ...config,
      });
      return response.data;
    } catch (error) {
      if (isPrivateRequest && error.response && error.response.status === 401) {
        this.refreshTokenFailedHandler();
      } else {
        throw error;
      }
    }
  }

  private setRequestCredentials(
    config?: AxiosRequestConfig,
    isPrivateRequest: boolean = true
  ) {
    config = config || {};

    if (isPrivateRequest) {
      config.withCredentials = true;
    } else {
      config.withCredentials = false;
    }
  }

  async fetch<T>(
    url: string,
    method: Method,
    config?: AxiosRequestConfig,
    isPrivateRequest: boolean = true
  ): Promise<T> {
    if (!this.isReady) throw new Error('not ready');

    try {
      this.setRequestCredentials(config, isPrivateRequest);
      const response: AxiosResponse<T> = await this.httpClient.request({
        url,
        method,
        ...config,
      });

      return response.data;
    } catch (error) {
      if (isPrivateRequest && error.response && error.response.status === 401) {
        await this.refreshTokenAndFetch(url, method, config, isPrivateRequest);
      } else {
        throw error;
      }
    }
  }
}
