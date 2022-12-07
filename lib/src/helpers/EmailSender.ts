import Mailer, { Transporter } from "nodemailer";
import { IEmailSender } from "../interfaces";

/**
 * @class EmailSender
 */
class EmailSender implements IEmailSender {

    transporter: Transporter;

    SENDER_EMAIL: string;

    MAIL_FROM_NAME = "HouseOfSounds";

    /**
     * @constructor
     * @param {string} SENDER_EMAIL 
     * @param {string} SENDER_PASSWORD 
     */
    constructor(SENDER_EMAIL: string, SENDER_PASSWORD: string) {
        const AUTH = {
            user: SENDER_EMAIL,
            pass: SENDER_PASSWORD
        };

        this.transporter = Mailer.createTransport({
            service: "gmail",
            auth: AUTH
        });

        this.SENDER_EMAIL = SENDER_EMAIL;
    }

    /**
     * @method send
     * @async
     * @param {string} toEmail 
     * @param {string} subject 
     * @param {string} message 
     */
    async send(toEmail: string, subject: string, message: string): Promise<void> {
        const FROM_MAIL_INFO = {
            name: this.MAIL_FROM_NAME,
            address: this.SENDER_EMAIL
        };

        this.transporter.sendMail({
            from: FROM_MAIL_INFO,
            to: toEmail,
            subject,
            text: message
        });
    }

}

export default EmailSender;