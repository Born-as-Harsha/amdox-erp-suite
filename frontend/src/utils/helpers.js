/**
 * Utility to convert an image file to Base64 format asynchronously.
 * Supports image type validation and file size validation.
 * 
 * @param {File} file - The file object to convert.
 * @param {Object} options - Validation options.
 * @param {number} options.maxSizeMB - Maximum file size allowed in Megabytes.
 * @returns {Promise<string>} Promise that resolves with base64 string representation.
 */
export const convertImageToBase64 = (file, options = { maxSizeMB: 2 }) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            return reject(new Error("No file provided."));
        }

        // Validate file type is an image
        if (!file.type.startsWith("image/")) {
            return reject(new Error("File must be a valid image."));
        }

        // Validate file size
        const maxSizeBytes = options.maxSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            return reject(new Error(`File size exceeds the ${options.maxSizeMB}MB limit.`));
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result);
        };
        reader.onerror = () => {
            reject(new Error("Failed to read file."));
        };
        reader.readAsDataURL(file);
    });
};

/**
 * Resolves static server upload path to complete browser URL.
 * Strips `/api` trailing from VITE_API_URL if present.
 * 
 * @param {string} path - Relative upload path.
 * @returns {string} Fully qualified URL or base64.
 */
export const getAvatarUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("data:image")) return path;
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const baseUrl = apiUrl.replace(/\/api$/, "");
    return `${baseUrl}${path}`;
};
