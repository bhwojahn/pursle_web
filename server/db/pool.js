'use strict';

const { Pool } = require('pg');

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }

  const ssl =
    process.env.PGSSLMODE === 'require' || process.env.DATABASE_SSL === 'true'
      ? { rejectUnauthorized: process.env.PGSSL_REJECT_UNAUTHORIZED !== 'false' }
      : undefined;

  return new Pool({
    connectionString,
    ssl,
    max: 10,
    idleTimeoutMillis: 30_000,
  });
}

let pool;
function getPool() {
  if (pool === undefined) {
    pool = createPool();
  }
  return pool;
}

module.exports = { getPool };
