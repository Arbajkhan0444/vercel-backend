import nodemailer from 'nodemailer'

const sendMail = async (email: string, subject: string, message: string)=>{
    try {
        const config = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        })

        const options = {
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: subject,
            html: message
        };

        await config.sendMail(options)

        return true
    }
    catch(err)
    {
        return false
    }
}

export default sendMail