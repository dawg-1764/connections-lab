//story
let story = ["A", "reader", "lives", "a", "thousand", "lives", "before", "he", "dies.", "The", "man", "who", "never", "reads", "lives", "only", "one"];

//make sure the page loads first
window.addEventListener('load', () => {
    let counter = 0;
    let container = document.getElementById('container');

    //listen for clicks on the page and get an exact location
    window.addEventListener('click', (e) => {
        console.log('you have clicked here, ' + e.x + ',' + e.y);
        console.log('counter: ', counter);

        //remove all html elements if story ends
        if (counter > story.length - 1) {
            console.log('cleaning up all content');
            //remove all children
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
            counter = 0; // reset to the beginning
        } else { //otherwise keep adding html elements
            let span = document.createElement('span');
            span.innerHTML = story[counter];
            span.style.position = "absolute";
            span.style.top = `${Math.random() * window.innerHeight}px`;
            span.style.left = `${Math.random() * window.innerWidth}px`;

            //add random color
            let r = Math.floor(Math.random() * 255);
            let g = Math.floor(Math.random() * 255);
            let b = Math.floor(Math.random() * 255);
            span.style.color = `rgb(${r}, ${g}, ${b})`;

            //add random size
            span.style.fontSize = Math.floor(Math.random() * (90 - 20) + 20) + "px";
            container.appendChild(span);
            counter++; //move on to the next word
        }
    });
});


document.getElementById("multitudes").addEventListener("click", (e) => {
    const word = "multitudes";
    const originX = e.clientX;
    const originY = e.clientY;
    const particleCount = 24;

    word.split("").forEach((letter, i) => {
        createParticle(originX, originY, word); // pass the whole word, not `letter`
    });
});

function createParticle(x, y, text) {
    const particle = document.createElement("span");
    particle.textContent = text;
    particle.classList.add("particle");
    document.body.appendChild(particle);

    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 150 + 50;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    particle.style.left = x + "px";
    particle.style.top = y + "px";
    particle.style.setProperty("--dx", dx + "px");
    particle.style.setProperty("--dy", dy + "px");

    setTimeout(() => particle.remove(), 800);
}