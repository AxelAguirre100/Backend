import passport from "passport"

export const passportError = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, (error, user, info) => {
            if (error) {
                return next(error)
            }
            if (!user) {
                return res.status(401).send({ error: info.message ? info.message : info.toString() })
            }
            req.user = user
            next()
        })(req, res, next)
    }
}

export const roleVerification = (roles) => {
    return async (req, res, next) => {
      const userAccess = req.session.user;
  
      if (!userAccess) {
        req.logger.fatal("User not allowed");
        return res.status(401).json({ error: "User no autorizado" });
      }
  
      let bandera = 1;
  
      roles.forEach((rolEnviado) => {
        if (userAccess.rol === rolEnviado) {
          bandera = 0;
        }
      });
  
      if (bandera === 1) {
        return res.status(401).json({ error: "User no posee los permisos necesarios" });
      }
  
      next();
    };
  };