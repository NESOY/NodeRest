const fs = require('fs');
const pool = require('./dbconnect.js');

class Movie {
    constructor() {
        const data = fs.readFileSync('./model/data.json');
        this.data = JSON.parse(data)
    }

    // Promise 예제
    getMovieList(cb) {
        pool.getConnection((err, con) => {
            if (err) {
                return cb(err);
            }
            let sql = 'SELECT movie_id, title FROM movies';
            con.query(sql, function (err, results) {
                if (err) {
                    return cb(err);
                }

                con.release();
                return cb(null, {count: results.length, data: results});
            });
        });
    }

    addMovie(title, director, year, synopsis) {
        return new Promise((resolve,reject) => {
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
                    resolve({id:results.insertId, title:title, director:director, year:year, synopsis:synopsis});
                    return ;
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
            for (let movie of this.data) {
                if (movie.id === movieId) {
                    movie.title = title;
                    movie.director = director;
                    movie.year = year;
                    movie.synopsis = synopsis;
                    resolve(movie);
                    return;
                }
            }
            reject({msg: 'Cannot Update Movie', code: 404});
        });
    }

    removeMovie(movieId) {
        return new Promise((resolve, reject) => {
            for (let movie of this.data) {
                if (movie.id === movieId) {
                    this.data.splice(movie.id, 1);
                    resolve(this.data);
                    return;
                }
            }
            reject({msg: 'Cannot Remove Movie', code: 404});
        });
    }


}

module.exports = new Movie();