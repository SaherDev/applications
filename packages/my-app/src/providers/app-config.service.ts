import { IConfigBase, ISyncConfigService } from '@application/models';

import { AUTH_REFRESH_URL } from '@/config';
import { SyncConfigService } from '@application/utilities';
import { httpService } from './http.service';

//XXX: THIS ONLY EXAMPLE FOR CONFIG
const defaultConfig = {
  meta: {
    version: 0,
  },
  someProperty: 'someValue',
};

interface IAppConfig extends IConfigBase {
  someProperty: string;
}

export const configService: ISyncConfigService<IAppConfig> =
  new SyncConfigService<IAppConfig>(
    [AUTH_REFRESH_URL, 'POST', , false],
    (...args) => httpService.fetch(...args),
    1000 * 5,
    3,
    (config) => config,
    defaultConfig,
    true
  );
