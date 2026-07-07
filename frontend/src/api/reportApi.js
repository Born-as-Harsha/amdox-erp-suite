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

export const getReports = () =>
    API.get("/reports");

export const addReport = (report) =>
    API.post("/reports", report);

export const updateReport = (id, report) =>
    API.put(`/reports/${id}`, report);

export const deleteReport = (id) =>
    API.delete(`/reports/${id}`);

export const getReportStats = () =>
    API.get("/reports/stats");