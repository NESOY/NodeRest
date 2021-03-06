/**
 * Created by nesoy on 2017. 5. 15..
 */
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const movieRouter = require('./router/movie_router');
app.use(movieRouter);

app.use((err,req,res, next) => {
    res.status(404).send({msg: err.message});
});

module.exports = app;

