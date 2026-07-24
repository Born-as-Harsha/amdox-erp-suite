import api from "../services/api";

export const getProjects = () =>
    api.get("/projects");

export const addProject = (project) =>
    api.post("/projects", project);

export const updateProject = (id, project) =>
    api.put(`/projects/${id}`, project);

export const deleteProject = (id) =>
    api.delete(`/projects/${id}`);

export const getProjectStats = () =>
    api.get("/projects/stats");