import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import type { Response } from 'express';
import { Public } from '../auth/decorators/public.decorator';

@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get()
  @Public() // Mark as public so JwtAuthGuard ignores it
  check(@Res({ passthrough: true }) res: Response) {
    const isDbConnected = this.connection?.readyState === 1;

    if (!isDbConnected) {
      res.status(HttpStatus.SERVICE_UNAVAILABLE);
      return {
        status: 'DOWN',
        uptime: process.uptime(),
        database: 'disconnected',
        readyState: this.connection?.readyState ?? 0,
      };
    }

    return {
      status: 'OK',
      uptime: process.uptime(),
      database: 'connected',
    };
  }
}
