export interface Sesion {
  usuarioId: string;
  rolId: number;
}


export const Rol = {
  ADMINISTRADOR: 1,
  EMPLEADO: 2,
  CLIENTE: 3,
};

export const RolS = {
  1: "ADMINISTRADOR",
  2: "EMPLEADO",
  3: "CLIENTE",
};

export interface SelectCliente {
  id: string;
  nombre: string;
  apellido: string;
}