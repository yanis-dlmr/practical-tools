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

        
        list_check_input.forEach(check_input => {
            let div = document.createElement('div');
            div.classList.add('form-check');

            var input = document.createElement("input");
            input.className = "form-check-input";
            input.type = "checkbox";
            input.id = check_input.id;
            input.value = check_input.value;

            var label = document.createElement("label");
            label.className = "form-check-label";
            label.htmlFor = check_input.id;
            label.textContent = check_input.label;
            
            div.appendChild(input);
            div.appendChild(label);
            this.form.appendChild(div);
        });

        // if one checkbox is checked, uncheck the others that are in list_check_input
        list_check_input.forEach(check_input => {
            document.getElementById(check_input.id).addEventListener('change', function() {
                if (this.checked) {
                    list_check_input.forEach(check_input => {
                        if (check_input.id != this.id) {
                            document.getElementById(check_input.id).checked = false;
                        }
                    });
                }
            });
        });
    }

    render() {
        return this.form;
    }
    
}

export { Form }