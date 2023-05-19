import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { createWriteStream, existsSync, statSync, unlink } from 'fs';
import { join } from 'path';

@Injectable()
export class CachingService {
  public async savePdf(key: string, url: string) {
    let result;
    console.log('key:', key, 'url:', url);
    const filePath = join(process.cwd(), 'src/docs/tmp/', `${key}.pdf`);

    try {
      const response = await axios.get(url, {
        responseType: 'stream',
        timeout: 10000,
      });
      const writer = createWriteStream(filePath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      const fileSize = Number(response.headers['content-length']);
      const realSize = statSync(filePath).size;
      result = existsSync(filePath) && fileSize === realSize;
    } catch (error) {
      console.log('error on download of PDF');
    }

    if (!result && existsSync(filePath)) {
      try {
        await unlink(filePath, (err) => console.error(err));
      } catch (error) {
        console.error(error);
      }
    }

    return result;
  }
}
