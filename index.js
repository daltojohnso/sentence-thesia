(function () {
    'use strict';

    const $els = {
        submit: document.querySelector('#process'),
        example: document.querySelector('#example'),
        textarea: document.querySelector('#input > textarea'),
        output: document.querySelector('#output > p')
    };

    $els.submit.addEventListener('click', () => onSubmit($els.textarea.value));
    $els.example.addEventListener('click', onExample);

    function onSubmit (value) {
        requestAnimationFrame(() => {
            emptyOutput();
            requestAnimationFrame(() => {
                const sentences = parseSentences(value);
                requestAnimationFrame(() => {
                    const coloredSentences = addColorToSentences(sentences);
                    requestAnimationFrame(() => {
                        appendSentencesToDOM(coloredSentences);
                    });
                });
            });
        });
    }

    function onExample () {
        requestAnimationFrame(() => {
            $els.textarea.value = EXAMPLE_TEXT;
            onSubmit($els.textarea.value);
        });
    }

    function emptyOutput () {
        const clone = $els.output.cloneNode(false);
        $els.output.parentNode.replaceChild(clone, $els.output);
        $els.output = clone;
    }

    function appendSentencesToDOM (sentences) {
        const output = $els.output;
        const fragment = document.createDocumentFragment();
        sentences.forEach(sentence => {
            const span = document.createElement('span');
            span.innerText = sentence.value;
            span.style.color = sentence.color;
            span.title = `${sentence.length} words`;
            fragment.appendChild(span);
        });
        output.appendChild(fragment);
    }

    function parseSentences (text = '') {
        text = text.trim();
        text = text && !/[\.\?\!]/g.test(text[text.length-1]) ? `${text}.` : text;
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

    function addColorToSentences (sentences) {
        const uniqueLengths = getUniqueLengths(sentences);
        const lengthsMap = buildLengthsMap(uniqueLengths);
        const colorsMap = buildColorsMap(uniqueLengths, lengthsMap);
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
