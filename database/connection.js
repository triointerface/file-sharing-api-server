import knex from 'knex';
import knexConfig from '../knexfile.js';

// Return databse connection
export default knex(knexConfig);
