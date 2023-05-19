import { IsNumber, IsString } from 'class-validator';

export class CodigoVerificacionCierreComisionDto {
  @IsString()
  to: string;
  @IsString()
  materia: string;
  @IsNumber()
  anio: number;
  @IsString()
  hash: string;
}
