module.exports = {
  development: {
    username: 'root',
    password: 'this-is-too-insecure',
    database: 'db-name',
    host: 'ec2-instance',
    dialect: 'postgres',
    dialectOptions: {
      charset: 'utf8mb4',
      ssl: true,
    },
  },
  staging: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: 'postgres',
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: 'postgres',
  },
};
