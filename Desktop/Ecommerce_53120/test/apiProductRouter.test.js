import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';

import apiProductRouter from '../src/routes/apiProductRouter.js';
import connectToMongo from '../src/dao/connection.js';


const app = express();
app.use(express.json());
app.use('/api/products', apiProductRouter);

describe('Tests de API de productos', function () {
    before(async function () {
        await connectToMongo();
    });

    after(async function () {
        await mongoose.disconnect();
    });

    it('GET /api/products debe retornar una lista de productos', async function () {
        const token = 'token_valido'; // Colocar un token JWT válido
        const response = await request(app)
            .get('/api/products')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        assert(response.body.products, 'Debe retornar una lista de productos');
    });

    it('GET /api/products/:productId debe retornar un producto por ID', async function () {
        const token = 'token_valido'; // Colocar un token JWT válido
        const productId = 'productId_valido'; // Colocar un ID de producto válido
        const response = await request(app)
            .get(`/api/products/${productId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        assert(response.body.product, 'Debe retornar un producto');
    });

    it('POST /api/products debe agregar un nuevo producto', async function () {
        const token = 'token_admin_valido'; // Colocar un token JWT válido de un admin
        const newProduct = {
            product: {
                title: 'Nuevo Producto',
                description: 'Descripción del nuevo producto',
                code: 'codigo123',
                price: 100,
                stock: 50,
                category: 'Categoría',
                thumbnails: ['thumbnail1.jpg']
            }
        };
        const response = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${token}`)
            .send(newProduct)
            .expect(201);

        assert(response.body.product, 'Debe retornar el producto agregado');
        assert.strictEqual(response.body.product.title, newProduct.product.title, 'El título del producto debe coincidir');
    });

    it('PUT /api/products/:productId debe actualizar un producto', async function () {
        const token = 'token_admin_valido'; // Colocar un token JWT válido de un admin
        const productId = 'productId_valido'; // Colocar un ID de producto válido
        const updatedProduct = {
            title: 'Producto Actualizado',
            price: 150
        };
        const response = await request(app)
            .put(`/api/products/${productId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedProduct)
            .expect(200);

        assert(response.body.product, 'Debe retornar el producto actualizado');
        assert.strictEqual(response.body.product.title, updatedProduct.title, 'El título del producto debe coincidir');
    });

    it('DELETE /api/products/:productId debe eliminar un producto', async function () {
        const token = 'token_admin_valido'; // Colocar un token JWT válido de un admin
        const productId = 'productId_valido'; // Colocar un ID de producto válido
        const response = await request(app)
            .delete(`/api/products/${productId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        assert(response.body.product, 'Debe retornar el producto eliminado');
    });

    it('GET /api/products/mockingproducts debe retornar productos mock', async function () {
        const response = await request(app)
            .get('/api/products/mockingproducts')
            .expect(200);

        assert(response.body.products, 'Debe retornar una lista de productos mock');
    });
});
