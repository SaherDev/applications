import {
  APP_CONFIG_SERVICE,
  HTTP_SERVICE,
  ROLE_SERVICE,
  USER_SERVICE,
} from './dependencies';
import { HTTPService, SyncConfigService } from '@application/utilities';
import { IConfigBase, ISyncConfigService } from '@application/models';

import { AUTH_REFRESH_URL } from '@/config';
import { Container } from 'inversify';
import { IRoleService } from './../models/role/role.service.interface';
import { IUserService } from './../models/user/user.service.interface';
import { RoleService } from './role.service';
import { UserService } from './user.service';
import { useMemo } from 'react';

interface IAppConfig extends IConfigBase {
  someProperty: string;
}
const defaultConfig = {
  meta: {
    version: 0,
  },
  someProperty: 'someValue',
};

const container = new Container();
let isConTainerInitialized: boolean = false;

function initializeConTainer(): Container {
  if (isConTainerInitialized) return container;

  container.bind<HTTPService>(HTTP_SERVICE).toDynamicValue(() => {
    const httpService = new HTTPService();

    httpService.initialize(AUTH_REFRESH_URL, () => {
      alert('navigate to login');
    });

    return httpService;
  });

  container.bind(APP_CONFIG_SERVICE).toDynamicValue((ctx) => {
    return new SyncConfigService<IAppConfig>(
      [AUTH_REFRESH_URL, 'POST', , false],
      ctx.container.get<HTTPService>(HTTP_SERVICE),
      1000 * 5,
      3,
      (config) => config,
      defaultConfig,
      true
    );
  });

  container.bind<IUserService>(USER_SERVICE).to(UserService);

  container.bind<IRoleService>(ROLE_SERVICE).to(RoleService);

  isConTainerInitialized = true;
  return container;
}

function useInject<T>(key: any): T {
  return container.get<T>(key);
}

interface IApplicationConfig extends ISyncConfigService<IConfigBase> {}

export { initializeConTainer, useInject, IApplicationConfig, HTTPService };