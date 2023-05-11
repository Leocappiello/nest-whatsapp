import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventsModule } from './events/events.module';
import { MessageController } from './message/message.controller';
import { MessageModule } from './message/message.module';
import { MessageService } from './message/message.service';

@Module({
  imports: [
    MessageModule,
    ConfigModule.forRoot({ isGlobal: true }),
    EventsModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class AppModule {
  static port: number;
  constructor(private readonly configService: ConfigService) {
    AppModule.port = +this.configService.get('PORT');
  }
}
