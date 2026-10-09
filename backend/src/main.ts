import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { SanitizationInterceptor } from './common/interceptors/sanitization.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security headers
  app.use(helmet());

  // CORS configuration for local development and cloud production
  const corsOriginsEnv = process.env.CORS_ORIGINS;
  const configuredOrigins = corsOriginsEnv
    ? corsOriginsEnv.split(',').map((o) => o.trim())
    : [];

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin) return callback(null, true);
      if (
        origin.includes('localhost:') ||
        origin.includes('127.0.0.1:') ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.netlify.app') ||
        origin.endsWith('.onrender.com') ||
        configuredOrigins.includes(origin)
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  });

  // Set global API prefix
  app.setGlobalPrefix('api');

  // Register global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Register global interceptors
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new SanitizationInterceptor(),
  );

  // Register global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Fail-fast: validate critical secrets at startup
  console.log('JWT_ACCESS_SECRET:', process.env.JWT_ACCESS_SECRET ? process.env.JWT_ACCESS_SECRET.length : 'undefined');
  if (
    !process.env.JWT_ACCESS_SECRET ||
    process.env.JWT_ACCESS_SECRET.length < 32
  ) {
    throw new Error(
      'JWT_ACCESS_SECRET must be set and at least 32 characters',
    );
  }
  if (
    !process.env.JWT_REFRESH_SECRET ||
    process.env.JWT_REFRESH_SECRET.length < 32
  ) {
    throw new Error(
      'JWT_REFRESH_SECRET must be set and at least 32 characters',
    );
  }
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI must be set');
  }
  if (!process.env.DB_ENCRYPTION_KEY || process.env.DB_ENCRYPTION_KEY.length < 64) {
    throw new Error('DB_ENCRYPTION_KEY must be a 64-character hex string (32 bytes)');
  }

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
