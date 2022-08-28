import { ApiProperty } from '@nestjs/swagger';
import { Entity, Schema } from 'redis-om';

export class UserData {
  @ApiProperty({ example: '823hd923489223', description: 'The ID of a user' })
  entityId: string;
  @ApiProperty({ example: 'king@gmail.com', description: 'The email of a user' })
  email: string;
  @ApiProperty({ example: 1, description: 'The total number of email recieved by a user' })
  totalMessageReceived: number;
  messageReceivedIds: string[];
}
export class User extends Entity {}

export const userSchema = new Schema(
  User,
  {
    email: { type: 'string' },
    messageReceivedIds: { type: 'string[]' },
    totalMessageReceived: { type: 'number' },
  },
  {
    dataStructure: 'HASH',
  },
);
