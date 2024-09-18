const db = require('../databases/database');
const jwt = require('jsonwebtoken'); /* créer un jeton d'authentification */
const bcrypt = require('bcryptjs');


exports.register = (req, res) => { /* Récuppérer les données du form */
    console.log(req.body);

    const { username, userPassword, userPasswordConfirmed } = req.body;

    if(username == "" || userPassword == "" || userPasswordConfirmed == "")
    {
        return res.render('register', {
            message: "Tous les champs sont requis!"
        });
    }

    db.query('SELECT username FROM user WHERE username = ?', [username], async (error, result) => {
        if (error) {
            console.log(error);
        }

        if (result.length > 0) {
            return res.render('register', {
                message: "Ce nom d'utilisateur a déjà été utilisé!"
            });
        }
        else if (userPassword !== userPasswordConfirmed) {
            return res.render('register', {
                message: "Les mots ne passent ne sont pas identiques!"
            });
        }

        let hashedPassword = await bcrypt.hash(userPassword, 5); /* 5 est le coût du hashage (+ c'est élevé, + c'est sécurisé) */
        console.log(hashedPassword);

        db.query('INSERT INTO user SET ?', { username: username, password: hashedPassword }, (error, result) => {
            if (error) {
                console.log(error);
            }
            else {
                const userId = { id: result.insertId }; // Utilisez l'ID de l'utilisateur inséré dans la base de données
                const token = jwt.sign(userId, process.env.JWT_SECRET); // Créez un token JWT
                res.cookie('token', token, { 
                    sameSite: 'strict', // le cookie est envoyé uniquement pour les requêtes provenant du même site
                    httpOnly: true, // le cookie est accessible uniquement via HTTP
                    secure: true // le cookie est envoyé uniquement via HTTPS
                });
                res.redirect('/games');
            }
        });
    });
}


exports.login = (req, res) => {
    console.log(req.body);

    const { username, passwordLogIn } = req.body;


    db.query('SELECT username,password,idUser FROM user WHERE username = ?', [username], async (error, result) => {
        if (error) {
            console.log(error);
        }

        if (result.length == 1) {
            const user = result[0];
            const hashedPassword = user.password;

            const passwordMatch = await comparePasswords(passwordLogIn, hashedPassword);

            if (passwordMatch) {
                // Les mots de passe correspondent, l'utilisateur est authentifié
                const userId = { id: user.idUser }; // userId est l'ID de l'utilisateur récupéré après la connexion
                const token = jwt.sign(userId, process.env.JWT_SECRET); // Créez un jeton d'authentification
                res.cookie('token', token, { 
                    // expires: pas de date donc le cookie expire à la fin de la session de navigation
                    // expires: new Date(Date.now() + 3600000), // expire dans 1h
                    sameSite: 'strict', // le cookie est envoyé uniquement pour les requêtes provenant du même site
                    httpOnly: true, // le cookie est accessible uniquement via HTTP
                    secure: true // le cookie est envoyé uniquement via HTTPS
                });
                res.redirect('/games');
            } else {
                // Les mots de passe ne correspondent pas, afficher un message d'erreur
                console.log("Mot de passe incorrect!");
                return res.render('login', {
                    message: "Nom d'utilisateur ou mot de passe incorrect!"
                });
            }
        } else {
            // Aucun utilisateur avec ce nom d'utilisateur trouvé dans la base de données
            console.log("Nom d'utilisateur incorrect!");
            return res.render('login', {
                message: "Nom d'utilisateur ou mot de passe incorrect!"
            });
        }
    });
}


// Fonction pour comparer les mots de passe hashés
async function comparePasswords(plainPassword, hashedPassword) {
    try {
        // Comparaison des mots de passe hashés
        const match = await bcrypt.compare(plainPassword, hashedPassword);
        return match;
    } catch (error) {
        console.error("Erreur lors de la comparaison des mots de passe :", error);
        return false;
    }
}