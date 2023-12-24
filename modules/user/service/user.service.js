import Database from '../../../database/connection.js';

class UserService {
  /**
   * Retrieves user information from the database based on the provided search parameters.
   * @param {Object} searchParams - The parameters used for filtering user information.
   * @returns {Promise<Array>} - A Knex.js query object representing the user retrieval query.
   */
  async getUser(searchParams = {}) {
    const columns = ['id', 'first_name', 'last_name', 'email', 'created_at'];
    if (
      searchParams
      && searchParams.includePassword
      && Object.prototype.hasOwnProperty.call(searchParams, 'includePassword')
    ) {
      columns.push('password');
    }
    const sql = Database.select(columns).from('users');

    if (searchParams && Object.prototype.hasOwnProperty.call(searchParams, 'email')) {
      sql.andWhere('email', '=', searchParams.email);
    }

    if (searchParams && Object.prototype.hasOwnProperty.call(searchParams, 'id')) {
      sql.andWhere('id', '=', searchParams.id);
    }

    return sql;
  }

  /**
   * Creates a new user in the database with the provided user payload.
   * @param {Object} payload - The user information to be inserted into the database.
   * @returns {Promise} - A Promise representing the result of the user creation operation in the database.
   */
  async createUser(payload) {
    return Database.insert(payload).into('users');
  }

  /**
   * Removes a user account from the database based on the provided user ID.
   * @param {number} userId - The ID of the user account to be removed.
   * @throws {Error} - Throws an error if the user account is not found.
   * @returns {Promise} - A Promise representing the result of the user account removal operation in the database.
   */
  async removeAccount(userId) {
    const user = await this.getUser({ id: userId });
    if (!user || (Array.isArray(user) && user.length === 0)) {
      throw new Error('Invalid user');
    }
    return Database('users').where('id', '=', userId).del();
  }
}

export default UserService;
