const mysql = require('mysql2/promise');

var pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Yuvraj",
    database: "restauantsreview"
})


module.exports = pool;