import twilio from 'twilio'
import config from "../config/config.js"

const twilioClient = twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN)

export const sendSMS = async (req, res) => {
    try {
        const twiliosmsoptions = {
            body: req.body.body,
            from: config.TWILIO_NUMBER,
            to: req.body.to
        }
        const result = await twilioClient.messages.create(twiliosmsoptions)
        res.send({message: "Enviado", payload: result})
    } catch (error) {
        console.error("Hubo un error enviando el sms")
        res.status(500).send({error: error});
    }
}