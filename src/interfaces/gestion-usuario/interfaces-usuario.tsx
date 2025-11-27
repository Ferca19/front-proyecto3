


export type Rol = {
  id: number;
  nombre: string;
};

export interface Usuario {
  _id: number;
  nombre: string
  apellido: string
  email: string;
  rol: Rol;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  area: Area;
  telefono?: string;
  direccion?: string;
  localidad?: string;
}

export interface Area {
  _id: string;
  nombre: string;
}



export interface SelectUsuario {
  _id: string;
  correo: string;
}
