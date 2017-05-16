const fs = require('fs');
const pool = require('./dbconnect.js');

class Movie {
    constructor() {
        const data = fs.readFileSync('./model/data.json');
        this.data = JSON.parse(data)
    }

    // Promise 예제
    getMovieList() {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, con) => {
                if (err) {
                    reject(err);
                    return;
                }
                let sql = 'SELECT movie_id, title FROM movies';
                con.query(sql, function (err, results) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    con.release();
                    return resolve({count: results.length, movies: results});
                });
            });
        });
    }

    addMovie(title, director, year, synopsis) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, con) => {
                if (err) {
                    reject(err);
                    return;
                }
                let sql = 'INSERT INTO movies VALUES(null, ?,?,?,?)';
                con.query(sql, [title, director, year, synopsis], (err, results) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    con.release();
                    resolve({id: results.insertId, title: title, director: director, year: year, synopsis: synopsis});
                    return;
                });
            });
        });
    }

    // Promise - Reject
    getMovieDetail(movieId) {
        return new Promise((resolve, reject) => {
            for (var movie of this.data) {
                if (movie.id == movieId) {
                    resolve(movie);
                    return;
                }
            }
            reject({msg: 'Can not find movie', code: 404});
        });
    }

    modifyMovie(movieId, title, director, year, synopsis) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, con) => {
                if (err) {
                    reject({msg: 'Cannot Update Movie', code: 404});
                    return;
                }
                let sql = 'UPDATE movies SET title = ?, director = ?, year = ?, synopsis = ? where movie_id = ?';
                con.query(sql, [title, director, year, synopsis, movieId], (err, results) => {
                    if (err) {
                        reject({msg: 'Cannot Update Movie', code: 404});
                        return;
                    }
                    con.release();
                    resolve({id: movieId, title: title, director: director, year: year, synopsis: synopsis});
                    return;
                });
            });
        });
    }

    removeMovie(movieId) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, con) => {
                if (err) {
                    reject({msg: 'Cannot Update Movie', code: 404});
                    return;
                }
                let sql = 'DELETE FROM movies where movie_id = ?';
                con.query(sql, [movieId], (err, results) => {
                    if (err) {
                        reject({msg: 'Cannot Update Movie', code: 404});
                        return;
                    }
                    con.release();
                    resolve({id: movieId});
                    return;
                });
            });
        });

    }


}

module.exports = new Movie();