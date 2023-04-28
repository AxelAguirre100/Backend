import { createUser, findUserByEmail } from "../services/UserService.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import { validatePassword, createHash } from "../utils/bcrypt.js";
export const loginUser = async (req, res, next) => {
    try {
        passport.authenticate('login', (err, user) => {
            if (err) {
                return res.status(401).send({
                    message: "Ha ocurrido un error durante el login",
                    error: err.message
                })
            }
            if (!user) {
                return res.status(401).send("Correo electrónico o contraseña incorrecta")
            }
            req.session.login = true;
            req.session.user = user;
            return res.status(200).send(`Usuario Logueado exitosamente: ${req.session.user.first_name}, Rol: ${req.session.user.rol}`)
        })(req, res, next)

    } catch (error) {
        res.status(500).send({
            message: "Hubo un error en el servidor", 
            error: error.message
        })
    }

}

export const registerUser = async (req, res, next) => {
    try {
        passport.authenticate('register', async (err, user) => {
            if (err) {
                return res.status(401).send({ 
                    message: "Ha ocurrido un error durante el registro", 
                    error: err.message })
            }
            if (!user) {
                return res.status(401).send("El correo electrónico ya está en uso")
            }
            return res.status(200).send("Registrado correctamente, ya puede logearse")
        })(req, res, next)

    } catch (error) {
        res.status(500).send({
            message: "Hubo un error en el servidor", 
            error: error.message
        })
    }

}

export const destroySession = async (req, res) => {
    try {
        if (req.session.login) {
            req.session.destroy()
            res.status(200).send("La sesión ha terminado, hasta la próxima")
        } else {
            return res.status(401).send("No existe sesion activa")
        }
    } catch (error) {
        res.status(500).send({
            message: "Hubo un error en el servidor", 
            error: error.message
        })
    }
}

export const getSession = async (req, res) => {
    try {
        if (req.session.login) {
            console.log(req.session.user)
            res.status(200).json({ response: req.session.user });
        } else {
            return res.status(401).send("No existe sesion activa")
        }
    } catch (error) {
        res.status(500).send({
            message: "Hubo un error en el servidor", 
            error: error.message
        })
    }
}