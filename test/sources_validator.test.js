const tape = require('tape');
const glob = require('glob');
const fs = require('fs');
const request = require('request');
const OASchema = require('./lib');

let validate;
tape('preflight', async (t) => {
    validate = await OASchema.compile(true);
    t.end();
});

// find all the sources, has to be synchronous for tape
glob.sync('sources/**/*.json').forEach((source) => {
    tape(`tests for ${source}`, (t) => {
        try {
            const data = JSON.parse(fs.readFileSync(source, 'utf8'));

            let valid = true;
            valid = validate(data);
            t.ok(valid, `${source}: ${JSON.stringify(validate.errors)}`);
        } catch (err) {
            t.fail(`could not parse ${source} as JSON: ${err}`);
        }

        t.end();
    });
});
