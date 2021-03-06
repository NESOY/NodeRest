const express = require('express');
const router = express.Router();
const movies = require('../model/movie');


router.get('/movies/:movieId', showMovieDetail); //READ

router.route('/movies')
    .get(showMovieList)
    .post(addMovie)
    .put(modifyMovie)
    .delete(removeMovieList);

module.exports = router;

async function showMovieList(req, res, next) {
    try {
        const result = await movies.getMovieList();
        res.send({msg: 'success', data: result});
    } catch (error) {
        next(error);
    }
}

async function showMovieDetail(req, res) {
    try {
        const movieId = req.params.movieId;
        const info = await movies.getMovieDetail(movieId);
        res.send(info);
    } catch (error) {
        res.status(error.code).send({msg: error.msg});
    }
}

async function addMovie(req, res, next) {
    const title = req.body.title;
    const director = req.body.director;
    const year = parseInt(req.body.year);
    const synopsis = req.body.synopsis;

    if (!title || !year || !director || !synopsis) {
        res.status(400).send({error: '정보 누락'});
        return;
    }

    try {
        const result = await movies.addMovie(title, director, year, synopsis);
        res.send({msg: 'success', data: result});
    }
    catch (error) {
        next(error);
    }
}

async function modifyMovie(req, res, next) {
    const id = req.body.id;
    const title = req.body.title;
    const director = req.body.director;
    const year = parseInt(req.body.year);
    const synopsis = req.body.synopsis;

    if (!title || !year || !director || !synopsis) {
        res.status(400).send({error: '정보 누락'});
        return;
    }

    try {
        const result = await movies.modifyMovie(id, title, director, year, synopsis);
        res.send({msg: 'success', data: result});
    }
    catch (error) {
        next(error);
    }
}

async function removeMovieList(req, res, next) {
    const id = req.body.id;
    if (!id) {
        res.status(400).send({error: 'Not Find ID'});
        return;
    }
    try {
        const result = await movies.removeMovie(id);
        res.send({msg: 'success Remove Movie', data: result});
    }
    catch (error) {
        next(error);
    }
}