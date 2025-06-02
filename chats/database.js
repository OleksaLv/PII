const mongoose = require("mongoose");

class Database {

    constructor() {
        this.connect();
    }

    connect() {
        mongoose.connect("mongodb+srv://root:root@pii-mongodb.gaewtjr.mongodb.net/?retryWrites=true&w=majority&appName=pii-mongodb")
        .then(() => {
            console.log("database connection successful");
        })
        .catch((err) => {
            console.log("database connection error " + err);
            process.exit(1);
        })
    }
}

module.exports = new Database();