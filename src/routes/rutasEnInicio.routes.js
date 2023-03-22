import { Router } from "express";
import { getproductManagers } from "../dao/daoManager.js";
const rutasEnInicio = Router();
import productManager from "../dao/ManagersGeneration/productManager.js";
import cartManager from "../dao/ManagersGeneration/cartManager.js";

rutasEnInicio.get('/productsGet',async(req,res)=>{
  
  const products = await productManager.getElements()
  res.json(products)
})
rutasEnInicio.get('/products', async (req, res) => {

  res.render("productsPaginate", {
    titulo: "Desafio Backend",
  })

})

rutasEnInicio.get('/carts/:cid', async (req, res) => {
  const resultado = await cartManager.getElementById(req.params.cid)
  if (resultado!=undefined){
    res.send(resultado);
  }else
  {
    res.send("No existe el carrito o simplemente está vacio")
  }
})

export default rutasEnInicio;