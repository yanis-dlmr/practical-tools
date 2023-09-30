import { Card } from '/src/components/card/index.js';
import { Container } from '/src/components/container/index.js';
import { Importer } from '/src/components/importer/index.js';

document.addEventListener('DOMContentLoaded', function() {
    init();
});

async function init() {

    const card = new Card('Pictures');
    const cardElement = card.render();

    const container = new Container();
    container.addComponent(cardElement);
    const containerElement = container.render();

    document.body.appendChild(containerElement);

    const importer = new Importer('multiple pictures');
    const importerElement = importer.render();
    cardElement.appendChild(importerElement);
}