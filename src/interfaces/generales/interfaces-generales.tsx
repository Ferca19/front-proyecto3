export interface Sesion {
  usuarioId: number;
  rolId: number;
}


export const Rol = {
  ADMINISTRADOR: 1,
  EMPLEADO: 2,
  AUDITOR: 3,
};
