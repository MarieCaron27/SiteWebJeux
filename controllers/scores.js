const db = require('../databases/database');

async function saveScore(userId, gameId, newScore) {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO score (score, idUser, idGame) VALUES (?, ?, ?)',
            [newScore, userId, gameId],
            (error, results) => {
                if (error) return reject(error);

                db.query(
                    'SELECT COUNT(idScore) AS scoreCount FROM score WHERE idUser=? AND idGame=?',
                    [userId, gameId],
                    (error, results) => {
                        if (error) return reject(error);

                        const nbScore = results[0].scoreCount;
                        if (nbScore > 5) {
                            db.query(
                                'SELECT idScore AS worstScore FROM score WHERE idUser = ? AND idGame = ? ORDER BY score ASC LIMIT 1',
                                [userId, gameId],
                                (error, results) => {
                                    if (error) return reject(error);

                                    const suppScore = results[0].worstScore;
                                    db.query(
                                        'DELETE FROM score WHERE idScore = ?',
                                        [suppScore],
                                        (error, results) => {
                                            if (error) return reject(error);
                                            resolve();
                                        }
                                    );
                                }
                            );
                        } else {
                            resolve();
                        }
                    }
                );
            }
        );
    });
}

async function getBestScore(userId, gameId) {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT MAX(score) AS bestScore FROM score WHERE idGame = ? AND idUser = ?',
            [gameId, userId],
            (error, results) => {
                if (error) return reject(error);
                if (results.length > 0) {
                    resolve(results[0].bestScore);
                } else {
                    resolve(0); // Default score if no scores found
                }
            }
        );
    });
}

module.exports = {
    saveScore,
    getBestScore
};
