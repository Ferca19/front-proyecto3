import { api } from "../../utils/apiService";
import axiosConfig from "../../utils/axiosConfig";
import { createCrudService } from "../../utils/crudFactory";
import type { FormValuesProyecto } from "../gestion-proyecto/interfaces-validaciones-proyecto";


const baseService = createCrudService<FormValuesProyecto>("estadisticas");
const apiUrl = axiosConfig.apiUrl;

const EstadisticasService = {
  ...baseService,

  obtenerEstadisticas: async (filtros:any) => {
    try {
      const { data } = await api.get(`${apiUrl}/estadisticas`, {params:filtros});
      return data;
    } catch (error) {
      console.error("Error al obtener estadisticas:", error);
      throw error
    }
  },
};

export default EstadisticasService;
