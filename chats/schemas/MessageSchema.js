const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    sender: { type: Number }, // Store SQL user ID as number
    content: { type: String, trim: true },
    chat: { type: Schema.Types.ObjectId, ref: 'Chat' },
    readBy: [{ type: Number }] // Store SQL user IDs as numbers
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);