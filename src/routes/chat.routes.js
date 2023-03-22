import { Router } from "express";

const routerChat = Router();

routerChat.get('/', async (req, res) => {
  res.render("chat", {
    titulo: "Desafio Backend",
  })
})

export default routerChat;