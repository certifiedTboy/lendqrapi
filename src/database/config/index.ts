const environment = process.env.ENVIRONMENT || 'development'
const knexConfig = require('../knexfile')[environment];
const db = require('knex')(knexConfig);



export default db