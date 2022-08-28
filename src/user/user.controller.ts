import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { ApiExtraModels, ApiHeader, ApiOkResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { PaginatedResponse, PaginationResult } from '../types';
import { AddUserDto, GetUsersDto } from './user.dto';
import { UserData } from './user.model';
import { UserService } from './user.service';

@ApiExtraModels(PaginatedResponse, UserData, PaginationResult)
@ApiHeader({
  name: 'x-api-key',
  description: 'Provide the API key before making the request',
})
@ApiTags('User')
@Controller('/api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(201)
  addUser(@Body() dto: AddUserDto): Promise<Partial<UserData>> {
    return this.userService.addUser(dto);
  }

  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResponse) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(UserData) },
            },
            pagination: {
              type: 'object',
              properties: {
                total: {
                  type: 'number',
                },
                pageSize: {
                  type: 'number',
                },
                pageNumber: {
                  type: 'number',
                }
              }

            }
          },
        },
      ],
    },
  })
  @Get()
  getUsers(
    @Query() dto: GetUsersDto,
  ): Promise<PaginatedResponse<Partial<UserData>>> {
    return this.userService.getUsers(dto);
  }

  @Get('/:id')
  getUser(@Param('id') id: string): Promise<UserData> {
    return this.userService.getUser(id);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string): Promise<Record<string, string>> {
    return this.userService.removeUser(id);
  }
}
