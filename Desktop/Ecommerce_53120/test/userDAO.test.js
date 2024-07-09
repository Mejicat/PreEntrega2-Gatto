import Assert from 'assert';
import mongoose from 'mongoose';
import UserDAO from '../src/dao/userDAO.js';

const connection  = await mongoose.connect('mongodb://127.0.0.1:27017/coder_53120');
const dao = new UserDAO();
const assert = Assert.strict;

describe('Tests DAO Users', function () {
    // Se ejecuta ANTES de comenzar el paquete de tests
    before(function () {});
    // Se ejecuta ANTES de CADA test
    beforeEach(function () {});
    // Se ejecuta FINALIZADO el paquete de tests
    after(function () {});
    // Se ejecuta FINALIZADO CADA text
    afterEeach(function () {});
    
    it('get() debe retornar un array de usuarios', async function () {}); 
    it('get() debe retornar un array de usuarios', async function () {});
    it('get() debe retornar un array de usuarios', async function () {});
    it('get() debe retornar un array de usuarios', async function () {});
    it('get() debe retornar un array de usuarios', async function () {});
});