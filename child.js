const fs = require('fs');
const {createImageInfo, processImage, calculateProportions} = require('./image_utils.js');


const inUrl = 'images/train';
const outUrl = 'training_data';
const trainingData = fs.readdirSync(inUrl);

process.on('message', function (message) {
    (async function () {
        const {id, start, length} = JSON.parse(message);
        console.log(`id: ${id} processing ${start} to ${length + start}`);
        const section = trainingData.slice(start, start + length);
        try {
            var hrstart = process.hrtime()
            for (const file of section) {
                if (file[0] === '.') continue;
                const imageObj = await createImageInfo(`${inUrl}/${file}`);
                const [imageInfo, averages] = processImage(imageObj);
                const proportions = calculateProportions(imageInfo);
                const out = {totals: imageInfo, proportions, averages};
                fs.writeFileSync(`${outUrl}/${file}.info.json`, JSON.stringify(out));
            }
            let hrend = process.hrtime(hrstart);
            console.info(`id: ${id} Execution time (hr): %ds %dms`, hrend[0], hrend[1] / 1000000)
            process.send({id});
            process.exit();
        } catch (e) {
            console.log("ERRORRRRRRRRRRRRR: ID: " + id);
            console.log(e);
            process.send({id});
            process.exit();
        }
    })();
});
