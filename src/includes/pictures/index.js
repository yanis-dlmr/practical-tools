import { Card } from '/src/components/card/index.js';
import { Container } from '/src/components/container/index.js';
import { Importer } from '/src/components/importer/index.js';
import { Caption } from '/src/components/caption/index.js';
import { Button } from '/src/components/button/index.js';
import { Select } from '/src/components/select/index.js';


document.addEventListener('DOMContentLoaded', function() {
    new PictureManager();
});

class PictureManager {

    constructor() {

        this.cv_pictures = [];
        this.create_body();

    }

    create_body() {
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

        validation_buttonElement.addEventListener('click', async () => {
            const files = importerElement.files;
            this.pictures = [];
            // store all the pictures in an array
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const url = URL.createObjectURL(file);
                const picture = await urlToImage(url);
                this.pictures.push(picture);
            }

            console.table(this.pictures);

            if (selectElementParameters.value == 'Display only') {
                this.display_pictures();
            } else if (selectElementParameters.value == 'Average') {
                this.compute_average_pictures();
            }
        });


        // Output  
        const card_output = new Card('Output');
        const cardElementOutput = card_output.render();

        const container_output = new Container('12');
        container_output.addComponent(cardElementOutput);
        const containerElementOutput = container_output.render();

        row.appendChild(containerElementOutput);

        const canvasOutput = document.createElement('canvas');
        canvasOutput.id = 'canvasOutputBlock';
        card_output.addComponent(canvasOutput);
    }

    display_pictures = () => { // Display all the pictures in the output block with their original size
        const canvasOutput = document.getElementById('canvasOutputBlock');
        const ctx = canvasOutput.getContext('2d');
        ctx.clearRect(0, 0, canvasOutput.width, canvasOutput.height);
        canvasOutput.width = this.pictures[0].width;
        canvasOutput.height = this.pictures[0].height;
        for (let i = 0; i < this.pictures.length; i++) {
            ctx.drawImage(this.pictures[i], 0, 0);
        }
    }

    compute_average_pictures = () => { // Compute the average of all the pictures and display it in the output block
        const canvasOutput = document.getElementById('canvasOutputBlock');
        const ctx = canvasOutput.getContext('2d');
        ctx.clearRect(0, 0, canvasOutput.width, canvasOutput.height);
        canvasOutput.width = this.pictures[0].width;
        canvasOutput.height = this.pictures[0].height;
        const imageData = ctx.getImageData(0, 0, canvasOutput.width, canvasOutput.height);
        const data = imageData.data;
        for (let i = 0; i < this.pictures.length; i++) {
            const picture = this.pictures[i];
            const pictureData = picture.getContext('2d').getImageData(0, 0, picture.width, picture.height).data;
            for (let j = 0; j < data.length; j++) {
                data[j] += pictureData[j];
            }
        }
        for (let i = 0; i < data.length; i++) {
            data[i] /= this.pictures.length;
        }
        ctx.putImageData(imageData, 0, 0);
    }

}

async function urlToImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}