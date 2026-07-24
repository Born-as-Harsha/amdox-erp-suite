import api from "../services/api";

// ======================
// GET ALL EMPLOYEES
// ======================

export const getEmployees = () =>
    api.get("/employees");

// ======================
// GET EMPLOYEE STATS
// ======================

export const getEmployeeStats = () =>
    api.get("/employees/stats");

// ======================
// ADD EMPLOYEE
// ======================

export const addEmployee = (employee) =>
    api.post("/employees", employee);

// ======================
// UPDATE EMPLOYEE
// ======================

export const updateEmployee = (id, employee) =>
    api.put(`/employees/${id}`, employee);

// ======================
// DELETE EMPLOYEE
// ======================

export const deleteEmployee = (id) =>
    api.delete(`/employees/${id}`);