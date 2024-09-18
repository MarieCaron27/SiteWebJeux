const express = require('express'); /* Importe le module Express. C'est un framework pour Node.js qui simplifie le processus de création d'applications web et d'API en fournissant des fonctionnalités et des outils pour gérer les requêtes HTTP, les routes, les cookies, les sessions, les templates, et bien plus encore. */
const route = express.Router(); /*  Créer une instance d'application Express.  */
const authController = require('../controllers/auth');

route.post('/register', authController.register);

route.post('/login', authController.login);

module.exports = route;