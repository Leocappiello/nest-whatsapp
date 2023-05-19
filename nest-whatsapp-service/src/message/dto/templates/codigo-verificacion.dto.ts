import { IsString } from 'class-validator';

export class CodigoVerificacionDto {
  @IsString()
  to: string;
  @IsString()
  materia: string;
  @IsString()
  hash: string;
}
