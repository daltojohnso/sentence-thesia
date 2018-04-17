importScripts('node_modules/compromise/builds/compromise.min.js');

onmessage = function (e) {
    const parsedSentences = nlpParseSentences(e.data);
    const coloredSentences = addColorToSentences(parsedSentences);
    postMessage(
        coloredSentences
    );
};

function nlpParseSentences (text = '') {
    return nlp(text).sentences().map(sentence => {
        return {
            length: sentence.words().length,
            value: sentence.data()[0].text
        }
    });
}

function addColorToSentences (sentences) {
    const uniqueLengths = getUniqueLengths(sentences);
    const lengthsMap = buildLengthsMap(uniqueLengths);
    const colorsMap = buildColorsMap(uniqueLengths, lengthsMap);
    return sentences.map(sentence => Object.assign({}, sentence, {
        color: colorsMap[sentence.length]
    }));
}

function getUniqueLengths (sentences) {
    return Array.from(new Set(sentences.map(({length}) => length)));
}

function buildLengthsMap (lengths) {
    lengths = lengths.sort();
    return lengths.reduce((lengthsMap, key, index) => {
        lengthsMap[key] = index;
        return lengthsMap;
    }, {});
}

function buildColorsMap (lengths, lengthsMap) {
    const numLengths = lengths.length;
    return lengths.reduce((colorsMap, length) => {
        colorsMap[length] = rainbow(numLengths, lengthsMap[length]);
        return colorsMap;
    }, {});
}

// https://stackoverflow.com/questions/1484506/random-color-generator
function rainbow (numOfSteps, step) {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    var r, g, b;
    var h = step / numOfSteps;
    var i = ~~(h * 6);
    var f = h * 6 - i;
    var q = 1 - f;
    switch(i % 6){
        case 0: r = 1; g = f; b = 0; break;
        case 1: r = q; g = 1; b = 0; break;
        case 2: r = 0; g = 1; b = f; break;
        case 3: r = 0; g = q; b = 1; break;
        case 4: r = f; g = 0; b = 1; break;
        case 5: r = 1; g = 0; b = q; break;
    }
    var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
    return (c);
}
