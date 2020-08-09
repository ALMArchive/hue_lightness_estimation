const fs = require('fs');
const brain = require('brain.js');

const data = JSON.parse(fs.readFileSync('aggregate_data.json', 'utf-8'));

const netP5Colors = new brain.NeuralNetwork();
const netP5Values = new brain.NeuralNetwork();

const netP10Colors = new brain.NeuralNetwork();
const netP10Values = new brain.NeuralNetwork();

const netP25Colors = new brain.NeuralNetwork();
const netP25Values = new brain.NeuralNetwork();

const netP33Colors = new brain.NeuralNetwork();
const netP33Values = new brain.NeuralNetwork();

const netP50Colors = new brain.NeuralNetwork();
const netP50Values = new brain.NeuralNetwork();

const netP66Colors = new brain.NeuralNetwork();
const netP66Values = new brain.NeuralNetwork();

const netP75Colors = new brain.NeuralNetwork();
const netP75Values = new brain.NeuralNetwork();

const p5C = netP5Colors.trainAsync(data.FIVE.colors);
const p5V = netP5Values.trainAsync(data.FIVE.values);

const p10C = netP10Colors.trainAsync(data.TEN.colors);
const p10V = netP10Values.trainAsync(data.TEN.values);

const p25C = netP25Colors.trainAsync(data.TWENTY_FIVE.colors);
const p25V = netP25Values.trainAsync(data.TWENTY_FIVE.values);

const p33C = netP33Colors.trainAsync(data.THIRTY_THREE.colors);
const p33V = netP33Values.trainAsync(data.THIRTY_THREE.values);

const p50C = netP50Colors.trainAsync(data.FIFTY.colors);
const p50V = netP50Values.trainAsync(data.FIFTY.values);

const p66C = netP66Colors.trainAsync(data.SIXTY_SIX.colors);
const p66V = netP66Values.trainAsync(data.SIXTY_SIX.values);

const p75C = netP75Colors.trainAsync(data.SEVENTY_FIVE.colors);
const p75V = netP75Values.trainAsync(data.SEVENTY_FIVE.values);

const pArray = [
    p5C, p5V,
    p10C, p10V,
    p25C, p25V,
    p33C, p33V,
    p50C, p50V,
    p66C, p66V,
    p75C, p75V
];

var hrstart = process.hrtime()

function writeModel(name, json) {
    fs.writeFileSync(`models/${name}.json`, JSON.stringify(json));
}

Promise.all(pArray)
    .then((values) => {
        const resP5C = values[0];
        writeModel('P5C', resP5C);
        const resP5V = values[1];
        writeModel('P5V', resP5V);

        const resP10C = values[2];
        writeModel('P10C', resP10C);
        const resP10V = values[3];
        writeModel('P10V', resP10V);

        const resP25C = values[4];
        writeModel('P25C', resP25C);
        const resP25V = values[5];
        writeModel('P25V', resP25V);

        const resP33C = values[6];
        writeModel('P33C', resP33C);
        const resP33V = values[7];
        writeModel('P33V', resP33V);

        const resP50C = values[8];
        writeModel('P50C', resP50C);
        const resP50V = values[9];
        writeModel('P50V', resP50V);

        const resP66C = values[10];
        writeModel('P66C', resP66C);
        const resP66V = values[11];
        writeModel('P66V', resP66V);

        const resP75C = values[12];
        writeModel('P75C', resP75C);
        const resP75V = values[13];
        writeModel('P75V', resP75V);
// do something super cool with my 2 trained networks

        let hrend = process.hrtime(hrstart);
        console.info(`Execution time (hr): %ds %dms`, hrend[0], hrend[1] / 1000000)
    })
    .catch((e) => console.log(e));
