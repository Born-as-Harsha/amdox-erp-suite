import fs from "fs";
import path from "path";

export const saveBase64Image = (base64String, prefix = "profile") => {
    if (!base64String || !base64String.startsWith("data:image")) {
        return base64String; // Return as-is if already a path
    }

    try {
        const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            return base64String;
        }

        const type = matches[1];
        const base64Data = matches[2];
        const extension = type.split("/")[1] || "jpg";
        
        // Ensure uploads/profile directory exists
        const uploadDir = path.join(process.cwd(), "uploads", "profile");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filename = `${prefix}_${Date.now()}.${extension}`;
        const filePath = path.join(uploadDir, filename);

        fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
        
        // Return static server path relative to root
        return `/uploads/profile/${filename}`;
    } catch (err) {
        console.error("Error saving base64 image:", err);
        return base64String;
    }
};

export const deleteImageFile = (imagePath) => {
    if (!imagePath || !imagePath.startsWith("/uploads/profile/")) return;
    try {
        const filePath = path.join(process.cwd(), imagePath);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Deleted old profile image file: ${imagePath}`);
        }
    } catch (err) {
        console.error("Error deleting image file:", err);
    }
};
