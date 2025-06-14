import axios from "axios";

const api = axios.create({
  baseURL: "https://7f0d-2804-14c-5b91-873a-e911-8813-a47d-ebfc.ngrok-free.app/api/v1", 
});

export default api;


