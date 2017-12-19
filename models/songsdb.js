let connection = require('../database/db');
class Songs {
    static create(title, band, url, cb) {
        connection.query('INSERT INTO music SET ?', { title: title, band: band, url: url }, (err, result) => {
            console.log(err)
            if (err) throw err
            cb(result);
        })
    }
    static all(cb) {
        connection.query('SELECT * FROM musics', (err, rows) => {
            if (err) throw err
            cb(rows)
        })
    }
}

module.exports = Songs