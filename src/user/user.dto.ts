import { IsEmail, IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';
import { constants } from '../utils';

export class AddUserDto {
  @IsNotEmpty({
    message: constants.EMAIL_NOT_EMPTY,
  })
  @IsEmail(
    {},
    {
      message: constants.VALID_EMAIL_REQUIRED,
    },
  )
  email: string;
}


export class GetUsersDto {
  @IsOptional()
  @IsNumberString()
  pageNumber?: string;

  @IsOptional()
  @IsNumberString()
  pageSize?: string;
}