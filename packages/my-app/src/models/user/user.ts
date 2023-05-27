import { IUser } from './user.interface';

export class User implements IUser {
  constructor(public userName: string) {}
}
