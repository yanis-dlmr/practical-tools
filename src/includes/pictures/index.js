import { Card } from '/src/components/card/index.js';
import { Container } from '/src/components/container/index.js';
import { Importer } from '/src/components/importer/index.js';
import { Caption } from '/src/components/caption/index.js';
import { Button } from '/src/components/button/index.js';

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

    const caption = new Caption('Import your pictures');
    const captionElement = caption.render();
    card.addComponent(captionElement);

    const importer = new Importer('multiple pictures');
    const importerElement = importer.render();
    card.addComponent(importerElement);

    const validation_button = new Button('Import pictures');
    const validation_buttonElement = validation_button.render();
    card.addComponent(validation_buttonElement);
}