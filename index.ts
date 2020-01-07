interface Sentence {
    length: number,
    value: string
}

interface ColoredSentence extends Sentence {
    color: string;
}

interface ColorsMap {
    [x: string]: string;
}

const $els: {
    submit: HTMLButtonElement,
    example: HTMLButtonElement,
    textarea: HTMLTextAreaElement,
    output: HTMLParagraphElement
} = {
    submit: document.querySelector('#process'),
    example: document.querySelector('#example'),
    textarea: document.querySelector('#input > textarea'),
    output: document.querySelector('#output > p')
}

$els.submit.addEventListener('click', () => onSubmit($els.textarea.value));
$els.example.addEventListener('click', onExample);

function onSubmit (value: string): void {
        emptyOutput();
        requestAnimationFrame(() => {
            const sentences = parseSentences(value);
            const coloredSentences = addColorToSentences(sentences);
            requestAnimationFrame(() => {
                appendSentencesToDOM(coloredSentences);
            });
        });
}

function onExample (): void {
    requestAnimationFrame(() => {
        $els.textarea.value = EXAMPLE_TEXT;
        onSubmit($els.textarea.value);
    });
}

function emptyOutput (): void {
    const clone = $els.output.cloneNode(false);
    $els.output.parentNode.replaceChild(clone, $els.output);
    $els.output = clone as HTMLParagraphElement;
}

function appendSentencesToDOM (sentences: ColoredSentence[]): void {
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


function parseSentences (text: string = ''): Sentence[] {
    text = text.trim();
    text = text && !/[\.\?\!]/g.test(text[text.length-1]) ? `${text}.` : text;
    return splitIntoSentences(text).map(sentenceString => ({
        length: countWords(sentenceString),
        value: sentenceString
    }));
}

function splitIntoSentences (text: string): string[] {
    return text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
}

function countWords (sentenceString: string): number {
    return getWordsByNonWhiteSpace(sentenceString).length;
}

function getWordsByNonWhiteSpace (str: string): string[] {
    const notLettersOrWhitespace = /[^\w\s]|_/g;
    const allWhitespace = /\s+/g
    const allNotWhitespace = /\S+/g;
    return str.replace(notLettersOrWhitespace, '')
        .replace(allWhitespace, ' ')
        .toLowerCase().match(allNotWhitespace) || [];
}

function getUniqueLengths (sentences: Sentence[]): number[] {
    return Array.from(new Set(sentences.map(({length}) => length)));
}

function buildLengthsMap (lengths: number[]): object {
    lengths = lengths.sort();
    return lengths.reduce((lengthsMap: object, key, index) => {
        lengthsMap[key] = index;
        return lengthsMap;
    }, {});
}

function buildColorsMap (lengths: number[], lengthsMap: object): ColorsMap {
    const numLengths: number = lengths.length;
    return lengths.reduce((colorsMap: ColorsMap, length: number) => {
        colorsMap[length] = rainbow(numLengths, lengthsMap[length]);
        return colorsMap;
    }, {});
}

function addColorToSentences (sentences: Sentence[]): ColoredSentence[] {
    const uniqueLengths = getUniqueLengths(sentences);
    const lengthsMap = buildLengthsMap(uniqueLengths);
    const colorsMap = buildColorsMap(uniqueLengths, lengthsMap);
    return sentences.map(sentence => ({
        ...sentence,
        color: colorsMap[sentence.length]
    }));
}

// https://stackoverflow.com/questions/1484506/random-color-generator
function rainbow (numOfSteps: number, step: number): string {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    var r: number;
    var g: number;
    var b: number;
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

const EXAMPLE_TEXT: string = `
The gods had condemned Sisyphus to ceaselessly rolling a rock to the top of a mountain, whence the stone would fall back of its own weight. They had thought with some reason that there is no more dreadful punishment than futile and hopeless labor.

If one believes Homer, Sisyphus was the wisest and most prudent of mortals. According to another tradition, however, he was disposed to practice the profession of highwayman. I see no contradiction in this. Opinions differ as to the reasons why he became the futile laborer of the underworld. To begin with, he is accused of a certain levity in regard to the gods. He stole their secrets. Egina, the daughter of Esopus, was carried off by Jupiter. The father was shocked by that disappearance and complained to Sisyphus. He, who knew of the abduction, offered to tell about it on condition that Esopus would give water to the citadel of Corinth. To the celestial thunderbolts he preferred the benediction of water. He was punished for this in the underworld. Homer tells us also that Sisyphus had put Death in chains. Pluto could not endure the sight of his deserted, silent empire. He dispatched the god of war, who liberated Death from the hands of her conqueror.

It is said that Sisyphus, being near to death, rashly wanted to test his wife's love. He ordered her to cast his unburied body into the middle of the public square. Sisyphus woke up in the underworld. And there, annoyed by an obedience so contrary to human love, he obtained from Pluto permission to return to earth in order to chastise his wife. But when he had seen again the face of this world, enjoyed water and sun, warm stones and the sea, he no longer wanted to go back to the infernal darkness. Recalls, signs of anger, warnings were of no avail. Many years more he lived facing the curve of the gulf, the sparkling sea, and the smiles of earth. A decree of the gods was necessary. Mercury came and seized the impudent man by the collar and, snatching him from his joys, lead him forcibly back to the underworld, where his rock was ready for him.

You have already grasped that Sisyphus is the absurd hero. He is, as much through his passions as through his torture. His scorn of the gods, his hatred of death, and his passion for life won him that unspeakable penalty in which the whole being is exerted toward accomplishing nothing. This is the price that must be paid for the passions of this earth. Nothing is told us about Sisyphus in the underworld. Myths are made for the imagination to breathe life into them. As for this myth, one sees merely the whole effort of a body straining to raise the huge stone, to roll it, and push it up a slope a hundred times over; one sees the face screwed up, the cheek tight against the stone, the shoulder bracing the clay-covered mass, the foot wedging it, the fresh start with arms outstretched, the wholly human security of two earth-clotted hands. At the very end of his long effort measured by skyless space and time without depth, the purpose is achieved. Then Sisyphus watches the stone rush down in a few moments toward tlower world whence he will have to push it up again toward the summit. He goes back down to the plain.

It is during that return, that pause, that Sisyphus interests me. A face that toils so close to stones is already stone itself! I see that man going back down with a heavy yet measured step toward the torment of which he will never know the end. That hour like a breathing-space which returns as surely as his suffering, that is the hour of consciousness. At each of those moments when he leaves the heights and gradually sinks toward the lairs of the gods, he is superior to his fate. He is stronger than his rock.

If this myth is tragic, that is because its hero is conscious. Where would his torture be, indeed, if at every step the hope of succeeding upheld him? The workman of today works everyday in his life at the same tasks, and his fate is no less absurd. But it is tragic only at the rare moments when it becomes conscious. Sisyphus, proletarian of the gods, powerless and rebellious, knows the whole extent of his wretched condition: it is what he thinks of during his descent. The lucidity that was to constitute his torture at the same time crowns his victory. There is no fate that can not be surmounted by scorn.

If the descent is thus sometimes performed in sorrow, it can also take place in joy. This word is not too much. Again I fancy Sisyphus returning toward his rock, and the sorrow was in the beginning. When the images of earth cling too tightly to memory, when the call of happiness becomes too insistent, it happens that melancholy arises in man's heart: this is the rock's victory, this is the rock itself. The boundless grief is too heavy to bear. These are our nights of Gethsemane. But crushing truths perish from being acknowledged. Thus, Edipus at the outset obeys fate without knowing it. But from the moment he knows, his tragedy begins. Yet at the same moment, blind and desperate, he realizes that the only bond linking him to the world is the cool hand of a girl. Then a tremendous remark rings out: "Despite so many ordeals, my advanced age and the nobility of my soul make me conclude that all is well." Sophocles' Edipus, like Dostoevsky's Kirilov, thus gives the recipe for the absurd victory. Ancient wisdom confirms modern heroism.

One does not discover the absurd without being tempted to write a manual of happiness. "What!---by such narrow ways--?" There is but one world, however. Happiness and the absurd are two sons of the same earth. They are inseparable. It would be a mistake to say that happiness necessarily springs from the absurd. Discovery. It happens as well that the felling of the absurd springs from happiness. "I conclude that all is well," says Edipus, and that remark is sacred. It echoes in the wild and limited universe of man. It teaches that all is not, has not been, exhausted. It drives out of this world a god who had come into it with dissatisfaction and a preference for futile suffering. It makes of fate a human matter, which must be settled among men.

All Sisyphus' silent joy is contained therein. His fate belongs to him. His rock is a thing. Likewise, the absurd man, when he contemplates his torment, silences all the idols. In the universe suddenly restored to its silence, the myriad wondering little voices of the earth rise up. Unconscious, secret calls, invitations from all the faces, they are the necessary reverse and price of victory. There is no sun without shadow, and it is essential to know the night. The absurd man says yes and his efforts will henceforth be unceasing. If there is a personal fate, there is no higher destiny, or at least there is, but one which he concludes is inevitable and despicable. For the rest, he knows himself to be the master of his days. At that subtle moment when man glances backward over his life, Sisyphus returning toward his rock, in that slight pivoting he contemplates that series of unrelated actions which become his fate, created by him, combined under his memory's eye and soon sealed by his death. Thus, convinced of the wholly human origin of all that is human, a blind man eager to see who knows that the night has no end, he is still on the go. The rock is still rolling.

I leave Sisyphus at the foot of the mountain! One always finds one's burden again. But Sisyphus teaches the higher fidelity that negates the gods and raises rocks. He too concludes that all is well. This universe henceforth without a master seems to him neither sterile nor futile. Each atom of that stone, each mineral flake of that night filled mountain, in itself forms a world. The struggle itself toward the heights is enough to fill a man's heart. One must imagine Sisyphus happy.
`.trim();
