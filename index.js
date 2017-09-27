(function () {
    'use strict';

    const $els = {
        submit: document.querySelector('#process'),
        example: document.querySelector('#example'),
        textarea: document.querySelector('#input > textarea'),
        out: document.querySelector('#output > p')
    };
    const state = {
        colors: {},
        lengths: {}
    };

    $els.submit.addEventListener('click', onSubmit);
    $els.example.addEventListener('click', onExample);

    // imp
    function onSubmit () {
        resetState();
        const sentences = buildSentences(getText($els.textarea.value));
        const uniqueLengths = getUniqueLengths(sentences);
        state.lengths = buildLengthsMap(uniqueLengths);
        state.colors = buildColorsMap(uniqueLengths, state.lengths);
        const coloredSentences = addColorToSentences(sentences, state.colors);
        appendSentencesToDOM(coloredSentences);
    }

    // imp
    function onExample () {
        $els.textarea.value = EXAMPLE_TEXT;
        $els.submit.dispatchEvent(
            new MouseEvent('click', {
              view: window,
              bubbles: true,
              cancelable: true
            })
        );
    }

    // imp
    function resetState () {
        const clone = $els.out.cloneNode(false);
        $els.out.parentNode.replaceChild(clone, $els.out);
        $els.out = clone;
        delete state.colors;
        delete state.lengths;
    }

    // imp
    function appendSentencesToDOM (sentences) {
        const out = $els.out;
        sentences.forEach(sentence => {
            const s = document.createElement('span');
            s.innerText = sentence.value;
            s.style.color = sentence.color;
            s.title = `${sentence.length} words`;
            out.appendChild(s);
        });
    }

    function getText (str = '') {
        let text = str.trim();
        // cheap hack
        return text && !/[\.\?\!]/g.test(text[text.length-1]) ? `${text}.` : text;
    }

    function buildSentences (text) {
        const sentenceStrs = splitIntoSentences(text);
        return splitIntoSentences(text).map(sentenceString => ({
            length: countWords(sentenceString),
            value: sentenceString
        }));
    }

    function splitIntoSentences (text) {
        return text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
    }

    function countWords (sentenceString) {
        return getWordsByNonWhiteSpace(sentenceString).length;
    }

    function getWordsByNonWhiteSpace (str) {
        const notLettersOrWhitespace = /[^\w\s]|_/g;
        const allWhitespace = /\s+/g
        const allNotWhitespace = /\S+/g;
        return str.replace(notLettersOrWhitespace, '')
            .replace(allWhitespace, ' ')
            .toLowerCase().match(allNotWhitespace) || [];
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

    function addColorToSentences (sentences, colorsMap) {
        return sentences.map(sentence => Object.assign({}, sentence, {
            color: colorsMap[sentence.length]
        }));
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
})();
