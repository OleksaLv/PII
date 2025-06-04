const mongoose = require("mongoose");
const mysql = require("mysql2/promise");

class Database {

    constructor() {
        this.connectMongoDB();
        this.connectSQL();
    }

    connectMongoDB() {
        mongoose.connect("mongodb+srv://root:root@pii-mongodb.gaewtjr.mongodb.net/?retryWrites=true&w=majority&appName=pii-mongodb")
        .then(() => {
            console.log("MongoDB connection successful");
        })
        .catch((err) => {
            console.log("MongoDB connection error " + err);
            process.exit(1);
        })
    }

    async connectSQL() {
        try {
            this.sqlConfig = {
                host: 'localhost',
                user: 'root',
                password: 'root',
                database: 'pii-lab'
            };

            // Test the connection
            const testConnection = await mysql.createConnection(this.sqlConfig);
            await testConnection.end();
            console.log("SQL database connection successful");
        } catch (error) {
            console.error('SQL database connection error:', error);
            process.exit(1);
        }
    }

    async getSQLConnection() {
        try {
            const connection = await mysql.createConnection(this.sqlConfig);
            return connection;
        } catch (error) {
            console.error('SQL connection error:', error);
            throw error;
        }
    }

    async getUserById(userId) {
        let connection;
        try {
            connection = await this.getSQLConnection();
            const [rows] = await connection.execute(
                'SELECT students.*, groups.name AS group_name FROM students LEFT JOIN groups ON students.group_id = groups.id WHERE students.id = ?',
                [userId]
            );
            
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }
}

module.exports = new Database();