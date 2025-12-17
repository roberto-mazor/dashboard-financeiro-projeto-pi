const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // 1. Busca o token no cabeçalho 'Authorization'
    const authHeader = req.headers['authorization'];
    
    // O formato padrão é: "Bearer TOKEN_AQUI"
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    }

    try {
        // 2. Verifica se o token é válido usando a sua chave secreta do .env
        const verificado = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Salva os dados do usuário dentro da requisição (req.usuario)
        // Isso permite que os controllers saibam QUEM está logado
        req.usuario = verificado;
        
        next(); // Autoriza a passagem para a próxima função (Controller)
    } catch (error) {
        res.status(403).json({ error: 'Token inválido ou expirado.' });
    }
};