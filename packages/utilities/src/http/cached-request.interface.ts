export interface ICachedRequest {
  id: string;
  input: RequestInfo;
  init: RequestInit;
  privateRequest: boolean;
  tag: string;
  timeStamp: number;
  error: any;
}
