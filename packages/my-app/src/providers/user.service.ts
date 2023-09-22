import {
  ClassService,
  IResilientHttpService,
  RESILIENT_HTTP_SERVICE,
} from '@application/utilities';
import { IUser, IUserService, User, UserResponseDto } from '@/models';

import { AUTH_SIGN_IN_URL } from '@/config';
import { inject, injectable } from 'inversify';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(RESILIENT_HTTP_SERVICE)
    private readonly httpService: IResilientHttpService
  ) {}

  async login(
    userName: Readonly<string>,
    password: Readonly<string>
  ): Promise<IUser | null> {
    let response: UserResponseDto;
    try {
      response = await this.httpService.fetch<UserResponseDto>([
        AUTH_SIGN_IN_URL,
        'POST',
        {
          data: {
            userName,
            password,
          },
        },
        false,
      ]);
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
