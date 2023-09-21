import {
  IConfigBase,
  IConfigMeta,
  ISyncConfigService,
} from '@application/models';
import { IHttpService, IHttpServiceArgs } from '../http';

import { DataSyncService } from '../data-sync';
import { ObjectAccessorUtilService } from '../object';

export class SyncConfigService<T extends IConfigBase>
  implements ISyncConfigService<T>
{
  private _config: T;
  private _dataSyncService: DataSyncService<T>;
  private _configPullingFailed: boolean;

  private _configResolve: (() => void) | null;

  constructor(
    private readonly httpArgs: IHttpServiceArgs,
    private readonly httpFetch: IHttpService,
    private readonly syncRefreshRate: number,
    private readonly maxSyncRetries: number,
    private readonly configInstanceFactory: (config: T) => T,
    private defaultConfig: T,
    private readonly fillEmptyProperties: boolean = false
  ) {
    this._configPullingFailed = false;
    this.validateArgumentsOrThrowAnError();
    this.prepareDefaultConfig(defaultConfig);
    this.startPullingConfig();
  }

  private validateArgumentsOrThrowAnError(): void {
    if (!this.defaultConfig || !this.defaultConfig.meta) {
      throw new Error('Invalid arguments');
    }
  }

  waitTillConfigIsSynced(): Promise<void> {
    return new Promise<void>((resolve) => {
      this._configResolve = resolve;
    });
  }

  private async startPullingConfig(): Promise<void> {
    if (!this._dataSyncService) {
      this._dataSyncService = this.createDataSyncService();
    }
    this._dataSyncService.sync();
  }

  private createDataSyncService() {
    return new DataSyncService<T>(
      this.httpArgs,
      this.httpFetch,
      this.configChangedHandler.bind(this),
      this.configPullingFailed.bind(this),
      this.syncRefreshRate,
      this.maxSyncRetries
    );
  }

  private configPullingFailed(error: any): void {
    console.error(
      `SyncConfigService >> Sync Failed, error = ${JSON.stringify(
        error?.message ?? error
      )}`
    );
    this.configChangedHandler(this.defaultConfig);
    this._configPullingFailed = true;
  }

  private configChangedHandler(config: T): void {
    this._configPullingFailed = false;
    this._config = this.configInstanceFactory(
      this.fillEmptyProperties
        ? ObjectAccessorUtilService.fillEmptyProperties(
            config,
            this.defaultConfig
          )
        : config
    );

    if (this._configResolve) {
      this._configResolve();
      this._configResolve = null;
    }
  }

  private prepareDefaultConfig(config: T): void {
    if (config.meta) {
      config.meta = this.emptyMeta();
    }
    this.defaultConfig = config;
    this._config = config;
  }

  private emptyMeta(): IConfigMeta {
    return {
      version: 0,
    };
  }

  get isConfigPullingFailed(): boolean {
    return this._configPullingFailed;
  }

  get config(): T {
    return this._config;
  }
}
