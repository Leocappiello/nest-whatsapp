import { ExamenFinalDto } from '../dto/templates';

export async function enviarNotificacionExamenFinal(
  cuerpo: ExamenFinalDto,
  templates: Array<any>,
) {
  templates.push({
    type: 'body',
    parameters: [
      { type: 'text', text: cuerpo.fecha },
      {
        type: 'text',
        text: cuerpo.informacion,
      },
      {
        type: 'text',
        text: cuerpo.materia,
      },
    ],
  });
}
