'use strict';

require('dotenv').config();

const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const { router: csrfRouter } = require('./routes/csrf');
const { router: contactRouter } = require('./routes/contact');

const app = express();
const publicDir = path.join(__dirname, '..', 'public');

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  app.set('trust proxy', 1);
}

app.use((req, res, next) => {
  if (!isProd) return next();
  const proto = req.get('x-forwarded-proto');
  if (proto === 'http') {
    return res.redirect(301, `https://${req.get('host')}${req.originalUrl}`);
  }
  next();
});

const cspDirectives = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'"],
  styleSrc: ["'self'", 'https://fonts.googleapis.com'],
  fontSrc: ['https://fonts.gstatic.com'],
  imgSrc: ["'self'", 'data:'],
  connectSrc: ["'self'"],
  frameAncestors: ["'none'"],
  baseUri: ["'self'"],
  formAction: ["'self'"],
  objectSrc: ["'none'"],
  scriptSrcAttr: ["'none'"],
};
if (isProd) {
  cspDirectives.upgradeInsecureRequests = [];
}

app.use(
  helmet({
    hsts: isProd
      ? { maxAge: 31536000, includeSubDomains: true, preload: true }
      : false,
    frameguard: { action: 'deny' },
    contentSecurityPolicy: {
      useDefaults: false,
      directives: cspDirectives,
    },
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);

app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});

app.use(express.json({ limit: '32kb' }));
app.use(cookieParser());

app.use('/api', csrfRouter);
app.use('/api', contactRouter);

app.use(express.static(publicDir, { extensions: ['html'] }));

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({ ok: false, error: 'not found' });
    return;
  }
  res.status(404).sendFile(path.join(publicDir, '404.html'), (err) => {
    if (err) next(err);
  });
});

app.use((err, req, res, next) => {
  console.error('unhandled error', err);
  if (req.path.startsWith('/api')) {
    res.status(500).json({ ok: false, error: 'something went wrong. please try again.' });
    return;
  }
  res.status(500).sendFile(path.join(publicDir, '404.html'));
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`pursle server listening on http://127.0.0.1:${port}`);
});

require('dotenv').config();

const requiredEnv = ['DB_HOST', 'DB_USER', 'DB_NAME', 'PORT'];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
});