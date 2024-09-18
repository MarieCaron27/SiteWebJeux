const jwt = require('jsonwebtoken');
const isAuthenticated = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        console.log("No access");
        return res.redirect('/login'); // Rediriger l'utilisateur vers la page de connexion s'il n'est pas authentifié
    }
    // Si l'utilisateur est authentifié, passez à la route suivante
    console.log("Access");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;  // Récup l'id de mon user depuis le token
    next();
};

module.exports = isAuthenticated;
