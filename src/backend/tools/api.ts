import axios from 'axios';

const isDev = process.env.NODE_ENV === 'development';
const baseURL = isDev
  ? `${process.env.API_URL}:${process.env.API_PORT}`
  : process.env.API_URL;

const api = axios.create({
    baseURL,
    headers: {
        'x-api-key': process.env.API_KEY,
        'x-api-signature': process.env.API_SIGNATURE,
        'x-api-user': "1d9a29c3-fb54-43f5-bd6f-4f9036302faf"
    },
});

export default api;