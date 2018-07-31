#! /usr/bin/env node
let shell = require("shelljs");
let fs = require('fs');
let util = require('util');

fs.readFile(__dirname + '/ComponentModel/ComponentModel.js', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    console.log('\x1b[36m%s\x1b[0m', 'Component class name without extension (ComponentModel):');

    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    process.stdin.once('data', function (text) {
        if (!text || text === '\n') {
            console.log('\x1b[31m%s\x1b[0m', 'No text provided');
            done();
        }
        if (text === 'quit\n') {
            done();
        }
        text = text.trim();
        let componentName = text.charAt(0).toUpperCase() + text.slice(1);

        console.log('\x1b[36m%s\x1b[0m', 'Component directory without name (' + __dirname + '/../src/js/components/ui/' + componentName + '/):');
        process.stdin.once('data', function (dir) {
            dir = dir.trim();
            if (!dir) {
                dir = __dirname + '/../src/js/components/ui/' + componentName + '/';
            }

            shell.exec("mkdir " + dir);
            console.log('\x1b[32m%s\x1b[0m', "Directory " + dir+ " created");

            createComponentFile(data, componentName, dir);

            fs.readFile(__dirname + '/ComponentModel/ComponentModel.scss', 'utf8', function (err, data) {
                createComponentFile(data, componentName, dir, '.scss');

                fs.readFile(__dirname + '/ComponentModel/ComponentModel.test.js', 'utf8', function (err, data) {
                    console.log('\x1b[36m%s\x1b[0m', 'Testing directory without name (' + __dirname + '/../__tests__/components/ui/):');
                    process.stdin.once('data', function (testingDir) {
                        testingDir = testingDir.trim();
                        if (!testingDir) {
                            testingDir = __dirname + '/../__tests__/components/ui/';
                        }

                        createComponentFile(data, componentName, testingDir, '.test.js');

                        fs.readFile(__dirname + '/ComponentModel/ComponentModel.stories.js', 'utf8', function (err, data) {
                            console.log('\x1b[36m%s\x1b[0m', 'Stories directory without name (' + __dirname + '/../src/js/stories/):');
                            process.stdin.once('data', function (storiesDir) {
                                storiesDir = storiesDir.trim();
                                if (!storiesDir) {
                                    storiesDir = __dirname + '/../src/js/stories/';
                                }

                                createComponentFile(data, componentName, storiesDir, '.stories.js', addStoryToConfig);


                            });
                        });
                    });
                });

            });
        });
    });
});

function createComponentFile(data, componentName, dir, ext = '.js', callback = null) {

    let Component = data.replace(/ComponentModel/g, componentName).replace(/componentModel/g, componentName.toLowerCase());

    let newFile = dir + componentName + ext;

    shell.exec("touch " + newFile);
    console.log('\x1b[32m%s\x1b[0m', "File " + newFile + " created");

    fs.writeFile(newFile, Component, function(err) {
        if(err) {
            return console.log('\x1b[31m%s\x1b[0m', err);
        }
        if (callback) {
            callback(componentName);
        }
    });
}

function done() {
    console.log('Process done');
    process.exit();
}

function addStoryToConfig(componentName) {

    console.log('\x1b[33m%s\x1b[0m', "Add this line to  .storybook/config.js | loadStories: " + "require('../src/js/stories/" + componentName + ".stories');");
    console.log('\x1b[33m%s\x1b[0m', "Press Enter when done");

    process.stdin.once('data', function () {
        done();
    });
}