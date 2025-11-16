// src/api.js
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    // For JSON requests; FormData requests will set their own Content-Type
    "Content-Type": "application/json",
  },
});
