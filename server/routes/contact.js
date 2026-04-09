'use strict';

const crypto = require('crypto');
const express = require('express');
const validator = require('validator');
const { Resend } = require('resend');

const { getPool } = require('../db/pool');
const { contactLimiter } = require('../middleware/rateLimit');
const { CSRF_COOKIE } = require('./csrf');

const router = express.Router();

const MAX_NAME = 200;
const MAX_COMPANY = 200;
const MAX_EMAIL = 320;
const MAX_SLOWING = 5000;

function stripHtmlAndControl(s) {
  if (typeof s !== 'string') return '';
  return s
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .trim();
}

function safeCsrfCompare(cookieVal, bodyVal) {
  if (typeof cookieVal !== 'string' || typeof bodyVal !== 'string') return false;
  const a = Buffer.from(cookieVal, 'utf8');
  const b = Buffer.from(bodyVal, 'utf8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function oneLineForEmail(s, max) {
  return stripHtmlAndControl(s).replace(/[\r\n]/g, ' ').slice(0, max);
}

async function sendLeadEmail({ name, company, email, slowing }) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  const from = process.env.FROM_EMAIL;
  if (!key || !to || !from) {
    console.warn('Lead stored but email skipped: set RESEND_API_KEY, NOTIFY_EMAIL, FROM_EMAIL');
    return;
  }

  const resend = new Resend(key);
  const subject = oneLineForEmail(`pursle lead: ${company || 'unknown'}`, 200);
  const text = [
    'new lead from pursle.com',
    '',
    `name: ${oneLineForEmail(name, MAX_NAME)}`,
    `company: ${oneLineForEmail(company, MAX_COMPANY)}`,
    `email: ${oneLineForEmail(email, MAX_EMAIL)}`,
    '',
    "what's slowing you down:",
    stripHtmlAndControl(slowing).slice(0, MAX_SLOWING),
  ].join('\n');

  await resend.emails.send({
    from,
    to: [to],
    subject,
    text,
  });
}

router.post('/contact', contactLimiter, async (req, res) => {
  try {
    const cookieToken = req.cookies && req.cookies[CSRF_COOKIE];
    const bodyToken = req.body && req.body._csrf;
    if (!safeCsrfCompare(cookieToken, bodyToken)) {
      return res.status(403).json({ ok: false, error: 'something went wrong. please try again.' });
    }

    const honeypot = req.body && req.body.website;
    if (honeypot != null && String(honeypot).trim() !== '') {
      return res.status(200).json({ ok: true });
    }

    let name = stripHtmlAndControl(req.body && req.body.name);
    let company = stripHtmlAndControl(req.body && req.body.company);
    let email = stripHtmlAndControl(req.body && req.body.email);
    let slowing = stripHtmlAndControl(req.body && req.body.slowing);

    if (!name || name.length > MAX_NAME) {
      return res.status(400).json({ ok: false, error: 'something went wrong. please try again.' });
    }
    if (!company || company.length > MAX_COMPANY) {
      return res.status(400).json({ ok: false, error: 'something went wrong. please try again.' });
    }
    if (!email || email.length > MAX_EMAIL || !validator.isEmail(email)) {
      return res.status(400).json({ ok: false, error: 'something went wrong. please try again.' });
    }
    if (!slowing || slowing.length > MAX_SLOWING) {
      return res.status(400).json({ ok: false, error: 'something went wrong. please try again.' });
    }

    const pool = getPool();
    if (!pool) {
      console.error('DATABASE_URL is not configured');
      return res.status(503).json({ ok: false, error: 'something went wrong. please try again.' });
    }
    await pool.query(
      'INSERT INTO leads (name, company, email, slowing) VALUES ($1, $2, $3, $4)',
      [name, company, email, slowing]
    );

    try {
      await sendLeadEmail({ name, company, email, slowing });
    } catch (mailErr) {
      console.error('notify email failed', mailErr);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('contact submission error', err);
    return res.status(500).json({ ok: false, error: 'something went wrong. please try again.' });
  }
});

module.exports = { router };
