import { IRole } from '@/models/role';

export interface IRoleService {
  createRole(
    name: Readonly<string>,
    permissions: Readonly<string[]>
  ): Promise<IRole | null>;
}
