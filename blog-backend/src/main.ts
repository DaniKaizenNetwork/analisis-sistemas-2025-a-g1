// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para permitir peticiones desde el frontend (Next.js)
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // Permitir ambos orígenes
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    credentials: true,
  });

  // Validación global con class-validator y class-transformer
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Prefijo opcional para tus rutas: /api/posts, etc.
  // app.setGlobalPrefix('api');

  await app.listen(3001);
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}

bootstrap();
