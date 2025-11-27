import * as yup from "yup";

export interface DecodedToken {
  rolId: number;
}

//===================== interfaces para las cosas que se van a ingresar en el formulario y es necesario validarlas ==========//

export interface FormValuesRegister {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  passwordConfirmada: string;
  rolId: number;
  areaId?: string;
  telefono?: string;
  direccion?: string;
  localidad?: string;
}

export interface FormValuesLogin {
  email: string;
  password: string;
}

export interface FormValuesRecuperarContrasena {
  email: string;
  codigo: string;
}

export interface FormValuesCambiarContrasena {
  nuevaContrasena: string;
  confirmarContrasena: string;
}

//===================== schema de validacion ============================================//

export const schemaLogin = yup.object().shape({
  email: yup
    .string()
    .trim()
    .lowercase()
    .required("El correo electrónico es obligatorio.")
    .max(255, "Máximo 255 caracteres.")
    .matches(/^[A-Za-z0-9@._-]+$/, "Formato de correo inválido."),
  password: yup.string().typeError("La contraseña es obligatoria.").required("La contraseña es obligatoria."),
});

export const schemaRegister = yup.object().shape({
  nombre: yup
    .string()
    .trim()
    .lowercase()
    .required("El nombre es obligatorio.")
    .max(50, "Máximo 50 caracteres.")
    .matches(/^[A-Za-záéíóúÁÉÍÓÚñÑ]+$/, "Solo se permiten letras."),
  apellido: yup
    .string()
    .trim()
    .lowercase()
    .required("El apellido es obligatorio.")
    .max(50, "Máximo 50 caracteres.")
    .matches(/^[A-Za-záéíóúÁÉÍÓÚñÑ]+$/, "Solo se permiten letras."),
  email: yup
    .string()
    .trim()
    .lowercase()
    .required("El correo electrónico es obligatorio.")
    .max(255, "Máximo 255 caracteres.")
    .matches(/^[A-Za-z0-9@._-]+$/, "Formato de correo inválido."),
  password: yup
    .string()
    .required("La contraseña es obligatoria.")
    .min(6, "La contraseña debe tener al menos 6 caracteres."),
  passwordConfirmada: yup
    .string()
    .required("La contraseña es obligatoria.")
    .min(6, "La contraseña debe tener al menos 6 caracteres."),
  rolId: yup.number().typeError("El rol es obligatorio.").required("El rol es obligatorio."),
  areaId: yup.string().typeError("El área es obligatoria.").notRequired(),
  telefono: yup
    .string()
    .trim()
    .notRequired()
    .max(20, "Máximo 20 caracteres.")
    .matches(/^[0-9()+-\s]*$/, "Formato de teléfono inválido."),
  direccion: yup
    .string()
    .trim()
    .notRequired()
    .max(255, "Máximo 255 caracteres."),
  localidad: yup
    .string()
    .trim()
    .notRequired()
    .max(100, "Máximo 100 caracteres."),
});

export const schemaRecuperarContrasena = yup.object().shape({
  email: yup
    .string()
    .trim()
    .lowercase()
    .required("El correo electrónico es obligatorio.")
    .max(255, "Máximo 255 caracteres.")
    .matches(/^[A-Za-z0-9@._-]+$/, "Formato de correo inválido."),
  codigo: yup
    .string()
    .required("El código es obligatorio.")
    .length(6, "El código debe tener 6 caracteres.")
    .matches(/^[0-9]+$/, "El código debe ser numérico."),
});

export const schemaCambiarContrasena = yup.object().shape({
  nuevaContrasena: yup
    .string()
    .required("La nueva contraseña es obligatoria.")
    .min(8, "La contraseña debe tener al menos 8 caracteres."),
  confirmarContrasena: yup
    .string()
    .required("Debes confirmar la nueva contraseña.")
    .oneOf([yup.ref("nuevaContrasena")], "Las contraseñas no coinciden."),
});
