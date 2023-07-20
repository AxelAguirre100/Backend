import passport from "passport";

export const loginUser = async (req, res, next) => {
    try {
        passport.authenticate('login', (error, user) => {
            if (error) {
                return res.status(500).send({
                    message: "Ha ocurrido un error durante el login",
                    error: error.message
                });
            }
            if (!user) {
                return res.status(401).send({
                    message: "Usuario o contraseña no válidos",
                    user: user
                });
            }
            req.session.login = true;
            req.session.user = user;
            return res.status(200).send({
                message: "Login exitoso",
                user: user
            });
        })(req, res, next);
    } catch (error) {
        req.logger.fatal("Error fatal/Conexión al servidor");
        res.status(500).send({
            message: "Hubo un error en el servidor",
            error: error.message
        });
    }
};

export const registerUser = async (req, res, next) => {
    try {
        passport.authenticate('register', async (error, user) => {
            if (error) {
                return res.status(500).send({
                    message: "Ha ocurrido un error durante el registro",
                    error: error.message
                });
            }
            if (!user) {
                return res.status(409).send({
                    message: "El correo electrónico ya está en uso",
                    user: user
                });
            }
            return res.status(200).send({
                message: "Registrado correctamente",
                user: user
            });
        })(req, res, next);
    } catch (error) {
        req.logger.fatal("Error fatal/Conexión al servidor");
        res.status(500).send({
            message: "Hubo un error en el servidor",
            error: error.message
        });
    }
};

export const destroySession = async (req, res) => {
    try {
        if (req.session.login) {
            req.session.destroy();
            return res.status(200).send("La sesión ha terminado");
        } else {
            return res.status(401).send("No existe sesión activa");
        }
    } catch (error) {
        req.logger.fatal("Error fatal/Conexión al servidor");
        res.status(500).send({
            message: "Hubo un error en el servidor",
            error: error.message
        });
    }
};

export const getSession = async (req, res) => {
    try {
        if (req.session.login) {
            req.logger.info("GetSessionUser: " + req.session.user);
            return res.status(200).json({ response: req.session.user });
        } else {
            return res.status(401).send("No existe sesión activa");
        }
    } catch (error) {
        req.logger.fatal("Error fatal/Conexión al servidor");
        res.status(500).send({
            message: "Hubo un error en el servidor",
            error: error.message
        });
    }
};

export const getSessionObject = async (req, res) => {
    try {
        if (req.session.login) {
            req.logger.info("GetSessionUser: " + req.session.user);
            const user = req.session.user;
            return user;
        } else {
            return res.status(401).send("No existe sesión activa");
        }
    } catch (error) {
        req.logger.fatal("Error fatal/Conexión al servidor");
        throw new Error(error.message);
    }
};