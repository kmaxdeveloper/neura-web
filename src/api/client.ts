import axios from 'axios';

const client = axios.create({
  // Oxiridagi slashni olib tashladik, shunda endpointlar bilan urishmaydi
  baseURL: 'https://api.timora.uz', 
  timeout: 10000, // 10 soniya kutish (server qotib qolsa, frontend uxlab qolmaydi)
  headers: {
    'Content-Type': 'application/json',
    //'Accept': 'application/json'
  }
});

// Interceptor: Har bir so'rovga tokenni avtomat qo'shish
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // "Bearer " prefiksi bilan birga yuborish
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// QO'SHIMCHA: Response Interceptor (Token muddati tugasa, login sahifasiga haydash uchun)
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Agar token eskirgan bo'lsa, avtomat login'ga yuboramiz
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;