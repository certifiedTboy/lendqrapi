import dotenv from "dotenv";

dotenv.config();

const { env } = process;

export default {
    APP_PORT: env.PORT || 3001,
    SMTP_HOST: env.SMTP_HOST,
    SMTP_PORT: env.SMTP_PORT,
    SMTP_USER : env.SMTP_USER,
    SMTP_PASSWORD : env.SMTP_PASSWORD,
    DB_CLIENT :<string>env.DB_CLIENT,
    DB_HOST :<string>env.DB_HOST,
    DB_NAME :<string>env.DB_NAME,
    DB_PASSWORD :<string>env.DB_PASSWORD,
    DB_USER :<string>env.DB_USER,
    JWT_TOKEN_SECRET:<string>env.JWT_TOKEN_SECRET,
    PAYMENT_TOKEN: <string>env.SECRET_PAYMENT_TOKEN,
    SMS_TOKEN: <string> env.SMS_TOKEN,
    SMS_NUMBER: env.SMS_NUMBER,
    SMS_KEY: <string>env.SMS_KEY, 
    SECRET_PAYMENT_TOKEN:<string>env.SECRET_PAYMENT_TOKEN
};