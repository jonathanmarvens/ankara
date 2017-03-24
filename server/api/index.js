'use strict';

const api = module.exports = require('express').Router();

api
  .use('/game', require('./game.js'))
  .use('/lobby', require('./lobby.js'))

// No routes matched? 404.
api.use((req, res) => res.status(404).end())
