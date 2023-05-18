import { CREATE_ROLE_URL } from '@/config';
import { IRole } from '@/models/role';
import { httpService } from './http.service';

export class RoleService {
  async createRole(
    name: Readonly<string>,
    permissions: Readonly<string[]>
  ): Promise<IRole | null> {
    let response: IRole | null = null;
    try {
      response = await httpService.fetch<IRole>(CREATE_ROLE_URL, 'POST', {
        data: { name, permissions },
      });
    } catch (error) {}
    return response;
  }
}
export const roleService = new RoleService();
