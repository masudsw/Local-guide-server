import nodemailer from "nodemailer";
import ApiError from "../errors/apiError";
import config from "../../config";

// 1. Create the transporter
const transporter = nodemailer.createTransport({
    host: config.email_sender.smtp_host,
    port: Number(config.email_sender.smtp_port),
    secure: Number(config.email_sender.smtp_port) === 465, // True for 465, false for 587
    auth: {
        user: config.email_sender.smtp_user,
        pass: config.email_sender.smtp_pass
    }
});

export interface SendEmailOptions {
    to: string;
    subject: string;
    html: string; // Changed from templateName for simplicity, or add a template engine
    attachments?: {
        filename: string;
        content: Buffer | string;
        contentType: string;
    }[];
}

export const sendEmail = async ({
    to,
    subject,
    html,
    attachments
}: SendEmailOptions) => {
    try { 
        const info = await transporter.sendMail({
            from: config.email_sender.smtp_from, // e.g., "App Name <info@app.com>"
            to,
            subject,
            html, // Now correctly passed from arguments
            attachments,
        });

        console.log(`✉️ Email sent to ${to}: ${info.messageId}`);
        return info;
    } catch (error: any) {
        console.error("Email sending error:", error.message);
        // Using 500 because it's a server/service failure, not an Auth (401) issue
        throw new ApiError(500, "Internal Server Error: Email could not be sent");
    }
};