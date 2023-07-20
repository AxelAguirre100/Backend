import { createNewMessage, returnMessages } from "../../dao/services/messageService.js";
import { io } from "../../index.js";

export const sendMessage = async (req, res) => {
    const { first_name, email, message } = req.body;
    try {
        if (!first_name || !email || !message) {
            return res.status(400).json({
                message: "Falta información requerida para enviar el mensaje"
            });
        }

        await createNewMessage({
            nombre: first_name,
            email: email,
            message: message
        });

        const messages = await returnMessages();

        io.emit("mensajes actualizados", messages);

        res.status(200).send({
            message: "Mensaje enviado",
        });

    } catch (error) {
        req.logger.fatal("Error fatal/Conexión con el servidor");
        res.status(500).send({
            message: "Hubo un error en el servidor",
            error: error.message
        });
    }
}

export const getMessages = async (req, res) => {
    try {
        const messages = await returnMessages();

        res.status(200).json({
            messages: messages
        });

    } catch (error) {
        req.logger.fatal("Fatal error/Server connection")
        res.status(500).send({
            message: "Hubo un error en el servidor",
            error: error.message
        })
    }
}