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

        const select_parameters = new Select(['Display only', 'Average Color', 'Average picture', 'Determine axis']);
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
                picture.name = file.name;            
                this.pictures.push(picture);
            }

            console.table(this.pictures);
            this.remove_all_output_blocks();

            if (selectElementParameters.value == 'Display only') {
                this.display_pictures();
            } else if (selectElementParameters.value == 'Average Color') {
                this.compute_average_color();
            } else if (selectElementParameters.value == 'Average picture') {
                this.compute_average_picture();
            } else if (selectElementParameters.value == 'Determine axis') {
                this.compute_determine_axis();
            }
            // clear memory
            for (let i = 0; i < this.pictures.length; i++) {
                URL.revokeObjectURL(this.pictures[i].src);
            }

        });


        // Output  
        this.card_output = new Card('Output');
        const cardElementOutput = this.card_output.render();

        const container_output = new Container('12');
        container_output.addComponent(cardElementOutput);
        const containerElementOutput = container_output.render();

        row.appendChild(containerElementOutput);

        const canvasOutput = document.createElement('canvas');
        canvasOutput.id = 'canvasOutputBlock';
        this.card_output.addComponent(canvasOutput);
    }

    display_pictures = () => { // Display all the pictures in the output block with their original size
        for (let i = 0; i < this.pictures.length; i++) {
            this.add_output_block('Title', 'text', this.pictures[i]);
        }
    }

    compute_average_color = () => { // Compute the average of all the pictures and display it in the output block, with the original size
        this.average_picture = document.createElement('canvas');
        this.average_picture.id = 'canvasOutputBlock';
        this.average_picture.width = this.pictures[0].width;
        this.average_picture.height = this.pictures[0].height;
        const ctx = this.average_picture.getContext('2d');
        ctx.clearRect(0, 0, this.average_picture.width, this.average_picture.height);
        for (let i = 0; i < this.pictures.length; i++) {
            ctx.drawImage(this.pictures[i], 0, 0);
        }
        const imageData = ctx.getImageData(0, 0, this.average_picture.width, this.average_picture.height);
        const data = imageData.data;
        const length = data.length;
        const average = [0, 0, 0];
        for (let i = 0; i < length; i += 4) {
            average[0] += data[i];
            average[1] += data[i + 1];
            average[2] += data[i + 2];
        }
        average[0] /= length / 4;
        average[1] /= length / 4;
        average[2] /= length / 4;
        for (let i = 0; i < length; i += 4) {
            data[i] = average[0];
            data[i + 1] = average[1];
            data[i + 2] = average[2];
        }
        ctx.putImageData(imageData, 0, 0);
        this.add_output_block('Average Color', 'nomnomnom', this.average_picture);
    }

    compute_average_picture = () => { // Compute the average of all the pictures and display it in the output block, with the original size
        // extract all arrays of pixels and make the average
        const arrays = [];
        for (let i = 0; i < this.pictures.length; i++) {
            const canvas = document.createElement('canvas');
            canvas.width = this.pictures[i].width;
            canvas.height = this.pictures[i].height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(this.pictures[i], 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const length = data.length;
            const array = [];
            for (let j = 0; j < length; j += 4) {
                array.push([data[j], data[j + 1], data[j + 2]]);
            }
            arrays.push(array);
        }
        const average_array = [];
        for (let i = 0; i < arrays[0].length; i++) {
            const average = [0, 0, 0];
            for (let j = 0; j < arrays.length; j++) {
                average[0] += arrays[j][i][0];
                average[1] += arrays[j][i][1];
                average[2] += arrays[j][i][2];
            }
            average[0] /= arrays.length;
            average[1] /= arrays.length;
            average[2] /= arrays.length;
            average_array.push(average);
        }
        // create the average picture
        this.average_picture = document.createElement('canvas');
        this.average_picture.id = 'canvasOutputBlock';
        this.average_picture.width = this.pictures[0].width;
        this.average_picture.height = this.pictures[0].height;
        const ctx = this.average_picture.getContext('2d');
        ctx.clearRect(0, 0, this.average_picture.width, this.average_picture.height);
        const imageData = ctx.getImageData(0, 0, this.average_picture.width, this.average_picture.height);
        const data = imageData.data;
        const length = data.length;
        for (let i = 0; i < length; i += 4) {
            data[i] = average_array[i / 4][0];
            data[i + 1] = average_array[i / 4][1];
            data[i + 2] = average_array[i / 4][2];
        }
        ctx.putImageData(imageData, 0, 0);
        this.add_output_block('Average Picture', 'nomnomnom', this.average_picture);
    }

    compute_determine_axis = () => {
        // convert all the pictures into cv.Mat
        this.cv_pictures = [];
        for (let i = 0; i < this.pictures.length; i++) {
            const canvas = document.createElement('canvas');
            canvas.width = this.pictures[i].width;
            canvas.height = this.pictures[i].height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(this.pictures[i], 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const length = data.length;
            const mat = new cv.Mat(canvas.height, canvas.width, cv.CV_8UC4);
            const mat_data = mat.data;
            for (let j = 0; j < length; j++) {
                mat_data[j] = data[j];
            }
            this.cv_pictures.push(mat);
        }
        this.add_cv_output_block('Fist cv picture as test', 'nomnomnom', this.cv_pictures[0])

        // process the pictures
        console.log('process_pictures');
        for (let i = 0; i < this.cv_pictures.length; i++) {
            console.log('process_pictures : ', i);
            // Threshold the picture
            const threshold_min_value = 100;
            const threshold_max_value = 255;
            const threshold_type = cv.THRESH_BINARY;
            const threshold = new cv.Mat();
            cv.threshold(this.cv_pictures[i], threshold, threshold_min_value, threshold_max_value, threshold_type);
            // Find contours
            cv.findContours(threshold, contours, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
        //    // Sort contours by area
        //    const contours_area = [];
        //    for (let j = 0; j < contours.size(); j++) {
        //        const contour = contours.get(j);
        //        const area = cv.contourArea(contour, false);
        //        contours_area.push([contour, area]);
        //    }
        //    contours_area.sort((a, b) => b[1] - a[1]);
        //    console.log(contours.size(), ' contours');
        //    // Draw contours
        //    const canvasOutput = document.getElementById('canvasOutputBlock');
        //    const ctx = canvasOutput.getContext('2d');
        //    ctx.clearRect(0, 0, canvasOutput.width, canvasOutput.height);
        //    cv.drawContours(this.cv_pictures[i], contours, -1, [255, 255, 255, 255], 1, cv.LINE_8);
        //    cv.imshow('canvasOutputBlock', this.cv_pictures[i]);
        //    
        }
    }

    remove_all_output_blocks = () => {
        this.card_output.removeAllComponents();
    }

    add_output_block  = (title, text, picture) => {

        console.log(picture)

        const picture_name = picture.name;
        const picture_size = picture.width + 'x' + picture.height;

        const caption = new Caption(title);
        const captionElement = caption.render();
        this.card_output.addComponent(captionElement);

        const textElement = document.createElement('p');
        textElement.innerHTML = text + '\n' + picture_name + ' (' + picture_size + ')';
        this.card_output.addComponent(textElement);

        const canvas = document.createElement('canvas');
        canvas.id = 'canvasOutputBlock' + picture_name;
        canvas.width = picture.width;
        canvas.height = picture.height;
        this.card_output.addComponent(canvas);

        // display image using ctx.drawImage
        const canvasOutput = document.getElementById('canvasOutputBlock'  + picture_name);
        const ctx = canvasOutput.getContext('2d');
        ctx.drawImage(picture, 0, 0);
    }

    add_cv_output_block  = (title, text, picture) => {

        console.log(picture)

        const picture_name = picture.name;
        const picture_size = picture.width + 'x' + picture.height;

        const caption = new Caption(title);
        const captionElement = caption.render();
        this.card_output.addComponent(captionElement);

        const textElement = document.createElement('p');
        textElement.innerHTML = text + '\n' + picture_name + ' (' + picture_size + ')';
        this.card_output.addComponent(textElement);

        const canvas = document.createElement('canvas');
        canvas.id = 'canvasOutputBlock' + picture_name;
        canvas.width = picture.width;
        canvas.height = picture.height;
        this.card_output.addComponent(canvas);

        // display image using cv
        const canvasOutput = document.getElementById('canvasOutputBlock'  + picture_name);
        const ctx = canvasOutput.getContext('2d');
        cv.imshow('canvasOutputBlock'  + picture_name, picture);
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