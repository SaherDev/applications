import { IsString } from 'class-validator';

export class UserResponseDto {
  @IsString()
  userName!: string;
}
