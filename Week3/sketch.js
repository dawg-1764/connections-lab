let story = ["A", "reader", "lives", "a", "thousand", "lives", "before", "he", "dies.", "The", "man", "who", "never", "reads", "lives", "only", "one"];
let counter = 0;

window.addEventListener('load', () => {
    let container = document.getElementById('container');
    const word = "multitudes";

    // single listener, only on the multitudes element
    document.getElementById("multitudes").addEventListener("click", (e) => {
        const originX = e.clientX;
        const originY = e.clientY;

        //particle behavior
        word.split("").forEach((letter, i) => {
            createParticle(originX, originY, word);
        });

        //story word behavior
        if (counter > story.length - 1) {
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
            counter = 0;
        } else {
            let span = document.createElement('span');
            span.innerHTML = story[counter];
            span.style.position = "absolute";

            //random position on the screen
            span.style.top = `${Math.random() * window.innerHeight}px`;
            span.style.left = `${Math.random() * window.innerWidth}px`;

            //random color and font size
            let r = Math.floor(Math.random() * 255);
            let g = Math.floor(Math.random() * 255);
            let b = Math.floor(Math.random() * 255);
            span.style.color = `rgb(${r}, ${g}, ${b})`;
            span.style.fontSize = Math.floor(Math.random() * (90 - 20) + 20) + "px";

            container.appendChild(span);
            counter++;
        }
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
