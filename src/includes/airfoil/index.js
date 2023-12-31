import { Card } from '/src/components/card/index.js';
import { Container } from '/src/components/container/index.js';
import { Caption } from '/src/components/caption/index.js';
import { Button } from '/src/components/button/index.js';
import { Select } from '/src/components/select/index.js';
import { Form } from '/src/components/form/index.js';
import { EmbededBlock } from '/src/components/embeded_block/index.js';
import { ChartJs } from '/src/components/chartjs/index.js';
import { NACA } from '/src/includes/airfoil/naca.js';
import { Table } from '/src/components/table/index.js';

const naca_types = {
    label: 'NACA type',
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
        alert.innerHTML = `For more informations please take a look a the documentation section related to the <a class="custom-link" href="https://practical-tools.yanis-dlmr.fr/documentation/airfoil/" target="_blank">Airfoil Tool</a>. This tool is still in development, some results may not be accurate.`;
        
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

        // NACA settings
        const card = new Card('Airfoil Parameters');
        const cardElement = card.render();

        const container = new Container('12', 'center');
        container.addComponent(cardElement);
        const containerElement = container.render();

        row.appendChild(containerElement);

        const form = new Form();
        const formElement = form.render();
        card.addComponent(formElement);
        
        form.add_caption('Generate the airfoil geometry');

        form.add_select_input(naca_types)
        form.add_text_input(naca_digits);
        
        form.add_caption('Method used');
        form.add_switch_input({
            label: 'Thin profile',
            id: 'thin_profile',
            value: 'false',
            checked: 'false',
            required: 'true',
            friends: ['vortex_panel_method']
        });
        form.add_switch_input({
            label: 'Vortex Panel Method',
            id: 'vortex_panel_method',
            value: 'false',
            checked: 'false',
            required: 'true',
            friends: ['thin_profile'],
            son_id_to_able: ['angle'],
            son_id_to_disable: ['angle']
        });
        form.add_text_input({
            label: 'Angle of attack',
            id: 'angle',
            unit: '°',
            value: '',
            disabled: true,
        })
        
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
            let method
            if (form_data.thin_profile == true) {
                method = 'thin_profile';
            } else if (form_data.vortex_panel_method == true) {
                method = 'vortex_panel_method';
            }
            console.log(method)
            const angle = form_data.angle * Math.PI / 180;
            const naca = new NACA(form_data.naca_types, form_data.digits, 1, angle, method);
            
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
            
            // Plot all panels
            //const panels = naca.get_panels();
            //for (let i = 0; i < panels.length; i++) {
            //    const panel = panels[i];
            //    const x = [panel["X0"], panel["X1"]];
            //    const y = [panel["Y0"], panel["Y1"]];
            //    x_values.push(x);
            //    y_values.push(y);
            //    line_names.push('Panel ' + i);
            //}

            this.add_output_title('Graphical representation of the profile depending on x');
            // Chart box row containing all the charts
            const chart_box_row = document.createElement('div');
            chart_box_row.className = 'row';

            this.card_output.addComponent(chart_box_row);

            const title = 'NACA ' + form_data.digits;
            const chartjs = new ChartJs(title, x_labels, x_values, y_values, line_names, x_label, y_label, true);
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

            ////////////////// 
            //this.add_output_title('Graphical representation of the profile depending on theta');
            //const theta = naca.get_theta_rounded();
            //const yc_theta = naca.get_yc_theta();
            //const dyc_dx_theta = naca.get_dyc_dx_theta();
//
            //const theta_dyx = theta.slice(1, theta.length);
//
            //var angle_range = [];
            //for (let i = 0; i < 180; i+=0.01) {
            //    angle_range.push(Math.round(i * 100) / 100);
            //}
//
            //const x_theta = [theta, theta_dyx];
            //const x_labels_2 = angle_range;
            //const y_theta = [yc_theta, dyc_dx_theta];
            //const line_names_theta = ['Camber line', 'dz/dx(theta)'];
//
            //const x_label_2 = 'theta (°)';
            //const y_label_2 = 'radius (m)';
//
            //// Chart box row containing all the charts
            //const chart_box_row_2 = document.createElement('div');
            //chart_box_row_2.className = 'row';
//
            //this.card_output.addComponent(chart_box_row_2);
//
            //const title_2 = 'NACA ' + form_data.digits;
            //const chartjs_2 = new ChartJs(title_2, x_labels_2, x_theta, y_theta, line_names_theta, x_label_2, y_label_2);
            //const chartJsElement_2 = chartjs_2.render();
//
            //const chart_box_2 = document.createElement('div');
            //chart_box_2.appendChild(chartJsElement_2);
            //chartJsElement_2.style.width = '100%';
            //chartJsElement_2.width = '100%';
            //chart_box_row_2.appendChild(chart_box_2);
//
            //chart_box_2.classList.add('col-md-12');
            //chart_box_2.style.padding = '1rem';
            //chart_box_2.style.height = '450px';

            if (form_data.thin_profile == true) {

                ////////////////

                const lift_coefficients = naca.get_lift_coefficients();
                const headers = ['Alpha (°)', 'Cl', 'A0', 'A1', 'A2'];
                let data = [];
                let lift_angles = [];
                let lift_coefficients_values = [];

                let data_2 = [];
                let alpha_list = [];
                let cl_list = [];
                let cm_ab_list = [];
                let cm_c4_list = [];
                let a0_list = [];
                let a1_list = [];
                let a2_list = [];

                for (let i = 0; i < lift_coefficients.length; i++) {
                    let angle = lift_coefficients[i]["angle"];
                    let cl = lift_coefficients[i]["lift_coefficient"];
                    let cm_ab = lift_coefficients[i]["cm_ab"];
                    let cm_c4 = lift_coefficients[i]["cm_c4"];
                    let a0 = lift_coefficients[i]["A0"];
                    let a1 = lift_coefficients[i]["A1"];
                    let a2 = lift_coefficients[i]["A2"];

                    alpha_list.push(angle + '°');
                    cl_list.push(cl);
                    cm_ab_list.push(cm_ab);
                    cm_c4_list.push(cm_c4);
                    a0_list.push(a0);
                    a1_list.push(a1);
                    a2_list.push(a2);

                    lift_angles.push(angle);
                    lift_coefficients_values.push(cl);

                    data.push([angle, cl, a0, a1, a2]);
                }

                data_2.push(alpha_list);
                data_2.push(cl_list);
                data_2.push(cm_ab_list);
                data_2.push(cm_c4_list);
                data_2.push(a0_list);
                data_2.push(a1_list);
                data_2.push(a2_list);

                const headers_2 = ['Angle', '$C_L$', '$C_{M,AB}$', '$C_{M,c/4}$', '$A_0$', '$A_1$', '$A_2$'];

                this.add_output_title('Table of the lift coefficients depending on the angle of attack')
                this.add_output_table_left_headers(headers_2, data_2);

                //this.add_output_table(headers, data);
                this.add_output_title('Graphical representation of the lift coefficients, it doesn\'t take into account the stall angle')
                // on graph
                const x_labels_3 = [lift_angles]
                const x_lift = [lift_angles];
                const y_lift = [lift_coefficients_values];
                const line_names_lift = ['Cl'];
                const x_label_3 = 'alpha (°)';
                const y_label_3 = 'Cl';

                // Chart box row containing all the charts
                const chart_box_row_3 = document.createElement('div');
                chart_box_row_3.className = 'row';

                this.card_output.addComponent(chart_box_row_3);

                const title_3 = 'Lift coefficients';
                const chartjs_3 = new ChartJs(title_3, x_labels_3, x_lift, y_lift, line_names_lift, x_label_3, y_label_3);
                const chartJsElement_3 = chartjs_3.render();

                const chart_box_3 = document.createElement('div');
                chart_box_3.appendChild(chartJsElement_3);
                chartJsElement_3.style.width = '100%';
                chartJsElement_3.width = '100%';
                chart_box_row_3.appendChild(chart_box_3);

                chart_box_3.classList.add('col-md-12');
                chart_box_3.style.padding = '1rem';
                chart_box_3.style.height = '450px';

            } else if (form_data.vortex_panel_method == true) {

                //////////////////
                //let A = naca.get_A();
                //let B = naca.get_B();

                //this.add_output_title('A and B matrix');
                //this.add_output_2d_array(A);
                //this.add_output_array(B);

                ////////////////
                const x_all = naca.get_x_all();
                const y_all = naca.get_y_all();
                const Cp = naca.get_Cp();
                let lower_Cp = [];
                let upper_Cp= [];
                let lower_x = [];
                let upper_x = [];
                let lower_y = [];
                let upper_y = [];

                for (let i = 0; i < (x_all.length)/2; i++) {
                    lower_Cp.push(Cp[i]);
                    lower_x.push(x_all[i]);
                    lower_y.push(y_all[i]);
                } 

                for (let i = (x_all.length)/2; i < x_all.length; i++) {
                    upper_Cp.push(Cp[i]);
                    upper_x.push(x_all[i]);
                    upper_y.push(y_all[i]);
                }


                ///////////////////////

                

                this.add_output_title('Graphical representation of the geometry of the profile');

                let number_of_panels = naca.get_number_of_panels();
                let number_of_points = naca.get_number_of_points();
                let text = 'Number of panels: $' + number_of_panels + '$<br>Number of points: $' + number_of_points + '$<br>';
                this.add_output_text(text);

                // on graph
                var x_labels_3 = [x_all]
                var x_values_3 = [x_all];
                var y_values_3 = [y_all];
                var line_names_3 = ['Geometry'];
                var x_label_3 = 'x/c';
                var y_label_3 = 'y';

                
                // Plot panel 1 and 2
                const panels = naca.get_panels();
                for (let i = 0; i < panels.length; i++) {
                    const panel = panels[i];
                    const x = [panel["X0"], panel["X1"]];
                    const y = [panel["Y0"], panel["Y1"]];
                    if (i == 0) {
                        line_names_3.push('First panel');
                        x_values_3.push(x);
                        y_values_3.push(y);
                    } else if (i == 1) {
                        line_names_3.push('Second panel');
                        x_values_3.push(x);
                        y_values_3.push(y);
                    }
                }

                // Chart box row containing all the charts
                var chart_box_row_3 = document.createElement('div');
                chart_box_row_3.className = 'row';

                this.card_output.addComponent(chart_box_row_3);

                var title_3 = 'Visualisation of the first two panels';
                var options = {
                    marker: true
                }
                var chartjs_3 = new ChartJs(title_3, x_labels_3, x_values_3, y_values_3, line_names_3, x_label_3, y_label_3, options);
                var chartJsElement_3 = chartjs_3.render();

                var chart_box_3 = document.createElement('div');
                chart_box_3.appendChild(chartJsElement_3);
                chartJsElement_3.style.width = '100%';
                chartJsElement_3.width = '100%';
                chart_box_row_3.appendChild(chart_box_3);

                chart_box_3.classList.add('col-md-12');
                chart_box_3.style.padding = '1rem';
                chart_box_3.style.height = '450px';
                ////
                

                // on graph
                var x_labels_3 = [x_all]
                var x_values_3 = [x_all];
                var y_values_3 = [y_all];
                var line_names_3 = ['Geometry'];
                var x_label_3 = 'x/c';
                var y_label_3 = 'y';

                
                // Plot all panels
                for (let i = 0; i < panels.length; i++) {
                    const panel = panels[i];
                    const x = [panel["X0"], panel["X1"]];
                    const y = [panel["Y0"], panel["Y1"]];
                    line_names_3.push('Panel ' + (i+1));
                    x_values_3.push(x);
                    y_values_3.push(y);
                }

                // Chart box row containing all the charts
                var chart_box_row_3 = document.createElement('div');
                chart_box_row_3.className = 'row';

                this.card_output.addComponent(chart_box_row_3);

                var title_3 = 'Visualization of the panels';
                var options = {
                    fill: true,
                    marker: true,
                    showLegend: false
                }
                var chartjs_3 = new ChartJs(title_3, x_labels_3, x_values_3, y_values_3, line_names_3, x_label_3, y_label_3, options);
                var chartJsElement_3 = chartjs_3.render();

                var chart_box_3 = document.createElement('div');
                chart_box_3.appendChild(chartJsElement_3);
                chartJsElement_3.style.width = '100%';
                chartJsElement_3.width = '100%';
                chart_box_row_3.appendChild(chart_box_3);

                chart_box_3.classList.add('col-md-12');
                chart_box_3.style.padding = '1rem';
                chart_box_3.style.height = '450px';

                ///////////////////////

                this.add_output_title('Graphical representation of the pressure coefficient');
                // on graph
                var x_labels_3 = [x_all]
                var x_lift = [upper_x, lower_x];
                var y_lift = [upper_Cp, lower_Cp];
                var line_names_lift = ['Upper surface', 'Lower surface'];
                var x_label_3 = 'x/c';
                var y_label_3 = 'Cp';

                // Chart box row containing all the charts
                var chart_box_row_3 = document.createElement('div');
                chart_box_row_3.className = 'row';

                this.card_output.addComponent(chart_box_row_3);

                var title_3 = 'Pressure coefficient';
                var options = {
                    marker: true,
                    reverseYAxis: true
                }
                var chartjs_3 = new ChartJs(title_3, x_labels_3, x_lift, y_lift, line_names_lift, x_label_3, y_label_3, options);
                var chartJsElement_3 = chartjs_3.render();

                var chart_box_3 = document.createElement('div');
                chart_box_3.appendChild(chartJsElement_3);
                chartJsElement_3.style.width = '100%';
                chartJsElement_3.width = '100%';
                chart_box_row_3.appendChild(chart_box_3);

                chart_box_3.classList.add('col-md-12');
                chart_box_3.style.padding = '1rem';
                chart_box_3.style.height = '600px';

                // add x and Cp arrays
                this.add_output_text('$x$ values');
                this.add_output_array(x_all);
                this.add_output_text('$y$ values');
                this.add_output_array(y_all);
                this.add_output_text('$Cp$ values');
                this.add_output_array(Cp);

                /////////////////
    
                this.add_output_title('Important results');
                let Cl = naca.get_Cl();
                let Cm = naca.get_Cm();
                let headers_3 = [ 'Profile', 'Angle of attack', 'Lift coefficient', 'Moment coefficient' ];
                let values_3 = [ 'NACA ' + form_data.digits, form_data.angle, Cl, Cm ];
                let data = [];
                for (let i = 0; i < values_3.length; i++) {
                    data.push([values_3[i]]);
                }
                //values_3.push(units_3)
                this.add_output_table_left_headers(headers_3, data, 6);


            }

            
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
        const text = '[\n    ' + array + '    \n]';
        const embededBlock = new EmbededBlock(text);
        const embededBlockElement = embededBlock.render();
        this.card_output.addComponent(embededBlockElement);
    }

    add_output_2d_array = (array) => { // Display 2d array between brackets and inside a code block
        let text = '[\n    ';
        for (let i = 0; i < array.length; i++) {
            text += '[' + array[i] + '],    \n    ';
        }
        text += '    \n]';
        const embededBlock = new EmbededBlock(text);
        const embededBlockElement = embededBlock.render();
        this.card_output.addComponent(embededBlockElement);
    }

    add_output_table = (headers, data) => {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.justifyContent = 'center';
        div.style.alignItems = 'center';
        div.style.maxWidth = '50vw';
        this.card_output.addComponent(div);
        const table = new Table(headers, data);
        const tableElement = table.render();
        div.appendChild(tableElement);
    }

    add_output_table_left_headers = (headers, data, precision = 3) => {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.justifyContent = 'center';
        div.style.alignItems = 'center';
        div.style.paddingLeft = '10px';
        div.style.paddingRight = '10px';
        this.card_output.addComponent(div);
        const table = new Table(headers, data, precision);
        const tableElement = table.render_left_headers();
        div.appendChild(tableElement);
    }

}

