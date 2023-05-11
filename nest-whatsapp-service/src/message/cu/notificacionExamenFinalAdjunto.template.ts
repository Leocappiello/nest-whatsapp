import { ExamenFinalDto } from '../dto/templates';

export async function enviarNotificacionExamenFinalConAdjunto(
  cuerpo: ExamenFinalDto,
  templates: Array<any>,
) {
  templates.push(
    {
      type: 'header',
      parameters: [
        {
          type: 'document',
          document: {
            link: cuerpo.link,
            filename: 'some-file-name.pdf',
          },
        },
      ],
    },
    {
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
    },
  );
}
