const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  refreshToken,
  getMe,
  updateProfile,
  changePassword,
  enable2FA,
  verify2FA,
  disable2FA,
} = require('../controllers/authController');
const { authenticate, verifyRefreshToken } = require('../middleware/auth');
const {
  validateRegister,
  validateLogin,
  validateUpdateUser,
} = require('../middleware/validation');

// Rotas públicas
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/refresh-token', verifyRefreshToken, refreshToken);

// Rotas privadas (requerem autenticação)
router.use(authenticate);

router.get('/me', getMe);
router.post('/logout', logout);
router.put('/profile', validateUpdateUser, updateProfile);
router.put('/change-password', changePassword);

// Rotas 2FA (apenas para admins)
router.post('/enable-2fa', enable2FA);
router.post('/verify-2fa', verify2FA);
router.post('/disable-2fa', disable2FA);

module.exports = router;
