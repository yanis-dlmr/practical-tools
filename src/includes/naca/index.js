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
        '5-digit',
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

            // Get form data
            const form_data = form.get_data();
            console.table(form_data);

            // Create NACA object
            const naca = new NACA(form_data.naca_types, form_data.digits, 1);
            const up_profile = naca.get_naca_top_profile();
            const x_values = up_profile[0];
            const y_values = [up_profile[1]];
            const line_names = ['Top NACA ' + form_data.digits + ' profile'];
            const bottom_profile = naca.get_naca_bottom_profile();
            y_values.push(bottom_profile[1]);
            line_names.push('Bottom NACA ' + form_data.digits + ' profile');

            // Chart box row containing all the charts
            const chart_box_row = document.createElement('div');
            chart_box_row.className = 'row';

            this.card_output.addComponent(chart_box_row);

            const title = 'NACA ' + form_data.digits;
            const chartjs = new ChartJs(title, x_values, y_values, line_names);
            const chartJsElement = chartjs.render();

            const chart_box = document.createElement('div');
            chart_box.appendChild(chartJsElement);
            chartJsElement.style.width = '100%';
            chartJsElement.width = '100%';
            chart_box_row.appendChild(chart_box);

            chart_box.classList.add('col-md-12');
            chart_box.style.padding = '1rem';
            chart_box.style.height = '450px';
        });
        
        // Output  
        this.card_output = new Card('Output');
        const cardElementOutput = this.card_output.render();

        const container_output = new Container('12', 'center');
        container_output.addComponent(cardElementOutput);
        const containerElementOutput = container_output.render();

        row.appendChild(containerElementOutput);
    }
}

