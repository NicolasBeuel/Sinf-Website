var nodemailer = require('nodemailer');

class Email {
    constructor() {
         this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: '', //  You need to configure your email account here
                pass: ''  //
            }
        });
        this.mailOptions;
    }
    setEmail(email, subject, text) {
        this.mailOptions = {
            from: '', //your email address
            to: email,
            subject: subject,
            text: text
        };
    }

    sendEmail(){
        this.transporter.sendMail(this.mailOptions, (error, info)=>{
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}

module.exports = Email
