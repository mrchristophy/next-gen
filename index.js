#!/usr/bin/env node

const prog = require('caporal');

const createCmd = require('./lib/create');

prog
    .version('1.0.0')
    .command('create', 'Create a new component')
    .action(createCmd);

prog.parse(process.argv);