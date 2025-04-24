const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');

router.post('/login', authController.login);
router.get('/google/callback', authController.googleLogin);

module.exports = router;

// Link for google login
// https://accounts.google.com/o/oauth2/auth?client_id=172929553590-6osiudirftrlu09g52rnk4b02a85p66k.apps.googleusercontent.com&redirect_uri=http://localhost:3000/api/auth/google/callback&response_type=code&scope=email%20profile&access_type=offline
