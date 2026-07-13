import User from "../models/User.js";
import Employee from "../models/Employee.js";
import Product from "../models/Inventory.js";
import Transaction from "../models/Finance.js";
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import Notification from "../models/Notification.js";

/**
 * Enterprise Global Search & Command Palette query.
 * Restricts query categories based on user authorization roles.
 */
export const searchEverything = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(200).json({ results: [] });
        }

        const role = req.user.role;
        const queryRegex = new RegExp(q, "i");
        const results = [];

        // Category 1: Modules (Static suggestions permitted based on active role)
        const allowedModules = [];
        const modules = [
            { name: "Dashboard", path: "/dashboard", roles: ["all"] },
            { name: "Employees Directory", path: "/employees", roles: ["Super Admin", "Admin", "HR Manager", "HR Executive"] },
            { name: "Recruitment Registry", path: "/recruitment", roles: ["Super Admin", "Admin", "HR Manager"] },
            { name: "Payroll Sheets", path: "/payroll", roles: ["Super Admin", "Admin", "HR Manager"] },
            { name: "Attendance logs", path: "/attendance", roles: ["Super Admin", "Admin", "HR Manager", "HR Executive"] },
            { name: "Leave approvals", path: "/leave", roles: ["Super Admin", "Admin", "HR Manager", "HR Executive"] },
            { name: "Inventory stock", path: "/inventory", roles: ["Super Admin", "Admin", "Inventory Manager", "Store Keeper"] },
            { name: "Suppliers indexes", path: "/suppliers", roles: ["Super Admin", "Admin", "Inventory Manager"] },
            { name: "Finance ledgers", path: "/finance", roles: ["Super Admin", "Admin", "Finance Manager", "Accountant"] },
            { name: "Invoices tracking", path: "/invoices", roles: ["Super Admin", "Admin", "Finance Manager"] },
            { name: "Projects metrics", path: "/projects", roles: ["Super Admin", "Admin", "Project Manager", "Project Lead"] },
            { name: "Teams configuration", path: "/teams", roles: ["Super Admin", "Admin", "Project Manager"] },
            { name: "Tasks board", path: "/tasks", roles: ["Super Admin", "Admin", "Project Manager", "Employee"] },
            { name: "Audit logs console", path: "/audit-logs", roles: ["Super Admin"] },
            { name: "System Settings", path: "/settings", roles: ["all"] },
            { name: "System Configuration", path: "/system-config", roles: ["Super Admin"] }
        ];

        modules.forEach(mod => {
            if (mod.roles.includes("all") || mod.roles.includes(role)) {
                if (mod.name.match(queryRegex)) {
                    allowedModules.push({
                        title: mod.name,
                        type: "Module",
                        path: mod.path,
                        badge: "System"
                    });
                }
            }
        });
        results.push(...allowedModules);

        // Category 2: Employees (Restricted to HR / Admin / Super Admin)
        const canAccessEmployees = ["Super Admin", "Admin", "HR Manager", "HR Executive"].includes(role);
        if (canAccessEmployees) {
            const employees = await Employee.find({
                $or: [
                    { fullName: queryRegex },
                    { employeeId: queryRegex },
                    { email: queryRegex },
                    { phone: queryRegex },
                    { department: queryRegex },
                    { designation: queryRegex }
                ]
            }).limit(5);

            employees.forEach(emp => {
                results.push({
                    title: emp.fullName,
                    description: `${emp.designation} - ${emp.department} (${emp.employeeId})`,
                    type: "Employee",
                    path: `/employees`,
                    badge: emp.employeeId
                });
            });
        }

        // Category 3: Inventory (Restricted to Inventory / Store / Admin / Super Admin)
        const canAccessInventory = ["Super Admin", "Admin", "Inventory Manager", "Store Keeper"].includes(role);
        if (canAccessInventory) {
            const products = await Product.find({
                $or: [
                    { name: queryRegex },
                    { SKU: queryRegex },
                    { category: queryRegex },
                    { supplier: queryRegex }
                ]
            }).limit(5);

            products.forEach(p => {
                results.push({
                    title: p.name,
                    description: `Category: ${p.category} | Stock: ${p.quantity} | SKU: ${p.SKU}`,
                    type: "Inventory",
                    path: `/inventory`,
                    badge: "Product"
                });
            });
        }

        // Category 4: Finance Transactions (Restricted to Finance Manager / Accountant / Admin / Super Admin)
        const canAccessFinance = ["Super Admin", "Admin", "Finance Manager", "Accountant"].includes(role);
        if (canAccessFinance) {
            const txs = await Transaction.find({
                $or: [
                    { category: queryRegex },
                    { transactionId: queryRegex },
                    { referenceNo: queryRegex }
                ]
            }).limit(5);

            txs.forEach(t => {
                results.push({
                    title: `${t.type === "Income" ? "+" : "-"} $${t.amount} (${t.category})`,
                    description: `Ref: ${t.referenceNo} | Date: ${new Date(t.date).toLocaleDateString()}`,
                    type: "Finance",
                    path: `/finance`,
                    badge: t.transactionId
                });
            });
        }

        // Category 5: Projects (Restricted to PM / Project Lead / Admin / Super Admin)
        const canAccessProjects = ["Super Admin", "Admin", "Project Manager", "Project Lead"].includes(role);
        if (canAccessProjects) {
            const projects = await Project.find({
                $or: [
                    { name: queryRegex },
                    { department: queryRegex }
                ]
            }).limit(5);

            projects.forEach(p => {
                results.push({
                    title: p.name,
                    description: `Dept: ${p.department} | Budget: $${p.budget} | Progress: ${p.progress}%`,
                    type: "Project",
                    path: `/projects`,
                    badge: "Project"
                });
            });
        }

        // Category 6: Tasks (Available for Super Admin, Admin, PM, and Employee)
        const canAccessTasks = ["Super Admin", "Admin", "Project Manager", "Employee"].includes(role);
        if (canAccessTasks) {
            const queryObj = {
                $or: [
                    { taskName: queryRegex },
                    { description: queryRegex }
                ]
            };
            // Employees can only search tasks assigned to them
            if (role === "Employee") {
                queryObj.assignedTo = req.user._id;
            }

            const tasks = await Task.find(queryObj).limit(5);
            tasks.forEach(t => {
                results.push({
                    title: t.taskName,
                    description: `Status: ${t.status} | Progress: ${t.progress} (${t.completionPercentage}%)`,
                    type: "Task",
                    path: `/tasks`,
                    badge: t.priority
                });
            });
        }

        res.status(200).json({ results });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
