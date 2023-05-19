import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CachingModule } from './caching/caching.module';
import { DailyCleanUpService } from './daily-clean-up/daily-clean-up.service';
import { DocsModule } from './docs/docs.module';
import { EventsModule } from './events/events.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    CachingModule,
    DocsModule,
    ScheduleModule.forRoot(),
    EventsModule,
    ConfigModule.forRoot(),
  ],
  providers: [DailyCleanUpService],
})
export class AppModule {}
