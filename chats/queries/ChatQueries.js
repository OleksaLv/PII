const Chat = require('../schemas/ChatSchema');
const Message = require('../schemas/MessageSchema');
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
            // Get chats and populate latestMessage, using lean() to get plain objects
            const chats = await Chat.find({
                users: { $in: [userId] }
            }).populate('latestMessage').sort({ updatedAt: -1 }).lean();
            
            // Get user details from SQL for each chat and latest message sender details
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
                    
                    // If no latestMessage is set, find the most recent message manually
                    if (!chat.latestMessage) {
                        const lastMessage = await Message.findOne({ chat: chat._id }).sort({ createdAt: -1 }).lean();
                        if (lastMessage) {
                            // Update the chat with the latest message
                            await Chat.findByIdAndUpdate(chat._id, { latestMessage: lastMessage._id });
                            chat.latestMessage = lastMessage;
                        }
                    }
                    
                    // Get sender details for latest message
                    if (chat.latestMessage && chat.latestMessage.sender) {
                        const [senderRows] = await connection.execute(
                            'SELECT id, first_name, last_name FROM students WHERE id = ?',
                            [chat.latestMessage.sender]
                        );
                        if (senderRows.length > 0) {
                            chat.latestMessage.senderDetails = senderRows[0];
                            console.log('Added sender details to latest message:', chat.latestMessage.senderDetails);
                        } else {
                            console.log('No sender found for ID:', chat.latestMessage.sender);
                        }
                    }
                }
            } finally {
                if (connection) {
                    await connection.end();
                }
            }
            
            console.log('Final chats with sender details:', JSON.stringify(chats, null, 2));
            return chats;
        } catch (error) {
            console.error('Error in getUserChats:', error);
            throw error;
        }
    }
    
    async getChatById(chatId) {
        try {
            const chat = await Chat.findById(chatId);
            
            if (!chat) {
                return null;
            }
            
            // Get user details from SQL
            let connection;
            try {
                connection = await Database.getSQLConnection();
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
            } finally {
                if (connection) {
                    await connection.end();
                }
            }
            
            return chat;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ChatQueries();