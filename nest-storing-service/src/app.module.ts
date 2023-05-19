import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoModule } from './db/mongo/mongo.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [ConfigModule.forRoot(), MongoModule, MessageModule],
})
export class AppModule {}
