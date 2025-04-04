import axios from "axios";


const API_URL = import.meta.env.VITE_SERVER_API_URL || "http://localhost:5000/api";


const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  export default apiClient;