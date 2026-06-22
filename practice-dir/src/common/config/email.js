import { Resend } from "resend";
import ApiError from "../utils/api-error.js ";

const resend = new Resend(process.env.EMAIL_APIKEY);

const sendEmail = async (email, token) => {
    const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: `first email hai bhai.`,
        text: `it works omg! Dekh bhai dekh chala gya email and haan your token is: ${token}`,
    });

    if (error) {
        throw new ApiError(error.message);
    }
}


export { sendEmail };