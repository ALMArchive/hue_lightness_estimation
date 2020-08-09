# Hue/Lightness Estimation Process

## First Round Process

- Take set of images

- Randomly sample some proportion of pixels (25%/33%/50%/66%/75%)

- Find HSV values for these pixels
   - Find proportion of RYGCBM based on H
   - Find proportion of Dark/Mid/Light based on V
   
- Find actual average Hue and Value
    - Train on RYGCBM proportions and average hue
    - Train on Dark/Mid/Light and average Value

- RYGCBM Model Range (source: https://www.lifewire.com/what-is-hsv-in-design-1078068)
    - Red: 0 - 60 degrees
    - Yellow: 61 - 120 degrees
    - Green: 121 - 180 degrees
    - Cyan: 181 - 240 degrees
    - Blue: 241 - 300 degrees
    - Magenta: 301 - 360 degrees

- Value Range
    - Dark: 0 - 50
    - Mid: 50 - 70
    - Bright: 70 - 100

### First Round Results

- The models failed to train, the errors were too great in attempting to determine average Hue/Lightness from
proportions of Colors/Values.

## Second Round Process

- Do same process for color range estimation, but estimate RGB values instead of HSL values to hopefully reduce
errors

- Do the same process for value estimation, but add more tiers

### Second Round Results

- The models failed to train, there were too great in attempting to determine average RGB/Lightness from proportions of Colors/Values

## Third Round Process

- Do everything the same, but add more tranches to both color and light, I do not suspect it will work

###