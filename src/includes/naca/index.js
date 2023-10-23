import { Card } from '/src/components/card/index.js';
import { Container } from '/src/components/container/index.js';
import { Caption } from '/src/components/caption/index.js';
import { Button } from '/src/components/button/index.js';
import { Select } from '/src/components/select/index.js';
import { Form } from '/src/components/form/index.js';
import { EmbededBlock } from '/src/components/embeded_block/index.js';
import { ChartJs } from '/src/components/chartjs/index.js';

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
    value: '0012',
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

