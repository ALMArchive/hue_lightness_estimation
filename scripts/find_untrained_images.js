const fs = require('fs');

const trainingImages = fs.readdirSync(__dirname + '/images/train');
const traiingInfo = fs.readdirSync(__dirname + '/training_data');

const left = trainingImages.filter(e => !traiingInfo.includes(e + '.info'));

console.log(left);
