/**
 * @interface IEmailSender
 */
interface IEmailSender {
    send(toEmail: string, subject: string, message: string): Promise<void>;
}

export default IEmailSender;