import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api"
});

API.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {

        config.headers.Authorization = `Bearer ${token}`;

    }

    return config;

});

export const getEmployees = () => API.get("/employees");

export const getInventory = () => API.get("/inventory");

export const getProjects = () => API.get("/projects");

export const getReports = () => API.get("/reports");

export const getFinanceStats = () => API.get("/finance/stats");