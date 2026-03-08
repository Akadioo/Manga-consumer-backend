import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, CanActivate, ExecutionContext } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger as PinoLogger } from 'nestjs-pino';

import fastifyHelmet from '@fastify/helmet';
import fastifyCors from '@fastify/cors';
import multipart from '@fastify/multipart';

import { AppModule } from './app.module';

class DevBypassGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}

async function bootstrap() {
  console.log('Iniciando Consumer con Fastify...');

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true },
  );

  const PORT = Number(process.env.APP_PORT) || 4000;

  app.useLogger(app.get(PinoLogger));

  console.log('Configurando CORS para Render...');
  await app.register(fastifyCors, {
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://mangaweb.onrender.com',
      'https://mangaweb-wami.onrender.com',
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Authorization',
      'X-User-Session',
    ],
    credentials: true,
  });

  await app.register(fastifyHelmet, {
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  });

  await app.register(multipart, {
    attachFieldsToBody: true,
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  const isLocal = process.env.ENVIRONMENT !== 'production';

  if (isLocal) {
    console.log('Modo local: bypass de guards activado');
    app.useGlobalGuards(new DevBypassGuard());
  }

  if (isLocal) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('API CONSUMER - MANGA NO STORE')
      .setDescription(
        'API del Consumer que interactúa con el CRUD de MangaNoStore',
      )
      .setVersion('1.0.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'APPToken' },
        'app-token',
      )
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);

    console.log('Swagger habilitado en entorno local → /api/docs');
  } else {
    console.log('Swagger deshabilitado en entorno de producción.');
  }

  await app.listen({ port: PORT, host: '0.0.0.0' });
  console.log(`Consumer (Fastify) corriendo en puerto ${PORT}`);
}

bootstrap();
