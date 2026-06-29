import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api"
});

// Automatically attach JWT token
API.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {

        config.headers.Authorization = `Bearer ${token}`;

    }

    return config;

});

// ======================
// GET ALL EMPLOYEES
// ======================

export const getEmployees = () =>
    API.get("/employees");

// ======================
// GET EMPLOYEE STATS
// ======================

export const getEmployeeStats = () =>
    API.get("/employees/stats");

// ======================
// ADD EMPLOYEE
// ======================

export const addEmployee = (employee) =>
    API.post("/employees", employee);

// ======================
// UPDATE EMPLOYEE
// ======================

export const updateEmployee = (id, employee) =>
    API.put(`/employees/${id}`, employee);

// ======================
// DELETE EMPLOYEE
// ======================

export const deleteEmployee = (id) =>
    API.delete(`/employees/${id}`);