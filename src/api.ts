import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.timora.uz', // Neura Gateway
});

export default api;