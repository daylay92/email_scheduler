import { NestFactory } from '@nestjs/core';
import * as cors from 'cors';
import rateLimit from 'express-rate-limit';
import { ValidationPipe,  } from '@nestjs/common';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AllExceptionsFilter } from './filters';
import { TransformInterceptor } from './interceptors/transform.interceptors';
import apiDocsHandler from './api.docs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // adds security middleware to handle potential attacks from HTTP requests
  app.use(helmet());

  // adds middleware for cross-origin resource sharing using the default package configuration
  app.use(cors());

  // adds application rate limiting
  const apiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 500,
  });

// integrates swagger docs generator
 apiDocsHandler(app);

// only apply to requests that begin with /api/
app.use('/api/', apiLimiter);

  // adds custom exception handling for all endpoints (similar to an exception boundary in React)
  app.useGlobalFilters(new AllExceptionsFilter());

  // adds class-validator enabled functionality for all incoming requestsforbidUnknownValues
  app.useGlobalPipes(
    new ValidationPipe({ stopAtFirstError: true, whitelist: true }),
  );

  // Intercepts and transforms the response body of a request
  app.useGlobalInterceptors(new TransformInterceptor());

  // Fetches the application port from the environment variables.
  const port = configService.get('PORT');

  // listens for requests.
  await app.listen(port);
}
bootstrap();
