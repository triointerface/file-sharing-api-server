import Database from '../../../database/connection.js';

class UserService {
    constructor() {}

    async getUser(searchParams = {}) {
        const columns = [
            'id', 'first_name', 'last_name', 'email', 'created_at'
        ];
        if (searchParams && searchParams.includePassword && searchParams.hasOwnProperty('includePassword')) {
            columns.push('password');
        }
        const sql = Database.select(columns).from('users');

        if (searchParams && searchParams.hasOwnProperty('email')) {
            sql.andWhere('email', searchParams.email)
        }

        if (searchParams && searchParams.hasOwnProperty('id')) {
            sql.andWhere('id', searchParams.id);
        }

        return sql;
    }

    async createUser(payload) {
        return Database.insert(payload).into('users');
    }

}

export default new UserService();