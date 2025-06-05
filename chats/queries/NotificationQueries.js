const Notification = require('../schemas/NotificationSchema');
const Database = require('../database');

class NotificationQueries {
    async createNotification({ userId, chatId, messageId, senderId, content }) {
        try {
            const notification = new Notification({
                userId: userId,
                chatId: chatId,
                messageId: messageId,
                senderId: senderId,
                content: content
            });
            
            const savedNotification = await notification.save();
            
            // Get sender details from SQL
            let connection;
            try {
                connection = await Database.getSQLConnection();
                const [userRows] = await connection.execute(
                    'SELECT id, first_name, last_name FROM students WHERE id = ?',
                    [senderId]
                );
                
                if (userRows.length > 0) {
                    savedNotification.senderDetails = userRows[0];
                }
            } finally {
                if (connection) {
                    await connection.end();
                }
            }
            
            return savedNotification;
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    }
    
    async getUserNotifications(userId) {
        try {
            const notifications = await Notification.find({ 
                userId: userId, 
                isRead: false 
            }).sort({ createdAt: -1 }).lean();
            
            // Get sender details from SQL for each notification
            let connection;
            try {
                connection = await Database.getSQLConnection();
                
                for (const notification of notifications) {
                    const [userRows] = await connection.execute(
                        'SELECT id, first_name, last_name FROM students WHERE id = ?',
                        [notification.senderId]
                    );
                    if (userRows.length > 0) {
                        notification.senderDetails = userRows[0];
                    }
                }
            } finally {
                if (connection) {
                    await connection.end();
                }
            }
            
            return notifications;
        } catch (error) {
            console.error('Error getting user notifications:', error);
            throw error;
        }
    }
    
    async markNotificationAsRead(notificationId) {
        try {
            return await Notification.findByIdAndUpdate(
                notificationId, 
                { isRead: true }, 
                { new: true }
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    }
    
    async deleteNotification(notificationId) {
        try {
            return await Notification.findByIdAndDelete(notificationId);
        } catch (error) {
            console.error('Error deleting notification:', error);
            throw error;
        }
    }
}

module.exports = new NotificationQueries();