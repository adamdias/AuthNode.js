  const express = require('express');
  const authMiddleware = require('../middlewares/auth'); 

  const router = express.Router(); 

  router.use(authMiddleware);

  // rota que necessita de login ativo para estar acessível 
  router.get('/', (req, res) =>{
    res.send({ ok: true, user: req.userId }); 
  });

  module.exports = app => app.use('/projects', router);

  // middleware => interceptador entre a rota e o controller para valida requisições
