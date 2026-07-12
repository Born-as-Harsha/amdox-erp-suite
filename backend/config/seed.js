import User from "../models/User.js";
import Role from "../models/Role.js";
import Department from "../models/Department.js";
import Permission from "../models/Permission.js";
import bcrypt from "bcryptjs";

export const seedDemoUsers = async () => {
    try {
        console.log("Starting Enterprise Seeding... ⏳");

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

        // 2. Seed Roles
        const roles = [
            {
                roleName: "Super Admin",
                description: "Complete ERP control and user deactivations",
                permissions: permissions.map(p => p.permissionName) // All permissions
            },
            {
                roleName: "Admin",
                description: "Access and write permissions for all core modules",
                permissions: permissions.filter(p => p.permissionName !== "manage:users").map(p => p.permissionName)
            },
            {
                roleName: "HR",
                description: "Onboard personnel and manage payroll / clocks",
                permissions: ["read:employees", "write:employees", "read:reports", "write:reports", "read:settings", "write:settings"]
            },
            {
                roleName: "Finance Manager",
                description: "Manage Treasury balances and print ledger flows",
                permissions: ["read:finance", "write:finance", "read:reports", "write:reports", "read:settings", "write:settings"]
            },
            {
                roleName: "Inventory Manager",
                description: "Track inventory products and vendors",
                permissions: ["read:inventory", "write:inventory", "read:reports", "write:reports", "read:settings", "write:settings"]
            },
            {
                roleName: "Project Manager",
                description: "Orchestrate project milestone tasks",
                permissions: ["read:projects", "write:projects", "read:reports", "write:reports", "read:settings", "write:settings"]
            },
            {
                roleName: "Executive",
                description: "Read-only analytics visual report checks",
                permissions: ["read:reports", "read:settings", "write:settings"]
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

        // 4. Seed Hashed Demo Users
        const demoAccounts = [
            {
                employeeId: "EMP001",
                name: "Super Admin",
                email: "superadmin@amadox.com",
                password: "SuperAdmin@123",
                role: "Super Admin",
                department: "Executive Office",
                designation: "Principal Administrator"
            },
            {
                employeeId: "EMP002",
                name: "Harsha Admin",
                email: "admin@amdox.com",
                password: "Admin@123",
                role: "Admin",
                department: "Engineering",
                designation: "Senior IT Architect"
            },
            {
                employeeId: "EMP003",
                name: "Kavya HR",
                email: "hr@amdox.com",
                password: "HR@123",
                role: "HR",
                department: "HR Operations",
                designation: "Chief HR Executive"
            },
            {
                employeeId: "EMP004",
                name: "Rahul Finance",
                email: "finance@amdox.com",
                password: "Finance@123",
                role: "Finance Manager",
                department: "Finance & Accounting",
                designation: "Chief Financial Officer"
            },
            {
                employeeId: "EMP005",
                name: "Arjun Inventory",
                email: "inventory@amdox.com",
                password: "Inventory@123",
                role: "Inventory Manager",
                department: "Inventory & Warehouse",
                designation: "Logistics Manager"
            },
            {
                employeeId: "EMP006",
                name: "Priya Projects",
                email: "projects@amdox.com",
                password: "Project@123",
                role: "Project Manager",
                department: "Engineering",
                designation: "Senior Project Manager"
            },
            {
                employeeId: "EMP007",
                name: "CEO Executive",
                email: "executive@amdox.com",
                password: "Executive@123",
                role: "Executive",
                department: "Executive Office",
                designation: "Chief Executive Officer"
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
                    name: account.name,
                    email: account.email,
                    password: hashedPassword,
                    role: account.role,
                    roleId: roleId,
                    department: account.department,
                    designation: account.designation,
                    status: "Active"
                });
                console.log(`Seeded Hashed Demo User: ${account.email}`);
            } else {
                // Ensure default hashed credentials and role map correctly
                userExists.password = hashedPassword;
                userExists.role = account.role;
                userExists.roleId = roleId;
                userExists.employeeId = account.employeeId;
                await userExists.save();
                console.log(`Verified/Updated Hashed Demo User: ${account.email}`);
            }
        }
        console.log("Enterprise Seeding Completed. ✅");
    } catch (error) {
        console.error("Error seeding enterprise database:", error);
    }
};

export default seedDemoUsers;
