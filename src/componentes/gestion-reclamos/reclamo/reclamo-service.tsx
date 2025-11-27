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

};

export default ReclamoService;
