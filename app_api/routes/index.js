const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // Enable JSON Web Tokens

const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');

// Method to authenticate our JWT
function authenticateJWT(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        console.log('Returning Unauthorized - No Token');
        return res.status(401).json({ message: 'Unauthorized' });
    }

    let headers = authHeader.split(' ');
    if (headers.length < 2) {
        console.log('Returning Unauthorized - Invalid Header Format');
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = headers[1];

    if (!token) {
        console.log('Returning Unauthorized - Null Bearer Token');
        return res.status(401).json({ message: 'Unauthorized' });
    }

    console.log('Decoding Token...');

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log('Returning Unauthorized - Token Validation Error:', err.message);
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.auth = decoded;    
        next(); 
    });
}


router
    .route('/login')
    .post(authController.login);

router
    .route('/register')
    .post(authController.register);

router
    .route('/trips')
    .get(tripsController.tripsList)
    .post(authenticateJWT, tripsController.tripsAddTrip);

router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode)
    .put(authenticateJWT, tripsController.tripsUpdateTrip);

module.exports = router;
