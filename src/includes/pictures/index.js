import { Card } from '/src/components/card/index.js';
import { Container } from '/src/components/container/index.js';
import { Caption } from '/src/components/caption/index.js';
import { Button } from '/src/components/button/index.js';
import { Select } from '/src/components/select/index.js';
import { Form } from '/src/components/form/index.js';
import { EmbededBlock } from '/src/components/embeded_block/index.js';

const main_check_input = [
    {id: 'display_only', label: 'Display Only', value: 'display_only', checked: 'false'},
    {id: 'average_color', label: 'Average Color', value: 'average_color', checked: 'false'},
    {id: 'average_pictures', label: 'Average Pictures', value: 'average_pictures', checked: 'false'},
    {id: 'determine_axis', label: 'Determine Axis', value: 'determine_axis', checked: 'false', son_id_to_able: ['threshold_min', 'threshold_max', 'nb_axis', 'get_light_intensity'], son_id_to_disable: ['threshold_min', 'threshold_max', 'nb_axis', 'get_light_intensity', 'max_min_derivative_condition', 'threshold_condition', 'threshold_value_condition', 'smooth_light_intensity', 'smooth_factor']},
];


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
        
        // Create the alert 
        var alert = document.createElement(`div`);
        alert.classList.add(`alert`);
        alert.classList.add(`alert-primary`);
        alert.classList.add(`alert-dismissible`);
        alert.classList.add(`fade`);
        alert.classList.add(`show`);
        alert.classList.add('m-3');
        alert.style.boxShadow = '0 0.5rem 1rem rgba(0,0,0,0.15)';
        alert.setAttribute(`role`, `alert`);
        alert.innerHTML = `A Python equivalent script is also available on <a class="custom-link" href="https://github.com/yanis-dlmr/picture-treatment" target="_blank">GitHub</a>. This tool is still in development, some results may not be accurate.`;
        
        var closeButton = document.createElement(`button`);
        closeButton.classList.add(`btn-close`);
        closeButton.setAttribute(`type`, `button`);
        closeButton.setAttribute(`data-bs-dismiss`, `alert`);
        closeButton.setAttribute(`aria-label`, `Close`);
        alert.appendChild(closeButton);

        const container_alert = new Container('12', 'center');
        container_alert.addComponent(alert);
        const containerElementAlert = container_alert.render();

        row.appendChild(containerElementAlert);

        // Parameters
        const card_parameters = new Card('Parameters');
        const cardElementParameters = card_parameters.render();

        const container_parameters = new Container('5', 'left');
        container_parameters.addComponent(cardElementParameters);
        const containerElementParameters = container_parameters.render();

        row.appendChild(containerElementParameters);

        const form = new Form();
        const formElement = form.render();
        card_parameters.addComponent(formElement);
        let name = 'Select the treatment needed';
        form.add_multiple_check_input_single_choice(main_check_input, name)

        //form.add_divider();
        form.add_caption('Settings for the axis processing')
        form.add_text_input({
            label: 'Threshold minimum',
            id: 'threshold_min',
            unit: '0 - 255',
            value: '55'
        });
        form.add_text_input({
            label: 'Threshold maximum',
            id: 'threshold_max',
            unit: '0 - 255',
            value: '255'
        });
        form.add_text_input({
            label: 'Nb. of Axis',
            id: 'nb_axis',
            unit: '2 - 10',
            value: '2'
        });
        form.add_switch_input({
            label: 'Process light intensity along the axis to determine the length of the colored axis',
            id: 'get_light_intensity',
            value: 'false',
            checked: 'false',
            son_id_to_able: ['max_min_derivative_condition', 'threshold_condition', 'smooth_light_intensity'],
            son_id_to_disable: ['max_min_derivative_condition', 'threshold_condition', 'threshold_value_condition', 'smooth_factor', 'smooth_light_intensity']
        });

        form.add_switch_input({
            label: 'Max/Min derivative conditions',
            id: 'max_min_derivative_condition',
            value: 'false',
            checked: 'false',
            required: 'true',
            friends: ['threshold_condition']
        });

        form.add_switch_input({
            label: 'Threshold',
            id: 'threshold_condition',
            value: 'false',
            checked: 'false',
            required: 'true',
            son_id_to_able: ['threshold_value_condition'],
            son_id_to_disable: ['threshold_value_condition'],
            friends: ['max_min_derivative_condition']
        });
        form.add_text_input({
            label: 'Threshold value',
            id: 'threshold_value_condition',
            unit: '0 - 255',
            value: '55'
        })



        form.add_switch_input({
            label: 'Smooth the light intensity',
            id: 'smooth_light_intensity',
            value: 'false',
            checked: 'false',
            required: 'false',
            son_id_to_able: ['smooth_factor'],
            son_id_to_disable: ['smooth_factor']
        })
        form.add_text_input({
            label: 'Smooth factor',
            id: 'smooth_factor',
            unit: '1 - 30',
            value: '5'
        })

        
        // Manually check the first one in order to trigger the event change
        const inputElement = document.getElementById('display_only');
        inputElement.checked = true;
        // Send the event change
        inputElement.dispatchEvent(new Event('change'));


        // Data import
        const card = new Card('Data importation');
        const cardElement = card.render();

        const container = new Container('7', 'right');
        container.addComponent(cardElement);
        const containerElement = container.render();

        row.appendChild(containerElement);

        const caption = new Caption('Import your pictures (.BMP, .jpg, .jpeg, .png allowed)');
        const captionElement = caption.render();
        card.addComponent(captionElement);

        let divider = document.createElement('hr');
        divider.classList.add('custom-divider');
        card.addComponent(divider);

        const importer = form.get_importer_element('importer_id');
        card.addComponent(importer);

        const validation_button = form.get_validation_button();
        card.addComponent(validation_button);

        validation_button.addEventListener('click', async () => {
            const importerElement = document.getElementById('importer_id');
            const files = importerElement.files;
            // if no file is selected, return
            if (files.length == 0) {
                return;
            }

            // If form is not valid, return
            if (!form.is_valid()) {
                return;
            }

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

            const check_input_id_checked = this.get_main_check_input_id_checked();

            if (check_input_id_checked == 'display_only') {
                this.display_pictures();
            } else if (check_input_id_checked == 'average_color') {
                this.compute_average_color();
            } else if (check_input_id_checked == 'average_pictures') {
                this.compute_average_picture();
            } else if (check_input_id_checked == 'determine_axis') {
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

        const container_output = new Container('12', 'center');
        container_output.addComponent(cardElementOutput);
        const containerElementOutput = container_output.render();

        row.appendChild(containerElementOutput);

        const canvasOutput = document.createElement('canvas');
        canvasOutput.id = 'canvasOutputBlock';
        this.card_output.addComponent(canvasOutput);
    }

    get_main_check_input_id_checked = () => { // Get the id of checked main check input
        for (let i = 0; i < main_check_input.length; i++) {
            if (document.getElementById(main_check_input[i].id).checked) {
                return main_check_input[i].id;
            }
        }
    }


    display_pictures = () => { // Display all the pictures in the output block with their original size
        for (let i = 0; i < this.pictures.length; i++) {
            this.add_output_block('This is your original picture', 'This is your original picture', this.pictures[i]);
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
        this.add_output_block('Average Color', 'This is the average color of your picture', this.average_picture);
    }

    compute_average_picture = () => { // Compute the average of all the pictures and display it in the output block, with the original size
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
            mat.height = canvas.height;
            mat.width = canvas.width;
            this.cv_pictures.push(mat);
        }

        // sum all the pictures into one array 
        const sum = [];
        for (let i = 0; i < this.cv_pictures[0].data.length; i++) {
            sum.push(0);
        }
        for (let i = 0; i < this.cv_pictures.length; i++) {
            for (let j = 0; j < this.cv_pictures[i].data.length; j++) {
                sum[j] += this.cv_pictures[i].data[j];
            }
        }
        console.log('sum', sum)
        
        // compute the average
        const average = [];
        for (let i = 0; i < sum.length; i++) {
            average.push(sum[i] / this.cv_pictures.length);
        }
        console.log('average', average)

        // display the average picture
        const average_picture = document.createElement('canvas');
        average_picture.id = 'canvasOutputBlock';
        average_picture.width = this.pictures[0].width;
        average_picture.height = this.pictures[0].height;
        const ctx = average_picture.getContext('2d');
        ctx.clearRect(0, 0, average_picture.width, average_picture.height);
        const imageData = ctx.getImageData(0, 0, average_picture.width, average_picture.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i++) {
            data[i] = average[i];
        }
        ctx.putImageData(imageData, 0, 0);
        this.add_output_block('Average Picture', 'This is the average picture of your pictures', average_picture);

        // free the memory
        for (let i = 0; i < this.cv_pictures.length; i++) {
            this.cv_pictures[i].delete();
        }

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
            mat.height = canvas.height;
            mat.width = canvas.width;
            this.cv_pictures.push(mat);
        }
        this.add_cv_output_block('Imported picture', '', this.cv_pictures[0])

        // process the pictures
        console.log('process_pictures');
        for (let i = 0; i < this.cv_pictures.length; i++) {
            console.log('process_pictures : ', i);
            
            // Find contours
            let src_original = this.cv_pictures[i];
            let src_copy = src_original.clone();
            let src = src_original.clone();
            let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
            dst.name = 'Contours' + this.cv_pictures[i].name;
            cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);

            // Threshold the picture
            let threshold_min_value = parseInt(document.getElementById('threshold_min').value);
            let threshold_max_value = parseInt(document.getElementById('threshold_max').value);
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
            if (contours.size() > 500) {
                this.add_output_block_without_picture('Error', 'Too many contours, please select a smaller range of threshold');
                return;
            }
            // Sort contours by area
            const contours_area = [];
            for (let j = 0; j < contours.size(); j++) {
                const contour = contours.get(j);
                const area = cv.contourArea(contour, false);
                contours_area.push([contour, area]);
            }
            contours_area.sort((a, b) => b[1] - a[1]);
            // For the n biggest contours, fit a line to the contour points using least squares
            let text = '';
            const biggest_contours = [];
            const all_angles = [];
            var n_bigger_contours = parseInt(document.getElementById('nb_axis').value);
            for (let j = 0; j < n_bigger_contours; j++) {
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
                const a = vy / vx;
                const b = lefty;
                biggest_contours.push([points, [lefty, 0], [righty, src.cols], [a, b]]);
                // Get angles of all lines with the x axis
                const angle = Math.atan(vy / vx) * 180 / Math.PI;
                all_angles.push(angle);
                
                text += 'Equation of the line : y' + (j+1) + ' = ' + vy / vx + ' x + ' + lefty + '° with an angle of ' + angle + '° with the x axis\n';
            }

            // Compare the angles between each line, 1 with 2, 1 with 3, 2 with 3, etc.
            for (let j = 0; j < biggest_contours.length; j++) {
                for (let k = j + 1; k < biggest_contours.length; k++) {
                    const angle = Math.abs(all_angles[j] - all_angles[k]);
                    text += 'Angle between line ' + (j+1) + ' and ' + (k+1) + ' : ' + angle + '°\n';
                }
            }

            // Draw the lines
            for (let j = 0; j < biggest_contours.length; j++) {
                const points = biggest_contours[j][0];
                //const lefty = biggest_contours[j][1];
                //const righty = biggest_contours[j][2];
                cv.line(dst, new cv.Point(points[0][0], points[0][1]), new cv.Point(points[1][0], points[1][1]), [255, 255, 255, 255], 2, cv.LINE_AA, 0);
            }
            dst.name = 'Lines' + this.cv_pictures[i].name;
            this.add_cv_output_block('Lines', text, dst);

            // Draw the lines on the original picture
            const src2 = src_copy;
            src2.name = 'Lines on original picture' + this.cv_pictures[i].name;
            for (let j = 0; j < biggest_contours.length; j++) {
                //const points = biggest_contours[j][0];
                const lefty = biggest_contours[j][1];
                const righty = biggest_contours[j][2];
                cv.line(src2, new cv.Point(lefty[1], lefty[0]), new cv.Point(righty[1], righty[0]), [255, 255, 255, 255], 2, cv.LINE_AA, 0);
            }
            this.add_cv_output_block('Lines on original picture', text, src2);

            // Get light intensity along the lines accross all the pictures
            const light_intensity_bool = document.getElementById('get_light_intensity').checked;
            var light_intensity = [];
            if (light_intensity_bool) {
                console.log('biggest_contours.length', biggest_contours.length)
                console.log('this.cv_pictures[i].data', this.cv_pictures[i].data);
                for (let j = 0; j < biggest_contours.length; j++) {
                    // Equation of the line : y = a x + b
                    const equation = biggest_contours[j][3];
                    const a = equation[0];
                    const b = equation[1];
                    // Get the light intensity along the line
                    const light_intensity_line = [];
                    console.log('this.cv_pictures[i].width', this.cv_pictures[i].width);
                    for (let x = 0; x < this.cv_pictures[i].width; x++) {
                        const y = Math.round(a * x + b);
                        if (y < 0 || y >= this.cv_pictures[i].height) {
                            light_intensity_line.push(0);
                        } else {
                            // Get the average light intensity of the 3 channels and don't compute the alpha channel
                            const pixel_r = this.cv_pictures[i].data[(y * this.cv_pictures[i].width + x) * 4 + 0];
                            const pixel_g = this.cv_pictures[i].data[(y * this.cv_pictures[i].width + x) * 4 + 1];
                            const pixel_b = this.cv_pictures[i].data[(y * this.cv_pictures[i].width + x) * 4 + 2];
                            const pixel = Math.round((pixel_r + pixel_g + pixel_b) / 3);
                            light_intensity_line.push(pixel);
                        }
                    }
                    light_intensity.push(light_intensity_line);
                }
                this.add_output_title('Light intensity along the lines')
                text = '';
                for (let j = 0; j < light_intensity.length; j++) {
                    this.add_output_text('Light intensity along the line ' + (j+1) + ' : ');
                    this.add_output_array(light_intensity[j]);
                }

                // Make the light intensity smoother
                const smooth_light_intensity = [];
                const smooth_light_intensity_bool = document.getElementById('smooth_light_intensity').checked;
                if (smooth_light_intensity_bool) {
                    const smooth_factor = document.getElementById('smooth_factor').value;
                    for (let j = 0; j < light_intensity.length; j++) {
                        const smooth_light_intensity_line = [];
                        for (let k = 0; k < light_intensity[j].length; k++) {
                            let sum = 0;
                            let count = 0;
                            for (let i = - smooth_factor; i < smooth_factor; i++) {
                                if (k + i >= 0 && k + i < light_intensity[j].length) {
                                    sum += light_intensity[j][k + i];
                                    count++;
                                }
                            }
                            const average = sum / count;
                            smooth_light_intensity_line.push(average);
                        }
                        smooth_light_intensity.push(smooth_light_intensity_line);
                    }
                    this.add_output_title('Smooth light intensity along the lines')
                    text = '';
                    for (let j = 0; j < smooth_light_intensity.length; j++) {
                        this.add_output_text('Smooth light intensity along the line ' + (j+1) + ' : ');
                        this.add_output_array(smooth_light_intensity[j]);
                    }
                }
                console.log(light_intensity)
                // Replace the light intensity by the smooth light intensity
                if (smooth_light_intensity_bool) {
                    light_intensity = smooth_light_intensity;
                }
                console.log(light_intensity)

                // Derivative of the light intensity to determine the min and max
                const max_min_derivative_condition = document.getElementById('max_min_derivative_condition').checked;
                // Threshold of the light intensity to determine the min and max
                const threshold_condition = document.getElementById('threshold_condition').checked;

                // DERIVATIVE OF THE LIGHT INTENSITY
                const list_min_max = [];
                if (max_min_derivative_condition) {
                    const derivative = [];
                    for (let j = 0; j < light_intensity.length; j++) {
                        const derivative_line = [];
                        for (let k = 0; k < light_intensity[j].length - 1; k++) {
                            const derivative_value = light_intensity[j][k+1] - light_intensity[j][k];
                            derivative_line.push(derivative_value);
                        }
                        derivative.push(derivative_line);
                    }
                    this.add_output_title('Derivative of the light intensity')
                    text = '';
                    for (let j = 0; j < derivative.length; j++) {
                        this.add_output_text('Derivative of the light intensity along the line ' + (j+1) + ' : ');
                        this.add_output_array(derivative[j]);
                    }
                
                    // Get the min and max of the derivative
                    for (let j = 0; j < derivative.length; j++) {
                        // Equation of the line : y = a x + b
                        const equation = biggest_contours[j][3];
                        const a = equation[0];
                        const b = equation[1];
                        let min = [];
                        let max = [];
                        for (let x = 0; x < derivative[j].length; x++) {
                            if (derivative[j][x] < min[2] || min.length == 0) {
                                const y = Math.round(a * x + b);
                                min = [x, y, derivative[j][x]];
                            }
                            if (derivative[j][x] > max[2] || max.length == 0) {
                                const y = Math.round(a * x + b);
                                max = [x, y, derivative[j][x]];
                            }
                        }
                        list_min_max.push([min, max]);
                    }
                } else if (threshold_condition) { // threshold_value_condition VALUE AS THRESHOLD, 1st and last place where the light intensity is above the average
                    for (let j = 0; j < light_intensity.length; j++) {
                        const threshold_value_condition = document.getElementById('threshold_value_condition').value;
                        let min = [];
                        let max = [];
                        // Equation of the line : y = a x + b
                        const equation = biggest_contours[j][3];
                        const a = equation[0];
                        const b = equation[1];
                        for (let x = 0; x < light_intensity[j].length; x++) { // 1st the threshold_value_condition is reached
                            if (light_intensity[j][x] > threshold_value_condition && max.length == 0) {
                                const y = Math.round(a * x + b);
                                max = [x, y, light_intensity[j][x]];
                            }
                        }
                        for (let x = light_intensity[j].length - 1; x >= 0; x--) { // 2nd the threshold_value_condition is reached
                            if (light_intensity[j][x] > threshold_value_condition && min.length == 0) {
                                const y = Math.round(a * x + b);
                                min = [x, y, light_intensity[j][x]];
                            }
                        }
                        list_min_max.push([min, max]);
                    }
                }





                console.log('list_min_max', list_min_max);
                text = '';
                // Draw the min and max on the picture
                const src_copy_2 = src_original.clone();
                text = '';
                for (let j = 0; j < list_min_max.length; j++) {
                    const min = list_min_max[j][0];
                    const max = list_min_max[j][1];
                    text += 'The minimum is at the index (' + min[0] + ';' + min[1] + ') with the value ' + min[2] + '\n';
                    text += 'The maximum is at the index (' + max[0] + ';' + max[1] + ') with the value ' + max[2] + '\n';
                    cv.circle(src_copy_2, new cv.Point(min[0], min[1]), 5, new cv.Scalar(0, 0, 255, 255), 2);
                    cv.circle(src_copy_2, new cv.Point(max[0], max[1]), 5, new cv.Scalar(0, 255, 0, 255), 2);
                    // Compute the pixel length between the min and the max
                    const pixel_length = Math.sqrt(Math.pow(max[0] - min[0], 2) + Math.pow(max[1] - min[1], 2));
                    text += 'The pixel length between the min and the max is ' + pixel_length + ' px\n';
                }
                this.add_cv_output_block('Min and max of the derivative of the light intensity along the line ', text, src_copy_2);
                
            }

            // Display highlighted code
            hljs.addPlugin(new CopyButtonPlugin());
            hljs.highlightAll();
            
            src.delete(); dst.delete(); contours.delete(); src_copy.delete(); src_original.delete();
        }
    }

    remove_all_output_blocks = () => {
        this.card_output.removeAllComponents();
    }

    add_output_title = (title) => {
        const caption = new Caption(title);
        const captionElement = caption.render();
        this.card_output.addComponent(captionElement);
        
        let divider = document.createElement('hr');
        divider.classList.add('custom-divider');
        this.card_output.addComponent(divider);
    }

    add_output_text = (text) => {
        const textElement = document.createElement('p');
        const replacedText = text.replace(/\n/g, "<br>");
        textElement.innerHTML = replacedText
        this.card_output.addComponent(textElement);
    }

    //add_output_array = (array) => { // Display array between brackets and inside a code block
    //    const textElement = document.createElement('p');
    //    let final_text = '[';
    //    for (let i = 0; i < array.length; i++) {
    //        final_text += array[i];
    //        if (i < array.length - 1) {
    //            final_text += ', ';
    //        }
    //    }
    //    final_text += ']';
    //    const replacedText = final_text.replace(/\n/g, "<br>");
    //    textElement.innerHTML = replacedText
    //    this.card_output.addComponent(textElement);
    //}

    add_output_array = (array) => { // Display array between brackets and inside a code block
        const text = '[\n    ' + array + '\n]';
        const embededBlock = new EmbededBlock(text);
        const embededBlockElement = embededBlock.render();
        this.card_output.addComponent(embededBlockElement);
    }

    add_output_block = (title, text, picture) => {

        const picture_name = picture.name;
        const picture_size = picture.width + 'x' + picture.height;

        const caption = new Caption(title);
        const captionElement = caption.render();
        this.card_output.addComponent(captionElement);
        
        let divider = document.createElement('hr');
        divider.classList.add('custom-divider');
        this.card_output.addComponent(divider);

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

        const caption = new Caption(title);
        const captionElement = caption.render();
        this.card_output.addComponent(captionElement);
        
        let divider = document.createElement('hr');
        divider.classList.add('custom-divider');
        this.card_output.addComponent(divider);

        const textElement = document.createElement('p');
        let final_text = text;
        const replacedText = final_text.replace(/\n/g, "<br>");
        textElement.innerHTML = replacedText
        this.card_output.addComponent(textElement);

        const canvas = document.createElement('canvas');
        canvas.id = 'canvasOutputBlock' + title;
        canvas.width = picture.width;
        canvas.height = picture.height;
        this.card_output.addComponent(canvas);

        // display image using cv
        const canvasOutput = document.getElementById('canvasOutputBlock' + title);
        const ctx = canvasOutput.getContext('2d');
        cv.imshow('canvasOutputBlock' + title, picture);
    }

    add_output_block_without_picture = (title, text) => {

        const caption = new Caption(title);
        const captionElement = caption.render();
        this.card_output.addComponent(captionElement);
        
        let divider = document.createElement('hr');
        divider.classList.add('custom-divider');
        this.card_output.addComponent(divider);

        const textElement = document.createElement('p');
        let final_text = text;
        const replacedText = final_text.replace(/\n/g, "<br>");
        textElement.innerHTML = replacedText
        this.card_output.addComponent(textElement);
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