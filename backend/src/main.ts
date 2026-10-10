import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { SanitizationInterceptor } from './common/interceptors/sanitization.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

function validateEnvironment() {
  // Fail-fast: validate critical secrets at startup
  console.log(
    'JWT_ACCESS_SECRET:',
    process.env.JWT_ACCESS_SECRET ? process.env.JWT_ACCESS_SECRET.length : 'undefined',
  );
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
  const hex64Regex = /^[0-9a-fA-F]{64}$/;
  if (
    !process.env.DB_ENCRYPTION_KEY ||
    process.env.DB_ENCRYPTION_KEY.length < 64 ||
    !hex64Regex.test(process.env.DB_ENCRYPTION_KEY)
  ) {
    throw new Error(
      'DB_ENCRYPTION_KEY must be a 64-character hex string (32 bytes)',
    );
  }
}

async function bootstrap() {
  validateEnvironment();

  const app = await NestFactory.create(AppModule);

  // Security headers
  app.use(helmet());

  // CORS configuration for local development and cloud production
  const corsOriginsEnv = process.env.CORS_ORIGINS;
  const configuredOrigins = corsOriginsEnv
    ? corsOriginsEnv.split(',').map((o) => o.trim()).filter(Boolean)
    : [];
  const isProd = process.env.NODE_ENV === 'production';

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      // Local development origins allowed in non-production
      if (
        !isProd &&
        (origin.startsWith('http://localhost:') ||
          origin.startsWith('http://127.0.0.1:'))
      ) {
        return callback(null, true);
      }

      // Check explicitly configured origins
      if (configuredOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow production frontend host on Render, Vercel, or configured FRONTEND_URL
      if (
        origin === 'https://scpr-frontend.onrender.com' ||
        origin === 'https://smart-carrer-path.vercel.app' ||
        (process.env.FRONTEND_URL &&
          (origin === process.env.FRONTEND_URL ||
            origin === process.env.FRONTEND_URL.replace(/\/$/, '')))
      ) {
        return callback(null, true);
      }

      return callback(
        new Error(`Origin ${origin} not allowed by CORS policy`),
        false,
      );
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

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
