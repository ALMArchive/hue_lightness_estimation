const fsAsync = require('fs').promises;
const fs = require('fs');

const TRAINING_PERCENT = 0.8;

(async function() {
    const directory = await fsAsync.readdir('images');

    if(!fs.existsSync('images/train')) {
        fs.mkdirSync('images/train');
    }

    if(!fs.existsSync('images/test')) {
        fs.mkdirSync('images/test');
    }

    const shuffledFiles = directory.filter(e => {
        const lstat = fs.lstatSync(`images/${e}`);
        return !lstat.isDirectory();
    }).sort(() => Math.random() - 0.5);

    const breakPoint = Math.round(shuffledFiles.length * TRAINING_PERCENT);

    const training = shuffledFiles.slice(0, breakPoint);
    const testing = shuffledFiles.slice(breakPoint);

    training.map(async e => await fsAsync.rename(`images/${e}`, `images/train/${e}`));
    testing.map(async e => await fsAsync.rename(`images/${e}`, `images/test/${e}`));
})();
