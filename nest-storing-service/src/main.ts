import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const MS_PORT = configService.get<number>('MS_PORT');
  const ms = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: MS_PORT,
        host: 'whatsapp-service',
        retryAttempts: 5,
        retryDelay: 1000,
      },
    },
  );
  await ms.listen();
  const PORT = configService.get<number>('PORT');
  await app.listen(PORT);
}
bootstrap();
