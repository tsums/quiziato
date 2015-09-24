/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

/*
 *  Logging Confirutation
 */

var winston = require('winston');

winston.loggers.add('default', {
    console: {
        level: 'silly',
        colorize: true,
        label: 'default'
    }
});

winston.loggers.add('socket', {
    console: {
        level: 'silly',
        colorize: true,
        label: 'socket'
    }
})

module.exports = winston;
