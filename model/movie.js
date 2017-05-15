const fs = require('fs');


class Movie {
    constructor() {
        const data = fs.readFileSync('./model/data.json');
        this.data = JSON.parse(data)
    }

    // Promise 예제
    getMovieList() {
        if (this.data) {
            return this.data;
        }
        else {
            return [];
        }
    }

    addMovie(title, director, year, synopsis) {
        return new Promise((resolve, reject) => {
            let last = this.data[this.data.length - 1];
            let id = last.id + 1;

            let newMovie = {id: id, title: title, director: director, year: year, synopsis: synopsis};
            this.data.push(newMovie);

            resolve(newMovie);
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