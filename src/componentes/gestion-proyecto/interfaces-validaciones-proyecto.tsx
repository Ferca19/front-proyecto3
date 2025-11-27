import * as yup from "yup";
//===================== interfaces para las cosas que se van a ingresar en el formulario y es necesario validarlas ==========//

export interface FormValuesProyecto {
  clienteId: string;
  nombre: string;
  descripcion?: string;
}

//===================== schema de validacion ============================================//

export const schemaProyecto = yup.object().shape({
  clienteId: yup.string().required("El cliente es obligatorio"),
  nombre: yup.string().required("El nombre es obligatorio"),
  descripcion: yup.string().optional(),
});

//===================== transform data ============================================//

