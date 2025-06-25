import axios from "axios";

// export const Api_Host = axios.create({
//   baseURL: 'http://127.0.0.1:8000/api/'
// });

export const Api_Host = axios.create({
  baseURL: 'https://test.simplaxi.com/api/'
});
// Interceptor para agregar el token a cada solicitud




export const createPreCotizacionAll = (data, token) =>
  Api_Host.post('precotizacionChat/', data, {
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  });

   export const createPDFPreCotizacion=(id)=> Api_Host.get(`generarPdfPrecotizacionChatbot/${id}/`);

   export const getNumberServicio=(id,numeros, token)=> Api_Host.get(`serviciosPorNumeros/${id}/?numeros=${numeros}`, {
    headers: {
      Authorization: token,
    },
  });