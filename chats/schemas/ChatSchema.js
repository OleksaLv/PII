const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    chatName: { type: String, required: true, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: Number }], // Store SQL user IDs as numbers
    latestMessage: { type: Schema.Types.ObjectId, ref: 'Message' }
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);