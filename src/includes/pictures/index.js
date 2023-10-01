import { Card } from '/src/components/card/index.js';
import { Container } from '/src/components/container/index.js';
import { Importer } from '/src/components/importer/index.js';
import { Caption } from '/src/components/caption/index.js';
import { Button } from '/src/components/button/index.js';
import { Select } from '/src/components/select/index.js';

document.addEventListener('DOMContentLoaded', function() {
    init();
});

async function init() {

    // Parameters
    const card_parameters = new Card('Parameters');
    const cardElementParameters = card_parameters.render();

    const container_parameters = new Container('2');
    container_parameters.addComponent(cardElementParameters);
    const containerElementParameters = container_parameters.render();

    document.body.appendChild(containerElementParameters);

    const caption_parameters = new Caption('Select your parameters');
    const captionElementParameters = caption_parameters.render();
    card_parameters.addComponent(captionElementParameters);


    // Data import
    const card = new Card('Pictures treatment');
    const cardElement = card.render();

    const container = new Container('8');
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

    validation_buttonElement.addEventListener('click', async function() {
        const files = importerElement.files;
        const pictures = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const picture = await file.arrayBuffer();
            pictures.push(picture);
        }
        console.log(pictures);
    });
}