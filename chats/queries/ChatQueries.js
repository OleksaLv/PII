const Chat = require('../schemas/ChatSchema');
const Database = require('../database');

class ChatQueries {
    async createChat({ users, isGroupChat }) {
        try {
            let connection;
            let chatName = '';
            
            try {
                connection = await Database.getSQLConnection();
                
                // Get user names for chat name generation
                const userNames = [];
                for (const userId of users) {
                    const [userRows] = await connection.execute(
                        'SELECT id, first_name, last_name FROM students WHERE id = ?',
                        [userId]
                    );
                    
                    if (userRows.length === 0) {
                        throw new Error(`User with ID ${userId} not found`);
                    }
                    
                    userNames.push(`${userRows[0].first_name} ${userRows[0].last_name}`);
                }
                
                // Generate chat name
                chatName = userNames.join(', ');
                
            } finally {
                if (connection) {
                    await connection.end();
                }
            }
            
            const chat = new Chat({
                chatName: chatName,
                users: users,
                isGroupChat: isGroupChat
            });
            
            return await chat.save();
        } catch (error) {
            throw error;
        }
    }
    
    async getUserChats(userId) {
        try {
            const chats = await Chat.find({
                users: { $in: [userId] }
            }).populate('latestMessage').sort({ updatedAt: -1 });
            
            // Get user details from SQL for each chat
            let connection;
            try {
                connection = await Database.getSQLConnection();
                
                for (const chat of chats) {
                    const userDetails = [];
                    for (const uid of chat.users) {
                        const [userRows] = await connection.execute(
                            'SELECT id, first_name, last_name, email FROM students WHERE id = ?',
                            [uid]
                        );
                        if (userRows.length > 0) {
                            userDetails.push(userRows[0]);
                        }
                    }
                    chat.userDetails = userDetails;
                }
            } finally {
                if (connection) {
                    await connection.end();
                }
            }
            
            return chats;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ChatQueries();