import { Card } from '/src/components/card/index.js';
import { Container } from '/src/components/container/index.js';
import { Caption } from '/src/components/caption/index.js';
import { Button } from '/src/components/button/index.js';
import { Select } from '/src/components/select/index.js';
import { Form } from '/src/components/form/index.js';
import { EmbededBlock } from '/src/components/embeded_block/index.js';
import { ChartJs } from '/src/components/chartjs/index.js';
import { NACA } from '/src/includes/naca/naca.js';

const naca_types = {
    label: 'Profile shape',
    id: 'naca_types',
    options: [
        '4-digit',
        //'5-digit',
    ],
    son_id_to_able: ['digits'],
    son_id_to_disable: ['digits']
}

const naca_digits = {
    label: 'Digits',
    id: 'digits',
    unit: '',
    value: '',
    disabled: true,
}

document.addEventListener('DOMContentLoaded', function() {
    new NacaManager();
});

class NacaManager {

    constructor() {

        this.create_body();

    }

    create_body() {
        
        const row = document.createElement('div');
        row.classList.add('row', 'custom-row');
        document.body.appendChild(row);

        // NACA settings
        const card = new Card('NACA Parameters');
        const cardElement = card.render();

        const container = new Container('12', 'center');
        container.addComponent(cardElement);
        const containerElement = container.render();

        row.appendChild(containerElement);

        const form = new Form();
        const formElement = form.render();
        card.addComponent(formElement);
        
        form.add_caption('NACA Profile');

        form.add_select_input(naca_types)
        form.add_text_input(naca_digits);
        
        const validation_button = form.get_validation_button();
        card.addComponent(validation_button);

        validation_button.addEventListener('click', async () => {
            // If form is not valid, return
            if (!form.is_valid()) {
                return;
            }
            
            this.card_output.removeAllComponents();

            // Get form data
            const form_data = form.get_data();
            console.table(form_data);

            // Create NACA object
            const naca = new NACA(form_data.naca_types, form_data.digits, 1);
            const x = naca.get_x();
            const yc = naca.get_yc();
            const yt = naca.get_yt();
            
            const x_top_profile = naca.get_x_top_profile();
            const y_top_profile = naca.get_y_top_profile();
            const x_bottom_profile = naca.get_x_bottom_profile();
            const y_bottom_profile = naca.get_y_bottom_profile();

            var x_range = [];
            for (let i = 0; i < 1; i += 0.01) {
                x_range.push(Math.round(i * 100) / 100);
            }
            
            const x_label = 'x (m)';
            const y_label = 'z (m)';

            const x_values = [x, x, x_top_profile, x_bottom_profile];
            const x_labels = x_range;
            const y_values = [yc, yt, y_bottom_profile, y_top_profile];
            const line_names = ['Camber line', 'Thickness', 'Lower surface', 'Upper surface'];

            this.add_output_title('Graphical representation of the profile depending on x');
            // Chart box row containing all the charts
            const chart_box_row = document.createElement('div');
            chart_box_row.className = 'row';

            this.card_output.addComponent(chart_box_row);

            const title = 'NACA ' + form_data.digits;
            const chartjs = new ChartJs(title, x_labels, x_values, y_values, line_names, x_label, y_label);
            const chartJsElement = chartjs.render();

            const chart_box = document.createElement('div');
            chart_box.appendChild(chartJsElement);
            chartJsElement.style.width = '100%';
            chartJsElement.width = '100%';
            chart_box_row.appendChild(chart_box);

            chart_box.classList.add('col-md-12');
            chart_box.style.padding = '1rem';
            chart_box.style.height = '450px';


            ////////////////
            this.add_output_title('Different data of the profile');
            for(let i = 0; i < line_names.length; i++) {
                this.add_output_text(line_names[i] + ' x');
                this.add_output_array(x_values[i]);
                this.add_output_text(line_names[i] + ' y');
                this.add_output_array(y_values[i]);
            }

            ////////////////
            this.add_output_title('Graphical representation of the profile depending on theta');
            const theta = naca.get_theta_rounded();
            const yc_theta = naca.get_yc_theta();

            var angle_range = [];
            for (let i = 0; i < 180; i+=0.01) {
                angle_range.push(Math.round(i * 100) / 100);
            }

            const x_theta = [theta];
            const x_labels_2 = angle_range;
            const y_theta = [yc_theta];
            const line_names_theta = ['Camber line'];

            const x_label_2 = 'theta (°)';
            const y_label_2 = 'radius (m)';

            // Chart box row containing all the charts
            const chart_box_row_2 = document.createElement('div');
            chart_box_row_2.className = 'row';

            this.card_output.addComponent(chart_box_row_2);

            const title_2 = 'NACA ' + form_data.digits;
            const chartjs_2 = new ChartJs(title_2, x_labels_2, x_theta, y_theta, line_names_theta, x_label_2, y_label_2);
            const chartJsElement_2 = chartjs_2.render();

            const chart_box_2 = document.createElement('div');
            chart_box_2.appendChild(chartJsElement_2);
            chartJsElement_2.style.width = '100%';
            chartJsElement_2.width = '100%';
            chart_box_row_2.appendChild(chart_box_2);

            chart_box_2.classList.add('col-md-12');
            chart_box_2.style.padding = '1rem';
            chart_box_2.style.height = '450px';

            
            //////////////// Add end 
            this.add_output_title('End of the processing !');

            // Display highlighted code
            hljs.addPlugin(new CopyButtonPlugin());
            hljs.highlightAll();

            // Rerender MathJax-script
            MathJax.typeset();
        });
        
        // Output  
        this.card_output = new Card('Output');
        const cardElementOutput = this.card_output.render();

        const container_output = new Container('12', 'center');
        container_output.addComponent(cardElementOutput);
        const containerElementOutput = container_output.render();

        row.appendChild(containerElementOutput);
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

    add_output_array = (array) => { // Display array between brackets and inside a code block
        const text = '[\n    ' + array + '\n]';
        const embededBlock = new EmbededBlock(text);
        const embededBlockElement = embededBlock.render();
        this.card_output.addComponent(embededBlockElement);
    }

}

