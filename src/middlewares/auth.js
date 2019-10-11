const jwt = require('jsonwebtoken'); 
const authConfig = require('../config/auth.json');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // verificação se token foi enviado na requisição
    if(!authHeader)
        return res.status(401).send({ error: 'No token provided' }); 
        // formato padrão do token's ==> 'Bearer + hash' 

    // separando token do bearer se ambos existirem 
    const parts = authHeader.split(' ');
        
    // verificação se há 2 partes 
    if(!parts.length === 2)
        return res.status(401).send({ error: 'Token error' }); 
        
        // separando em váriáveis 
    const [ scheme, token ] = parts; 
        
    // Verificando se há a String 'Bearer' na scheme  
    // => fazendo uma rejects para verificação 
    if(!/^Bearer$/i.test(scheme))
        return res.status(401).send({ error: 'Token malformatted' });

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) return res.status(401).send({ error: 'Token invalid' });

        req.userId = decoded.id; 
            
        return next();
    });
        
}