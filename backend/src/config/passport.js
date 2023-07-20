import local from 'passport-local';
import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import { createHash, validatePassword } from '../utils/bcrypt.js';
import { findUserByEmail, findUserById, createUser } from '../dao/services/UserService.js';
import { createCart } from '../dao/services/cartService.js';
import config from './config.js';
const LocalStrategy = local.Strategy;

const CLIENT_ID = config.CLIENT_ID
const CLIENT_SECRET = config.CLIENT_SECRET


export const initializePassport = () => {

    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            try {
                const user = await findUserByEmail(req.body.email);
                if (user) {
                    return done(null, false);
                }
                const cart = await createCart();
                const hashPassword = createHash(password);
                const newUser = await createUser({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    age: req.body.age,
                    rol: req.body.rol,
                    password: hashPassword,
                    idCart: cart._id
                });
                return done(null, newUser);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await findUserByEmail(username);
            if (!user) {
                return done(null, false);
            }
            if (validatePassword(password, user.password)) {
                user.last_login = new Date();
                await user.save();
                return done(null, user);
            }
            return done(null, false);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use('github', new GitHubStrategy({
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/auth/github/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await findUserByEmail(profile._json.email);
            if (user) {
                return done(null, user)
            } else {
                const cart = await createCart()
                const passwordHash = createHash('coder123')
                const userCreated = await createUser({
                    first_name: profile._json.name,
                    last_name: ' ',
                    email: profile._json.email,
                    age: 18,
                    role: "Usuario",
                    password: passwordHash,
                    cartId: cart._id
                });
                return done(null, userCreated)
            }
        } catch (error) {
            return done(error)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    });

    passport.deserializeUser(async (id, done) => {
        const user = await findUserById(id)
        done(null, user)
    });
}