import { Card } from '/src/components/card/index.js';
import { Container } from '/src/components/container/index.js';

document.addEventListener('DOMContentLoaded', function() {
    init();
});

async function init() {

    const card = new Card();
    card.setTitle('Pictures');
    const cardElement = card.render();

    const container = new Container();
    container.addComponent(cardElement);
    const containerElement = container.render();

    document.body.appendChild(containerElement);
}