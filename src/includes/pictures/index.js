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
            this.cv_pictures = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                // convert file into img object
                const img = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
                // convert img object into mat object
                const mat = cv.imread(await urlToImage(img));
                this.cv_pictures.push(mat);
            }
            console.table(this.cv_pictures);

            if (selectElementParameters.value == 'Display only') {
                this.display_pictures();
            } else if (selectElementParameters.value == 'Average') {
                this.average_pictures();
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
        canvasOutput.width = 640;
        canvasOutput.height = 480;
        card_output.addComponent(canvasOutput);
    }

    display_pictures = () => {
        for (let i = 0; i < this.cv_pictures.length; i++) {
            const picture = this.cv_pictures[i];
            cv.imshow('canvasOutputBlock', picture);
            picture.delete();
        }
    }

    average_pictures = () => {
        averagedImage = averageImages(this.cv_pictures);
        cv.imshow('canvasOutputBlock', averagedImage);
        picture.delete();
    }

    averageImages(images) {
        if (images.length === 0) {
            return null;
        }
    
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
    
        const width = images[0].width;
        const height = images[0].height;
    
        canvas.width = width;
        canvas.height = height;
    
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = new Uint8Array(width * height * 4);
    
        for (let i = 0; i < images.length; i++) {
            const img = images[i];
            ctx.drawImage(img, 0, 0, width, height);
    
            const currentImageData = ctx.getImageData(0, 0, width, height);
    
            for (let j = 0; j < data.length; j++) {
                data[j] += currentImageData.data[j];
            }
        }
    
        for (let i = 0; i < data.length; i++) {
            data[i] = Math.round(data[i] / images.length);
        }
    
        imageData.data.set(data);
        ctx.putImageData(imageData, 0, 0);
    
        const averagedImage = new Image();
        averagedImage.src = canvas.toDataURL('image/png');
    
        return averagedImage;
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