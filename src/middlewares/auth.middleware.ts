import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { constants } from '../utils';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  async use(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const apiKey = req.headers['X-API-KEY'] || req.headers['x-api-key'];
    if (!apiKey) throw new UnauthorizedException(constants.API_KEY_REQUIRED);
    const apiKeyToBase64 = Buffer.from(apiKey).toString('base64');
    if (apiKeyToBase64 !== this.configService.get('API_KEY'))
      throw new UnauthorizedException(constants.INVALID_API_KEY);
    next();
  }
}
