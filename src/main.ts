import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    // {
    // logger: console,
    // }
  );
  app.use(cookieParser());
  // app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // returns empty payload
  app.enableCors({
    credentials: true,
    origin: 'http://localhost:5173',
    allowedHeaders: ['Authorization', 'Content-Type'],
  });
  await app.listen(3000);
}
bootstrap();
