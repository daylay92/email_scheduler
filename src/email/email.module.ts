import { Module } from '@nestjs/common';
import * as sendGrid from '@sendgrid/mail';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { EmailService } from './email.service';

@Module({
  imports: [ConfigModule, UserModule],
  providers: [
    {
      provide: 'mailer',
      useFactory: (configService: ConfigService): sendGrid.MailService =>{
      sendGrid.setApiKey(configService.get<string>('SENDGRID_API_KEY') as string);
      return sendGrid;
    },
      inject: [ConfigService],
    },
    EmailService,
  ],
  exports: [EmailService],
})
export class EmailModule {}
