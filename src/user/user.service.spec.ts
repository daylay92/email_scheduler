import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { UserService } from './user.service';
import { mockSchema } from './user.test-fixture';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { constants } from '../utils';

describe('UserService Unit Tests', () => {
  let userService: UserService;
  const firstEmail = faker.internet.email()
  beforeEach(async () => {
    
    const ref: TestingModule = await Test.createTestingModule({
      providers: [{
        provide: 'redis',
        useValue: {
          fetchRepository(): typeof mockSchema {
            return mockSchema
          }
        }
      },UserService],
    }).compile();
    userService = ref.get<UserService>(UserService);
  });
  describe('Adding a new user', () => {
    it ('should successfully add user', async () => {
      const user = await userService.addUser({
        email: firstEmail,
      })
      expect(user.email).toBe(firstEmail.toLowerCase());
      expect(user.totalMessageReceived).toBe(0);
    })

    it ('should throw an error if same email is used to create user', async () => {
      userService.addUser({
        email: firstEmail,
      }).then(() => {
        throw new Error()
      })
      .catch((err: Error) => {
        expect(err).toBeInstanceOf(ConflictException);
        expect(err?.message).toBe(constants.USER_ALREADY_EXISTS)
      });
    })
  })

  describe('Get a list of paginated users', () => {
    it ('should successfully get all with pagination query', async () => {
      await userService.addUser({ email: faker.internet.email()})
      const users = await userService.getUsers({
        pageNumber: '1',
        pageSize: '1'
      })
      expect(users?.pagination).toBeDefined;
      expect(users?.pagination?.total).toBe(2);
      expect(users?.data?.length).toBe(1);
    })
  })

  describe('Get a single user by ID', () => {
    it ('should successfully retrieve a user if the ID is correct', async () => {
      const user = await userService.getUser('1');
      expect(user).not.toBeDefined;
    })

    it('should return a NotFoundException Error (404) if a user was not found by ID', async () => {
     userService.getUser('5').then(() => {
      throw new Error()
    })
    .catch((err: Error) => {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err?.message).toBe(constants.USER_NOT_FOUND);
    });
    });
  })

  describe('It should delete a user by ID', () => {
    it ('should successfully remove a user if the ID is correct', async () => {
      const user = await userService.removeUser('1');
      expect(user).not.toBeDefined;
    })

    it('should return a NotFoundException Error (404) if a user was not found by ID', async () => {
     userService.getUser('6').then(() => {
      throw new Error()
    })
    .catch((err: Error) => {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err?.message).toBe(constants.USER_NOT_FOUND);
    });
    });
  })
});
