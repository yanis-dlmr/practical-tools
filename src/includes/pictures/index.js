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

    const card = new Card('Data importation');
    const cardElement = card.render();
    
    const card_parameters = new Card('Treatment parameters');
    const cardElementParameters = card_parameters.render();

    const container_parameters = new Container('3');
    container_parameters.addComponent(cardElement);
    const containerParametersElement = container_parameters.render();

    document.body.appendChild(containerParametersElement);

    var caption = new Caption('Kind of treatment');
    var captionElement = caption.render();
    card_parameters.addComponent(captionElement);

    const container_pictures = new Container('7');
    container_pictures.addComponent(cardElement);
    const containerPicturesElement = container_pictures.render();

    document.body.appendChild(containerPicturesElement);

    var caption = new Caption('Import your pictures');
    var captionElement = caption.render();
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