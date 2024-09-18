const express = require('express'); /* Importe le module Express. C'est un framework pour Node.js qui simplifie le processus de création d'applications web et d'API en fournissant des fonctionnalités et des outils pour gérer les requêtes HTTP, les routes, les cookies, les sessions, les templates, et bien plus encore. */
const route = express.Router(); /*  Créer une instance d'application Express.  */
const gamesController = require('../controllers/games');
const isAuthenticated = require('../middleware/auth');


route.get('/', isAuthenticated, (req, res, next) => {
    gamesController.getBestScores(req, res, next);
}, (req, res) => {
    // Rediriger vers la page /games.hbs si nécessaire
    res.render('games.hbs');
});


route.post('/launch_game', isAuthenticated, (req, res) => {
    const gameId = req.body.gameId; // Récupérer l'identifiant du jeu à lancer
    console.log(gameId);
    res.redirect(`/games/game${gameId}/game${gameId}.html`);
}, );

module.exports = route;