const express = require('express'); /* Importe le module Express. C'est un framework pour Node.js qui simplifie le processus de création d'applications web et d'API en fournissant des fonctionnalités et des outils pour gérer les requêtes HTTP, les routes, les cookies, les sessions, les templates, et bien plus encore. */
const route = express.Router(); /*  Créer une instance d'application Express.  */


route.get('/', (req,res) => {
    res.render('index.hbs');
});

route.get('/register', (req,res) => {
    res.render('register.hbs'); 
}); 

route.get('/login', (req,res) => {
    res.render('login.hbs'); 
}); 

route.get('/logout', (req,res) => {
    // Effacer le cookie de session
    res.clearCookie('token');
    // Rediriger l'utilisateur vers la page de connexion ou une autre page appropriée
    res.redirect('/');
});


module.exports = route;