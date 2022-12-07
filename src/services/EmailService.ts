const nodemailer = require('nodemailer');
import config from "../config"


module.exports.transport = nodemailer.createTransport({
    host: config.SMTP_HOST || "smtp.elasticemail.com",
    port: config.SMTP_PORT || 2525,
    secure: false, 
    auth: {
        user: config.SMTP_USER || "info.lendqr@gmail.com", 
        pass: config.SMTP_PASSWORD || "717D15B9DC288B168419A78F8027D1591B44"
    }
});



