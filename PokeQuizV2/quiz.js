//answers[i] = index of the answer chosen for question i
let answers = [];

//Sound things
let theme = null;
let bgMusic = new Audio("ThemeSongs/bgMusic.mp3");

//Holding the Pokémon Cry of the winning Pokemon 
let currentCryUrl = null;

//Referencing the document body in the DOM to change the image
const body = document.body; 

//Audio objects
const selectSound = new Audio("SoundEffects/select.mp3");
const returnSound = new Audio("SoundEffects/return.mp3");

//Type Colors
const TYPE_COLORS = {
    normal: "#A8A878", fire: "#F08030", water: "#6890F0", grass: "#78C850",
    electric: "#F6D954", ice: "#98D8D8", fighting: "#D7425E", poison: "#A040A0",
    ground: "#D78656", flying: "#99B3E5", psychic: "#F85888", bug: "#9AC42F",
    rock: "#CEC08E", ghost: "#6666BB", dragon: "#0874BF", dark: "#775544",
    steel: "#669CAA", fairy: "#FFAAFF",
};
const DEFAULT_COLOR = "#2b3a42";

//Based on the in-game Pokémon natures, but simplified to 5 categories 
//Each nature is a personality trait that a Pokémon can have, and each Pokémon has a profile of how much of each nature it has.
const natures = ["bold", "clever", "calm", "playful", "loyal"];

//Storing Pokemon using an object with the Pokémon's name as the key, and its generation, natures, and blurb as the values.
const candidates = {
    // Gen 1
    bulbasaur: { gen: 1, natures: { clever: 3, calm: 2, loyal: 1 }, blurb: "A Kanto classic. Steady, dependable, and quietly clever. Bulbasaur carries the load and never complains." },
    charmander: { gen: 1, natures: { bold: 3, playful: 1, loyal: 2 }, blurb: "A Kanto classic. Fierce and loyal. Charmander charges into any fight for you and never gives up on you." },
    squirtle: { gen: 1, natures: { bold: 1, clever: 3, playful: 2 }, blurb: "A Kanto classic. Confident, a bit cheeky, and sharper than it looks. Squirtle brings swagger and a plan." },

    // Gen 2
    chikorita: { gen: 2, natures: { clever: 1, calm: 3, loyal: 2 }, blurb: "Gentle and devoted, Chikorita keeps the whole journey calm just by being next to you. A steady companion straight out of Johto." },
    cyndaquil: { gen: 2, natures: { bold: 1, calm: 3, playful: 2 }, blurb: "Shy until the spark catches, Cyndaquil is sure to bring out the fire in you. A steady companion straight out of Johto." },
    totodile: { gen: 2, natures: { bold: 2, playful: 3, loyal: 1 }, blurb: "A goofball with a big bite. Every day with Totodile feels like a party. A steady companion straight out of Johto." },

    // Gen 3
    treecko: { gen: 3, natures: { bold: 3, clever: 2, calm: 1 }, blurb: "Cool under pressure and always a step ahead, the kind of adventurer Hoenn's islands are known for. Treecko can't wait to show you all the tricks up its sleeve." },
    torchic: { gen: 3, natures: { bold: 3, clever: 1, loyal: 2 }, blurb: "Scrappy and warm-hearted, the kind of adventurer Hoenn's islands are known for. Torchic fights hard for you no matter how hard the challenge may be." },
    mudkip: { gen: 3, natures: { calm: 1, playful: 2, loyal: 3 }, blurb: "Cheerful and endlessly loyal, the kind of adventurer Hoenn's islands are known for. Mudkip makes even the muddy days feel like adventures." },

    // Gen 4
    turtwig: { gen: 4, natures: { clever: 1, calm: 2, loyal: 3 }, blurb: "Ready to brave Sinnoh's mountain trails! Patient, sturdy, and deeply loyal. Turtwig is a partner you never have to worry about." },
    chimchar: { gen: 4, natures: { bold: 3, clever: 1, playful: 2 }, blurb: "Ready to brave Sinnoh's mountain trails! Quick, playful, and always ready for a rematch, Chimchar turns every battle into fun." },
    piplup: { gen: 4, natures: { bold: 3, clever: 2, playful: 1 }, blurb: "Ready to brave Sinnoh's mountain trails! Proud and precise, with big ambitions, Piplup pushes you to be your best." },

    // Gen 5
    snivy: { gen: 5, natures: { bold: 1, clever: 3, calm: 2 }, blurb: "Composed, clever, and a little aloof, ready for the big region of Unova! You and Snivy are bound to make a great team." },
    tepig: { gen: 5, natures: { bold: 1, calm: 3, loyal: 2 }, blurb: "Warm, stubborn, and fiercely on your side, ready for the big region of Unova!. Tepig charges ahead and you'll want to follow." },
    oshawott: { gen: 5, natures: { bold: 1, playful: 2, loyal: 3 }, blurb: "Earnest and upbeat, ready for the big region of Unova!. Oshawott will try its best to make you proud." },

    // Gen 6
    chespin: { gen: 6, natures: { bold: 2, calm: 1, loyal: 3 }, blurb: "Chespin is known for its protective heart in a spiky coat. It stands in front of you when it counts, as expected for Kalos's finest trainers." },
    fennekin: { gen: 6, natures: { clever: 3, calm: 2, playful: 1 }, blurb: "Sharp-witted and curious, as expected for Kalos's finest trainers. Fennekin notices everything and quietly plans around it." },
    froakie: { gen: 6, natures: { bold: 1, clever: 2, calm: 3 }, blurb: "Smooth, adaptable, and quick to size up a situation, as expected for Kalos's finest trainers. Froakie makes hard things look easy." },

    // Gen 7
    rowlet: { gen: 7, natures: { clever: 2, calm: 3, loyal: 1 }, blurb: "Aloha from the beaches of Alola! Calm and observant, with a sharp mind. Rowlet is proud to be your companion." },
    litten: { gen: 7, natures: { bold: 3, clever: 1, calm: 2 }, blurb: "Aloha from the beaches of Alola! Litten is independent and cool, but it warms up to you eventually. A true friend." },
    popplio: { gen: 7, natures: { clever: 1, playful: 3, loyal: 2 }, blurb: "Aloha from the beaches of Alola! Popplio is a showman with a big heart. It cheers you on and loves an audience." },

    // Gen 8
    grookey: { gen: 8, natures: { bold: 2, calm: 1, playful: 3 }, blurb: "Cheers from the Galar stadium! Grookey is known for its rhythm, mischief, and nonstop fun. It keeps morale high wherever you go." },
    scorbunny: { gen: 8, natures: { bold: 3, playful: 2, loyal: 1 }, blurb: "Cheers from the Galar stadium! Nonstop energy and pure fire from Scorbunny. Fast, fearless, and always ready to go." },
    sobble: { gen: 8, natures: { calm: 2, playful: 1, loyal: 3 }, blurb: "Cheers from the Galar stadium! Shy, sensitive, and unexpectedly clever. Sobble needs a gentle partner, and gives everything back." },

    // Gen 9
    sprigatito: { gen: 9, natures: { clever: 2, calm: 1, playful: 3 }, blurb: "Ready for a Paldean adventure! The charming, clever, and little mischievous Sprigatito knows exactly what it's doing." },
    fuecoco: { gen: 9, natures: { calm: 2, playful: 3, loyal: 1 }, blurb: "Ready for a Paldean adventure! Easygoing and always hungry, two words to describe Fuecoco. It reminds you to enjoy the ride." },
    quaxly: { gen: 9, natures: { bold: 1, clever: 3, loyal: 2 }, blurb: "Ready for a Paldean adventure! Polite, precise, and quietly devoted. Quaxly does things properly and will never leave your side." },
};

//Each question has a set of answers that corresponds to the Pokémon natures.
//The more a player chooses answers that match a Pokémon's natures, the higher that Pokémon will score.
const questions = [
    {
        text: "It's your first day as a trainer! What are you most excited about?",
        answers: [
            { text: "Battling right away!", natures: { bold: 2, playful: 1 } },
            { text: "Filling every last entry of my Pokedex. Gotta catch 'em all!", natures: { clever: 2, calm: 1 } },
            { text: "Traveling with a friend by my side across the world", natures: { loyal: 2, playful: 1 } },
            { text: "Exploring all the new places each region has to offer", natures: { calm: 2, clever: 1 } },
        ],
    },
    {
        text: "It's midnight, everyone's exhausted, and the next town is 10 km away. You...",
        answers: [
            { text: "Push on, we'll rest when we get there", natures: { bold: 2, loyal: 1 } },
            { text: "Make camp and cook something good", natures: { calm: 2, playful: 1 } },
            { text: "Check the map for a shortcut", natures: { clever: 2, bold: 1 } },
            { text: "Turn the rest of the journey into a game to keep spirits up", natures: { playful: 2, loyal: 1 } },
        ],
    },
    {
        text: "A rival challenges you in front of a crowd.",
        answers: [
            { text: "Accept immediately, we've got this!", natures: { bold: 2, playful: 1 } },
            { text: "Study their team first, then make a move", natures: { clever: 2, calm: 1 } },
            { text: "Check that my partner is ready to battle", natures: { loyal: 2, calm: 1 } },
            { text: "Turn the battle into a show of skill for the audience", natures: { playful: 2, bold: 1 } },
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
            { text: "Go over what went wrong and think of a better strategy for the next battle", natures: { clever: 2, loyal: 1 } },
            { text: "Make sure my partner and team are okay", natures: { loyal: 2, calm: 1 } },
        ],
    },
    {
        text: "You're exploring a new region, what route do you decide to go down first?",
        answers: [
            { text: "A dense forest without a clear path, the sunlight peaks through the leaves", natures: { calm: 2, bold: 1 } },
            { text: "A busy town with a festival, the streets are filled with people and music", natures: { playful: 2, loyal: 1 } },
            { text: "The steepest mountain trail with wind howling through the peaks", natures: { bold: 2, clever: 1 } },
            { text: "The coastline at sunset as waves crash against the rocks", natures: { calm: 2, loyal: 1 } },
        ],
    },
];

//Play the select sound effect
function playSelectSound() {
    selectSound.currentTime = 0; // Rewind to start if clicked rapidly
    selectSound.play();
}

//Play the return sound effect
function playReturnSound() {
    returnSound.currentTime = 0;
    returnSound.play();
}

//Play the background music
function playBackgroundMusic() {
    bgMusic.play();
    bgMusic.loop = true;
}

//Function that takes a generation number (1-9) and plays the corresponding Pokémon theme song.
function playThemeSong(gen) {
    theme = new Audio("ThemeSongs/gen" + gen + ".mp3");
    theme.play();
}

//Function that sets the backround depending on the generation number
function setBackground(gen) {
    body.style.backgroundImage = 'url("Media/gen' + gen + '.jpg")';;
}

//Scoring
//Step 1: add up the player's nature totals from their answers.
//Step 2: score each Pokémon by how well its natures match.
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

//Find the highest score. If there is a tie, pick one of them at random.
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

//Show one screen and hide the others.
function show(screenId) {
    //Replicating structure from HTML
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

//Start the quiz
function startQuiz() {
    answers = [];
    document.documentElement.style.setProperty("--accent", DEFAULT_COLOR);
    show("quiz");
    playBackgroundMusic();
    showQuestion();
}

//Show one question at a time
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
            playSelectSound();
            choose(a);
        });
        answersElement.appendChild(button);
    }
}

// When the user chooses an answer, record it and either show the next question or show the result if we're done.
function choose(answerIndex) {
    answers.push(answerIndex);
    if (answers.length < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

//Clear anything left from a previous result and play the reveal animation
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

    //Make reveal canvas visible
    document.querySelector('#reveal-canvas').hidden = false;
    
    //Pause music
    bgMusic.pause();
    bgMusic.currentTime = 0;

    //Play the pokeball animation first. revealPokemon(winner) only runs once playRevealAnimation finishes and calls back.
    playRevealAnimation(() => {
        //play theme song and change background image depending the winner's generation specified in the array of objects
        playThemeSong(candidates[winner].gen);
        setBackground(candidates[winner].gen);

        document.querySelector('#reveal-canvas').hidden = true;
        revealPokemon(winner);
    });
}

//Communicate with the API and populate the web elements
function revealPokemon(winner) {
    //Call 1: the Pokémon itself (name, sprite, types, stats)
    let API_URL = "https://pokeapi.co/api/v2/pokemon/" + winner;

    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            // Name
            document.querySelector('#p-name').innerHTML = data.name;

            // Sprite
            let imageElement = document.querySelector('#p-img');
            imageElement.src = data.sprites.front_default;
            imageElement.hidden = false;

            // Pokemon cry
            if (data.cries) {
                currentCryUrl = data.cries.latest;
            }

            //blurb element from our previous array of objects
            document.querySelector('#p-blurb').innerHTML = candidates[winner].blurb;

            //types (main and sub-type if present)
            let typeElement = document.querySelector('#p-type');

            for (let i = 0; i < data.types.length; i++) {
                let typeName = data.types[i].type.name;
                let elt = document.createElement('p');
                elt.innerHTML = typeName;
                elt.style.backgroundColor = TYPE_COLORS[typeName] || DEFAULT_COLOR;
                typeElement.appendChild(elt);
            }

            // colour the page accents after the first type
            let firstType = data.types[0].type.name;
            if (TYPE_COLORS[firstType]) {
                document.documentElement.style.setProperty("--accent", TYPE_COLORS[firstType]);
            }

            //particleApp.startParticles(TYPE_COLORS[firstType] || DEFAULT_COLOR);

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
                fill.style.width = Math.min((statValue / 150) * 100, 100) + "%";
                track.appendChild(fill);

                let number = document.createElement('span');
                number.innerHTML = statValue;

                row.appendChild(label);
                row.appendChild(track);
                row.appendChild(number);
                statsElement.appendChild(row);
            }
        })
        //Fall-back in case API is non-responsive
        .catch(err => {
            console.log("error is: " + err);

            //name
            let nameElement = document.querySelector('#p-name');
            nameElement.innerHTML = winner;

            //blurb
            let blurbElement = document.querySelector('#p-blurb');
            blurbElement.innerHTML = candidates[winner].blurb;

            //stats (error message)
            let statsElement = document.querySelector('#p-stats');
            statsElement.innerHTML = "Could not load the details. Check your connection and try again.";
        })

    //Call 2: the species (this is where the Pokédex description lives)
    let SPECIES_URL = "https://pokeapi.co/api/v2/pokemon-species/" + winner;
    fetch(SPECIES_URL)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            // the entries come in many languages, so find the first English one
            let entries = data.flavor_text_entries;
            let description = "";
            for (let i = 0; i < entries.length; i++) {
                if (entries[i].language.name === "en") {
                    description = entries[i].flavor_text;
                    // stop looking once we've found it
                    break;                               
                }
            }

            // the text contains line breaks (\n) and page breaks (\f), breaking them into spaces
            description = description.replace(/[\n\f]/g, " ");

            //Pokedex description
            let dexElement = document.querySelector('#p-dex');
            dexElement.innerHTML = description;
        })
        .catch(err => {
            console.log("error is: " + err);
        })
}

//Reset the quiz to the beginning, clearing answers and resetting the accent color.
function restart() {
    answers = [];
    document.documentElement.style.setProperty("--accent", DEFAULT_COLOR);
    show("intro");
    theme.pause();
    theme.currentTime = 0;

    //Reset background image
    body.style.backgroundImage = 'url("Media/BG.jpg")';
    
    //particleApp.stopParticles();
}

//Actual start to the page, waiting for the page to load
window.addEventListener('load', () => {
    console.log('page is loaded');

    //Start button on the intro page
    let startButton = document.querySelector('#start');
    startButton.addEventListener('click', () => {
        playSelectSound();
        startQuiz();
    });

    //Clicking the sprite plays that Pokémon's cry (only once one has been revealed)
    let imageElement = document.querySelector('#p-img');
    imageElement.addEventListener('click', () => {
        if (currentCryUrl) {
            let cry = new Audio(currentCryUrl);
            cry.play();
        }
    });
})
