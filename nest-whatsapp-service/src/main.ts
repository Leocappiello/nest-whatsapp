import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');
  const PORT_CACHING_TWO = configService.get('PORT_CACHING_TWO');
  const PORT_CACHING = configService.get('PORT_CACHING');
  const PORT_STORING = configService.get('PORT_STORING');
  // nest caching service
  /* const ms = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: PORT_CACHING_TWO,
        retryAttempts: 5,
        retryDelay: 1000,
      },
    },
  );
  await ms.listen();

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: 'caching-service',
      port: PORT_CACHING, // 3001
      retryAttempts: 5,
      retryDelay: 1000,
    },
  }); */

  // nest storing service
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: 'storing-service',
      port: PORT_STORING, //3003
      retryAttempts: 5,
      retryDelay: 1000,
    },
  });

  await app.listen(PORT);
}
bootstrap();
