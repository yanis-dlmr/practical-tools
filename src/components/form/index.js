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

    add_divider() {
        let divider = document.createElement('hr');
        divider.classList.add('my-4');
        this.form.appendChild(divider);
    }

    add_text_input(structure) {

        var input = document.createElement(`div`);
        input.setAttribute("class", "input-group mb-3");
    
        var span = document.createElement(`span`);
        span.setAttribute("class", "input-group-text col-4");
        span.textContent = structure["label"];
    
        var text = document.createElement('input');
        text.setAttribute('type', 'text');
        text.setAttribute('class', 'form-control');
        text.id = structure["id"];
        text.classList.add('form-control');
        text.required = true;
    
        input.appendChild(span);
        input.appendChild(text);
    
        if (("unit" in structure) && (structure["unit"] != "")) {
            var unit = document.createElement(`span`);
            unit.setAttribute("class", "input-group-text col-2");
            unit.textContent = structure["unit"];
            input.appendChild(unit);
        };
    
        
        var validFeedback = document.createElement('div');
        validFeedback.classList.add('valid-feedback');
        validFeedback.textContent = 'Looks good!';
        input.appendChild(validFeedback);
    
        var invalidFeedback = document.createElement('div');
        invalidFeedback.classList.add('invalid-feedback');
        invalidFeedback.textContent = 'Please provide a valid value.';
        input.appendChild(invalidFeedback);
    
        this.form.appendChild(input);
    
    }


    render() {
        return this.form;
    }
    
}

export { Form }