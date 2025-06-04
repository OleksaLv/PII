const Database = require('../database');

class UserQueries {
    async searchUsers(searchTerm, currentUserId) {
        let connection;
        try {
            connection = await Database.getSQLConnection();
            const searchPattern = `%${searchTerm}%`;
            
            const [rows] = await connection.execute(`
                SELECT id, first_name, last_name, email 
                FROM students 
                WHERE (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?) 
                AND id != ?
                LIMIT 10
            `, [searchPattern, searchPattern, searchPattern, currentUserId]);
            
            return rows;
        } catch (error) {
            console.error('Error searching users:', error);
            throw error;
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }
}

module.exports = new UserQueries();
