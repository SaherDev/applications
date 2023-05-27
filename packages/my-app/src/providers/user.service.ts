import { IUser, User, UserResponseDto } from '@/models';

import { AUTH_SIGN_IN_URL } from '@/config';
import { ClassService } from '@application/utilities';
import { httpService } from './http.service';

export class UserService {
  async login(
    userName: Readonly<string>,
    password: Readonly<string>
  ): Promise<IUser | null> {
    let response: UserResponseDto;
    try {
      response = await httpService.fetch<UserResponseDto>(
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
    } catch (error) {
      return null;
    }

    return (await this.toObject(response)) as IUser;
  }

  private async toObject(plain: any): Promise<IUser | IUser[] | null> {
    try {
      return await ClassService.transformAndValidate(
        UserResponseDto,
        plain,
        this.dtoToClass
      );
    } catch (error) {
      return null;
    }
  }

  private dtoToClass(dto: UserResponseDto): IUser {
    return new User(dto.userName);
  }
}
export const userService = new UserService();
