import { Router } from "express";
import passport from "passport";

const routerGithub = Router()
routerGithub.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { req.session.login = true; })
routerGithub.get("/githubSession", passport.authenticate("github"), async (req, res) => {
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/products")
})

export default routerGithub