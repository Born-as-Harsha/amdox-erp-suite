import api from "../services/api";

export const getReports = () =>
    api.get("/reports");

export const addReport = (report) =>
    api.post("/reports", report);

export const updateReport = (id, report) =>
    api.put(`/reports/${id}`, report);

export const deleteReport = (id) =>
    api.delete(`/reports/${id}`);

export const getReportStats = () =>
    api.get("/reports/stats");