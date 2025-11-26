export interface Sesion {
  usuarioId: string;
  rolId: number;
}


export const Rol = {
  ADMINISTRADOR: 1,
  EMPLEADO: 2,
  CLIENTE: 3,
};

export interface SelectCliente {
  id: string;
  nombre: string;
}