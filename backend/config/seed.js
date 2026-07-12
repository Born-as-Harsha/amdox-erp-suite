import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const seedDemoUsers = async () => {
    try {
        const demoAccounts = [
            {
                name: "Super Admin",
                email: "admin@amdox.com",
                password: "Admin@123",
                role: "Super Admin"
            },
            {
                name: "HR Manager",
                email: "hr@amdox.com",
                password: "HR@123",
                role: "HR"
            },
            {
                name: "Finance Manager",
                email: "finance@amdox.com",
                password: "Finance@123",
                role: "Finance"
            },
            {
                name: "Inventory Manager",
                email: "inventory@amdox.com",
                password: "Inventory@123",
                role: "Inventory Manager"
            },
            {
                name: "Project Manager",
                email: "project@amdox.com",
                password: "Project@123",
                role: "Project Manager"
            },
            {
                name: "Executive User",
                email: "executive@amdox.com",
                password: "Executive@123",
                role: "Executive"
            }
        ];

        for (const account of demoAccounts) {
            const userExists = await User.findOne({ email: account.email });
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(account.password, salt);

            if (!userExists) {
                await User.create({
                    name: account.name,
                    email: account.email,
                    password: hashedPassword,
                    role: account.role
                });
                console.log(`Seeded demo account: ${account.email} with role ${account.role}`);
            } else {
                // Ensure the password and role match the spec
                userExists.password = hashedPassword;
                userExists.role = account.role;
                await userExists.save();
                console.log(`Verified/Updated demo account: ${account.email}`);
            }
        }
        console.log("Demo account seeding completed successfully. ✅");
    } catch (error) {
        console.error("Error seeding demo accounts:", error);
    }
};
export default seedDemoUsers;
