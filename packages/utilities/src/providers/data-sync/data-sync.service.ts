import { HttpFetchFunction, HttpFetchFunctionArgs } from '../../models';

import { AsyncUtilService } from '../async';

export class DataSyncService<T> {
  private syncInterval: NodeJS.Timer | null = null;
  private syncInProgress: boolean;
  private pullingRetries: number;

  constructor(
    private readonly httpArgs: HttpFetchFunctionArgs,
    private readonly httpFetch: HttpFetchFunction<T>,
    private readonly pullingRefreshRate: number,
    private readonly maxPullingRetries: number,
    private readonly pullOnsTART: boolean,
    private readonly onPullingHandler: (data: T) => void,
    private readonly onPullingFailed: (error: any) => void
  ) {
    if (this.pullOnsTART) {
      this.sync();
    }
  }

  private sync() {
    if (this.syncInProgress) return;

    this.syncInProgress = true;
    this.pullingRetries = 0;

    this.syncInterval = AsyncUtilService.setIntervalImmediate(async () => {
      try {
        await this.pullData();
      } catch (e) {
        this.pullingRetries++;
        if (
          this.maxPullingRetries <= this.pullingRetries &&
          this.syncInterval
        ) {
          clearInterval(this.syncInterval);
          this.syncInProgress = false;
          this.onPullingFailed(e);
        }
      }
    }, this.pullingRefreshRate);
  }

  private async pullData() {
    this.onPullingHandler(await this.httpFetch(...this.httpArgs));
  }
}
