import local from 'passport-local'
import passport from 'passport'
import GitHubStrategy from 'passport-github2'
import userManager from "../dao/ManagersGeneration/userManager.js";
import { createHash, validatePassword } from '../utils/bcrypt.js'

const LocalStrategy = local.Strategy
const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body
            try {
                const user = await userManager.getElementByEmail(username)

                if (user) {
                    return done(null, false)

                }

                const passwordHash = createHash(password)

                const userCreated = await userManager.addElements([{
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    age: age,
                    password: passwordHash
                }])

                return done(null, userCreated)
            } catch (error) {
                return done(error)
            }

        }

    ))

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {

        try {
            const user = await userManager.getElementByEmail(username)

            if (!user) {
                return done(null, false)
            }
            if (validatePassword(password, user.password)) {
                return done(null, user)
            }

            return done(null, false)

        } catch (error) {
            return done(error)
        }
    }))

    passport.use('github', new GitHubStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/authSession/githubSession'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile)
            const user = await userManager.getElementByEmail(profile._json.email)

            if (user) {
                done(null, user)
            } else {
                const passwordHash = createHash('coder')
                const userCreated = await userManager.addElements([{
                    first_name: profile._json.name,
                    last_name: ' ',
                    email: profile._json.email,
                    age: 19,
                    password: passwordHash
                }])
                done(null, userCreated)
            }

        } catch (error) {
            return done(error)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user); // serializar todo el objeto de usuario en la sesión
      });

    //Eliminar la sesion del usuario
    passport.deserializeUser(async (id, done) => {
        const user = await userManager.getElementById(id)
        done(null, user)
    })
}

export default initializePassport