let nodemailer;
try {
    nodemailer = require('nodemailer');
} catch (e) {
    console.warn('Nodemailer not installed. Emails will be mocked in console.');
}

const sendEmail = async (options) => {
    if (!nodemailer) {
        console.log('--- MOCK EMAIL SEND ---');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: ${options.message}`);
        console.log('-----------------------');
        return;
    }

    // Create transporter
    // For Real-world, use SendGrid or Mailgun
    // For Dev, we use Ethereal or just a simple log if Env not set

    // NOTE: For this demo, we will use Ethereal which fakes email sending
    let transporter;

    if (process.env.SMTP_HOST && process.env.SMTP_EMAIL) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            },
            // Prevent hanging
            connectionTimeout: 10000, // 10 seconds
            greetingTimeout: 10000,
            socketTimeout: 10000,
            logger: true,
            debug: true
        });
    } else {
        // Create Ethereal Account
        const testAccount = await nodemailer.createTestAccount();

        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
        console.log('Ethereal Email Credentials:', testAccount.user, testAccount.pass);
    }

    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL || 'noreply@tikat.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};

module.exports = sendEmail;
