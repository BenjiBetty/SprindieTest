let connection = require('../database/connection');

class Song {
    // CREATE
    static create(title, band, url, cb) {
            connection.query('INSERT INTO music SET ?', { title: title, band: band, url: url }, (err, result) => {
                if (err) throw err
                cb(result);
            })
        }
        // READ
    static all(cb) {
            connection.query('SELECT * FROM music', (err, rows) => {
                if (err) throw err
                cb(rows)
            })
        }
        // UPDATE   
    static update(id, cb) {
            connection.query('SELECT * FROM music WHERE id = ?', id, (err, rows) => {
                if (err) throw err
                cb(result);
            })
        }
        // DELETE
    static delete(id, cb) {
        connection.query('DELETE FROM music WHERE id = ?', id, (err, rows) => {
            if (err) throw err
            cb(rows);
        })
    }
}

module.exports = Song;