import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api"
});

// Get all employees
export const getEmployees = () => API.get("/employees");

// Add employee
export const addEmployee = (employee) =>
    API.post("/employees", employee);

// Update employee
export const updateEmployee = (id, employee) =>
    API.put(`/employees/${id}`, employee);

// Delete employee
export const deleteEmployee = (id) =>
    API.delete(`/employees/${id}`);