'use strict';

const crypto = require('crypto');
const express = require('express');

const router = express.Router();
const CSRF_COOKIE = 'pursle_csrf';

router.get('/csrf-token', (req, res) => {
  const token = crypto.randomBytes(32).toString('hex');
  res.cookie(CSRF_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 1000,
  });
  res.json({ csrfToken: token });
});

module.exports = { router, CSRF_COOKIE };
