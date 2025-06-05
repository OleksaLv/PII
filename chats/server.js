const express = require('express');
const path = require('path');
const Database = require("./database");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require('cookie-parser');
const fs = require('fs');
const UserQueries = require('./queries/UserQueries');
const ChatQueries = require('./queries/ChatQueries');
const MessageQueries = require('./queries/MessageQueries');

const app = express();
const port = 3000;

const server = app.listen(port, () => console.log("Server listening on port " + port));
const io = require("socket.io")(server, { pingTimeout: 60000 });

// Track online users by chat
const onlineUsersByChat = new Map();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use('/assets', express.static(path.join(__dirname, '..', 'public')));

app.locals.ASSETS_PATH = '/assets';
app.locals.PHP_BASE_URL = 'http://localhost/pii';

app.use(session({
    name: 'nodejs_session',
    secret: "cheese and potato",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: false,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

function readPHPSession(sessionId) {
    try {
        const paths = [
            require('os').tmpdir() + '/php_sessions/sess_' + sessionId,
            'C:\\xampp\\tmp\\sess_' + sessionId
        ];
        
        for (const path of paths) {
            if (fs.existsSync(path)) {
                return fs.readFileSync(path, 'utf8');
            }
        }
        return null;
    } catch (error) {
        return null;
    }
}

function parsePHPSession(data) {
    const result = {};
    const regex = /(\w+)\|([^}]+}|[^;]+);/g;
    let match;
    
    while ((match = regex.exec(data)) !== null) {
        const key = match[1];
        let value = match[2];
        
        if (value.startsWith('s:')) {
            const stringMatch = value.match(/s:\d+:"(.*)"/);
            if (stringMatch) {
                result[key] = stringMatch[1];
            }
        } else if (value.startsWith('i:')) {
            result[key] = parseInt(value.substring(2));
        }
    }
    
    return result;
}

async function requireAuth(req, res, next) {
    try {
        console.log('Auth middleware - Query params:', req.query);
        
        const userId = req.query.user_id;
        const authToken = req.query.auth_token;
        
        if (!userId || !authToken) {
            console.log('Missing userId or authToken');
            return res.redirect('http://localhost/pii/users/login');
        }

        const user = await Database.getUserById(userId);
        
        if (!user) {
            console.log('User not found in database');
            return res.redirect('http://localhost/pii/users/login');
        }

        const crypto = require('crypto');
        const expectedToken = crypto.createHash('md5').update(user.id + user.email + 'cheese and potato').digest('hex');
        
        if (authToken !== expectedToken) {
            console.log('Invalid auth token');
            return res.redirect('http://localhost/pii/users/login');
        }

        console.log(`Authentication successful: ${user.email}`);
        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.redirect('http://localhost/pii/users/login');
    }
}

app.get("/chats", requireAuth, (req, res, next) => {
    const crypto = require('crypto');
    const authToken = crypto.createHash('md5').update(req.user.id + req.user.email + 'cheese and potato').digest('hex');
    
    var payload = {
        pageTitle: "Chats",
        user: req.user,
        phpSession: req.phpSession,
        css: ['chats.css'],
        authToken: authToken
    };
    
    res.status(200).render("chats", payload);
});

app.get("/messages/:chatId", requireAuth, async (req, res, next) => {
    try {
        const chatId = req.params.chatId;
        const chat = await ChatQueries.getChatById(chatId);
        
        if (!chat || !chat.users.includes(req.user.id)) {
            return res.redirect(`/chats?user_id=${req.user.id}&auth_token=${req.query.auth_token}`);
        }
        
        const crypto = require('crypto');
        const authToken = crypto.createHash('md5').update(req.user.id + req.user.email + 'cheese and potato').digest('hex');
        
        var payload = {
            pageTitle: "Messages",
            user: req.user,
            phpSession: req.phpSession,
            css: ['messages.css'],
            authToken: authToken,
            chat: chat
        };
        
        res.status(200).render("messages", payload);
    } catch (error) {
        console.error('Error loading messages:', error);
        res.redirect(`/chats?user_id=${req.user.id}&auth_token=${req.query.auth_token}`);
    }
});

app.get("/create-chat", requireAuth, (req, res, next) => {
    const crypto = require('crypto');
    const authToken = crypto.createHash('md5').update(req.user.id + req.user.email + 'cheese and potato').digest('hex');
    
    var payload = {
        pageTitle: "Create Chat",
        user: req.user,
        phpSession: req.phpSession,
        css: ['create-chat.css'],
        authToken: authToken
    };
    
    res.status(200).render("create-chat", payload);
});

app.get("/api/search-users", requireAuth, async (req, res) => {
    try {
        console.log('Search users request:', req.query);
        const searchTerm = req.query.term;
        
        if (!searchTerm) {
            return res.json([]);
        }
        
        const users = await UserQueries.searchUsers(searchTerm, req.user.id);
        console.log('Search users result:', users);
        res.json(users);
    } catch (error) {
        console.error('Search users error:', error);
        res.status(500).json({ error: 'Search failed' });
    }
});

app.post("/api/create-chat", requireAuth, async (req, res) => {
    try {
        console.log('Create chat request body:', req.body);
        console.log('Create chat user:', req.user);
        
        const { users, isGroupChat } = req.body;
        
        if (!users || users.length === 0) {
            console.log('No users provided');
            return res.status(400).json({ error: 'At least one user must be selected' });
        }
        
        const allUsers = [...users, req.user.id];
        console.log('All users for chat:', allUsers);
        
        const chat = await ChatQueries.createChat({
            users: allUsers,
            isGroupChat: isGroupChat || allUsers.length > 2
        });
        
        console.log('Chat created successfully:', chat);
        res.json({ success: true, chat });
    } catch (error) {
        console.error('Create chat error:', error);
        res.status(500).json({ error: 'Failed to create chat' });
    }
});

app.get("/api/chats", requireAuth, async (req, res) => {
    try {
        console.log('Get chats for user:', req.user.id);
        const chats = await ChatQueries.getUserChats(req.user.id);
        console.log('Retrieved chats:', chats);
        res.json(chats);
    } catch (error) {
        console.error('Get chats error:', error);
        res.status(500).json({ error: 'Failed to load chats' });
    }
});

app.get("/api/messages/:chatId", requireAuth, async (req, res) => {
    try {
        const chatId = req.params.chatId;
        const messages = await MessageQueries.getChatMessages(chatId);
        res.json(messages);
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ error: 'Failed to load messages' });
    }
});

app.get("/api/online-users/:chatId", requireAuth, async (req, res) => {
    try {
        const chatId = req.params.chatId;
        const onlineUsers = onlineUsersByChat.get(chatId) || new Set();
        res.json(Array.from(onlineUsers));
    } catch (error) {
        console.error('Get online users error:', error);
        res.status(500).json({ error: 'Failed to load online users' });
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    socket.on('join-chat', (data) => {
        const { chatId, userId } = data;
        socket.join(chatId);
        socket.userId = userId;
        socket.chatId = chatId;
        
        // Add user to online users for this chat
        if (!onlineUsersByChat.has(chatId)) {
            onlineUsersByChat.set(chatId, new Set());
        }
        onlineUsersByChat.get(chatId).add(userId);
        
        console.log(`User ${userId} (${socket.id}) joined chat ${chatId}`);
        socket.to(chatId).emit('user-joined', userId);
        
        // Send current online users to the newly joined user
        const onlineUsers = Array.from(onlineUsersByChat.get(chatId));
        socket.emit('online-users', onlineUsers);
    });
    
    socket.on('send-message', async (data) => {
        try {
            const { chatId, content, userId } = data;
            socket.userId = userId;
            
            const message = await MessageQueries.createMessage({
                sender: userId,
                content: content,
                chat: chatId
            });
            
            const Chat = require('./schemas/ChatSchema');
            await Chat.findByIdAndUpdate(chatId, { 
                latestMessage: message._id,
                updatedAt: new Date()
            });
            
            const messageObject = message.toObject();
            messageObject.senderDetails = message.senderDetails;
            
            console.log('Message sent and chat updated:', { chatId, messageId: message._id });
            
            io.to(chatId).emit('new-message', messageObject);
        } catch (error) {
            console.error('Send message error:', error);
        }
    });
    
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        if (socket.userId && socket.chatId) {
            // Remove user from online users for this chat
            if (onlineUsersByChat.has(socket.chatId)) {
                onlineUsersByChat.get(socket.chatId).delete(socket.userId);
                if (onlineUsersByChat.get(socket.chatId).size === 0) {
                    onlineUsersByChat.delete(socket.chatId);
                }
            }
            socket.to(socket.chatId).emit('user-left', socket.userId);
        }
    });
});