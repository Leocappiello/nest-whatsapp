import { codigoCierreComision } from './cu/codigoCierreComision.template';
import { codigoVerificacionUsuario } from './cu/codigoVerificacion.template';
import { enviarNotificacionExamenFinal } from './cu/notificacionExamenFinal.template';
import { enviarNotificacionExamenFinalConAdjunto } from './cu/notificacionExamenFinalAdjunto.template';
//
import { samplePurchaseFeedback } from './cu/sample.template';

export const actions = {
  hello_world: samplePurchaseFeedback,
  //
  notificacion_examen_final: enviarNotificacionExamenFinal,
  notificacion_examen_final_con_adj: enviarNotificacionExamenFinalConAdjunto,
  codigo_verificacion_usuario: codigoVerificacionUsuario,
  codigo_cierre_comision: codigoCierreComision,
};
