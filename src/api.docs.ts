import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export default (app: INestApplication): void => {
  const options = new DocumentBuilder()
    .setTitle('Email Scheduler APIs')
    .setDescription(
      'A collection of API Endpoints for the email scheduler backend.',
    )
    .setVersion('1.0')
    .addTag('User', 'Endpoints for interacting performing user related actions')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
};