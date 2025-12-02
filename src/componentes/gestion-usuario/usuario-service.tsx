import { api } from "../../utils/apiService";
import axiosConfig from "../../utils/axiosConfig";
import { createCrudService } from "../../utils/crudFactory";
import type { FormValuesRegister } from "./interfaces-validaciones-usuario";

const apiUrl = axiosConfig.apiUrl;

const baseService = createCrudService<FormValuesRegister>("usuario");

const UsuarioService = {
  ...baseService,
  
  obtenerUsuarioId: async (id: number) => {
    try {
      const token = localStorage.getItem("Token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const { data } = await api.get(`${apiUrl}/usuario/${id}`, { headers });
      return data;
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      throw error
    }
  },

  login: async (payload: any) => {
    try {
      const { data } = await api.post(`${apiUrl}/auth/login`, payload);
      return data;
    } catch (error) {
      console.error("Error al iniciar Sesion:", error);
      throw error
    }
  },


  obtenerRol: async (id: number) => {
    try {
      const token = localStorage.getItem("Token");
      const roleResponse = await api.get(`${apiUrl}/rol/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Agregar el token al header
        },
      });
      return roleResponse;
    } catch (error) {
      console.error("Error al obtener rol:", error);
      throw error
    }
  },

  register: async (payload: any) => {
    try {

      const response = await api.post(`${apiUrl}/usuario`, payload);

      return response;
    } catch (error) {
      console.error("Error al registrar Usuario:", error);
      throw error
    }
  },

  obtenerRolesTotales: async () => {
    try {
      const token = localStorage.getItem("Token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const { data } = await api.get(`${apiUrl}/rol`, {
        headers,
      });
      return data;
    } catch (error) {
      console.error("Error al obtener roles", error);
      throw error
    }
  },

  recuperarContrasena: async (mail: string) => {
    try {
      const response = await api.post(`${apiUrl}/auth/recuperar`, { mail });
      return response;
    } catch (error) {
      console.error("Error al recuperar contraseña:", error);
      throw error
    }
  },

  verificarCodigo: async (mail: string, codigo: string) => {
    try {
      const response = await api.post(`${apiUrl}/auth/verificar-codigo`, {
        mail,
        codigo,
      });
      return response;
    } catch (error) {
      console.error("Error al verificar código:", error);
      throw error
    }
  },

  cambiarContrasena: async (mail: string, nuevaContrasena: string) => {
    try {
      const response = await api.patch(`${apiUrl}/auth/cambiar-contrasena`, {
        mail,
        nuevaContrasena,
      });
      return response;
    } catch (error) {
      console.error("Error al cambiar contrasena:", error);
      throw error
    }
  },
  
};

export default UsuarioService;
