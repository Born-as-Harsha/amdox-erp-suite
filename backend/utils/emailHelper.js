import nodemailer from "nodemailer";

// Retrieve SMTP settings from environment variables
const smtpHost = process.env.SMTP_HOST || "";
const smtpPort = process.env.SMTP_PORT || 587;
const smtpUser = process.env.SMTP_USER || "";
const smtpPass = process.env.SMTP_PASS || "";
const fromEmail = process.env.SMTP_FROM || "no-reply@amadox.com";

const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort),
    secure: parseInt(smtpPort) === 465,
    auth: {
        user: smtpUser,
        pass: smtpPass
    }
});

/**
 * Dispatches an email notification.
 * Falls back to simulated log if SMTP variables are not set.
 */
export const sendEmail = async ({ to, subject, html, text }) => {
    if (smtpHost && smtpUser && smtpPass) {
        try {
            await transporter.sendMail({
                from: `"AMADOX ERP" <${fromEmail}>`,
                to,
                subject,
                text,
                html
            });
            console.log(`[SMTP Email Dispatched] Sent successfully to ${to}`);
        } catch (error) {
            console.error(`[SMTP Email Error] Failed to send email to ${to}:`, error.message);
        }
    } else {
        console.log(`\n======================================\n[SIMULATED EMAIL DISPATCH]\nTO: ${to}\nSUBJECT: ${subject}\nCONTENT: ${text || html}\n======================================\n`);
    }
};
