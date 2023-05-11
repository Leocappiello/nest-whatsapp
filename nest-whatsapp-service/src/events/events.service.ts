import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CLIENTS } from './clients';
import { Observable, share } from 'rxjs';

@Injectable()
export class EventsService implements OnApplicationBootstrap {
  constructor(
    /* @Inject('CACHING-CLIENT')
    private readonly cachingService: ClientProxy, */
    @Inject('STORING-CLIENT')
    private readonly storingService: ClientProxy,
  ) {}

  async onApplicationBootstrap() {
    console.log('connecting...');
    //await this.cachingService.connect();
    await this.storingService.connect();
  }

  /* async emit(message: string, data: any, client: string) {
    await this.cachingService.emit(message, data);
  } */

  send(event: string, data: any, client: string): Observable<any> {
    return this[CLIENTS[client]].send(event, data).pipe(share());
  }
}
