const fs = require('fs').promises;
const fsSync = require('fs');

(async function() {
    const aggregateData = {};
    const dataDir = await fs.readdir('training_data');

    for(const file of dataDir) {
        if(file[0] === '.') continue;
        const json = require(`./training_data/${file}`);

        const proportions = json.proportions;
        const averages = json.averages;
        const { colorAverage, valueAverage } = averages;

        for(const thresh in proportions) {
            if(!aggregateData[thresh]) aggregateData[thresh] = {colors: [], values: []};
            const colorInputs = proportions[thresh].colors;
            const valueInputs = proportions[thresh].values;
            aggregateData[thresh].colors.push({
                input: colorInputs,
                output: colorAverage
            });

            aggregateData[thresh].values.push({
                input: valueInputs,
                output: [valueAverage]
            });
        }
    }
    fsSync.writeFileSync('aggregate_data.json', JSON.stringify(aggregateData));
})();
