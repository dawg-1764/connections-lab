// DATA - Natures, Type Colors and Candidates
const TYPE_COLORS = { fire: "#d9541e", water: "#2f6fbf", grass: "#3f8f4a" };
const DEFAULT_COLOR = "#2b3a42";

// Based on the Pokémon natures, but simplified to 5 categories that are easy to understand.
// Each nature is a personality trait that a Pokémon can have, and each Pokémon has a profile of how much of each nature it has.
const natures = ["bold", "clever", "calm", "playful", "loyal"];

// answers[i] = index of the answer chosen for question i
let answers = [];   

// Each Pokémon has a profile of how much of each nature it has.
const candidates = {
    // Gen 1
    bulbasaur: { natures: { clever: 3, calm: 2, loyal: 1 }, blurb: "A Kanto classic. Steady, dependable, and quietly clever. It carries the load and never complains." },
    charmander: { natures: { bold: 3, playful: 1, loyal: 2 }, blurb: "A Kanto classic. Fierce and loyal. It charges into any fight for you and never gives up on you." },
    squirtle: { natures: { bold: 1, clever: 3, playful: 2 }, blurb: "A Kanto classic. Confident, a bit cheeky, and sharper than it looks. It brings swagger and a plan." },
    
    // Gen 2
    chikorita: { natures: { clever: 1, calm: 3, loyal: 2 }, blurb: "Gentle and devoted. It keeps the whole journey calm just by being next to you. A steady companion straight out of Johto." },
    cyndaquil: { natures: { bold: 1, calm: 3, playful: 2 }, blurb: "Shy until the spark catches, then full of energy. It brings out the fire in you. A steady companion straight out of Johto." },
    totodile: { natures: { bold: 2, playful: 3, loyal: 1 }, blurb: "A goofball with a big bite. Every day with it feels like a party. A steady companion straight out of Johto." },
    
    // Gen 3
    treecko: { natures: { bold: 3, clever: 2, calm: 1 }, blurb: "Cool under pressure and always a step ahead, the kind of adventurer Hoenn's islands are known for. Laid-back until it isn't." },
    torchic: { natures: { bold: 3, clever: 1, loyal: 2 }, blurb: "Scrappy and warm-hearted, the kind of adventurer Hoenn's islands are known for. It fights hard for you and expects the same back." },
    mudkip: { natures: { calm: 1, playful: 2, loyal: 3 }, blurb: "Cheerful and endlessly loyal, the kind of adventurer Hoenn's islands are known for. It makes even the muddy days feel like adventures." },
    
    // Gen 4
    turtwig: { natures: { clever: 1, calm: 2, loyal: 3 }, blurb: "Ready to brave Sinnoh's mountain trails! Patient, sturdy, and deeply loyal. A partner you never have to worry about." },
    chimchar: { natures: { bold: 3, clever: 1, playful: 2 }, blurb: "Ready to brave Sinnoh's mountain trails! Quick, playful, and always ready for a rematch. It turns every battle into fun." },
    piplup: { natures: { bold: 3, clever: 2, playful: 1 }, blurb: "Ready to brave Sinnoh's mountain trails! Proud and precise, with big ambitions. It pushes you to be your best." },
    
    // Gen 5
    snivy: { natures: { bold: 1, clever: 3, calm: 2 }, blurb: "Composed, clever, and a little aloof, ready for the big region of Unova! It respects you once you've earned it." },
    tepig: { natures: { bold: 1, calm: 3, loyal: 2 }, blurb: "Warm, stubborn, and fiercely on your side, ready for the big region of Unova!. It charges ahead and you'll want to follow." },
    oshawott: { natures: { bold: 1, playful: 2, loyal: 3 }, blurb: "Earnest and upbeat, ready for the big region of Unova!. It believes in you and wants you to believe in it too." },
    
    // Gen 6
    chespin: { natures: { bold: 2, calm: 1, loyal: 3 }, blurb: "A protective heart in a spiky coat. It stands in front of you when it counts, as expected for Kalos's finest trainers." },
    fennekin: { natures: { clever: 3, calm: 2, playful: 1 }, blurb: "Sharp-witted and curious, as expected for Kalos's finest trainers. It notices everything and quietly plans around it." },
    froakie: { natures: { bold: 1, clever: 2, calm: 3 }, blurb: "Smooth, adaptable, and quick to size up a situation, as expected for Kalos's finest trainers. It makes hard things look easy." },
    
    // Gen 7
    rowlet: { natures: { clever: 2, calm: 3, loyal: 1 }, blurb: "Aloha from the beaches of Alola! Calm and observant, with a sharp mind. It thinks before it acts and rarely misses." },
    litten: { natures: { bold: 3, clever: 1, calm: 2 }, blurb: "Aloha from the beaches of Alola! Independent and cool, but it warms up to you eventually. Worth earning." },
    popplio: { natures: { clever: 1, playful: 3, loyal: 2 }, blurb: "Aloha from the beaches of Alola! A showman with a big heart. It cheers you on and loves an audience." },
    
    // Gen 8
    grookey: { natures: { bold: 2, calm: 1, playful: 3 }, blurb: "Cheers from the Galar stadium! Rhythm, mischief, and nonstop fun. It keeps morale high wherever you go." },
    scorbunny: { natures: { bold: 3, playful: 2, loyal: 1 }, blurb: "Cheers from the Galar stadium! Nonstop energy and pure fire. Fast, fearless, and always ready to go." },
    sobble: { natures: { calm: 2, playful: 1, loyal: 3 }, blurb: "Cheers from the Galar stadium! Shy, sensitive, and unexpectedly clever. It needs a gentle partner, and gives everything back." },
    
    // Gen 9
    sprigatito: { natures: { clever: 2, calm: 1, playful: 3 }, blurb: "Ready for a Paldean adventure! Charming, clever, and a little mischievous. It knows exactly what it's doing." },
    fuecoco: { natures: { calm: 2, playful: 3, loyal: 1 }, blurb: "Ready for a Paldean adventure! Easygoing and always hungry. It reminds you to enjoy the ride." },
    quaxly: { natures: { bold: 1, clever: 3, loyal: 2 }, blurb: "Ready for a Paldean adventure! Polite, precise, and quietly devoted. It does things properly, and it's on your side." },
};

// Each question has a set of answers that corresponds to the Pokémon natures.
// The more a player chooses answers that match a Pokémon's natures, the higher that Pokémon will score.
const questions = [
    {
        text: "It's your first day as a trainer! What are you most excited about?",
        answers: [
            { text: "Battling right away!", natures: { bold: 2, playful: 1 } },
            { text: "Filling every last entry of my Pokedex. Gotta catch 'em all!", natures: { clever: 2, calm: 1 } },
            { text: "Traveling with a friend by my side across the world.", natures: { loyal: 2, playful: 1 } },
            { text: "Exploring all the new places each region has to offer", natures: { calm: 2, clever: 1 } },
        ],
    },
    {
        text: "It's midnight, everyone's exhausted, and the next town is 10 km away. You...",
        answers: [
            { text: "Push on. We'll rest when we get there", natures: { bold: 2, loyal: 1 } },
            { text: "Make camp and cook something good", natures: { calm: 2, playful: 1 } },
            { text: "Check the map for a shortcut", natures: { clever: 2, bold: 1 } },
            { text: "Turn it into a game to keep spirits up", natures: { playful: 2, loyal: 1 } },
        ],
    },
    {
        text: "A rival challenges you in front of a crowd.",
        answers: [
            { text: "Accept immediately", natures: { bold: 2, playful: 1 } },
            { text: "Study their team first", natures: { clever: 2, calm: 1 } },
            { text: "Check that my partner is ready", natures: { loyal: 2, calm: 1 } },
            { text: "Turn it into a show", natures: { playful: 2, bold: 1 } },
        ],
    },
    {
        text: "What do you want most from your Pokemon partner?",
        answers: [
            { text: "Someone who never leaves my side", natures: { loyal: 2, calm: 1 } },
            { text: "Someone who keeps surprising me", natures: { playful: 2, clever: 1 } },
            { text: "Someone who isn't afraid of anything", natures: { bold: 2, loyal: 1 } },
            { text: "Someone who thinks before acting", natures: { clever: 2, calm: 1 } },
        ],
    },
    {
        text: "You lose a battle badly. Afterwards you...",
        answers: [
            { text: "Train harder, immediately", natures: { bold: 2, clever: 1 } },
            { text: "Laugh it off and go get food", natures: { playful: 2, calm: 1 } },
            { text: "Go over what went wrong and think of a better strategy for the next battle.", natures: { clever: 2, loyal: 1 } },
            { text: "Make sure my partner is okay", natures: { loyal: 2, calm: 1 } },
        ],
    },
    {
        text: "You're exploring a new region, what route do you decide to go down first?",
        answers: [
            { text: "A dense forest without a clear path, the sunlight peaks through the leaves.", natures: { calm: 2, bold: 1 } },
            { text: "A busy town with a festival, the streets are filled with people and music.", natures: { playful: 2, loyal: 1 } },
            { text: "The steepest mountain trail, wind howls through the peaks.", natures: { bold: 2, clever: 1 } },
            { text: "The coastline at sunset as waves crash against the rocks.", natures: { calm: 2, loyal: 1 } },
        ],
    },
];

//Scoring
// Step 1: add up the player's nature totals from their answers.
// Step 2: score each Pokémon by how well its natures match.
function calculateScores() {
    let player = {};
    for (let i = 0; i < natures.length; i++) {
        player[natures[i]] = 0;
    }

    for (let q = 0; q < answers.length; q++) {
        let question = questions[q];
        let answer = question.answers[answers[q]];

        let weight = 1;
        if (question.weight) {
            // optional: a question can count for more
            weight = question.weight;   
        }

        for (let nature in answer.natures) {
            player[nature] = player[nature] + answer.natures[nature] * weight;
        }
    }

    let scores = {};
    for (let name in candidates) {
        scores[name] = 0;
        for (let i = 0; i < natures.length; i++) {
            let nature = natures[i];
            let candidateValue = candidates[name].natures[nature];
            if (candidateValue === undefined) {
                // natures left out of a profile count as 0
                candidateValue = 0;     
            }
            scores[name] = scores[name] + player[nature] * candidateValue;
        }
    }
    return scores;
}

// Find the highest score. If several Pokémon tie, pick one of them at random.
function getWinner(scores) {
    let bestScore = -1;
    let tied = [];

    for (let name in scores) {
        if (scores[name] > bestScore) {
            bestScore = scores[name];
            tied = [name];
        } else if (scores[name] === bestScore) {
            tied.push(name);
        }
    }

    let randomNumber = Math.floor(Math.random() * tied.length);
    return tied[randomNumber];
}

// Show one screen and hide the others.
function show(screenId) {
    let screens = ["intro", "quiz", "result"];
    for (let i = 0; i < screens.length; i++) {
        let element = document.querySelector('#' + screens[i]);
        if (screens[i] === screenId) {
            element.hidden = false;
        } else {
            element.hidden = true;
        }
    }
}

function showQuestion() {
    // current question = how many we've answered
    let i = answers.length;              
    let question = questions[i];

    document.querySelector('#count').innerHTML = "Question " + (i + 1) + " of " + questions.length;
    document.querySelector('#bar').style.width = (i / questions.length * 100) + "%";
    document.querySelector('#question').innerHTML = question.text;

    let answersElement = document.querySelector('#answers');
    answersElement.innerHTML = "";     // clear the previous question's buttons

    for (let a = 0; a < question.answers.length; a++) {
        let button = document.createElement('button');
        button.innerHTML = question.answers[a].text;
        button.addEventListener('click', () => {
            choose(a);
        });
        answersElement.appendChild(button);
    }
}

function choose(answerIndex) {
    answers.push(answerIndex);
    if (answers.length < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

//Start the quiz
function startQuiz() {
    answers = [];
    document.documentElement.style.setProperty("--accent", DEFAULT_COLOR);
    show("quiz");
    showQuestion();
}

//Reset the quiz to the beginning, clearing answers and resetting the accent color.
function restart() {
    answers = [];
    document.documentElement.style.setProperty("--accent", DEFAULT_COLOR);
    show("intro");
}

//Show results and communicate with the API
function showResult() {
    show("result");

    let scores = calculateScores();
    let winner = getWinner(scores);          

    // clear anything left over from a previous result
    document.querySelector('#p-name').innerHTML = "Finding your partner...";
    document.querySelector('#p-img').hidden = true;
    document.querySelector('#p-type').innerHTML = "";
    document.querySelector('#p-blurb').innerHTML = "";
    document.querySelector('#p-dex').innerHTML = "";
    document.querySelector('#p-stats').innerHTML = "";

    //Pokémon itself (name, sprite, types, stats) ----
    let API_URL = "https://pokeapi.co/api/v2/pokemon/" + winner;
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            // name, sprite and blurb
            let nameElement = document.querySelector('#p-name');
            nameElement.innerHTML = data.name;

            let imageElement = document.querySelector('#p-img');
            imageElement.src = data.sprites.front_default;
            imageElement.hidden = false;

            let blurbElement = document.querySelector('#p-blurb');
            blurbElement.innerHTML = candidates[winner].blurb;

            // types
            let typeElement = document.querySelector('#p-type');
            for (let i = 0; i < data.types.length; i++) {
                let elt = document.createElement('p');
                elt.innerHTML = data.types[i].type.name;
                typeElement.appendChild(elt);
            }

            // colour the page after the first type
            let firstType = data.types[0].type.name;
            if (TYPE_COLORS[firstType]) {
                document.documentElement.style.setProperty("--accent", TYPE_COLORS[firstType]);
            }

            // stat bars: one row per stat (label, bar, number)
            let statsElement = document.querySelector('#p-stats');
            for (let i = 0; i < data.stats.length; i++) {
                let statName = data.stats[i].stat.name;
                let statValue = data.stats[i].base_stat;

                let row = document.createElement('div');
                row.className = 'stat';

                let label = document.createElement('span');
                label.innerHTML = statName.replace("-", " ");

                let track = document.createElement('div');
                track.className = 'track';

                let fill = document.createElement('div');
                fill.className = 'fill';
                let percent = statValue / 150 * 100;     // 150 is our "full bar"
                if (percent > 100) {
                    percent = 100;
                }
                fill.style.width = percent + "%";
                track.appendChild(fill);

                let number = document.createElement('span');
                number.innerHTML = statValue;

                row.appendChild(label);
                row.appendChild(track);
                row.appendChild(number);
                statsElement.appendChild(row);
            }
        })
        .catch(err => {
            console.log("error is: " + err);

            // we still know the winner, even if the API didn't answer
            let nameElement = document.querySelector('#p-name');
            nameElement.innerHTML = winner;

            let blurbElement = document.querySelector('#p-blurb');
            blurbElement.innerHTML = candidates[winner].blurb;

            let statsElement = document.querySelector('#p-stats');
            statsElement.innerHTML = "Could not load the details. Check your connection and try again.";
        })

    //Call 2: Species (Pokedex description)
    let SPECIES_URL = "https://pokeapi.co/api/v2/pokemon-species/" + winner;
    fetch(SPECIES_URL)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            //Find the first English entry
            let entries = data.flavor_text_entries;
            let description = "";
            for (let i = 0; i < entries.length; i++) {
                if (entries[i].language.name === "en") {
                    description = entries[i].flavor_text;
                    break;                               
                }
            }

            // the text contains line breaks (\n) and page breaks (\f); turn them into spaces
            description = description.replace(/[\n\f]/g, " ");

            let dexElement = document.querySelector('#p-dex');
            dexElement.innerHTML = description;
        })
        .catch(err => {
            console.log("error is: " + err);
        })
}

//Actual start to the page, waiting for the page to load
window.addEventListener('load', () => {
    console.log('page is loaded');

    let startButton = document.querySelector('#start');
    startButton.addEventListener('click', startQuiz);

    let restartButton = document.querySelector('#restart');
    restartButton.addEventListener('click', restart);
})