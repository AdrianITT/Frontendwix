import axios from "axios";

export const Api_Host = axios.create({
  baseURL: 'http://127.0.0.1:8000/api'
});




   export const createServicioPreCotizacion = (data) => Api_Host.post('/precotizacionservicio/', data);

   export const createPreCotizacionAll=(data)=> Api_Host.post('/precotizacion/precotizacionChat/',data);

   export const createPDFPreCotizacion=(id)=> Api_Host.get(`precotizacion/${id}/pdf/`);

   export const getNumberServicio=(id,numeros)=> Api_Host.get(`serviciosPorNumeros/${id}/?numeros=${numeros}`);
   