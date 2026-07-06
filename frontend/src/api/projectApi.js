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

export const getProjects = () =>
    API.get("/projects");

export const addProject = (project) =>
    API.post("/projects", project);

export const updateProject = (id, project) =>
    API.put(`/projects/${id}`, project);

export const deleteProject = (id) =>
    API.delete(`/projects/${id}`);

export const getProjectStats = () =>
    API.get("/projects/stats");