import { Caption } from '/src/components/caption/index.js';

class Form {

    constructor() {
        this.form = document.createElement('form');
        this.form.classList.add('custom-form');    
        this.form.classList.add('needs-validation');
        //this.form.setAttribute('novalidate', '');
    }

    add_multiple_check_input_single_choice(list_check_input, name) { // list_check_input = [check_input1, check_input2, ...] with check_input = {id: id, label: label, value: value}
        let caption = new Caption(name);
        this.form.appendChild(caption.render());
        
        let div = document.createElement('div');
        div.classList.add('custom-form-check');
        list_check_input.forEach(check_input => {
            let input = document.createElement('input');
            input.classList.add('custom-form-check-input');
            input.type = "checkbox";
            input.id = check_input.id;
            input.value = check_input.value;
            let label = document.createElement('label');
            label.classList.add('custom-form-check-label');
            label.for = check_input.id;
            label.textContent = check_input.label;
            div.appendChild(input);
            div.appendChild(label);
        });
        this.form.appendChild(div);
    }

    render() {
        return this.form;
    }
    
}

export { Form }