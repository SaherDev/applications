import { IUser } from './user.interface';

export interface IUserService {
  login(
    userName: Readonly<string>,
    password: Readonly<string>
  ): Promise<IUser | null>;
}
