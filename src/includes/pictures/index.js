import { Card } from '/src/components/card/';

document.addEventListener('DOMContentLoaded', function() {
    init();
});

async function init() {
    const card = new Card();
    card.setTitle('Pictures');
    const cardElement = card.render();
    document.body.appendChild(cardElement);
}