import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

const prisma = new PrismaClient();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.enableShutdownHooks();
  app.enableCors({
    credentials: true,
    origin: 'http://localhost:5173',
    allowedHeaders: ['Authorization', 'Content-Type'],
  });

  process.on('beforeExit', async (code) => {
    console.log(`Process will exit with code: ${code}`);
    await prisma.$disconnect();
  });
  await app.listen(3000);
}

bootstrap();
