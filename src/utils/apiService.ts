import axios from "axios";
import axiosConfig from "./axiosConfig";


const apiUrl = axiosConfig.apiUrl;

export const api = axios.create({
  withCredentials: true, // 👈 permite enviar y recibir cookies
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si la request falla con 401 y no se ha reintentado aún
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh") // 👈 Evita bucle
    ) {
      originalRequest._retry = true;
      try {
        // Intentamos refrescar el token
        await api.get(`${apiUrl}/auth/refresh`, { withCredentials: true });

        // Reintentamos la request original
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Error al refrescar token", refreshError);

        window.location.href = "/login"; 
      }
    }

    // Si no cumple las condiciones, devolvemos el error normal
    return Promise.reject(error);
  }
);


const ApiService = {

  get: async (url: string, params?: any) => {
    try {
      const { data } = await api.get(`${apiUrl}${url}`, {
        params,
      });
      return data;
    } catch (error) {
      console.error(`GET ${url} →`, error);
      throw error;
    }
  },

  imprimir: async (url: string): Promise<Blob> => {
    try {
      const {data} = await api.get(`${apiUrl}${url}`, {
        responseType: "blob",
      });
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },


  post: async (url: string, body: any) => {
    try {
      const { data } = await api.post(`${apiUrl}${url}`, body, {
      });
      return data;
    } catch (error) {
      console.error(`POST ${url} →`, error);
      throw error;
    }
  },

  put: async (url: string, body: any) => {
    try {
      const { data } = await api.put(`${apiUrl}${url}`, body, {
      });
      return data;
    } catch (error) {
      console.error(`PUT ${url} →`, error);
      throw error;
    }
  },

  delete: async (url: string, usuarioId:number) => {
    try {
      const { data } = await api.delete(`${apiUrl}${url}`, {
        params: { usuarioId },
      });
      return data;
    } catch (error) {
      console.error(`DELETE ${url} →`, error);
      throw error;
    }
  },
};

export default ApiService;
