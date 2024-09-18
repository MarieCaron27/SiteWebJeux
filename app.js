const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const mysql = require('mysql');
const express = require('express');
const app = express();
const path = require('path');
const db = require('./databases/database');

dotenv.config();  // Pour charger les variables d'environnement

app.use(cookieParser());

// Connexion à la base de données MySQL
db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("MYSQL connected");
    }
});

// Configuration du moteur de vues Handlebars
app.set('view engine', 'hbs');

// Dossiers pour les fichiers statiques
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));  // Serveur les fichiers statiques de 'public'

const gamesDirectory = path.join(__dirname, 'games');  // Chemin vers le dossier des jeux
app.use('/games', express.static(gamesDirectory));  // Serveur les fichiers statiques de 'games'

// Parseur pour les corps de requêtes
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
app.use('/games', require('./routes/games'));
app.use('/scores', require('./routes/scores'));


// Démarrage du serveur
app.listen(8000, () => {
    console.log("Server started on port 8000");
});
