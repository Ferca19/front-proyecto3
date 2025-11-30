import * as yup from "yup";
import type { Reclamo } from "../../../interfaces/gestion-reclamo/interfaces-reclamo";


//===================== interfaces para las cosas que se van a ingresar en el formulario y es necesario validarlas ==========//

export interface FormValuesReclamo{
  titulo: string;
  descripcion: string;
  tipo: number
  prioridad: number
  criticidad: number
  proyectoId: string;
}

//===================== schema de validacion ============================================//

export const schemaReclamo = 
  yup.object().shape({
    titulo: yup.string().required("El título es obligatorio").max(200, "El título no puede tener más de 200 caracteres"),
    descripcion: yup.string().required("La descripción es obligatoria").max(400, "La descripción no puede tener más de 400 caracteres"),
    tipo: yup.number().required("El tipo de reclamo es obligatorio"),
    prioridad: yup.number().required("La prioridad es obligatoria"),
    criticidad: yup.number().required("La criticidad es obligatoria"),
    proyectoId: yup.string().required("El proyecto es obligatorio"),
  });

//===================== transform data ============================================//

/*
export const transformData = (reclamo: Reclamo): FormValuesReclamo => {
  return {
    
    
    descripcion: reclamo.descripcion ?? null,
    tipo: reclamo.tipo ?? null,
    prioridad: reclamo.prioridad ?? 0,
    criticidad: reclamo.criticidad ?? 0,
    proyectoId: reclamo.proyecto.id ?? "",

  
  };
};
*/

export const transformData = (reclamo: Reclamo): FormValuesReclamo => {
  return {
    tipo: reclamo.tipo ?? null,
    prioridad: reclamo.prioridad ?? 0,
    criticidad: reclamo.criticidad ?? 0,
    descripcion: reclamo.descripcion ?? null,
    titulo: reclamo.titulo,
    proyectoId: reclamo.proyecto.id ?? "",

  
  };
};

