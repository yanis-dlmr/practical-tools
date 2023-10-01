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
                // convert img object into mat object, only black and white
                const mat = await new Promise((resolve, reject) => {
                    const imgElement = document.createElement('img');
                    imgElement.onload = () => {
                        // create Uint8Array object
                        const canvas = document.createElement('canvas');
                        canvas.width = imgElement.width;
                        canvas.height = imgElement.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(imgElement, 0, 0);
                        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                        const image = new Uint8Array(data);
                        console.log(image)
                        // create mat object
                        const mat = cv.imread(imgElement);
                        cv.cvtColor(mat, mat, cv.COLOR_RGB2GRAY);
                        resolve(mat);
                    };
                    imgElement.onerror = reject;
                    imgElement.src = img;
                });
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
        // convert mat object into Uint8Array 
        const imageList = [];
        for (let i = 0; i < this.cv_pictures.length; i++) {
            const picture = this.cv_pictures[i];
            const image = new Uint8Array(picture.data);
            imageList.push(image);
            picture.delete();
        }
        console.log(imageList)
        console.table(imageList)
        // compute average image
        const avg_image = this.computeAverageImage(imageList);
        // convert Uint8Array into mat object
        const avg_picture = new cv.Mat(avg_image, avg_image.length / 3, cv.CV_8UC3);
        // display average image
        cv.imshow('canvasOutputBlock', avg_picture);
        picture.delete();
    }
    
    computeAverageImage = (imageList) => {
        // compute average image
        let avg_image = imageList[0];
        for (let i = 1; i < imageList.length; i++) {
            avg_image = this.addImage(avg_image, imageList[i]);
        }
        avg_image = this.divideImage(avg_image, imageList.length);
        return avg_image;
    };

    addImage = (image1, image2) => {
        const result = new Uint8Array(image1.length);
        for (let i = 0; i < image1.length; i++) {
            result[i] = image1[i] + image2[i];
        }
        return result;
    };

    divideImage = (image, divisor) => {
        const result = new Uint8Array(image.length);
        for (let i = 0; i < image.length; i++) {
            result[i] = image[i] / divisor;
        }
        return result;
    };

}

async function urlToImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}