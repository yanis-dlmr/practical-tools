import { Card } from '/src/components/card/index.js';
import { Container } from '/src/components/container/index.js';
import { Importer } from '/src/components/importer/index.js';
import { Caption } from '/src/components/caption/index.js';
import { Button } from '/src/components/button/index.js';
import { Select } from '/src/components/select/index.js';

import * as cv from 'opencv4nodejs';

document.addEventListener('DOMContentLoaded', function() {
    init();
});

async function init() {

    const row = document.createElement('div');
    row.classList.add('row', 'custom-row');
    document.body.appendChild(row);

    // Parameters
    const card_parameters = new Card('Parameters');
    const cardElementParameters = card_parameters.render();

    const container_parameters = new Container('5');
    container_parameters.addComponent(cardElementParameters);
    const containerElementParameters = container_parameters.render();

    row.appendChild(containerElementParameters);

    const caption_parameters = new Caption('Select your parameters');
    const captionElementParameters = caption_parameters.render();
    card_parameters.addComponent(captionElementParameters);

    const select_parameters = new Select(['Display only', 'Average']);
    const selectElementParameters = select_parameters.render();
    card_parameters.addComponent(selectElementParameters);


    // Data import
    const card = new Card('Data importation');
    const cardElement = card.render();

    const container = new Container('7');
    container.addComponent(cardElement);
    const containerElement = container.render();

    row.appendChild(containerElement);

    const caption = new Caption('Import your pictures (.BMP, .jpg, .jpeg, .png allowed)');
    const captionElement = caption.render();
    card.addComponent(captionElement);

    const importer = new Importer('multiple pictures');
    const importerElement = importer.render();
    card.addComponent(importerElement);

    const validation_button = new Button('Compute');
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