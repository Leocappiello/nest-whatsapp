import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { readdir, unlink } from 'fs';
import { join } from 'path';

@Injectable()
export class DailyCleanUpService {
  @Cron('0 0 * * *')
  async cleanUp() {
    const folderPath = join(process.cwd(), '/src/docs/tmp');
    readdir(folderPath, (err, files) => {
      if (err) {
        console.error(err);
      } else {
        for (const file of files) {
          unlink(`${folderPath}/${file}`, (err) => {
            if (err) {
              console.error(err);
            } else {
              console.log(`Deleted ${file}`);
            }
          });
        }
      }
    });
  }
}
