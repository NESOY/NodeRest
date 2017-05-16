const express = require('express');
const router = express.Router();
const movies = require('../model/movie');


router.get('/movies/:movieId', showMovieDetail); //READ
/* CRUD */
router.post('/movies', addMovie);
router.get('/movies', showMovieList);
router.put('/movies', modifyMovie);
router.delete('/movies', removeMovieList)


module.exports = router;

async function showMovieList(req, res) {
    try {
        const result = await movies.getMovieList();
        res.send({msg: 'success', data: result});
    } catch (error) {
        next(err);
    }
}

async function showMovieDetail(req, res) {
    try {
        // 영화 상세 정보 Id
        const movieId = req.params.movieId;
        console.log('movieId : ', movieId);
        const info = await movies.getMovieDetail(movieId);
        res.send(info);
    } catch (error) {
        res.status(error.code).send({msg: error.msg});
    }
}

async function addMovie(req, res) {
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
        next(err);
        //res.status(500).send(error.msg);
    }
}

async function modifyMovie(req, res) {
    const id = req.body.id;
    if (!id) {
        res.status(400).send({error: 'Not Find ID'});
        return;
    }

    const title = req.body.title;
    const director = req.body.director;
    const year = parseInt(req.body.year);
    const synopsis = req.body.synopsis;

    try {
        const result = await movies.modifyMovie(id, title, director, year, synopsis);
        res.send({msg: 'success Modify Movie', data: result});
    }
    catch (error) {
        res.status(500).send(error.msg);
    }
}

async function removeMovieList(req, res) {
    const id = req.body.id;
    if (!id) {
        res.status(400).send({error: 'Not Find ID'});
        return;
    }
    try {
        const result = await movies.removeMovie(id);
        console.log('REMOVE IT!');
        res.send({msg: 'success Remove Movie', data: result});
    }
    catch (error) {
        res.status(500).send(error.msg);
    }
}