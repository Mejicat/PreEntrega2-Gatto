import { Router } from 'express';
//import { productManagerFS } from '../dao/productManagerFS.js';
import { productManagerDB } from '../dao/productManagerDB.js';
import { messageManagerDB } from '../dao/messageManagerDB.js';

const router = Router();
//const ProductService = new productManagerFS('products.json');
const ProductService = new productManagerDB();

router.get('/', async (req, res) => {
    res.render(
        'index',
        {
            title: 'Productos',
            style: 'index.css',
            products: await ProductService.getAllProducts()
        }
    )
});

router.get('/realtimeproducts', async (req, res) => {
    res.render(
        'realTimeProducts',
        {
            title: 'Productos',
            style: 'index.css',
            products: await ProductService.getAllProducts()
        }
    )
});

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