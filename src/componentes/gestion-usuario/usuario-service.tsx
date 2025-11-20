import axios from "axios";
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

      const { data } = await axios.get(`${apiUrl}/usuario/${id}`, { headers });
      return data;
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      throw error
    }
  },

  login: async (payload: any) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, payload);
      return response;
    } catch (error) {
      console.error("Error al iniciar Sesion:", error);
      throw error
    }
  },


  obtenerRol: async (id: number) => {
    try {
      const token = localStorage.getItem("Token");
      const roleResponse = await axios.get(`${apiUrl}/rol/${id}`, {
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
      const token = localStorage.getItem("Token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.post(`${apiUrl}/auth/register`, payload, {
        headers,
      });

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

      const { data } = await axios.get(`${apiUrl}/rol`, {
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
      const response = await axios.post(`${apiUrl}/auth/recuperar`, { mail });
      return response;
    } catch (error) {
      console.error("Error al recuperar contraseña:", error);
      throw error
    }
  },

  verificarCodigo: async (mail: string, codigo: string) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/verificar-codigo`, {
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
      const response = await axios.patch(`${apiUrl}/auth/cambiar-contrasena`, {
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
