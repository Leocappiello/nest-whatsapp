import { IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

export class NumberMassiveMessageDto {
  @Transform(({ value }) => parseInt(value))
  @IsArray()
  number: Array<number>;

  to: number;
}
