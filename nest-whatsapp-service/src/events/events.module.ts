import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EventsService } from './events.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CACHING-CLIENT',
        transport: Transport.TCP,
        options: {
          host: 'caching-service',
          port: 3001,
        },
      },
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
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
