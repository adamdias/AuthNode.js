const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// importando o secretHash
const authConfig = require('../config/auth.json');

const router = express.Router();

// function geradora de token's
function generateToken(params = {}) {
    // gerando token
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

// rota de Registro de usuário
router.post('/register', async (req, res) => {
    const { email } = req.body;

    try {
        if(await User.findOne({ email }))
            return res.status(400).send({error: 'User already exists'});

        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({
            user,
            token: generateToken({ id: user.id }),
        });

    } catch (err) {
        return res.status(400).send({error: 'Registration failed' });
    }
});

// rota de Autenticação
router.post('/authenticate', async (req, res) =>{
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if(!user){
        res.status(400).send({error: 'User not found'});
    }

    // comparação de hash's
    if(!await bcrypt.compare(password, user.password))
        return res.status(400).send({error: 'Invalid password'});

        //removendo o password da resposta
        user.password = undefined;

        return res.send({
             user,
             token: generateToken({ id: user.id })
        });

});

module.exports = app => app.use('/auth', router);