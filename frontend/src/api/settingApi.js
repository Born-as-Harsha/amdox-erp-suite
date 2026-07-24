import api from "../services/api";

export const getProfile = () => api.get("/settings");

export const updateProfile = (data) =>
    api.put("/settings", data);