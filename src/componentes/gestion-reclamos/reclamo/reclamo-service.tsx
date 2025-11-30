import { api } from "../../../utils/apiService";
import axiosConfig from "../../../utils/axiosConfig";
import { createCrudService } from "../../../utils/crudFactory";
import type { FormValuesReclamo } from "./interfaces-validaciones-reclamo";

const apiUrl = axiosConfig.apiUrl;

const baseService = createCrudService<FormValuesReclamo | FormData>("reclamo");

const ReclamoService = {
  ...baseService,


  obtenerHistorial: async (id: string) => {
    try {
      const token = localStorage.getItem("Token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const { data } = await api.get(`${apiUrl}/reclamo/historial/${id}`, { headers });
      return data;
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      throw error
    }
  },

  obtenerComentarios: async (id: string) => {
    try {
      const token = localStorage.getItem("Token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const { data } = await api.get(`${apiUrl}/reclamo/historial/${id}`, { headers });
      return data;
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      throw error
    }
  },

  asignar: async (reclamoId: string, payload:any) => {
    try {

      const { data } = await api.get(`${apiUrl}/reclamo/asignar/${reclamoId}`, payload);
      return data;
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      throw error
    }
  },

  cambiarPrioridad: async (reclamoId: string, payload:any) => {
    try {

      const { data } = await api.get(`${apiUrl}/reclamo/cambiar-prioridad-criticidad/${reclamoId}`, payload);
      return data;
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      throw error
    }
  },

  cambiarCriticidad: async (reclamoId: string, payload:any) => {
    try {

      const { data } = await api.get(`${apiUrl}/reclamo/cambiar-criticidad/${reclamoId}`, payload);
      return data;
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      throw error
    }
  },

  cambiarEstado: async (reclamoId: string, payload:any) => {
    try {

      const { data } = await api.get(`${apiUrl}/reclamo/cambiar-estado/${reclamoId}`, payload);
      return data;
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      throw error
    }
  },

};

export default ReclamoService;
