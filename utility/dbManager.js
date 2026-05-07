const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(
    'D:\\sip-db',
    (error) => {
        if(error){
            console.error("Error connecting to database");
        }
        else{
            console.log("Connected to SQLite");
        }
    }
);
module.exports = db;