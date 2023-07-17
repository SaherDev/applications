import { HttpFetchFunction, HttpFetchFunctionArgs } from '../../models';

import { AsyncUtilService } from '../async';

export class DataSyncService<T> {
  private syncInterval: NodeJS.Timer | null = null;
  private syncInProgress: boolean;
  private syncRetries: number;

  constructor(
    private readonly httpArgs: HttpFetchFunctionArgs,
    private readonly httpFetch: HttpFetchFunction<T>,
    private readonly syncRefreshRate: number,
    private readonly maxSyncRetries: number,
    private readonly pullOnsStart: boolean,
    private readonly onSyncHandler: (data: T) => void,
    private readonly onSyncFailed: (error: any) => void
  ) {
    if (this.pullOnsStart) {
      this.sync();
    }
  }

  sync() {
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
          this.onSyncFailed(e);
        }
      }
    }, this.syncRefreshRate);
  }

  private async syncData() {
    this.onSyncHandler(await this.httpFetch(...this.httpArgs));
  }
}
