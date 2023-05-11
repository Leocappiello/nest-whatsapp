import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  Param,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { createReadStream, statSync } from 'fs';
import { join } from 'path';
import { Observable } from 'rxjs';
import { CachingService } from 'src/caching/caching.service';

@Controller('docs')
@UseInterceptors(CacheInterceptor)
export class DocsController {
  constructor(private readonly cachingService: CachingService) {}

  @MessagePattern('cachedoc')
  async cachePdf(data): Promise<Observable<any>> {
    const { filename, link } = data;
    const resultSave = await this.cachingService.savePdf(filename, link);
    console.log(resultSave);
    return resultSave;
  }

  @Get(':pdf')
  async getDoc(@Param('pdf') param, @Req() req: Request, @Res() res: Response) {
    const path = join(process.cwd(), 'src/docs/tmp/', param);
    const stat = statSync(path);

    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${param}.pdf`);

    const stream = createReadStream(path);
    stream.pipe(res);
  }
}
