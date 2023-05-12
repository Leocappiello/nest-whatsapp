import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const MS_PORT = configService.get<number>('MS_PORT');
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: MS_PORT,
      host: 'storing-service',
      retryAttempts: 5,
      retryDelay: 1000,
    },
  });

  await app.startAllMicroservices();
  const PORT = configService.get<number>('PORT');
  await app.listen(PORT);
}
bootstrap();
