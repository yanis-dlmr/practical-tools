import { Caption } from '/src/components/caption/index.js';
import { Importer } from '/src/components/importer/index.js';

class Form {

    constructor() {
        this.form = document.createElement('form');
        this.form.classList.add('custom-form');    
        this.form.classList.add('needs-validation');
        this.form.id = 'form';
        //this.form.setAttribute('novalidate', '');
    }

    add_check_input(structure) {
        let div = document.createElement('div');
        div.classList.add('form-check');

        var input = document.createElement("input");
        input.className = "form-check-input";
        input.type = "checkbox";
        input.id = structure.id;
        input.value = structure.value;
        if ("checked" in structure && structure.checked == "true") {
            input.checked = true;
        }

        var label = document.createElement("label");
        label.className = "form-check-label";
        label.htmlFor = structure.id;
        label.textContent = structure.label;
        
        div.appendChild(input);
        div.appendChild(label);
        this.form.appendChild(div);
    }


    add_multiple_check_input_single_choice(list_check_input, name) { // list_check_input = [check_input1, check_input2, ...] with check_input = {id: id, label: label, value: value}
        let caption = new Caption(name);
        this.form.appendChild(caption.render());
        
        let divider = document.createElement('hr');
        divider.classList.add('custom-divider');
        this.form.appendChild(divider);

        
        list_check_input.forEach(check_input => {
            let div = document.createElement('div');
            div.classList.add('form-check');

            var input = document.createElement("input");
            input.className = "form-check-input";
            input.type = "checkbox";
            input.id = check_input.id;
            input.value = check_input.value;
            if ("checked" in check_input && check_input.checked == "true") {
                input.checked = true;
            }

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
                    // uncheck the others
                    list_check_input.forEach(check_input => {
                        if (check_input.id != this.id) {
                            document.getElementById(check_input.id).checked = false;
                            if ('son_id_to_disable' in check_input) {
                                // put all the sons as disabled and not required
                                check_input.son_id_to_disable.forEach(son => {
                                    document.getElementById(son).disabled = true;
                                    // if checkbox then uncheck
                                    if (document.getElementById(son).type == 'checkbox') {
                                        document.getElementById(son).checked = false;
                                    }
                                    //document.getElementById(son).required = false;
                                });
                            }
                        }
                    });
                    if ('son_id_to_able' in check_input) {
                        // put all the sons as not disabled and required
                        check_input.son_id_to_able.forEach(son => {
                            document.getElementById(son).disabled = false;
                            //document.getElementById(son).required = true;
                        });
                    }
                } else {
                    // can't uncheck all the checkboxes
                    this.checked = true;
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
        text.value = structure["value"];
        if ("disabled" in structure && structure["disabled"] == true) {
            text.disabled = true;
        }
    
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

    add_caption(title) {
        let caption = new Caption(title);
        this.form.appendChild(caption.render());
        
        let divider = document.createElement('hr');
        divider.classList.add('custom-divider');
        this.form.appendChild(divider);
    }

    get_validation_button() {
        let button = document.createElement('button');
        button.classList.add('btn');
        button.classList.add('btn-primary');
        button.classList.add('btn-lg');
        button.classList.add('btn-block');
        button.setAttribute('type', 'submit');
        button.textContent = 'Compute';
        // check for valid or invalid input
        button.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            var form = document.getElementById('form');
            if (form.checkValidity() === false) {
                form.classList.add('was-validated');
            }
        }, false);
        return button;
    }

    get_importer_element (importer_id) {
        const importer = new Importer(importer_id, 'multiple pictures');
        const formGroup = document.createElement('div');
        formGroup.classList.add('form-group');
        formGroup.appendChild(importer.render());
        var validFeedback = document.createElement('div');
        validFeedback.classList.add('valid-feedback');
        validFeedback.textContent = 'Looks good!';
        formGroup.appendChild(validFeedback);
        var invalidFeedback = document.createElement('div');
        invalidFeedback.classList.add('invalid-feedback');
        invalidFeedback.textContent = 'Please import at least one picture.';
        formGroup.appendChild(invalidFeedback);
        return formGroup;
    }

    add_switch_input(structure) {
        let div = document.createElement('div');
        div.classList.add('form-check');
        div.classList.add('form-switch');

        var input = document.createElement("input");
        input.className = "form-check-input";
        input.type = "checkbox";
        input.id = structure.id;
        input.value = structure.value;
        if ("checked" in structure && structure.checked == "true") {
            input.checked = true;
        }
        if ("required" in structure && structure.required == "true") {
            input.required = true;
        }
        
        var validFeedback = document.createElement('div');
        validFeedback.classList.add('valid-feedback');
        validFeedback.textContent = 'Looks good!';
        input.appendChild(validFeedback);
    
        var invalidFeedback = document.createElement('div');
        invalidFeedback.classList.add('invalid-feedback');
        invalidFeedback.textContent = 'Please provide a valid value.';
        input.appendChild(invalidFeedback);

        var label = document.createElement("label");
        label.className = "form-check-label";
        label.htmlFor = structure.id;
        label.textContent = structure.label;
        
        div.appendChild(input);
        div.appendChild(label);
        this.form.appendChild(div);
        document.getElementById(structure.id).addEventListener('change', function() {
            if (this.checked) {
                if ('friends' in structure) {
                    // uncheck all the friends and put them at not required
                    structure.friends.forEach(friend => {
                        document.getElementById(friend).checked = false;
                        document.getElementById(friend).dispatchEvent(new Event('change'));
                        document.getElementById(friend).required = false;
                    });
                }
                if ('son_id_to_able' in structure) {
                    // put all the sons as not disabled and required
                    structure.son_id_to_able.forEach(son => {
                        document.getElementById(son).disabled = false;
                        //document.getElementById(son).required = true;
                    });
                }
            } else {
                if ('friends' in structure) {
                    // put them at required
                    structure.friends.forEach(friend => {
                        document.getElementById(friend).required = true;
                    });
                }
                if ('son_id_to_disable' in structure) {
                    // put all the sons as disabled and not required
                    structure.son_id_to_disable.forEach(son => {
                        document.getElementById(son).disabled = true;
                        //document.getElementById(son).required = false;
                        // if checkbox then uncheck
                        if (document.getElementById(son).type == 'checkbox') {
                            document.getElementById(son).checked = false;
                        }
                    });
                }
            }
        });
    }

    add_multiple_switch_input(structures) { // Same as add_switch_input but we can only check one box
        for (let i = 0; i < structures.length; i++) {
            let div = document.createElement('div');
            div.classList.add('form-check');
            div.classList.add('form-switch');

            var input = document.createElement("input");
            input.className = "form-check-input";
            input.type = "checkbox";
            input.id = structures[i].id;
            input.value = structures[i].value;
            if ("checked" in structures[i] && structures[i].checked == "true") {
                input.checked = true;
            }
            input.required = false;

            var label = document.createElement("label");
            label.className = "form-check-label";
            label.htmlFor = structures[i].id;
            label.textContent = structures[i].label;
            
            div.appendChild(input);
            div.appendChild(label);
            this.form.appendChild(div);
            document.getElementById(structures[i].id).addEventListener('change', function() {
                if (this.checked) {
                    if ('son_id_to_able' in structures[i]) {
                        // put all the sons as not disabled and required
                        structures[i].son_id_to_able.forEach(son => {
                            document.getElementById(son).disabled = false;
                            document.getElementById(son).required = true;
                        });
                    }
                    // uncheck all the other boxes
                    for (let j = 0; j < structures.length; j++) {
                        if (j != i) {
                            document.getElementById(structures[j].id).checked = false;
                        }
                    }
                } else {
                    // can't uncheck all the checkboxes
                    this.checked = true;
                    if ('son_id_to_disable' in structures[i]) {
                        // put all the sons as disabled and not required
                        structures[i].son_id_to_disable.forEach(son => {
                            document.getElementById(son).disabled = true;
                            document.getElementById(son).required = false;
                            // if checkbox then uncheck
                            if (document.getElementById(son).type == 'checkbox') {
                                document.getElementById(son).checked = false;
                            }
                        });
                    }
                }
            });
        }
    }


    add_select_input(structure) {
        var input = document.createElement(`div`);
        input.setAttribute("class", "input-group mb-3");
    
        var label = document.createElement(`label`);
        label.setAttribute("class", "input-group-text col-4");
        label.setAttribute("for", structure.label);
        label.textContent = structure.label;
    
        var select = document.createElement(`select`);
        select.setAttribute("class", "form-select");
        select.setAttribute("id", structure.id);
        select.classList.add('form-select');
        select.setAttribute('required', true);
    
        var option0 = document.createElement(`option`);
        option0.setAttribute("selected", "true");
        option0.setAttribute('value', '');structure.label
        option0.textContent = "Choose...";
        select.appendChild(option0);
    
        Object.keys(structure.options).forEach(option_value => {
            var name = structure.options[option_value];
            var option = document.createElement(`option`);
            option.setAttribute("value", structure.options[option_value]);
            option.textContent = structure.options[option_value];
            select.appendChild(option);
        });
        
        input.appendChild(label);
        input.appendChild(select);
        this.form.appendChild(input);

        
        document.getElementById(structure.id).addEventListener('change', function() {
            if (this.value != '') {
                if ('friends' in structure) {
                    // uncheck all the friends and put them at not required
                    structure.friends.forEach(friend => {
                        document.getElementById(friend).checked = false;
                        document.getElementById(friend).dispatchEvent(new Event('change'));
                        document.getElementById(friend).required = false;
                    });
                }
                if ('son_id_to_able' in structure) {
                    // put all the sons as not disabled and required
                    structure.son_id_to_able.forEach(son => {
                        document.getElementById(son).disabled = false;
                        //document.getElementById(son).required = true;
                    });
                }
            } else {
                if ('friends' in structure) {
                    // put them at required
                    structure.friends.forEach(friend => {
                        document.getElementById(friend).required = true;
                    });
                }
                if ('son_id_to_disable' in structure) {
                    // put all the sons as disabled and not required
                    structure.son_id_to_disable.forEach(son => {
                        document.getElementById(son).disabled = true;
                        //document.getElementById(son).required = false;
                        // if checkbox then uncheck
                        if (document.getElementById(son).type == 'checkbox') {
                            document.getElementById(son).checked = false;
                        }
                    });
                }
            }
        });
    }

    get_data() {
        var data = {};
        for (let i = 0; i < this.form.elements.length; i++) {
            if (this.form.elements[i].type == 'checkbox') {
                data[this.form.elements[i].id] = this.form.elements[i].checked;
            } else {
                data[this.form.elements[i].id] = this.form.elements[i].value;
            }
        }
        return data;
    }

    is_valid() {
        return this.form.checkValidity();
    }

    render() {
        return this.form;
    }
    
}

export { Form }