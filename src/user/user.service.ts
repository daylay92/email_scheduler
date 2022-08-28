import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Client, Repository } from 'redis-om';
import { AddUserDto, GetUsersDto } from './user.dto';
import { userSchema, User, UserData } from './user.model';
import { constants } from '../utils';
import { PaginatedResponse } from '../types';

@Injectable()
export class UserService {
  private readonly userRepository: Repository<User>;
  constructor(@Inject('redis') client: Client) {
    this.userRepository = client.fetchRepository(userSchema);
  }

  public getUserRepository(): Repository<User> {
    return this.userRepository;
  }

  async addUser(dto: AddUserDto): Promise<Partial<UserData>> {
    const userId = await this.userRepository
      .search()
      .where('email')
      .eq(dto.email.toLowerCase())
      .firstId();
    if (userId) throw new ConflictException(constants.USER_ALREADY_EXISTS);
    const user = this.userRepository.createEntity({
      email: dto.email.toLowerCase(),
      messageRecievedIds: [],
      totalMessageReceived: 0,
    });
    await this.userRepository.save(user);
    const {
      entityId,
      email,
      totalMessageReceived,
    } = (user as unknown) as UserData;
    return { entityId, email, totalMessageReceived };
  }

  async getUsers(
    dto: GetUsersDto,
  ): Promise<PaginatedResponse<Partial<UserData>>> {
    const page = +(dto?.pageNumber || '1');
    const pageSize = +(dto?.pageSize || '30');
    const total = await this.userRepository.search().count();
    const users = ((await this.userRepository
      .search()
      .page((page - 1) * pageSize, pageSize)) as unknown) as Partial<
      UserData
    >[];
    return {
      data: users?.map(({ entityId, email, totalMessageReceived }) => ({
        entityId,
        email,
        totalMessageReceived,
      })),
      pagination: {
        pageNumber: page,
        pageSize,
        total,
      },
    };
  }
  async getUser(id: string): Promise<UserData> {
    const user = await this.userRepository.fetch(id);
    if (!((user as unknown) as UserData)?.entityId)
      throw new NotFoundException(constants.USER_NOT_FOUND);
    return (user as unknown) as UserData;
  }

  async removeUser(id: string): Promise<Record<string, string>> {
    await this.getUser(id);
    await this.userRepository.remove(id);
    return {};
  }
}
