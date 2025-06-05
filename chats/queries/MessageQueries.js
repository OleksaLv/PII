const Message = require('../schemas/MessageSchema');
const Database = require('../database');

class MessageQueries {
    async createMessage({ sender, content, chat }) {
        try {
            const message = new Message({
                sender: sender,
                content: content,
                chat: chat
            });
            
            const savedMessage = await message.save();
            
            // Get sender details from SQL
            let connection;
            try {
                connection = await Database.getSQLConnection();
                const [userRows] = await connection.execute(
                    'SELECT id, first_name, last_name FROM students WHERE id = ?',
                    [sender]
                );
                
                if (userRows.length > 0) {
                    savedMessage.senderDetails = userRows[0];
                }
            } finally {
                if (connection) {
                    await connection.end();
                }
            }
            
            return savedMessage;
        } catch (error) {
            console.error('Error creating message:', error);
            throw error;
        }
    }
    
    async getChatMessages(chatId) {
        try {
            // Sort by createdAt ascending (oldest first, newest at bottom)
            const messages = await Message.find({ chat: chatId }).sort({ createdAt: 1 }).lean();
            
            // Get sender details from SQL for each message
            let connection;
            try {
                connection = await Database.getSQLConnection();
                
                for (const message of messages) {
                    const [userRows] = await connection.execute(
                        'SELECT id, first_name, last_name FROM students WHERE id = ?',
                        [message.sender]
                    );
                    if (userRows.length > 0) {
                        message.senderDetails = userRows[0];
                    }
                }
            } finally {
                if (connection) {
                    await connection.end();
                }
            }
            
            return messages;
        } catch (error) {
            console.error('Error getting chat messages:', error);
            throw error;
        }
    }
}

module.exports = new MessageQueries();