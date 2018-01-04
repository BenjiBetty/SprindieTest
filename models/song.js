let connection = require('../database/connection');

class Song {
    static create(title, band, url, cb) {
        connection.query('INSERT INTO music SET ?', { title: title, band: band, url: url }, (err, result) => {
            if (err) throw err
            cb(result);
        })
    }
    static all(cb) {
        connection.query('SELECT * FROM music', (err, rows) => {
            if (err) throw err
            cb(rows)
        })
    }
    static delete(cb) {
        connection.query('DELETE FROM music WHERE id = ?', [req.body.id], (err, rows) => {
            if (err) throw err
            cb(result);
        })
    }
}

module.exports = Song;