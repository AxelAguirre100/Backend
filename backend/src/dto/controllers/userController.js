import { findUsers, deleteInactiveUsers } from "../../dao/services/UserService.js"

export const getUsers = async (req, res) => {
    try {
        const users = await findUsers()
        res.status(200).send(users)
    } catch (error) {
        req.logger.fatal("Fatal error: " + error)
        res.status(500).send(error)
    }
}

export const deleteInactive = async (req, res) => {
    try {
        const resultado = await deleteInactiveUsers();
        res.status(200).send(resultado)
    } catch (error) {
        req.logger.fatal("Fatal error: " + error)
        res.status(500).send(error)
    }
}
