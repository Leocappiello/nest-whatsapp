import { HttpModule } from '@nestjs/axios/dist';
import { Module } from '@nestjs/common';
import { EventsModule } from 'src/events/events.module';
import { ProvidersModule } from 'src/providers/providers.module';
import { MessageController } from './message.controller';
import { MessageGuard } from './message.guard';
import { MessageService } from './message.service';
import { EventsService } from 'src/events/events.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    EventsModule,
    HttpModule,
    ProvidersModule,
    ClientsModule.register([
      /* {
        name: 'CACHING-CLIENT',
        transport: Transport.TCP,
        options: {
          host: 'caching-service',
          port: 3001,
        },
      }, */
      {
        name: 'STORING-CLIENT',
        transport: Transport.TCP,
        options: {
          host: 'storing-service',
          port: 3003,
        },
      },
    ]),
  ],
  controllers: [MessageController],
  providers: [MessageService, MessageGuard, EventsService],
})
export class MessageModule {}
