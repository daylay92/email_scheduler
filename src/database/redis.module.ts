import { createClient } from 'redis';
import { Client } from 'redis-om';
import { Global, Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

const redisFactory = {
  provide: 'redis',
  useFactory: async (configService: ConfigService): Promise<Client> => {
    const logger = new Logger('Redis');
    const url = configService.get('REDIS_URL');
    const client = createClient({
      url,
    });
    await client.connect();
    logger.log('Redis connection has been successfully established');
    client.on('error', (error: Error) =>
      logger.error('Error initialising Redis connection', error?.message),
    );
    const om = await new Client().use(client);
    return om;
  },
  inject: [ConfigService],
};

@Global()
@Module({
  imports: [ConfigModule],
  providers: [redisFactory],
  exports: [redisFactory],
})
export class RedisModule {}
