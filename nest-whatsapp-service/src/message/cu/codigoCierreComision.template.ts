import { CodigoVerificacionCierreComisionDto } from '../dto/templates/codigo-verificacion-cierre-comision.dto';

export async function codigoCierreComision(
  cuerpo: CodigoVerificacionCierreComisionDto,
  templates: Array<any>,
) {
  templates.push({
    type: 'body',
    parameters: [
      { type: 'text', text: cuerpo.materia },
      { type: 'text', text: cuerpo.anio },
      { type: 'text', text: cuerpo.hash },
    ],
  });
}
