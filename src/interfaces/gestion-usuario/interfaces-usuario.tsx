


export type Rol = {
  id: number;
  nombre: string;
};

export interface Usuario {
  id: number;
  nombre: string
  apellido: string
  email: string;
  rol: Rol;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
}

export interface SelectUsuario {
  id: number;
  correo: string;
}
