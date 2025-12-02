import { api } from "../../../utils/apiService";
import axiosConfig from "../../../utils/axiosConfig";
import { createCrudService } from "../../../utils/crudFactory";
import type { FormValuesReclamo } from "./interfaces-validaciones-reclamo";

const apiUrl = axiosConfig.apiUrl;

const baseService = createCrudService<FormValuesReclamo | FormData>("reclamo");

const ReclamoService = {
  ...baseService,

  nuevoConArchivos: async (payload:any) => {
    try {

      const { data } = await api.post(`${apiUrl}/reclamo/with-files`, payload, {
        headers: {
          "Content-Type": "multipart/form-data", // IMPORTANTE
        },
      });
      return data;
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      throw error
    }
  },

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

      const { data } = await api.get(`${apiUrl}/comentario/${id}`);
      return data;
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      throw error
    }
  },

  asignar: async (reclamoId: string, payload:any) => {
    try {

      const { data } = await api.patch(`${apiUrl}/reclamo/${reclamoId}/asignar`, payload);
      return data;
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      throw error
    }
  },

  cancelar: async (reclamoId: string) => {
    try {

      const { data } = await api.patch(`${apiUrl}/reclamo/cancelar/${reclamoId}`);
      return data;
    } catch (error) {
      console.error("Error al cancelar reclamo:", error);
      throw error
    }
  },

  cambiarPrioridad: async (reclamoId: string, payload:any) => {
    try {

      const { data } = await api.patch(`${apiUrl}/reclamo/${reclamoId}/prioridad`, payload);
      return data;
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      throw error
    }
  },

  cambiarCriticidad: async (reclamoId: string, payload:any) => {
    try {

      const { data } = await api.patch(`${apiUrl}/reclamo/${reclamoId}/criticidad`, payload);
      return data;
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      throw error
    }
  },

  cambiarEstado: async (reclamoId: string, payload:any) => {
    try {

      const { data } = await api.patch(`${apiUrl}/reclamo/${reclamoId}/estado`, payload);
      return data;
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      throw error
    }
  },

};

export default ReclamoService;
