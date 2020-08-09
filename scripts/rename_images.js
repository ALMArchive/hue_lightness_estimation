const fsAsync = require('fs').promises;
const fs = require('fs');

function simplifyName(name) {
    return name.replace(/[^A-Za-z_\.]/g, '');
}

(async function() {
    const trainDirectory = await fsAsync.readdir('images/train');
    const testDirectory = await fsAsync.readdir('images/test');

    trainDirectory.map(async e => await fsAsync.rename(`images/train/${e}`, `images/train/${simplifyName(e)}`));
    testDirectory.map(async e => await fsAsync.rename(`images/test/${e}`, `images/test/${simplifyName(e)}`));
})();
