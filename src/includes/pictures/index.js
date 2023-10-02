import { Card } from '/src/components/card/index.js';
import { Container } from '/src/components/container/index.js';
import { Importer } from '/src/components/importer/index.js';
import { Caption } from '/src/components/caption/index.js';
import { Button } from '/src/components/button/index.js';
import { Select } from '/src/components/select/index.js';
import { Form } from '/src/components/form/index.js';


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

        const form = new Form();
        const formElement = form.render();
        card_parameters.addComponent(formElement);
        let list_check_input = [
            {id: 'display_only', label: 'Display Only', value: 'display_only'},
            {id: 'average_color', label: 'Average Color', value: 'average_color'},
            {id: 'average_pictures', label: 'Average Pictures', value: 'average_pictures'},
            {id: 'determine_axis', label: 'Determine Axis', value: 'determine_axis'}
        ];
        let name = 'Select the treatment needed';
        form.add_multiple_check_input_single_choice(list_check_input, name)
        form.add_divider();
        form.add_caption('Settings for the axis processing')
        form.add_text_input({
            label: 'Threshold minimum',
            id: 'threshold_min',
            unit: 'px'
        });
        form.add_text_input({
            label: 'Threshold maximum',
            id: 'threshold_max',
            unit: 'px'
        });


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
            
            // Find contours
            let src_original = this.cv_pictures[i];
            let src = src_original.clone();
            let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
            dst.name = 'Contours' + this.cv_pictures[i].name;
            cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);

            // Threshold the picture
            let threshold_min_value = 55;
            let threshold_max_value = 255;
            cv.threshold(src, src, threshold_min_value, threshold_max_value, cv.THRESH_BINARY);
            src.name = 'Threshold' + this.cv_pictures[i].name;
            this.add_cv_output_block('Threshold', 'Threshold between ' + threshold_min_value + ' and ' + threshold_max_value + ' (range 0:255) ', src);

            // Find contours
            let contours = new cv.MatVector();
            let hierarchy = new cv.Mat();
            cv.findContours(src, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
            for (let i = 0; i < contours.size(); ++i) {
                let color = new cv.Scalar(Math.round(Math.random() * 255), Math.round(Math.random() * 255),
                                          Math.round(Math.random() * 255));
                cv.drawContours(dst, contours, i, color, 1, cv.LINE_8, hierarchy, 100);
            }
            this.add_cv_output_block('Contours', "Number of contours : " + contours.size(), dst);
            // Sort contours by area
            const contours_area = [];
            for (let j = 0; j < contours.size(); j++) {
                const contour = contours.get(j);
                const area = cv.contourArea(contour, false);
                contours_area.push([contour, area]);
            }
            contours_area.sort((a, b) => b[1] - a[1]);
            // For the 2 biggest contours, fit a line to the contour points using least squares
            let text = '';
            const biggest_contours = [];
            for (let j = 0; j < 2; j++) {
                const contour = contours_area[j][0];
                const epsilon = 0.1 * cv.arcLength(contour, true);
                const approx = new cv.Mat();
                cv.approxPolyDP(contour, approx, epsilon, true);
                const points = [];
                for (let k = 0; k < approx.rows; k++) {
                    points.push([approx.data32S[k * 2], approx.data32S[k * 2 + 1]]);
                }
                const line = new cv.Mat();
                cv.fitLine(approx, line, cv.DIST_L2, 0, 0.01, 0.01);
                const vx = line.data32F[0];
                const vy = line.data32F[1];
                const x = line.data32F[2];
                const y = line.data32F[3];
                const lefty = Math.round((-x * vy / vx) + y);
                const righty = Math.round(((src.cols - x) * vy / vx) + y);
                biggest_contours.push([points, [lefty, 0], [righty, src.cols]]);
                text += 'Equation of the line : y = ' + vy / vx + ' x + ' + lefty + '\n';
            }
            console.log(biggest_contours);
            // Compute the angle between the 2 lines
            const angle = Math.atan2(biggest_contours[0][0][0][1] - biggest_contours[1][0][0][1], biggest_contours[0][0][0][0] - biggest_contours[1][0][0][0]) * 180 / Math.PI;
            console.log(angle);
            text += 'Angle between the 2 lines : ' + angle + '°' + '\n';
            // Draw the lines
            for (let j = 0; j < biggest_contours.length; j++) {
                const points = biggest_contours[j][0];
                const lefty = biggest_contours[j][1];
                const righty = biggest_contours[j][2];
                cv.line(dst, new cv.Point(points[0][0], points[0][1]), new cv.Point(points[1][0], points[1][1]), [255, 255, 255, 255], 2, cv.LINE_AA, 0);
            }
            dst.name = 'Lines' + this.cv_pictures[i].name;
            this.add_cv_output_block('Lines', text, dst);

            // Draw the lines on the original picture
            const src2 = src_original;
            src2.name = 'Lines on original picture' + this.cv_pictures[i].name;
            for (let j = 0; j < biggest_contours.length; j++) {
                const points = biggest_contours[j][0];
                const lefty = biggest_contours[j][1];
                const righty = biggest_contours[j][2];
                cv.line(src2, new cv.Point(points[0][0], points[0][1]), new cv.Point(points[1][0], points[1][1]), [255, 255, 255, 255], 2, cv.LINE_AA, 0);
            }
            this.add_cv_output_block('Lines on original picture', text, src2);
            
            src.delete(); dst.delete(); contours.delete(); hierarchy.delete();
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
        let final_text = text + '\n' + picture_name + ' (' + picture_size + ')';
        const replacedText = final_text.replace(/\n/g, "<br>");
        textElement.innerHTML = replacedText
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
        let final_text = text + '\n' + picture_name + ' (' + picture_size + ')';
        const replacedText = final_text.replace(/\n/g, "<br>");
        textElement.innerHTML = replacedText
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