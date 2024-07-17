import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';

import apiCartRouter from '../src/routes/apiCartRouter.js';
import connectToMongo from '../src/dao/connection.js';

const app = express();
app.use(express.json());
app.use('/api/carts', apiCartRouter);

describe('Tests de API de carritos', function () {
    before(async function () {
        await connectToMongo();
    });

    after(async function () {
        await mongoose.disconnect();
    });

    it('POST /api/carts debe crear un carrito', async function () {
        const token = 'token_valido'; // Colocar un token JWT válido
        const response = await request(app)
            .post('/api/carts')
            .set('Authorization', `Bearer ${token}`)
            .expect(201);

        assert(response.body.cart, 'Debe retornar un carrito creado');
    });

    it('GET /api/carts/:cid debe retornar un carrito por ID', async function () {
        const token = 'token_admin_valido'; // Colocar un token JWT válido de un admin
        const cartId = 'cartId_valido'; // Colocar un ID de carrito válido
        const response = await request(app)
            .get(`/api/carts/${cartId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        assert(response.body.cart, 'Debe retornar un carrito');
    });

    it('GET /api/carts debe retornar todos los carritos', async function () {
        const token = 'token_admin_valido'; // Colocar un token JWT válido de un admin
        const response = await request(app)
            .get('/api/carts')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        assert(response.body.carts, 'Debe retornar una lista de carritos');
    });

    it('POST /api/carts/:cid/products/:pid debe agregar un producto al carrito', async function () {
        const token = 'token_valido'; // Colocar un token JWT válido
        const cartId = 'cartId_valido'; // Colocar un ID de carrito válido
        const productId = 'productId_valido'; // Colocar un ID de producto válido
        const response = await request(app)
            .post(`/api/carts/${cartId}/products/${productId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ quantity: 2 })
            .expect(201);

        assert(response.body.response, 'Debe retornar la respuesta de la operación');
    });

    it('PUT /api/carts/:cid/products/:pid debe actualizar la cantidad de un producto en el carrito', async function () {
        const token = 'token_valido'; // Colocar un token JWT válido
        const cartId = 'cartId_valido'; // Colocar un ID de carrito válido
        const productId = 'productId_valido'; // Colocar un ID de producto válido
        const response = await request(app)
            .put(`/api/carts/${cartId}/products/${productId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ quantity: 3 })
            .expect(200);

        assert(response.body.response, 'Debe retornar la respuesta de la operación');
    });

    it('DELETE /api/carts/:cid debe eliminar un carrito', async function () {
        const token = 'token_valido'; // Colocar un token JWT válido
        const cartId = 'cartId_valido'; // Colocar un ID de carrito válido
        const response = await request(app)
            .delete(`/api/carts/${cartId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        assert(response.body.response, 'Debe retornar la respuesta de la operación');
    });

    it('DELETE /api/carts/:cid/products/:pid debe eliminar un producto del carrito', async function () {
        const token = 'token_valido'; // Colocar un token JWT válido
        const cartId = 'cartId_valido'; // Colocar un ID de carrito válido
        const productId = 'productId_valido'; // Colocar un ID de producto válido
        const response = await request(app)
            .delete(`/api/carts/${cartId}/products/${productId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        assert(response.body.response, 'Debe retornar la respuesta de la operación');
    });

    it('POST /api/carts/:cid/purchase debe realizar la compra del carrito', async function () {
        const token = 'token_valido'; // Colocar un token JWT válido
        const cartId = 'cartId_valido'; // Colocar un ID de carrito válido
        const response = await request(app)
            .post(`/api/carts/${cartId}/purchase`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        assert(response.body.ticket, 'Debe retornar el ticket de compra');
        assert(response.body.itemsRemoved, 'Debe retornar los productos que no tenían stock');
    });
});
