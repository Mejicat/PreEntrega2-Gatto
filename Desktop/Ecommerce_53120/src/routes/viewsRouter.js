import { Router } from 'express';
import { messageManagerDB } from '../dao/messageManagerDB.js';

const router = Router();

router.get("/chat", async (req, res) => {
    try {
      const messages = await messageManagerDB.getAllMessages()
      res.render("chat", {
        title: "Chat",
        style: "index.css",
        messages: messages,
      });
    } catch (error) {
      console.error(error)
      res.status(500).send("Internal Server Error");
    }
  });

export default router;

// EL CÓDIGO A CONTINUACIÓN ERA PARTE DE MI VIEJO VIEWRSROUTER, ANTES DE TRABAJAR CON MONGO:

/*router.get('/', async (req, res) => {
    res.render(
        'index',
        {
            title: 'Productos',
            style: 'index.css',
            products: await ProductService.getAllProducts()
        }
    )
});*/

/*router.get('/realtimeproducts', async (req, res) => {
    res.render(
        'realTimeProducts',
        {
            title: 'Productos',
            style: 'index.css',
            products: await ProductService.getAllProducts()
        }
    )
});*/