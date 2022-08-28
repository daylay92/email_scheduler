import { createClient } from 'redis';
import { Client } from 'redis-om';
import { Logger } from '@nestjs/common';
import { userSchema } from '../user/user.model';

export default (async (): Promise<void> => {
  const logger = new Logger('Indexing Script');
  const client = process.env.REDIS_URL
    ? createClient({ url: process.env.REDIS_URL as string })
    : createClient();
  await client.connect();
  logger.log('Redis connection has been successfully established');
  client.on('error', (error: Error) =>
    logger.error('Error initialising Redis connection', error?.message),
  );
  const om = await new Client().use(client);
  // Index User Entity
  logger.log('Attempting to index entities');
  await om.fetchRepository(userSchema).createIndex();
  logger.log('Successfully indexed entities');
  process.exit(0);
})();
