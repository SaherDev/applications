import { HttpFetchFunctionArgs } from './http-function-args.type';

export type HttpFetchFunction<T> = (
  ...args: HttpFetchFunctionArgs
) => Promise<T>;
