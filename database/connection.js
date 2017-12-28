let mysql = require('mysql')
let connection = mysql.createConnection({
    //Properties...
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'songs'
});

let connected = connection.connect(function(error) {
    if (!!error) {
        console.log('Connection error to the database');
    } else {
        console.log('Connected to database')
    }
})

module.exports = connection;