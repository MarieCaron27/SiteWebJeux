const db = require('../databases/database');



async function getBestScores(req, res) {
    try {
        // Récupérer les jeux distincts
        const games = await getDistinctGames();

        // Récupérer les 5 meilleurs scores pour chaque jeu
        const bestScoresByGame = {};
        for (const game of games) {
            const scores = await getTopScoresForGame(game.idGame);
            bestScoresByGame[game.idGame] = scores;
        }

        // Envoyer les meilleurs scores à la vue
        console.log(bestScoresByGame);
        res.render('games', { bestScoresByGame });
    } catch (error) {
        console.error('Erreur lors de la récupération des meilleurs scores :', error);
        res.status(500).send('Erreur lors de la récupération des meilleurs scores');
    }
}

// Fonction pour récupérer les jeux distincts
function getDistinctGames() {
    return new Promise((resolve, reject) => { //  la promesse est un objet qui représente l'état d'une opération asynchrone 
        const sql = 'SELECT DISTINCT idGame FROM game';
        db.query(sql, (error, results) => {
            if (error) {
                reject(error); //  L'opération asynchrone a échoué.
            } else {
                resolve(results); // opération asynchrone s'est terminée avec succès
            }
        });
    });
}

// Fonction pour récupérer les 5 meilleurs scores pour un jeu donné
function getTopScoresForGame(gameId) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT s.score, u.username
            FROM score s
            INNER JOIN user u ON s.idUser = u.idUser
            WHERE s.idGame = ?
            ORDER BY s.score DESC
            LIMIT 5
        `;
        db.query(sql, [gameId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

module.exports = {
    getBestScores
};