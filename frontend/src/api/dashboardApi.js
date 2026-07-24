import api from "../services/api";

export const getEmployees = () => api.get("/employees");

export const getInventory = () => api.get("/inventory");

export const getProjects = () => api.get("/projects");

export const getReports = () => api.get("/reports");

export const getFinanceStats = () => api.get("/finance/stats");