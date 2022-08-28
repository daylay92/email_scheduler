import { Injectable, Inject, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MailService } from '@sendgrid/mail';
import { UserData, User } from '../user/user.model';
import { constants } from '../utils';
import { UserService } from '../user/user.service';
import { getMessage, getMessagesKeys } from './assets/messages';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly cronLogger = new Logger('Cron Job');

  constructor(
    @Inject('mailer') private readonly mailer: MailService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async send(msgId: string, recipient: string[]): Promise<void> {
    const options = {
      from: {
        email: this.configService.get('SENDGRID_EMAIL'),
        name: constants.SENDGRID_NAME,
      },
      to: recipient.length === 1 ? recipient[0] : recipient,
      subject: constants.EMAIL_SUBJECT,
      html: getMessage(msgId),
    };
    await this.mailer.send(options);
  }

  @Cron('* * * * *')
  async messageCronHandler(): Promise<void> {
    // Grab all message keys
    this.cronLogger.log('New messaging cycle started');
    const messageKeys = getMessagesKeys();
    const userCount = await this.userService
      .getUserRepository()
      .search()
      .where('totalMessageReceived')
      .not.eq(messageKeys.length)
      .return.count();
    this.cronLogger.log(
      `Total number of recipients for the current cycle is ${userCount}`,
    );
    await this.messagingHandler(messageKeys, userCount);
  }

  async messagingHandler(
    keys: string[],
    recipientCount: number,
    processedIds: string[] = [],
  ): Promise<void> {
    if (recipientCount > 0) {
      // Randomly obtain a message
      const cloneKeys = [...keys];
      const randomIndex = Math.floor(Math.random() * keys.length);
      const [messageKey] = cloneKeys.splice(randomIndex, 1);
      this.cronLogger.log(
        `Message with key: ${messageKey} is being processed.`,
      );
      let recipientsQuery = this.userService
        .getUserRepository()
        .search()
        .where('messageReceivedIds')
        .not.contains(messageKey);
      // This essentially prevents a user from being sent more than one message per cycle
      const updatedProcessedIds = [...processedIds];
      if (updatedProcessedIds.length)
        updatedProcessedIds.forEach(key => {
          recipientsQuery = recipientsQuery
            .and('messageReceivedIds')
            .not.contains(key);
        });
      // Todo: optimize by batching processing recipients
      const recipients = await recipientsQuery.returnAll();
      const totalRecipients = recipients.length;
      if (totalRecipients) {
        // Send email to recipients who hasn't recieved the message with the message key obtained
        const recipientsPayload = (recipients as unknown) as UserData[];
        await this.send(
          messageKey,
          recipientsPayload.map(({ email }) => email),
        );
        this.cronLogger.log(
          `Message with key: ${messageKey} successfully sent to ${totalRecipients} recipient(s).`,
        );
        // update all users after message has been sent to indicate recipient of message
        await Promise.all(
          recipientsPayload.map(async recipient => {
            if (!recipient?.messageReceivedIds?.length)
              recipient.messageReceivedIds = [messageKey];
            else recipient.messageReceivedIds.push(messageKey);
            recipient.totalMessageReceived += 1;
            await this.userService
              .getUserRepository()
              .save((recipient as unknown) as User);
          }),
        );
        this.cronLogger.log(
          `Message with key: ${messageKey} successfully added to recipients sent list.`,
        );
        updatedProcessedIds.push(messageKey);
      } else {
        this.cronLogger.log(
          `Message with key: ${messageKey} seem to have been sent to all users, skipping to next message.`,
        );
      }
      return this.messagingHandler(
        cloneKeys,
        recipientCount - totalRecipients,
        updatedProcessedIds,
      );
    }
  }
}
