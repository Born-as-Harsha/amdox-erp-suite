import User from "../models/User.js";
import Role from "../models/Role.js";
import Department from "../models/Department.js";
import Permission from "../models/Permission.js";
import bcrypt from "bcryptjs";

export const seedDemoUsers = async () => {
    try {
        console.log("Starting Enterprise Seeding for 13 Roles... ⏳");

        // 1. Seed Permissions
        const permissions = [
            { permissionName: "read:employees", description: "View employee records" },
            { permissionName: "write:employees", description: "Create/Modify employee records" },
            { permissionName: "read:inventory", description: "View inventory logs" },
            { permissionName: "write:inventory", description: "Modify inventory stock items" },
            { permissionName: "read:finance", description: "View treasury balance ledger" },
            { permissionName: "write:finance", description: "Create cash flow transactions" },
            { permissionName: "read:projects", description: "View project milestones" },
            { permissionName: "write:projects", description: "Modify project campaigns" },
            { permissionName: "read:reports", description: "View analytics reports" },
            { permissionName: "write:reports", description: "Compile sheets & export" },
            { permissionName: "read:settings", description: "View personal profile preferences" },
            { permissionName: "write:settings", description: "Update profile password/avatar" },
            { permissionName: "manage:users", description: "Admin rights to create/delete users" }
        ];

        for (const p of permissions) {
            const exists = await Permission.findOne({ permissionName: p.permissionName });
            if (!exists) {
                await Permission.create(p);
            }
        }
        console.log("Permissions seeded. ✅");

        // 2. Seed 13 Roles
        const roles = [
            {
                roleName: "Super Admin",
                description: "Complete ERP control and user deactivations",
                permissions: permissions.map(p => p.permissionName)
            },
            {
                roleName: "Admin",
                description: "Access and write permissions for all core modules",
                permissions: permissions.filter(p => p.permissionName !== "manage:users").map(p => p.permissionName)
            },
            {
                roleName: "HR Manager",
                description: "Manage department personnel and run payroll",
                permissions: ["read:employees", "write:employees", "read:reports", "write:reports", "read:settings", "write:settings"]
            },
            {
                roleName: "HR Executive",
                description: "Track personnel clocks and leave files",
                permissions: ["read:employees", "read:reports", "read:settings", "write:settings"]
            },
            {
                roleName: "Finance Manager",
                description: "Manage Treasury balances and budgets",
                permissions: ["read:finance", "write:finance", "read:reports", "write:reports", "read:settings", "write:settings"]
            },
            {
                roleName: "Accountant",
                description: "Verify invoices and ledger postings",
                permissions: ["read:finance", "read:reports", "read:settings", "write:settings"]
            },
            {
                roleName: "Inventory Manager",
                description: "Manage warehouse assets and vendor lists",
                permissions: ["read:inventory", "write:inventory", "read:reports", "write:reports", "read:settings", "write:settings"]
            },
            {
                roleName: "Store Keeper",
                description: "Verify stock catalogs and low stock sheets",
                permissions: ["read:inventory", "read:settings", "write:settings"]
            },
            {
                roleName: "Project Manager",
                description: "Orchestrate project campaigns and milestones",
                permissions: ["read:projects", "write:projects", "read:reports", "write:reports", "read:settings", "write:settings"]
            },
            {
                roleName: "Project Lead",
                description: "Manage project tasks checklist",
                permissions: ["read:projects", "read:reports", "read:settings", "write:settings"]
            },
            {
                roleName: "Employee",
                description: "Personal dashboards access",
                permissions: ["read:settings", "write:settings"]
            },
            {
                roleName: "Executive",
                description: "Read-only analytics and corporate margins trends",
                permissions: ["read:reports", "read:settings", "write:settings"]
            },
            {
                roleName: "Viewer",
                description: "Read-only access across allowed reports",
                permissions: ["read:settings"]
            }
        ];

        const seededRoles = {};
        for (const r of roles) {
            let roleDoc = await Role.findOne({ roleName: r.roleName });
            if (!roleDoc) {
                roleDoc = await Role.create(r);
                console.log(`Seeded Role: ${r.roleName}`);
            } else {
                roleDoc.permissions = r.permissions;
                await roleDoc.save();
            }
            seededRoles[r.roleName] = roleDoc._id;
        }
        console.log("Roles seeded and permissions mapped. ✅");

        // 3. Seed Departments
        const departments = [
            { deptName: "Engineering", description: "Product dev & IT architectures" },
            { deptName: "Executive Office", description: "Corporate operations direction" },
            { deptName: "HR Operations", description: "Staff onboards & payroll logistics" },
            { deptName: "Finance & Accounting", description: "Treasury ledger sheets audit" },
            { deptName: "Inventory & Warehouse", description: "Product stock storage" }
        ];

        for (const d of departments) {
            const exists = await Department.findOne({ deptName: d.deptName });
            if (!exists) {
                await Department.create(d);
            }
        }
        console.log("Departments seeded. ✅");

        // 4. Seed Hashed Demo Users (13 Accounts)
        const demoAccounts = [
            {
                employeeId: "EMP001",
                username: "superadmin",
                name: "Super Admin",
                email: "admin@amadox.com",
                password: "Admin@123",
                role: "Super Admin",
                department: "Executive Office",
                designation: "Principal Administrator"
            },
            {
                employeeId: "EMP002",
                username: "admin",
                name: "Harsha Admin",
                email: "operations@amadox.com",
                password: "Admin123@",
                role: "Admin",
                department: "Engineering",
                designation: "Senior IT Architect"
            },
            {
                employeeId: "EMP003",
                username: "hrmanager",
                name: "HR Manager",
                email: "hr.manager@amadox.com",
                password: "HR123@",
                role: "HR Manager",
                department: "HR Operations",
                designation: "Chief HR Executive"
            },
            {
                employeeId: "EMP004",
                username: "hrexecutive",
                name: "HR Executive",
                email: "hr.executive@amadox.com",
                password: "HRExec123@",
                role: "HR Executive",
                department: "HR Operations",
                designation: "Personnel Officer"
            },
            {
                employeeId: "EMP005",
                username: "financemanager",
                name: "Finance Manager",
                email: "finance@amadox.com",
                password: "Finance123@",
                role: "Finance Manager",
                department: "Finance & Accounting",
                designation: "Chief Financial Officer"
            },
            {
                employeeId: "EMP006",
                username: "accountant",
                name: "Accountant",
                email: "accounts@amadox.com",
                password: "Accounts123@",
                role: "Accountant",
                department: "Finance & Accounting",
                designation: "Senior Ledger Accountant"
            },
            {
                employeeId: "EMP007",
                username: "inventorymanager",
                name: "Inventory Manager",
                email: "inventory@amadox.com",
                password: "Inventory123@",
                role: "Inventory Manager",
                department: "Inventory & Warehouse",
                designation: "Logistics Manager"
            },
            {
                employeeId: "EMP008",
                username: "storekeeper",
                name: "Store Keeper",
                email: "store@amadox.com",
                password: "Store123@",
                role: "Store Keeper",
                department: "Inventory & Warehouse",
                designation: "Warehouse Officer"
            },
            {
                employeeId: "EMP009",
                username: "projectmanager",
                name: "Project Manager",
                email: "pm@amadox.com",
                password: "Project123@",
                role: "Project Manager",
                department: "Engineering",
                designation: "Senior Projects Manager"
            },
            {
                employeeId: "EMP010",
                username: "projectlead",
                name: "Project Lead",
                email: "lead@amadox.com",
                password: "Lead123@",
                role: "Project Lead",
                department: "Engineering",
                designation: "Product Lead Developer"
            },
            {
                employeeId: "EMP011",
                username: "employee",
                name: "Standard Employee",
                email: "employee@amadox.com",
                password: "Employee123@",
                role: "Employee",
                department: "Engineering",
                designation: "Software Engineer"
            },
            {
                employeeId: "EMP012",
                username: "executive",
                name: "CEO Executive",
                email: "executive@amadox.com",
                password: "Executive123@",
                role: "Executive",
                department: "Executive Office",
                designation: "Chief Executive Officer"
            },
            {
                employeeId: "EMP013",
                username: "viewer",
                name: "General Viewer",
                email: "viewer@amadox.com",
                password: "Viewer123@",
                role: "Viewer",
                department: "Engineering",
                designation: "Guest Analyst"
            }
        ];

        for (const account of demoAccounts) {
            const userExists = await User.findOne({ email: account.email });
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(account.password, salt);

            const roleId = seededRoles[account.role];

            if (!userExists) {
                await User.create({
                    employeeId: account.employeeId,
                    username: account.username,
                    name: account.name,
                    email: account.email,
                    password: hashedPassword,
                    role: account.role,
                    roleId: roleId,
                    department: account.department,
                    designation: account.designation,
                    status: "Active",
                    emailVerified: true,
                    otpVerified: true
                });
                console.log(`Seeded Hashed Account: ${account.email}`);
            } else {
                userExists.password = hashedPassword;
                userExists.role = account.role;
                userExists.roleId = roleId;
                userExists.employeeId = account.employeeId;
                userExists.username = account.username;
                await userExists.save();
                console.log(`Verified/Updated Account: ${account.email}`);
            }
        }
        console.log("Enterprise 13 Roles Seeding Completed. ✅");
    } catch (error) {
        console.error("Error seeding enterprise database:", error);
    }
};

export default seedDemoUsers;
