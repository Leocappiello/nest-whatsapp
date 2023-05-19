import { HttpModule } from '@nestjs/axios';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CachingModule } from 'src/caching/caching.module';
import { CachingService } from 'src/caching/caching.service';
import { EventsModule } from 'src/events/events.module';
import { DocsController } from './docs.controller';

@Module({
  imports: [HttpModule, CachingModule, EventsModule, CacheModule.register()],
  controllers: [DocsController],
  providers: [
    CachingService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class DocsModule {}
