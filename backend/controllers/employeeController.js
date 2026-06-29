import Employee from "../models/Employee.js";

// ===========================
// GET ALL EMPLOYEES
// ===========================

export const getEmployees = async (req, res) => {

    try {

        const employees = await Employee.find();

        res.status(200).json(employees);

    }

    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ===========================
// EMPLOYEE DASHBOARD STATS
// ===========================

export const getEmployeeStats = async (req, res) => {

    try {

        const totalEmployees = await Employee.countDocuments();

        const activeEmployees = await Employee.countDocuments({
            status: "Active"
        });

        const leaveEmployees = await Employee.countDocuments({
            status: "Leave"
        });

        const departments = await Employee.distinct("department");

        res.status(200).json({

            totalEmployees,

            activeEmployees,

            leaveEmployees,

            departments: departments.length

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};
// ===========================
// DELETE EMPLOYEE
// ===========================

export const deleteEmployee = async (req, res) => {

    try {

        const employee = await Employee.findByIdAndDelete(req.params.id);

        if (!employee) {

            return res.status(404).json({
                message: "Employee not found"
            });

        }

        res.status(200).json({
            message: "Employee deleted successfully"
        });

    }

    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ===========================
// UPDATE EMPLOYEE
// ===========================

export const updateEmployee = async (req, res) => {

    try {

        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!employee) {

            return res.status(404).json({
                message: "Employee not found"
            });

        }

        res.status(200).json(employee);

    }

    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
// ===========================
// CREATE EMPLOYEE
// ===========================

export const createEmployee = async (req, res) => {

    try {

        const employee = new Employee(req.body);

        const savedEmployee = await employee.save();

        res.status(201).json(savedEmployee);

    }

    catch (error) {

        res.status(400).json({
            message: error.message
        });

    }

};