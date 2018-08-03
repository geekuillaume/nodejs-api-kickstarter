module.exports = {
  port: 'PORT',
  db: {
    client: 'DB_CLIENT',
    connection: {
      connectionString: 'DATABASE_URL',
      host: 'DB_HOST',
      user: 'DB_USER',
      password: 'DB_PASSWORD',
      database: 'DB_NAME',
    },
  },
  jwtSecret: 'JWT_SECRET',
  email: {
    from: 'SMTP_FROM',
    smtp: {
      host: 'SMTP_HOST',
      port: 'SMTP_PORT',
      auth: {
        user: 'SMTP_USER',
        pass: 'SMTP_PASS',
      },
    },
  },
};
