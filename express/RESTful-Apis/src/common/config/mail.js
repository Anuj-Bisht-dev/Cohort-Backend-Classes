// use mailtrap for testing
import nodemailer from "nodemailer"

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    host: "smtp.example.com",
    port: 587,
    secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// basically we create multiple methods like for sendMail, sendToken, verification
// to send email
const sendMail = async (to, subject, html) => {
    await transporter.sendMail({
        from: `${process.env.SMTP_FROM_EMAIL}`,
        to,
        subject,
        html,
    });
}

// this is a seperate method for verification
const sendVerificationEmail = async (email, token) => {
    await transporter.sendMail({
        from: `${process.env.SMTP_FROM_EMAIL}`,
        email,
        subject,
        html,
    });
}

export { sendMail, sendVerificationEmail };