const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    userId: { type: Number, required: true }, // Store SQL user ID as number
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    messageId: { type: Schema.Types.ObjectId, ref: 'Message', required: true },
    senderId: { type: Number, required: true }, // Store sender SQL user ID as number
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);