const fs = require('fs');

const nonColorImages = fs.readFileSync('./non-color-images.txt', 'utf-8').split('\n').filter(e => e !== '');

for(const file of nonColorImages) {
    fs.unlinkSync(file);
    fs.unlinkSync(`training_data/${file.replace('images/train/', '')}.info`);
    console.log(file)
}
