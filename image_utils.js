const {loadImage, createCanvas} = require('canvas');
const convert = require('color-convert');

const COLOR_ENUM = {
    RED: 'RED',
    RED_YELLOW: 'RED_YELLOW',
    YELLOW: 'YELLOW',
    YELLOW_GREEN: 'YELLOW_GREEN',
    GREEN: 'GREEN',
    GREEN_CYAN: 'GREEN_CYAN',
    CYAN: 'CYAN',
    CYAN_BLUE: 'CYAN_BLUE',
    BLUE: 'BLUE',
    BLUE_MAGENTA: 'BLUE_MAGENTA',
    MAGENTA: 'MAGENTA',
    MAGENTA_RED: 'MAGENTA_RED'
}

const VALUE_ENUM = {
    DARK: 'DARK',
    DARK_MID_DARK: 'DARK_MID_DARK',
    MID_DARK: 'MID_DARK',
    MID_DARK_BRIGHT: 'MID_DARK_BRIGHT',
    MID: 'MID',
    DARK_MID_BRIGHT: 'DARK_MID_BRIGHT',
    MID_BRIGHT: 'MID_BRIGHT',
    BRIGHT_MID_BRIGHT: 'BRIGHT_MID_BRIGHT',
    BRIGHT: 'BRIGHT',
    VERY_BRIGHT: 'VERY_BRIGHT'
}

function degreeToColor(deg) {
    if (deg < 0 || deg > 360) throw 'Degree should be in range 0-359';

    if (deg >= 0 && deg <= 29) {
        return COLOR_ENUM.RED;
    } else if (deg >= 30 && deg <= 59) {
        return COLOR_ENUM.RED_YELLOW;
    } else if (deg >= 60 && deg <= 89) {
        return COLOR_ENUM.YELLOW;
    } else if (deg >= 90 && deg <= 119) {
        return COLOR_ENUM.YELLOW_GREEN;
    } else if (deg >= 120 && deg <= 149) {
        return COLOR_ENUM.GREEN;
    } else if (deg >= 150 && deg <= 179) {
        return COLOR_ENUM.GREEN_CYAN;
    } else if (deg >= 180 && deg <= 209) {
        return COLOR_ENUM.CYAN;
    } else if (deg >= 210 && deg <= 239) {
        return COLOR_ENUM.CYAN_BLUE;
    } else if (deg >= 240 && deg <= 269) {
        return COLOR_ENUM.BLUE;
    } else if (deg >= 270 && deg <= 299) {
        return COLOR_ENUM.BLUE_MAGENTA;
    } else if (deg >= 300 && deg <= 329) {
        return COLOR_ENUM.MAGENTA;
    } else if (deg >= 330 && deg <= 360) {
        return COLOR_ENUM.MAGENTA_RED;
    }
}

function valueToValue(value) {
    if (value < 0 || value > 100) throw 'Value should be in range 0-99'

    if (value >= 0 && value <= 9) {
        return VALUE_ENUM.DARK
    } else if (value >= 10 && value <= 19) {
        return VALUE_ENUM.DARK_MID_DARK;
    } else if (value >= 20 && value <= 29) {
        return VALUE_ENUM.MID_DARK;
    } else if (value >= 30 && value <= 39) {
        return VALUE_ENUM.MID_DARK_BRIGHT;
    } else if (value >= 40 && value <= 49) {
        return VALUE_ENUM.MID;
    } else if (value >= 50 && value <= 59) {
        return VALUE_ENUM.DARK_MID_BRIGHT;
    } else if (value >= 60 && value <= 69) {
        return VALUE_ENUM.MID_BRIGHT;
    } else if (value >= 70 && value <= 79) {
        return VALUE_ENUM.BRIGHT_MID_BRIGHT;
    } else if (value >= 80 && value <= 89) {
        return VALUE_ENUM.BRIGHT;
    } else if (value >= 90 && value <= 100) {
        return VALUE_ENUM.VERY_BRIGHT;
    }
}

function ImageInfo(width, height, src, data) {
    this.width = width;
    this.height = height;
    this.length = width * height;
    this.src = src;
    this.data = data;
}

async function createImageInfo(src) {
    const tmpImg = await loadImage(src);
    const {width, height} = tmpImg;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(tmpImg, 0, 0);
    const imageData = ctx.getImageData(0, 0, width, height);
    return new ImageInfo(width, height, src, imageData);
}

const THRESHOLD_ENUMS = {
    EMPTY: 0,
    FIVE: 1,
    TEN: 2,
    TWENTY_FIVE: 3,
    THIRTY_THREE: 4,
    FIFTY: 5,
    SIXTY_SIX: 6,
    SEVENTY_FIVE: 7,
    HUNDRED: 8
};

const THRESHHOLD_PERCENTS = {
    EMPTY: 0,
    FIVE: .05,
    TEN: .10,
    TWENTY_FIVE: .25,
    THIRTY_THREE: .33,
    FIFTY: .5,
    SIXTY_SIX: .66,
    SEVENTY_FIVE: .75,
    HUNDRED: 1
}

const randomBetween = (low, high) => Math.floor(Math.random() * high) + low;

function fillThershholdArray(length) {
    const empty = Array(length).fill(THRESHOLD_ENUMS.EMPTY);
    let total = 0;
    for (const level in THRESHOLD_ENUMS) {
        const pixelsNeeded = Math.ceil(length * THRESHHOLD_PERCENTS[level]);
        while (total < pixelsNeeded) {
            const randPos = randomBetween(0, length);
            if (empty[randPos] === THRESHOLD_ENUMS.EMPTY) {
                empty[randPos] = level;
                total++;
            }
        }
    }
    return empty;
}

function initializeObject(obj) {
    for (const thresh in THRESHOLD_ENUMS) {
        if (thresh === 'EMPTY') continue;
        obj[thresh] = {colors: {}, values: {}};

        for (const color in COLOR_ENUM) {
            obj[thresh].colors[color] = 0;
        }

        for (const value in VALUE_ENUM) {
            obj[thresh].values[value] = 0;
        }
    }

    return obj;
}

function processImage(imageInfo) {
    const {data: imageData, length} = imageInfo;
    const threshArray = fillThershholdArray(length);
    const threshValues = initializeObject({});
    let rAgg = 0;
    let gAgg = 0;
    let bAgg = 0;
    let valueAggregate = 0;

    for (let i = 0; i < length; i++) {
        const thresh = threshArray[i];

        const offset = 4 * i;
        const r = imageData.data[offset];
        const g = imageData.data[offset + 1];
        const b = imageData.data[offset + 2];
        const hsv = convert.rgb.hsv(r, g, b);
        const color = degreeToColor(hsv[0]);
        const value = valueToValue(hsv[2]);

        rAgg += r;
        gAgg += g;
        bAgg += b;
        valueAggregate += hsv[2];

        threshValues[thresh].colors[color]++;
        threshValues[thresh].values[value]++;

    }
    const averages = {
        colorAverage: {
            r: rAgg / length,
            g: gAgg / length,
            b: bAgg / length
        },
        valueAverage: valueAggregate / length
    };
    return [threshValues, averages];
}

function calculateProportions(info) {
    const tmpObj = initializeObject({});
    const colorTotals = tmpObj.TWENTY_FIVE.colors;
    const valueTotals = tmpObj.TWENTY_FIVE.values;
    const outTotals = initializeObject({});

    let totalV = 0;
    let totalC = 0;

    for (const thresh in info) {
        for (const value in info[thresh].values) {
            const val = info[thresh].values[value];
            valueTotals[value] += val;
            totalV += val;
        }

        for (const value in info[thresh].values) {
            outTotals[thresh].values[value] = valueTotals[value] / totalV;
        }

        for (const color in info[thresh].colors) {
            const val = info[thresh].colors[color];
            colorTotals[color] += val;
            totalC += val;
        }

        for (const color in info[thresh].colors) {
            outTotals[thresh].colors[color] = colorTotals[color] / totalC;
        }
    }
    return outTotals;
}

module.exports = {
    ImageInfo,
    processImage,
    calculateProportions,
    createImageInfo,
    valueToValue,
    degreeToColor,
    COLOR_ENUM,
    VALUE_ENUM
}
