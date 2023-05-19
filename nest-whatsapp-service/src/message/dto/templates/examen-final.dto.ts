import { IsString } from 'class-validator';

export class ExamenFinalDto {
  @IsString()
  to: string;
  @IsString()
  fecha: string;
  @IsString()
  informacion: string;
  @IsString()
  materia: string;
  @IsString()
  link: string;
}
