let mysql = require('mysql');
let dbconfig = {
    host: 'localhost',
    user: 'root',
    password: 'csedbadmin',
    port: 3306,
    database: 'moviest'
};

let dbPool = mysql.createPool(dbconfig);

module.exports = dbPool;