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

    const worker = new Worker('nlp.js');
    worker.onmessage = function (e) {
        appendSentencesToDOM(e.data);
    }

    function onSubmit (text) {
        emptyOutput();
        worker.postMessage(text);
    }

    function onExample () {
        $els.textarea.value = EXAMPLE_TEXT;
        onSubmit($els.textarea.value);
    }

    function emptyOutput () {
        const clone = $els.output.cloneNode(false);
        $els.output.parentNode.replaceChild(clone, $els.output);
        $els.output = clone;
    }

    function appendSentencesToDOM (sentences) {
        const output = $els.output;
        sentences.forEach(sentence => {
            const span = document.createElement('span');
            span.innerText = sentence.value;
            span.style.color = sentence.color;
            span.title = `${sentence.length} words`;
            output.appendChild(span);
        });
    }
})();
