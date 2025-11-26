import * as yup from "yup";
//===================== interfaces para las cosas que se van a ingresar en el formulario y es necesario validarlas ==========//

export interface FormValuesProyecto {
  clienteId: string;
}

//===================== schema de validacion ============================================//

export const schemaProyecto = yup.object().shape({
  clienteId: yup.string().required("El cliente es obligatorio"),
});

//===================== transform data ============================================//

