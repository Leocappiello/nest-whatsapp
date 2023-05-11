import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, catchError } from 'rxjs';
import { AxiosError } from 'axios';
import { delay } from 'rxjs/operators';

@Injectable()
export class HttpCustomService {
  constructor(private readonly httpService: HttpService) {}

  public async postMessage(url: string, dataMessage: any) {
    /* const { config, status, data } = await firstValueFrom(
      this.httpService.post(url, dataMessage).pipe(
        catchError((error: AxiosError) => {
          console.log(error.code, error.response.status, error.response.data);
          throw new HttpException(error.response.data, error.response.status);
        }),
      ),
    );

    return { config, status, data }; */
    const { config, status, data } = await firstValueFrom(
      this.httpService.post(url, dataMessage).pipe(
        delay(100),
        catchError((error: AxiosError) => {
          console.log(error.code, error.response.status, error.response.data);
          throw new HttpException(error.response.data, error.response.status);
        }),
      ),
    );

    return { config, status, data };
  }
}
