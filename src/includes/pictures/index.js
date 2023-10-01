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
                        // convert img to array
                        const canvas = document.createElement('canvas');
                        canvas.width = imgElement.width;
                        canvas.height = imgElement.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(imgElement, 0, 0);
                        const data = ctx.getImageData(0, 0, imgElement.width, imgElement.height).data;
                        const array = new Uint8Array(data);
                        console.log(array)
                        // convert array to mat
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
        const picture = this.computeAverageImage( this.cv_pictures );
        console.log(picture);
        cv.imshow('canvasOutputBlock', picture);
        picture.delete();
    }
    
    computeAverageImage = (imageList) => {
        let averageImage = imageList[0].clone();
        for (let i = 1; i < imageList.length; i++) {
            const image = imageList[i];
            averageImage = this.addImage(averageImage, image);
        }
        averageImage = this.divideImage(averageImage, imageList.length);
        return averageImage;
    };

    addImage = (image1, image2) => {
        const result = new cv.Mat();
        cv.add(image1, image2, result);
        return result;
    };

    divideImage = (image, divisor) => {
        const result = new cv.Mat();
        const divisorMat = new cv.Mat(image.rows, image.cols, image.type(), new cv.Scalar(divisor/3, divisor/3, divisor/3, 1));
        cv.divide(image, divisorMat, result);
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