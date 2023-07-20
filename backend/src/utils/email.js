import nodemailer from 'nodemailer'
import config from '../config/config.js'

const EMAIL = config.EMAIL

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: "axelentoo@gmail.com",
        pass: EMAIL,
        authMethod: 'LOGIN'
    }
})

export const sendEmail = async (req, res) => {
    await transporter.sendMail({
        from: 'Coder axelentoo@gmail.com',
        to: req.session.user.email,
        subject: "Sujeto del email",
        html: `
            <div>
                <h2>PRUEBA ESTO ES UN H2</h2>
            </div>
        `,
        attachments: []
    })
    res.send("Email enviado")
}

export const sendDeleteNotification = async (user) => {
    await transporter.sendMail({
        from: 'Axel Aguirre',
        to: user.email,
        subject: "Producto eliminado",
        html: `
                <div>
                    <h2>Su producto publicado ha sido eliminado</h2>
                </div>
            `,
        attachments: []
    })
    return "Email sent"
}

export async function sendDeleteUserNotification(emails) {
    for (const email of emails) {
        await sendEmailUsers(email);
    }
}

async function sendEmailUsers(email) {
    try {
        await transporter.sendMail({
            from: 'axelentoo@gmail.com',
            to: email,
            subject: 'Usuario inactivo',
            html: `
            <div>
                <h2>Su cuenta ha sido eliminada por inactividad</h2>
            </div>
        `
        });
    } catch (error) {
        console.error(`Error al enviar el correo electrónico a ${email}:`, error);
    }
}