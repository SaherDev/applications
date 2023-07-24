import { AxiosRequestConfig, Method } from 'axios';

export type HttpFetchFunctionArgs = [
  string,
  Method,
  AxiosRequestConfig?,
  boolean?
];
