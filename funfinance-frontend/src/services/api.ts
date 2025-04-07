import axios from 'axios';

const API_URL = 'https://localhost:7127/api'; // Замініть на URL вашого API

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Додавання userId до всіх запитів, якщо користувач авторизований
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      // В реальному проекті тут був би JWT токен
      // Але в нашому випадку ми просто додаємо userId 
      // до кожного запиту, як частину URL, коли це потрібно
      // або передаємо його в тілі запиту для POST/PUT
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Обробка відповідей
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Сервер відповів з кодом статусу, який виходить за межі 2xx
      console.error('API Error:', error.response.status, error.response.data);
      
      // Якщо 401 (Unauthorized) - перенаправляємо на сторінку логіну
      if (error.response.status === 401) {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // Запит був зроблений, але відповіді не було отримано
      console.error('API Error: No response received', error.request);
    } else {
      // Щось сталося при налаштуванні запиту
      console.error('API Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;