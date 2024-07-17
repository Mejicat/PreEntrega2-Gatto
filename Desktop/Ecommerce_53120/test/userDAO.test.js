import assert from 'assert';
import mongoose from 'mongoose';

import UserDAO from '../src/dao/userDAO.js';
import connectToMongo from '../src/dao/connection.js';

describe('Tests DAO Users', function () {
    let dao;

    before(async function () {
        await connectToMongo();
    });

    after(async function () {
        await mongoose.disconnect();
    });

    beforeEach(function () {
        dao = new UserDAO();
    });

    it('getUsers() debe retornar un array de usuarios', async function () {
        const users = await dao.getUsers();
        assert(Array.isArray(users), 'El resultado debe ser un array');
    });

    it('getUserById() debe retornar un usuario por ID', async function () {
        const user = await dao.getUserById('usuarioId');
        assert(user, 'El resultado no debe ser nulo');
        assert.strictEqual(user._id, 'usuarioId', 'El ID del usuario debe coincidir');
    });

    it('registerUser() debe registrar un nuevo usuario', async function () {
        const newUser = {
            first_name: 'Test',
            last_name: 'User',
            email: 'test@example.com',
            age: 30,
            password: 'password123'
        };
        const registeredUser = await dao.registerUser(newUser);
        assert(registeredUser, 'El usuario registrado no debe ser nulo');
        assert.strictEqual(registeredUser.email, newUser.email, 'El email del usuario debe coincidir');
    });

    it('login() debe autenticar un usuario y retornar un token', async function () {
        const email = 'test@example.com';
        const password = 'password123';
        const token = await dao.login(email, password);
        assert(token, 'El token no debe ser nulo');
    });

    it('updateUserRole() debe actualizar el rol de un usuario', async function () {
        const userId = 'usuarioId';
        const newRole = 'admin';
        const updatedUser = await dao.updateUserRole(userId, newRole);
        assert(updatedUser, 'El usuario actualizado no debe ser nulo');
        assert.strictEqual(updatedUser.role, newRole, 'El rol del usuario debe coincidir');
    });
});
