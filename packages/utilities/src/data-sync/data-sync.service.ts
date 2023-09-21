import { IHttpService, IHttpServiceArgs } from '../http';

import { AsyncUtilService } from '../async';

export class DataSyncService<T> {
  private syncInterval: number | null = null;
  private syncInProgress: boolean;
  private syncRetries: number;

  constructor(
    private readonly httpArgs: IHttpServiceArgs,
    private readonly httpFetch: IHttpService,
    private readonly onSyncHandler: (data: T) => void,
    private readonly onFailure: (error: any) => void,
    private readonly syncRefreshRate: number,
    private readonly maxSyncRetries: number,
    private readonly pullOnsStart: boolean = false
  ) {
    this.validateArgsOrThrowError();
    if (this.pullOnsStart) {
      this.sync();
    }
  }

  private validateArgsOrThrowError() {
    if (
      this.httpArgs.length < 2 ||
      typeof this.onSyncHandler !== 'function' ||
      typeof this.syncRefreshRate !== 'number' ||
      this.syncRefreshRate <= 0 ||
      typeof this.maxSyncRetries !== 'number' ||
      this.maxSyncRetries <= 0 ||
      typeof this.pullOnsStart !== 'boolean'
    ) {
      throw new Error('Invalid arguments');
    }
  }

  async sync() {
    if (this.syncInProgress) return;

    this.syncInProgress = true;
    this.syncRetries = 0;

    this.syncInterval = AsyncUtilService.setIntervalImmediate(async () => {
      try {
        await this.syncData();
      } catch (e) {
        this.syncRetries++;
        if (this.maxSyncRetries <= this.syncRetries && this.syncInterval) {
          clearInterval(this.syncInterval);
          this.syncInProgress = false;
          this.onFailure(e);
        }
      }
    }, this.syncRefreshRate);
  }

  private async syncData() {
    this.onSyncHandler(await this.httpFetch.fetch(...this.httpArgs));
  }
}
