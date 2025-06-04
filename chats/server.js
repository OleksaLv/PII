const express = require('express');
const path = require('path');
const Database = require("./database");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require('cookie-parser');
const fs = require('fs');

const app = express();
const port = 3000;

const server = app.listen(port, () => console.log("Server listening on port " + port));
const io = require("socket.io")(server, { pingTimeout: 60000 });


app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views")); // Use absolute path

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Serve PHP public folder assets
app.use('/assets', express.static(path.join(__dirname, '..', 'public')));

// Global variables for templates
app.locals.ASSETS_PATH = '/assets';
app.locals.PHP_BASE_URL = 'http://localhost/pii';

// Configure session with PHP-compatible settings
app.use(session({
    name: 'nodejs_session',
    secret: "cheese and potato",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: false,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Function to read PHP session data
function readPHPSession(sessionId) {
    try {
        const paths = [
            require('os').tmpdir() + '/php_sessions/sess_' + sessionId,
            'C:\\xampp\\tmp\\sess_' + sessionId
        ];
        
        for (const path of paths) {
            if (fs.existsSync(path)) {
                const sessionData = fs.readFileSync(path, 'utf8');
                const parsedData = parsePHPSession(sessionData);
                
                if (parsedData && parsedData.user_id && parsedData.authenticated) {
                    return parsedData;
                }
            }
        }
        return null;
    } catch (error) {
        return null;
    }
}

// Function to parse PHP session data format
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
        } else if (value.startsWith('b:')) {
            result[key] = value.substring(2) === '1';
        }
    }
    
    return result;
}

// Authentication middleware
async function requireAuth(req, res, next) {
    try {
        const userId = req.query.user_id;
        const authToken = req.query.auth_token;
        
        if (!userId || !authToken) {
            // Fallback to PHP session reading
            const phpSessionId = req.cookies.PHPSESSID;
            
            if (phpSessionId) {
                const phpSessionData = readPHPSession(phpSessionId);
                if (phpSessionData && phpSessionData.user_id) {
                    const user = await Database.getUserById(phpSessionData.user_id);
                    if (user) {
                        console.log(`Authentication successful via session: ${user.email}`);
                        req.user = user;
                        req.phpSession = phpSessionData;
                        return next();
                    }
                }
            }
            
            if (!req.session.authFailLogged) {
                console.log('Authentication failed: No valid credentials found, redirecting to login');
                req.session.authFailLogged = true;
            }
            return res.redirect('http://localhost/pii/users/login');
        }

        // Validate user exists in SQL database
        const user = await Database.getUserById(userId);
        
        if (!user) {
            console.log('Authentication failed: User not found in database, redirecting to login');
            return res.redirect('http://localhost/pii/users/login');
        }

        // Validate auth token
        const crypto = require('crypto');
        const expectedToken = crypto.createHash('md5').update(user.id + user.email + 'cheese and potato').digest('hex');
        
        if (authToken !== expectedToken) {
            console.log('Authentication failed: Invalid auth token, redirecting to login');
            return res.redirect('http://localhost/pii/users/login');
        }

        console.log(`Authentication successful via URL parameters: ${user.email}`);
        req.session.authFailLogged = false;
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

app.get("/messages", requireAuth, (req, res, next) => {
    const crypto = require('crypto');
    const authToken = crypto.createHash('md5').update(req.user.id + req.user.email + 'cheese and potato').digest('hex');
    
    var payload = {
        pageTitle: "Messages",
        user: req.user,
        phpSession: req.phpSession,
        css: ['messages.css'],
        authToken: authToken
    };
    
    res.status(200).render("messages", payload);
});