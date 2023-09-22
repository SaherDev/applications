import { IRole, IRoleService } from '@/models';

import { CREATE_ROLE_URL } from '@/config';
import { HTTPService } from '@application/utilities';
import { inject, injectable } from 'inversify';
import { APP_CONFIG_SERVICE, HTTP_SERVICE } from './dependencies';
import { IApplicationConfig } from './container.mgr.service';

@injectable()
export class RoleService implements IRoleService {
  constructor(
    @inject(HTTP_SERVICE) private readonly httpService: HTTPService,
    @inject(APP_CONFIG_SERVICE)
    private readonly configService: IApplicationConfig
  ) {}

  async createRole(
    name: Readonly<string>,
    permissions: Readonly<string[]>
  ): Promise<IRole | null> {
    let response: IRole | null = null;
    try {
      response = await this.httpService.fetch<IRole>(CREATE_ROLE_URL, 'POST', {
        data: { name, permissions },
      });
    } catch (error) {}
    return response;
  }
}
