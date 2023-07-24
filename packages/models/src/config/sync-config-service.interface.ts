import { IConfigBase } from './config-base.interface';

export interface ISyncConfigService<T extends IConfigBase> {
  waitTillConfigIsSynced(): Promise<void>;
  get isConfigPullingFailed(): boolean;
  get config(): T;
}
