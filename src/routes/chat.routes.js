import { Router } from "express";

const routerChat = Router();

routerChat.get('/', async(req,res) => {
        res.render("chat", { 
        titulo: "Primera Practica Integradora",
      })
      
  })

export default routerChat;