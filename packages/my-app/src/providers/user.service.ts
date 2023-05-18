import { AUTH_SIGN_IN_URL } from '@/config';
import { IUser } from '@/models';
import { httpService } from './http.service';

export class UserService {
  ///the response need to be decoded
  async login(
    userName: Readonly<string>,
    password: Readonly<string>
  ): Promise<IUser | null> {
    let response: IUser | null = null;
    try {
      response = await httpService.fetch<IUser>(
        AUTH_SIGN_IN_URL,
        'POST',
        {
          data: {
            userName,
            password,
          },
        },
        false
      );
    } catch (error) {}
    return response;
  }
}
export const userService = new UserService();
