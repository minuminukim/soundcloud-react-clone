const express = require('express');
const asyncHandler = require('express-async-handler');

const { setTokenCookie, restoreUser } = require('../../utils/auth.js');
const { User } = require('../../db/models');

const router = express.Router();

// Log in
router.post(
  '/',
  asyncHandler(async (req, res, next) => {
    const { credential, password } = req.body;
    const user = await User.login({ credential, password });

    if (!user) {
      const error = new Error('Login failed');
      error.status = 401;
      error.title = 'Login failed';
      error.errors = ['The provided credentials were invalid.'];
      return next(error);
    }

    await setTokenCookie(res, user);

    return res.json({
      user,
    });
  })
);

module.exports = router;
